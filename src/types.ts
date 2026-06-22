export type Page =
  | 'home'
  | 'login'
  | 'signup'
  | 'welcome'
  | 'intro'
  | 'surveyStart'
  | 'dashboard'
  | 'mypage'
  | 'surveyResult'
  | 'surveyForm'
  | 'surveyComplete'
  | 'roadmap';

export type RoadmapStatus = 'done' | 'unfinshed';

export type GoToPage = (page: Page) => void;
