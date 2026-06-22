export type Page =
  | 'home'
  | 'login'
  | 'signup'
  | 'welcome'
  | 'intro'
  | 'personalInfo'
  | 'guardianConsent'
  | 'noGuardian'
  | 'surveyStart'
  | 'dashboard'
  | 'mypage'
  | 'surveyResult'
  | 'surveyForm'
  | 'surveyComplete'
  | 'roadmap';

export type RoadmapStatus = 'done' | 'unfinshed';

export type GoToPage = (page: Page) => void;
