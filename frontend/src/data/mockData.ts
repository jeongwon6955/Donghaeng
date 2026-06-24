import type { Page, RoadmapStatus } from '../types';

export const user = {
  name: '홍길동',
  role: '성인',
  email: 'hong@example.com',
};

export const surveyRows = [
  ['현재 상황', '안정적'],
  ['목표 분야', '커리어 성장'],
  ['우선순위', '자기계발'],
  ['관심 영역', '기술 학습']
] as const;

export const roadmapSteps: Array<{ title: string; label: string; status: RoadmapStatus; page?: Page }> = [
  { title: '1단계. 상황 확인', label: '완료', status: 'done', page: 'surveyResult' },
  { title: '2단계. 맞춤 지원사업 추천', label: '완료', status: 'done' },
  { title: '3단계. 지원사업 확인', label: '미완료', status: 'unfinshed' },
  { title: '4단계. 상담 준비 가이드', label: '미완료', status: 'unfinshed' },
  { title: '5단계. 공식 기관 연결', label: '미완료', status: 'unfinshed' }
];

export const questions = [
  {
    title: '현재 나의 상황은 어떻게 느껴지시나요?',
    options: ['매우 안정적이다', '보통이다', '다소 불안정하다', '매우 불안정하다']
  },
  {
    title: '가장 먼저 개선하고 싶은 영역은 무엇인가요?',
    options: ['커리어 성장', '생활 습관', '재무 안정', '관계 회복']
  },
  {
    title: '목표를 실행할 때 필요한 도움은 무엇인가요?',
    options: ['구체적인 단계', '꾸준한 점검', '학습 자료', '동기 부여']
  }
];
