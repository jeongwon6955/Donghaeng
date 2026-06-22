export type Page =
  | 'home'
  | 'login'
  | 'signup'
  | 'welcome'
  | 'intro'
  | 'personalInfo'
  | 'gettingStarted'
  | 'surveyStart'
  | 'dashboard'
  | 'mypage'
  | 'surveyResult'
  | 'surveyForm'
  | 'surveyComplete'
  | 'roadmap';

export type RoadmapStatus = 'done' | 'unfinshed';

export type AgeRange = '16-18' | '19-25';

export type GoToPage = (page: Page) => void;
