CREATE DATABASE sk; -- 테스트 용 DB

-- ※ 테이블 생성 순서 (FK 의존성)
-- 1. users → 2. survey_questions → 3. survey_results
-- 4. welfare_services → 5. user_roadmaps → 6. roadmap_services

-- 유저 생성 (테스트용)
-- CREATE USER 'test'@'%' IDENTIFIED BY 'testSK';
-- GRANT ALL PRIVILEGES ON sk.* TO 'test'@'%';
-- FLUSH PRIVILEGES;

use sk;

-- 유저 테이블
CREATE TABLE users (
    user_idx INT AUTO_INCREMENT PRIMARY KEY,    -- 시스템 내부 식별용 고유 번호 (PK)
    user_id VARCHAR(255) UNIQUE NOT NULL,       -- 로그인 시 사용할 이메일
    name VARCHAR(50) NOT NULL,                  -- 사용자 이름
    password VARCHAR(255) NOT NULL,             -- 암호화(Hash)된 비밀번호
    track_type TINYINT NULL,                    -- 'JUNIOR'(16~18세), 'SENIOR'(19~25세) 트랙 구분
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 설문 문항 관리 테이블 (Data-driven UI 및 AI 매핑용)
CREATE TABLE survey_questions (
    question_idx INT AUTO_INCREMENT PRIMARY KEY,
    question_code VARCHAR(20) UNIQUE NOT NULL,  -- 예: 'Q1', 'Q5', 'REGION'
    question_text TEXT NOT NULL,                -- 질문 원문 (예: "현재 가족을 위해...")
    question_type VARCHAR(20) NOT NULL,         -- 'SINGLE', 'MULTI', 'TEXT' 등
    options JSON,                               -- 선택지 배열 (예: ["예", "아니오"])
    is_active BOOLEAN DEFAULT TRUE,             -- 문항 사용 여부
    order_num INT NOT NULL                      -- 화면 노출 순서
);

-- 설문 결과 저장 테이블 (JSON 하이브리드 설계)
CREATE TABLE survey_results (
    result_idx INT AUTO_INCREMENT PRIMARY KEY,
    user_idx INT NOT NULL,                      -- 응답한 유저
    responses JSON NOT NULL,                    -- 유저의 답변 전체 (AI 분석을 위해 통째로 저장)
    ai_summary JSON,                            -- AI가 분석한 한줄결과 및 상황요약 저장
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_idx) REFERENCES users(user_idx) ON DELETE CASCADE
);

-- 초기 설문 문항 데이터 삽입 (Seed Data)
INSERT INTO survey_questions (question_code, question_text, question_type, options, order_num) VALUES 
('Q1', '현재 가족을 위해 직접 돌봄을 하고 있나요? (가사, 간병, 병원 동행, 보호자 역할 등)', 'SINGLE', '["예", "아니오"]', 1),
('Q2', '현재 가족의 생활비나 생계를 일부 또는 전부 책임지고 있나요?', 'SINGLE', '["예", "아니오"]', 2),
('Q3', '주로 누구를 돌보거나 책임지고 있나요?', 'PRIORITY_MULTI', '["부모", "조부모", "형제·자매", "기타 가족", "해당 없음"]', 3),
('Q4', '가족이 돌봄이 필요한 가장 큰 이유는 무엇인가요?', 'PRIORITY_MULTI', '["신체 질환", "장애", "정신건강 문제", "고령", "기타", "잘 모르겠음"]', 4),
('Q5', '가족 돌봄으로 인해 겪고 있는 어려움을 모두 선택해주세요.', 'PRIORITY_MULTI', '["공부 시간이 부족하다", "학교생활·출석에 영향을 받는다", "진로 또는 취업 준비가 어렵다", "충분한 휴식을 취하기 어렵다", "친구나 주변 사람들과의 관계가 어려워졌다", "병원비·생활비 등 경제적 부담이 있다", "아르바이트나 경제활동 부담이 있다", "스트레스나 불안감을 자주 느낀다", "해당 없음"]', 5),
('Q6', '현재 가장 필요한 도움은 무엇인가요? (최대 3개)', 'PRIORITY_MULTI', '["생활비 지원", "의료비 지원", "장학금 정보", "학습 지원", "진로·취업 지원", "심리상담 연결", "돌봄 서비스 정보", "쉼·휴식 프로그램", "문화·여가 프로그램", "가족돌봄청년 지원사업 정보 알아보기", "도움을 받을 수 있는 기관 안내"]', 6),
('Q7', '도움이 필요할 때 의지할 수 있는 사람이 있나요?', 'SINGLE', '["충분히 있다", "몇 명 있다", "거의 없다", "없다"]', 7),
('Q8', '현재 거주 지역은 어디인가요?', 'SINGLE', '["서울", "인천", "경기"]', 8);

CREATE TABLE welfare_services (
    service_idx     INT AUTO_INCREMENT PRIMARY KEY,
    service_name    VARCHAR(200) NOT NULL,
    category        VARCHAR(20) NOT NULL,           -- '학업', '경제', '정서', '휴식', '정보연결'
    support_content TEXT,
    apply_method    TEXT,
    contact_org     VARCHAR(200),
    target_age_min  INT,                            -- NULL이면 연령 제한 없음
    target_age_max  INT,                            -- NULL이면 연령 제한 없음
    region          VARCHAR(20),                    -- '전국' 또는 광역시도명
    care_type       JSON,                           -- 큐레이터 모델이 분류한 돌봄 유형 배열
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_roadmaps (
    roadmap_idx     INT AUTO_INCREMENT PRIMARY KEY,
    user_idx        INT NOT NULL,
    result_idx      INT NOT NULL,                   -- 생성 기준이 된 설문 결과
    ai_summary      TEXT,                           -- donghaeng-summary 모델 출력
    profile_scores  JSON,                           -- 규칙 기반 계산값 예: {"학업":35,"경제":25,...}
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_idx)   REFERENCES users(user_idx)             ON DELETE CASCADE,
    FOREIGN KEY (result_idx) REFERENCES survey_results(result_idx)  ON DELETE CASCADE
);

CREATE TABLE roadmap_services (
    rs_idx          INT AUTO_INCREMENT PRIMARY KEY,
    roadmap_idx     INT NOT NULL,
    service_idx     INT NOT NULL,
    priority_order  INT NOT NULL,                   -- 추천 순위
    status          ENUM('pending','checked','contacted','applied') DEFAULT 'pending',
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roadmap_idx) REFERENCES user_roadmaps(roadmap_idx)    ON DELETE CASCADE,
    FOREIGN KEY (service_idx) REFERENCES welfare_services(service_idx)  ON DELETE CASCADE
);

-- 테스트용 복지 서비스 더미 데이터 삽입
INSERT INTO welfare_services (service_name, category, support_content, apply_method, contact_org, target_age_min, target_age_max, region, care_type) VALUES 
('가족돌봄청년 생활비 지원사업', '경제', '매월 30만원 생활비 지원 및 긴급 의료비 지원', '온라인 및 관할 주민센터 방문', '보건복지상담센터(129)', 13, 34, '전국', '["신체 질환", "고령"]'),
('청소년상담복지센터 심리상담 지원', '정서', '개인 심리상담 10회 및 집단 상담 프로그램', '거주지 인근 청소년상담복지센터 전화 예약', '청소년전화(1388)', 9, 24, '전국', '["정신건강 문제", "기타"]'),
('진로·취업 탐색 프로그램', '학업', '자격증 취득 지원금 및 1:1 진로 컨설팅', '온라인 신청 (워크넷)', '고용노동부 고객상담센터(1350)', 15, 24, '전국', '["신체 질환", "장애"]');
