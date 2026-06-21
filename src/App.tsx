import { useMemo, useState } from 'react';
import type { Page } from './types';
import { Dashboard, Home, Intro, Login, MyPage, Roadmap, Signup, SurveyComplete, SurveyForm, SurveyResult, SurveyStart, Welcome } from './pages';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [transitionKey, setTransitionKey] = useState(0);
  const [firstUser, setFirstUser] = useState(true);
  const [lastSurveyDate, setLastSurveyDate] = useState(new Date('2026-05-10T00:00:00+09:00'));

  const showReminder = useMemo(() => {
    const elapsed = Date.now() - lastSurveyDate.getTime();
    return elapsed >= 30 * 24 * 60 * 60 * 1000;
  }, [lastSurveyDate]);

  const go = (next: Page) => {
    setTransitionKey((key) => key + 1);
    setPage(next);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div key={`${page}-${transitionKey}`} className="page-transition" style={{ animationDelay: `${transitionKey % 2}ms` }}>
        {page === 'home' && <Home go={go} />}
        {page === 'login' && <Login go={go} firstUser={firstUser} />}
        {page === 'signup' && <Signup go={go} markFirstUser={() => setFirstUser(true)} />}
        {page === 'welcome' && <Welcome go={go} />}
        {page === 'intro' && <Intro go={go} />}
        {page === 'surveyStart' && <SurveyStart go={go} />}
        {page === 'dashboard' && <Dashboard go={go} />}
        {page === 'mypage' && <MyPage go={go} />}
        {page === 'surveyResult' && <SurveyResult go={go} showReminder={showReminder} />}
        {page === 'surveyForm' && (
          <SurveyForm
            go={go}
            completeSurvey={() => {
              setFirstUser(false);
              setLastSurveyDate(new Date());
            }}
          />
        )}
        {page === 'surveyComplete' && <SurveyComplete go={go} />}
        {page === 'roadmap' && <Roadmap go={go} />}
      </div>
    </div>
  );
}
