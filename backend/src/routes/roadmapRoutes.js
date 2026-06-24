const express = require("express");
const router = express.Router();
const roadmapController = require("../controllers/roadmapController");
const { authenticateJWT } = require("../middlewares/auth");

// 내 로드맵 조회 (회원 전용)
router.get("/", authenticateJWT, roadmapController.getRoadmap);

// 로드맵 내 특정 서비스 진행 상태 업데이트
router.put("/services/:id/status", authenticateJWT, roadmapController.updateServiceStatus);

module.exports = router;
