require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST, // 로컬 환경에 따라 localhost 또는 127.0.0.1
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 연결 테스트
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MariaDB 연결 성공!");
    connection.release(); // 연결 확인 후 풀에 반환
  } catch (err) {
    console.error("❌ DB 연결 실패:", err.message);
  }
})();

module.exports = pool;
