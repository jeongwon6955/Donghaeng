# 자가진단 (Survey) API 명세서

## 1. 설문조사 결과 제출 및 AI 분석 API

사용자가 참여한 자가진단(설문조사) 응답 데이터를 제출하고 AI 분석 결과를 반환받습니다.
**회원/비회원 모두 사용 가능**하며, 헤더에 JWT 토큰이 포함된 경우에만 **사용자의 설문 응답(`responses`)과 생성된 AI 요약 결과(`aiResult`)를 함께 DB에 저장**합니다. 토큰이 없는 비회원 요청의 경우 DB 저장 없이 AI 분석 결과만 반환합니다.

- **URL:** `/user/survey`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (선택 사항)

### 1-1. 설문조사 응답 제출
각 문항의 답변은 단일/복수 선택과 관계없이 **모두 배열(`[]`) 형태**로 전달해야 합니다. 주관식 '기타' 응답은 문자열로 전달할 수 있습니다.

> **[중요] 우선순위(Priority) 전달 방식**
> `PRIORITY_MULTI` 타입의 문항(Q3, Q4, Q5, Q6)의 경우, **배열에 담긴 순서 자체가 곧 유저가 선택한 우선순위**를 의미합니다.
> 즉, 유저가 가장 먼저 선택한(가장 중요하다고 생각하는) 항목을 배열의 첫 번째(Index 0)에 담아서 보내주시면, 백엔드와 DB가 그 순서를 100% 그대로 유지하여 저장 및 AI 분석에 활용합니다.

**Request Body**
```json
{
  "responses": {
    "Q1": ["예"],
    "Q2": ["아니오"],
    "Q3": ["부모", "조부모"],
    "Q4": ["신체 질환", "고령"],
    "Q5": ["병원비·생활비 등 경제적 부담이 있다", "진로 또는 취업 준비가 어렵다"],
    "Q6": ["생활비 지원", "진로·취업 지원", "심리상담 연결"],
    "Q7": ["거의 없다"],
    "Q8": ["19~25세"],
    "Q9": ["서울"]
  }
}
```

**Response (회원: 201 Created / 비회원: 200 OK)**
```json
{
  "success": true,
  "message": "설문 결과 및 로드맵이 성공적으로 생성되었습니다.", // 비회원인 경우: "비회원 설문 처리 완료 (DB 저장 안함)"
  "aiResult": {
    "summary": "가족 돌봄으로 인해 학업·진로 부담과 경제적 부담이 가장 크게 나타나고 있으며...",
    "details": "현재 부모를 돌보는 역할을 하고 있으며, 가족 돌봄으로 인해 공부 시간 확보와 진로 준비에 어려움을 겪고 있는 것으로 나타났습니다.\n\n또한 병원비와 생활비에 대한 부담을 느끼고 있어...",
    "profile_scores": {
      "학업": 35,
      "경제": 25,
      "정서": 15,
      "휴식": 10,
      "정보연결": 15
    }
  },
  "roadmap_idx": 1  // 회원일 경우 생성된 맞춤 로드맵 ID를 함께 반환
}
```

**에러 응답 예시**
- `400 Bad Request`: 필수 데이터(`responses`) 누락
- `403 Forbidden`: 제출된 토큰이 유효하지 않거나 만료됨 (토큰을 제출하지 않은 경우는 통과됨)
- `500 Internal Server Error`: AI 분석 중 서버 에러 발생 (응답 객체에 `error` 필드로 실패 사유 반환)
  - `FORMAT_ERROR`: AI가 정해진 포맷(태그)대로 답변하지 않음
  - `BANNED_EXPRESSION`: AI가 정책상 금지된 단어를 사용하여 필터링됨
  - `MAX_RETRY_EXCEEDED`: AI 응답 파싱 및 필터링 재시도 횟수 초과
  - `TIMEOUT_ERROR`: AI 서버 응답 대기 시간 초과
  - `NETWORK_ERROR`: AI 서버(Ollama) 통신 실패

<br/>

## 2. 설문조사 문항 조회 API

프론트엔드 화면 구성(Data-Driven UI)을 위해 DB에 등록된 전체 설문 문항 목록을 가져옵니다.

- **URL:** `/user/survey-questions`
- **Method:** `GET`

### 2-1. 설문조사 문항 요청
현재는 인증 없이 조회할 수 있도록 설계되어 있습니다. 화면을 그릴 때 이 API를 호출하세요.

**Response (200 OK - 조회 성공)**
```json
{
  "success": true,
  "data": [
    {
      "question_code": "Q1",
      "question_text": "현재 가족을 위해 가사, 간병, 병원 동행 등의 돌봄을 직접 하고 있나요?",
      "question_type": "SINGLE",
      "options": ["예", "아니오"]
    },
    {
      "question_code": "Q5",
      "question_text": "돌봄으로 인해 어려움을 느끼는 분야가 있나요?",
      "question_type": "MULTI",
      "options": ["학업", "진로·취업", "경제적 부담", "휴식 부족", "정서적 스트레스", "없음", "기타"]
    }
  ]
}
```

<br/>

## 3. 내 설문조사 이력 조회 API

회원가입 후 로그인한 사용자가 과거에 진행했던 모든 설문조사 결과와 AI 요약본을 최신순으로 조회합니다.

- **URL:** `/user/survey`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (필수)

### 3-1. 조회 요청
파라미터나 바디 없이 토큰만 헤더에 담아서 요청합니다.

**Response (200 OK - 조회 성공)**
```json
{
  "success": true,
  "data": [
    {
      "result_idx": 15,
      "created_at": "2026-06-23T12:00:00.000Z",
      "responses": {
        "Q1": { "question": "현재 가족을 위해...", "answer": ["예"] },
        "Q5": { "question": "돌봄으로 인해...", "answer": ["학업", "경제적 부담"] }
      },
      "aiResult": {
        "summary": "가족 돌봄으로 인해 학업·진로 부담과...",
        "details": "현재 부모를 돌보는 역할을 하고 있으며...",
        "profile_scores": { "학업": 35, "경제": 25, "정서": 15, "휴식": 10, "정보연결": 15 }
      }
    },
    {
      "result_idx": 12,
      "created_at": "2026-06-20T09:30:00.000Z",
      "responses": { ... },
      "aiResult": { ... }
    }
  ]
}
```

**에러 응답 예시**
- `401 Unauthorized`: 토큰이 없거나 유효하지 않음
- `500 Internal Server Error`: 서버 내부 조회 오류
