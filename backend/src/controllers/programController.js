const pool = require("../config/db");
const { callModelWithRetry, parseGuideOutput, parseCounselOutput } = require("../services/ollama.js");

// 2단계: 맞춤 지원사업 추천 (카테고리 기반 검색)
exports.getPrograms = async (req, res) => {
  try {
    const { category } = req.query; // 프론트에서 ?category=경제 형태로 호출
    let query = `SELECT service_idx, service_name, category, support_content, contact_org FROM welfare_services WHERE is_active = TRUE`;
    let params = [];

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    const [rows] = await pool.query(query, params);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("지원사업 조회 에러:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
};

// 지원사업 상세 정보 (3단계, 5단계 공통 사용)
exports.getProgramDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM welfare_services WHERE service_idx = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "지원사업을 찾을 수 없습니다." });
    }
    
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
};

// 3단계: 지원 확인 가이드 (체크리스트) 생성
exports.generateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const user_idx = req.user.user_idx;

    // 유저의 최신 로드맵에서 상황 요약 텍스트 가져오기
    const [roadmaps] = await pool.query(
      "SELECT ai_summary FROM user_roadmaps WHERE user_idx = ? ORDER BY created_at DESC LIMIT 1",
      [user_idx]
    );
    const userSituation = roadmaps.length > 0 ? roadmaps[0].ai_summary : "알 수 없음";

    const [services] = await pool.query("SELECT * FROM welfare_services WHERE service_idx = ?", [id]);
    if (services.length === 0) return res.status(404).json({ success: false, message: "지원사업 없음" });
    const svc = services[0];

    const targetAudience = `연령: ${svc.target_age_min || 0}세 ~ ${svc.target_age_max || '제한없음'}, 지역: ${svc.region || '전국'}`;

    const prompt = `[사용자 상황]\n${userSituation || '알 수 없음'}\n\n[지원사업 정보]\n- 제목: ${svc.service_name}\n- 지원대상: ${targetAudience}\n- 지원내용: ${svc.support_content}\n\n위 사업을 신청하기 위해 확인해야 할 항목들을 체크리스트로 작성해줘.`;

    const aiResultData = await callModelWithRetry('donghaeng-guide', prompt, parseGuideOutput, 2);

    if (!aiResultData.valid) {
      return res.status(500).json({ success: false, error: aiResultData.reason });
    }

    return res.status(200).json({ success: true, aiResult: aiResultData.items });
  } catch (error) {
    return res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
};

// 4단계: 상담 준비 가이드 (대본) 생성
exports.generateCounsel = async (req, res) => {
  try {
    const { id } = req.params;
    const user_idx = req.user.user_idx;

    // 유저의 최신 로드맵에서 상황 요약 텍스트 가져오기
    const [roadmaps] = await pool.query(
      "SELECT ai_summary FROM user_roadmaps WHERE user_idx = ? ORDER BY created_at DESC LIMIT 1",
      [user_idx]
    );
    const userSituation = roadmaps.length > 0 ? roadmaps[0].ai_summary : "알 수 없음";

    const [services] = await pool.query("SELECT * FROM welfare_services WHERE service_idx = ?", [id]);
    if (services.length === 0) return res.status(404).json({ success: false, message: "지원사업 없음" });
    const svc = services[0];

    const prompt = `[사용자 상황]\n${userSituation || '알 수 없음'}\n\n[문의 기관 정보]\n- 사업명: ${svc.service_name}\n- 문의처: ${svc.contact_org}\n\n위 기관에 전화로 문의할 때 사용할 추천 질문과 문의 템플릿을 작성해줘.`;

    // isCounsel 플래그 true로 전달
    const aiResultData = await callModelWithRetry('donghaeng-counsel', prompt, parseCounselOutput, 2, true);

    if (!aiResultData.valid) {
      return res.status(500).json({ success: false, error: aiResultData.reason });
    }

    return res.status(200).json({ 
      success: true, 
      aiResult: { 
        questions: aiResultData.questions, 
        template: aiResultData.template 
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
};
