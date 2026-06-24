# 로드맵 및 복지 서비스 (Roadmap & Welfare Services) API 명세서

'나의 동행 발자국' 2단계~5단계를 관통하는 맞춤 로드맵 조회 및 AI 가이드 생성 API입니다.

## 1. 내 맞춤 로드맵 조회 (2단계)
1단계 설문조사 직후 백엔드에서 자동으로 생성해둔 '나만의 맞춤 로드맵'과 추천 복지 서비스 목록을 가져옵니다.

- **URL:** `/roadmaps`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (필수)

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "roadmap_idx": 1,
    "ai_summary": "현재 부모를 돌보는 역할을 하고 있으며...",
    "services": [
      {
        "rs_idx": 1,
        "priority_order": 1,
        "status": "pending",
        "service_idx": 5,
        "service_name": "가족돌봄청년 생활비 지원사업",
        "category": "경제",
        "support_content": "매월 30만원 생활비 지원 및 긴급 의료비 지원",
        "apply_method": "온라인 및 관할 주민센터 방문",
        "contact_org": "보건복지상담센터(129)",
        "target_age_min": 13,
        "target_age_max": 34,
        "region": "전국",
        "care_type": ["신체 질환", "장애"],
        "is_active": 1,
        "created_at": "2026-06-24T10:00:00.000Z",
        "updated_at": "2026-06-24T10:00:00.000Z"
      }
    ]
  }
}
```

<br/>

## 2. 지원사업 목록 검색 (일반 검색용)
로드맵과 무관하게, 특정 카테고리(예: 학업, 경제, 정서 등)에 속하는 복지 서비스 목록을 검색합니다.

- **URL:** `/programs`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (필수)
- **Query Params:** `?category=경제` (선택 사항)

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "service_idx": 5,
      "service_name": "가족돌봄청년 생활비 지원사업",
      "category": "경제",
      "support_content": "매월 30만원 생활비 지원...",
      "contact_org": "보건복지상담센터(129)"
    }
  ]
}
```

<br/>

## 3. 지원사업 상세 확인 (3단계, 5단계)
특정 복지 서비스의 상세 정보(지원 내용, 대상 연령, 지역, 신청 방법 등)를 단건 조회합니다.

- **URL:** `/programs/:service_idx`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (필수)

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "service_idx": 5,
    "service_name": "가족돌봄청년 생활비 지원사업",
    "category": "경제",
    "support_content": "매월 30만원...",
    ...
  }
}
```

<br/>

## 4. 지원 확인 가이드 (체크리스트) 생성 (3단계)
유저가 특정 기관에 전화를 걸기 전 반드시 확인해야 할 자격 요건(나이, 지역 등) 체크리스트를 AI(donghaeng-guide)가 생성합니다.

- **URL:** `/programs/:service_idx/guide`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (필수)

*(백엔드가 토큰을 통해 유저의 최신 로드맵 데이터를 자동으로 찾아 사용하므로 Request Body는 필요 없습니다.)*

**Response (200 OK)**
```json
{
  "success": true,
  "aiResult": [
    "연령 조건 확인 (만 13세 ~ 34세 이하인지)",
    "거주 지역 조건 확인 (전국 지원 대상인지)",
    "돌봄 관련 기준 확인 (신체 질환/장애 기준 부합 여부)",
    "필요 서류(가족관계증명서 등) 확인"
  ]
}
```

<br/>

## 5. 상담 준비 가이드 (대본) 생성 (4단계)
기관 통화 시 유저가 사용할 수 있는 '추천 질문 목록'과 '전화 대본 템플릿'을 AI(donghaeng-counsel)가 생성합니다.

- **URL:** `/programs/:service_idx/counsel`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (필수)

*(백엔드가 토큰을 통해 유저의 최신 로드맵 데이터를 자동으로 찾아 사용하므로 Request Body는 필요 없습니다.)*

**Response (200 OK)**
```json
{
  "success": true,
  "aiResult": {
    "questions": [
      "제가 확인해볼 수 있는 지원사업이 있을까요?",
      "학업과 돌봄을 병행하는 청소년을 위한 지원이 있나요?"
    ],
    "template": "현재 부모를 돌보고 있는 학생입니다. 가족 돌봄으로 인해 학업에 어려움을 겪고 있습니다. 이용 가능한 지원사업이 있는지 문의드리고 싶습니다."
  }
}
```

<br/>

## 6. 로드맵 내 지원사업 진행 상태 업데이트
추천받은 복지 사업 카드의 진행 상태(대기, 확인, 연락, 신청)를 변경하여 저장합니다.

- **URL:** `/roadmaps/services/:rs_idx/status`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (필수)
- **Content-Type:** `application/json`

**Request Body**
```json
{
  "status": "contacted" 
  // 허용되는 값: "pending"(대기중), "checked"(확인됨), "contacted"(연락완료), "applied"(신청완료)
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "상태가 성공적으로 업데이트되었습니다."
}
```
