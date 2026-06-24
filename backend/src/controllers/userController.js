const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { callModelWithRetry, parseSummaryOutput } = require("../services/ollama.js");

const JWT_SECRET = process.env.JWT_SECRET;

function getUserWhereFromToken(user) {
  if (user && user.user_idx) {
    return { clause: "user_idx = ?", value: user.user_idx };
  }

  if (user && user.user_id) {
    return { clause: "user_id = ?", value: user.user_id };
  }

  return null;
}

exports.signup = async (req, res) => {
  const { user_id, name, password } = req.body;

  if (!user_id || !name || !password) {
    return res.status(400).json({
      success: false,
      message: "모든 정보를 입력해주세요.",
    });
  }

  try {
    const [existingUsers] = await pool.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [user_id]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: "이미 가입된 아이디입니다." });
    }

    const saltRounds = 10;
    const hashed_password = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO users (user_id, name, password, track_type) 
      VALUES (?, ?, ?, NULL)
    `;
    await pool.query(insertQuery, [user_id, name, hashed_password]);

    return res.status(201).json({ success: true, message: "회원가입이 완료되었습니다. 로그인해 주세요." });
  } catch (error) {
    console.error("회원가입 중 에러 발생:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류로 회원가입에 실패했습니다." });
  }
};

exports.updateTrackType = async (req, res) => {
  const { track_type } = req.body;
  const userWhere = getUserWhereFromToken(req.user);

  if (![1, 2].includes(Number(track_type))) {
    return res.status(400).json({
      success: false,
      message: "track_type은 1(16-18세) 또는 2(19-25세)만 입력할 수 있습니다.",
    });
  }

  if (!userWhere) {
    return res.status(401).json({ success: false, message: "인증 정보가 올바르지 않습니다. 다시 로그인해 주세요." });
  }

  try {
    await pool.query(
      `UPDATE users SET track_type = ? WHERE ${userWhere.clause}`,
      [Number(track_type), userWhere.value]
    );

    return res.status(200).json({
      success: true,
      message: "나이 트랙이 저장되었습니다.",
      track_type: Number(track_type),
    });
  } catch (error) {
    console.error("나이 트랙 저장 중 서버 에러 발생:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류로 나이 트랙 저장에 실패했습니다." });
  }
};

exports.getMe = async (req, res) => {
  const userWhere = getUserWhereFromToken(req.user);

  if (!userWhere) {
    return res.status(401).json({ success: false, message: "인증 정보가 올바르지 않습니다. 다시 로그인해 주세요." });
  }

  try {
    const [users] = await pool.query(
      `SELECT user_id, name, track_type FROM users WHERE ${userWhere.clause}`,
      [userWhere.value]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
    }

    return res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error("내 정보 조회 중 서버 에러 발생:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류로 내 정보 조회에 실패했습니다." });
  }
};

exports.updatePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  const userWhere = getUserWhereFromToken(req.user);

  if (!current_password || !new_password) {
    return res.status(400).json({ success: false, message: "현재 비밀번호와 새 비밀번호를 모두 입력해 주세요." });
  }

  if (current_password === new_password) {
    return res.status(400).json({ success: false, message: "같은 비밀번호 입니다." });
  }

  if (!userWhere) {
    return res.status(401).json({ success: false, message: "인증 정보가 올바르지 않습니다. 다시 로그인해 주세요." });
  }

  try {
    const [users] = await pool.query(
      `SELECT password FROM users WHERE ${userWhere.clause}`,
      [userWhere.value]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
    }

    const isPasswordMatch = await bcrypt.compare(current_password, users[0].password);

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." });
    }

    const hashed_password = await bcrypt.hash(new_password, 10);

    await pool.query(
      `UPDATE users SET password = ? WHERE ${userWhere.clause}`,
      [hashed_password, userWhere.value]
    );

    return res.status(200).json({ success: true, message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error("비밀번호 변경 중 서버 에러 발생:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류로 비밀번호 변경에 실패했습니다." });
  }
};

exports.signin = async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ success: false, message: "아이디와 비밀번호를 모두 입력해 주세요." });
  }

  try {
    const findUserQuery = `
      SELECT user_idx, password, user_id, name, track_type 
      FROM users 
      WHERE user_id = ?
    `;
    const [users] = await pool.query(findUserQuery, [user_id]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "가입되지 않은 아이디이거나 비밀번호가 틀렸습니다." });
    }

    const user = users[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "가입되지 않은 아이디이거나 비밀번호가 틀렸습니다." });
    }

    const token = jwt.sign(
      { user_idx: user.user_idx, user_id: user.user_id, name: user.name },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      success: true,
      message: "로그인에 성공했습니다.",
      token: token,
      user: { user_id: user.user_id, name: user.name, track_type: user.track_type },
    });
  } catch (error) {
    console.error("로그인 중 서버 에러 발생:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류로 로그인에 실패했습니다." });
  }
};

// 프로파일 스코어(퍼센트) 계산 함수
function calculateProfileScores(responses) {
  let scores = { 학업: 0, 경제: 0, 정서: 0, 휴식: 0, 정보연결: 0 };

  const checkArr = (arr, keyword, category, weight) => {
    if (Array.isArray(arr) && arr.some(a => a.includes(keyword))) {
      scores[category] += weight;
    }
  };

  const q5 = responses["Q5"]; // 어려움 분야
  const q6 = responses["Q6"]; // 필요한 도움

  // Q5 가중치
  checkArr(q5, "학업", "학업", 15);
  checkArr(q5, "진로", "학업", 15);
  checkArr(q5, "경제", "경제", 20);
  checkArr(q5, "휴식", "휴식", 20);
  checkArr(q5, "정서", "정서", 20);

  // Q6 가중치
  checkArr(q6, "생활비", "경제", 25);
  checkArr(q6, "진로", "학업", 20);
  checkArr(q6, "취업", "학업", 20);
  checkArr(q6, "심리상담", "정서", 25);
  checkArr(q6, "돌봄 서비스 정보", "정보연결", 25);
  checkArr(q6, "쉼", "휴식", 25);
  checkArr(q6, "문화", "휴식", 15);

  let total = scores.학업 + scores.경제 + scores.정서 + scores.휴식 + scores.정보연결;
  
  if (total === 0) {
    return { 학업: 20, 경제: 20, 정서: 20, 휴식: 20, 정보연결: 20 };
  }

  const percentages = {
    학업: Math.round((scores.학업 / total) * 100),
    경제: Math.round((scores.경제 / total) * 100),
    정서: Math.round((scores.정서 / total) * 100),
    휴식: Math.round((scores.휴식 / total) * 100),
    정보연결: Math.round((scores.정보연결 / total) * 100)
  };

  const sum = percentages.학업 + percentages.경제 + percentages.정서 + percentages.휴식 + percentages.정보연결;
  if (sum !== 100) {
    let maxKey = '학업';
    for (const key in percentages) {
      if (percentages[key] > percentages[maxKey]) maxKey = key;
    }
    percentages[maxKey] += (100 - sum);
  }

  return percentages;
}

exports.submitSurvey = async (req, res) => {
  const { responses } = req.body;

  if (!responses) {
    return res.status(400).json({ success: false, message: "설문 응답 데이터가 없습니다." });
  }

  try {
    // 1. DB에서 활성화된 질문 목록 가져오기 (비회원 프롬프트 생성을 위해 공통으로 수행)
    const [questions] = await pool.query("SELECT question_code, question_text FROM survey_questions WHERE is_active = TRUE");
    
    const questionTexts = {};
    questions.forEach((q) => {
      questionTexts[q.question_code] = q.question_text;
    });

    // 2. AI 분석을 위한 프롬프트 문자열 조립
    let promptLines = ["[설문 응답]"];
    for (const [key, answerData] of Object.entries(responses)) {
      if (questionTexts[key] && answerData && answerData.length > 0) {
        promptLines.push(`- ${questionTexts[key]}: ${answerData.join(", ")}`);
      }
    }
    promptLines.push("위 내용을 바탕으로 한줄결과와 상황요약을 작성해줘.");
    const prompt = promptLines.join("\n");

    // 3. AI 모델 호출 (재시도 래퍼 사용)
    const aiResultData = await callModelWithRetry(
      'donghaeng-summary',
      prompt,
      parseSummaryOutput,
      2
    );

    if (!aiResultData.valid) {
      return res.status(500).json({ 
        success: false, 
        message: "AI 분석 중 오류가 발생했습니다.", 
        error: aiResultData.reason 
      });
    }

    const profileScores = calculateProfileScores(responses);

    const aiResponse = {
      summary: aiResultData.oneLine,
      details: aiResultData.summary,
      profile_scores: profileScores
    };

    // 4. 회원/비회원 로직 분기 처리
    if (req.user && req.user.user_idx) {
      const user_idx = req.user.user_idx;
      
      const finalJsonToSave = {};
      for (const [key, answerData] of Object.entries(responses)) {
        if (questionTexts[key]) {
          finalJsonToSave[key] = { question: questionTexts[key], answer: answerData };
        } else {
          finalJsonToSave[key] = answerData;
        }
      }

      const responsesString = JSON.stringify(finalJsonToSave);
      const aiSummaryString = JSON.stringify(aiResponse);
      const profileScoresString = JSON.stringify(profileScores);
      
      // 1. 설문 결과 저장 (ai_summary 컬럼 안에 프로파일 점수도 함께 저장됨)
      const insertQuery = `INSERT INTO survey_results (user_idx, responses, ai_summary) VALUES (?, ?, ?)`;
      const [result] = await pool.query(insertQuery, [user_idx, responsesString, aiSummaryString]);
      const result_idx = result.insertId;

      // 2. 로드맵 기본 정보 생성
      const insertRoadmapQuery = `INSERT INTO user_roadmaps (user_idx, result_idx, ai_summary, profile_scores) VALUES (?, ?, ?, ?)`;
      const [roadmap] = await pool.query(insertRoadmapQuery, [user_idx, result_idx, aiResponse.details, profileScoresString]);
      const roadmap_idx = roadmap.insertId;

      // 3. 로드맵 서비스(roadmap_services) 추천 매칭
      const [services] = await pool.query("SELECT service_idx FROM welfare_services WHERE is_active = TRUE LIMIT 3");
      for (let i = 0; i < services.length; i++) {
        await pool.query(
          `INSERT INTO roadmap_services (roadmap_idx, service_idx, priority_order) VALUES (?, ?, ?)`,
          [roadmap_idx, services[i].service_idx, i + 1]
        );
      }

      return res.status(201).json({ 
        success: true, 
        message: "설문 결과 및 로드맵이 성공적으로 생성되었습니다.",
        aiResult: aiResponse,
        roadmap_idx: roadmap_idx
      });
    } else {
      // 비회원은 DB 저장 없이 결과만 반환
      return res.status(200).json({ 
        success: true, 
        message: "비회원 설문 처리 완료 (DB 저장 안함)",
        aiResult: aiResponse
      });
    }

  } catch (error) {
    console.error("설문 결과 처리 중 에러 발생:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류로 설문 결과 처리에 실패했습니다." });
  }
};

// ==========================================
// [GET] 설문조사 문항 목록 가져오기 API
// ==========================================
exports.getSurveyQuestions = async (req, res) => {
  try {
    const query = `
      SELECT question_code, question_text, question_type, options 
      FROM survey_questions 
      WHERE is_active = TRUE 
      ORDER BY order_num ASC
    `;
    const [questions] = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error("설문 문항 조회 중 에러 발생:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류로 설문 문항 조회에 실패했습니다." });
  }
};

// ==========================================
// [GET] 내 설문조사 결과 이력 조회 API
// ==========================================
exports.getSurveyResults = async (req, res) => {
  try {
    const user_idx = req.user.user_idx;

    // 최신 순으로 해당 유저의 모든 설문 기록 조회
    const query = `
      SELECT result_idx, responses, ai_summary, created_at 
      FROM survey_results 
      WHERE user_idx = ? 
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(query, [user_idx]);

    // DB에서 문자열로 반환될 수 있는 JSON 데이터를 객체로 안전하게 파싱
    const data = rows.map((row) => {
      let parsedResponses = row.responses;
      let parsedAiSummary = row.ai_summary;

      if (typeof parsedResponses === "string") {
        try { parsedResponses = JSON.parse(parsedResponses); } catch (e) {}
      }
      if (typeof parsedAiSummary === "string") {
        try { parsedAiSummary = JSON.parse(parsedAiSummary); } catch (e) {}
      }

      return {
        result_idx: row.result_idx,
        created_at: row.created_at,
        responses: parsedResponses,
        aiResult: parsedAiSummary || null // 분석 실패 시 null 처리 대비
      };
    });

    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("설문 결과 조회 중 에러 발생:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류로 설문 결과 조회에 실패했습니다." });
  }
};
