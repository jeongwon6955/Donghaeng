import { useMemo, useState } from 'react';
import type { AgeRange, Page } from './types';
import { AuthRequiredModal } from './components';
import {
  Dashboard,
  GettingStarted,
  Home,
  Intro,
  Login,
  MyPage,
  PersonalInfo,
  Roadmap,
  Signup,
  Start,
  SurveyComplete,
  SurveyForm,
  SurveyResult,
  SurveyStart,
  Welcome
} from './pages';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [transitionKey, setTransitionKey] = useState(0);
  const [firstUser, setFirstUser] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [authRequiredOpen, setAuthRequiredOpen] = useState(false);
  const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRange>('16-18');
  const [lastSurveyDate, setLastSurveyDate] = useState(new Date('2026-05-10T00:00:00+09:00'));

  const showReminder = useMemo(() => {
    const elapsed = Date.now() - lastSurveyDate.getTime();
    return elapsed >= 30 * 24 * 60 * 60 * 1000;
  }, [lastSurveyDate]);

  const go = (next: Page) => {
    setTransitionKey((key) => key + 1);
    setPage(next);
  };

  const goWithAuthGuard = (next: Page) => {
    if (isGuest && (next === 'mypage' || next === 'roadmap')) {
      setAuthRequiredOpen(true);
      return;
    }

    go(next);
  };

  const enterGuest = () => {
    setIsGuest(true);
    go('welcome');
  };

  const completeLogin = () => {
    setIsGuest(false);
    setAuthRequiredOpen(false);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div key={`${page}-${transitionKey}`} className="page-transition" style={{ animationDelay: `${transitionKey % 2}ms` }}>
        {page === 'home' && <Home go={go} enterGuest={enterGuest} />}
        {page === 'start' && <Start go={go} />}
        {page === 'login' && <Login go={go} firstUser={firstUser} onLogin={completeLogin} />}
        {page === 'signup' && (
          <Signup
            go={go}
            markFirstUser={() => {
              setIsGuest(false);
              setFirstUser(true);
            }}
          />
        )}
        {page === 'welcome' && <Welcome go={go} />}
        {page === 'intro' && <Intro go={go} />}
        {page === 'personalInfo' && <PersonalInfo go={go} onAgeRangeSelect={setSelectedAgeRange} />}
        {page === 'gettingStarted' && <GettingStarted go={go} ageRange={selectedAgeRange} />}
        {page === 'surveyStart' && <SurveyStart go={go} />}
        {page === 'dashboard' && <Dashboard go={goWithAuthGuard} isGuest={isGuest} />}
        {page === 'mypage' && <MyPage go={goWithAuthGuard} />}
        {page === 'surveyResult' && <SurveyResult go={goWithAuthGuard} showReminder={showReminder} />}
        {page === 'surveyForm' && (
          <SurveyForm
            go={go}
            completeSurvey={() => {
              if (!isGuest) {
                setFirstUser(false);
              }
              setLastSurveyDate(new Date());
            }}
          />
        )}
        {page === 'surveyComplete' && <SurveyComplete go={goWithAuthGuard} />}
        {page === 'roadmap' && <Roadmap go={goWithAuthGuard} />}
      </div>
      {authRequiredOpen ? (
        <AuthRequiredModal
          onClose={() => setAuthRequiredOpen(false)}
          onLogin={() => {
            setAuthRequiredOpen(false);
            go('login');
          }}
        />
      ) : null}
    </div>
  );
}
