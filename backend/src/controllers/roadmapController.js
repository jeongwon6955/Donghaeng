const pool = require("../config/db");

// 내 최신 로드맵 및 매칭된 지원사업 목록 조회
exports.getRoadmap = async (req, res) => {
  try {
    const user_idx = req.user.user_idx;

    // 1. 가장 최신 로드맵 조회
    const [roadmaps] = await pool.query(
      "SELECT * FROM user_roadmaps WHERE user_idx = ? ORDER BY created_at DESC LIMIT 1",
      [user_idx]
    );

    if (roadmaps.length === 0) {
      return res.status(404).json({ success: false, message: "생성된 로드맵이 없습니다." });
    }

    const roadmap = roadmaps[0];

    // 2. 해당 로드맵에 매칭된 서비스 목록 조회
    const [services] = await pool.query(
      `SELECT rs.rs_idx, rs.priority_order, rs.status, ws.* 
       FROM roadmap_services rs
       JOIN welfare_services ws ON rs.service_idx = ws.service_idx
       WHERE rs.roadmap_idx = ?
       ORDER BY rs.priority_order ASC`,
      [roadmap.roadmap_idx]
    );

    return res.status(200).json({
      success: true,
      data: {
        roadmap_idx: roadmap.roadmap_idx,
        ai_summary: roadmap.ai_summary,
        profile_scores: typeof roadmap.profile_scores === 'string' ? JSON.parse(roadmap.profile_scores) : roadmap.profile_scores,
        services: services
      }
    });
  } catch (error) {
    console.error("로드맵 조회 에러:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
};

// 특정 로드맵 서비스 상태 업데이트
exports.updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params; // rs_idx
    const { status } = req.body; 

    const validStatuses = ['pending', 'checked', 'contacted', 'applied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `상태는 ${validStatuses.join(', ')} 중 하나여야 합니다.` });
    }

    const [result] = await pool.query(
      "UPDATE roadmap_services SET status = ? WHERE rs_idx = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "해당 매칭 내역을 찾을 수 없습니다." });
    }

    return res.status(200).json({ success: true, message: "상태가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("상태 업데이트 에러:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
};
