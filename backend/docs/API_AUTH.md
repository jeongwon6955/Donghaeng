# 인증 (Authentication) API 명세서

## 1. 회원가입 API

사용자의 계정을 생성합니다.
사용자는 `user_id`, `name`, `password`를 입력하여 가입합니다.

- **URL:** `/user/signup`
- **Method:** `POST`
- **Content-Type:** `application/json`

### 1-1. 회원가입 요청
회원가입 폼을 제출합니다. 

**Request Body**
```json
{
  "user_id": "test1234",
  "name": "홍길동",
  "password": "mySecurePassword1!"
}
```

**Response (201 Created - 가입 완료)**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다. 로그인해 주세요."
}
```

**에러 응답 예시**
- `400 Bad Request`: 필수 필드 누락
- `409 Conflict`: 아이디 중복

<br/>

## 2. 로그인 API

아이디와 비밀번호를 사용하여 로그인합니다.

- **URL:** `/user/signin`
- **Method:** `POST`
- **Content-Type:** `application/json`

### 2-1. 로그인 요청
아이디와 비밀번호가 일치하면 즉시 JWT 토큰이 발급됩니다.

**Request Body**
```json
{
  "user_id": "test1234",
  "password": "mySecurePassword1!"
}
```

**Response (200 OK - 로그인 성공)**
```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "test1234",
    "name": "홍길동"
  }
}
```

**에러 응답 예시**
- `400 Bad Request`: 필수 필드(user_id, password) 누락
- `401 Unauthorized`: 가입되지 않은 아이디 또는 비밀번호 불일치
