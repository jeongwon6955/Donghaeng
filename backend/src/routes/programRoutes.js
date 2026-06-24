const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");
const { authenticateJWT } = require("../middlewares/auth");

// 2~5단계의 모든 복지 사업 조회 및 AI 가이드 생성은 회원 전용 (토큰 필수)
router.use(authenticateJWT);

// 2단계: 맞춤 지원사업 추천 (목록 조회)
router.get("/", programController.getPrograms);

// 3단계(상세확인) 및 5단계(공식기관 연결)용 상세 조회
router.get("/:id", programController.getProgramDetail);

// 3단계: 지원 확인 가이드 (체크리스트) AI 생성
router.post("/:id/guide", programController.generateGuide);

// 4단계: 상담 준비 가이드 (문의 템플릿) AI 생성
router.post("/:id/counsel", programController.generateCounsel);

module.exports = router;
