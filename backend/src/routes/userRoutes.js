const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateJWT, optionalAuthenticateJWT } = require("../middlewares/auth");

// 회원가입
router.post("/signup", userController.signup);

// 로그인
router.post("/signin", userController.signin);

// 내 정보 조회
router.get("/me", authenticateJWT, userController.getMe);

// 나이 트랙 저장
router.put("/track-type", authenticateJWT, userController.updateTrackType);

// 비밀번호 변경
router.put("/password", authenticateJWT, userController.updatePassword);

// 프론트엔드가 화면을 그리기 위해 질문 목록을 가져가는 API
router.get("/survey-questions", userController.getSurveyQuestions);

// 설문조사 결과 저장 (비회원도 AI 분석 결과를 받기 위해 토큰 선택 적용)
router.post("/survey", optionalAuthenticateJWT, userController.submitSurvey);

// 내 설문조사 결과 이력 조회 (회원 전용)
router.get("/survey", authenticateJWT, userController.getSurveyResults);

module.exports = router;
