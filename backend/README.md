# backend

Express.js 기반 API 서버.

## 폴더 구조 (예정)

```
backend/
├── src/
│   ├── config/        # DB 연결, 환경설정
│   ├── routes/         # 라우터 (auth, diagnosis, roadmap 등)
│   ├── controllers/    # 요청 처리 로직
│   ├── models/         # DB 쿼리/모델
│   ├── middlewares/    # 인증(JWT), 에러 핸들링 등
│   └── app.js
├── package.json
└── .env.example
```

## 셋업

```bash
npm install express mysql2 bcrypt jsonwebtoken dotenv cors
npm install -D nodemon
```
