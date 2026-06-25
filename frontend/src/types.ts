export type Page =
  | 'home'
  | 'start'
  | 'login'
  | 'loading'
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
  | 'customSupport'
  | 'supportCheck'
  | 'consultingGuide'
  | 'agencyConnect'
  | 'inquiryGuide'
  | 'roadmapCurrent'
  | 'roadmap';

export type RoadmapStatus = 'done' | 'inProgress' | 'unfinshed';

export type AgeRange = '16-18' | '19-25';

export type GoToPage = (page: Page) => void;
