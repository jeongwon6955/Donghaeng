import { useEffect, useMemo, useState } from 'react';
import type { AuthUser } from './api/auth';
import { clearAuthSession, getMe, getSavedAuthSession, saveAuthUser } from './api/auth';
import type { AgeRange, Page } from './types';
import { AuthRequiredModal } from './components';
import {
  Dashboard,
  GettingStarted,
  Home,
  Intro,
  Login,
  Loading,
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
  const savedSession = getSavedAuthSession();
  const [page, setPage] = useState<Page>('home');
  const [transitionKey, setTransitionKey] = useState(0);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(savedSession?.user ?? null);
  const [checkingSession, setCheckingSession] = useState(Boolean(savedSession));
  const [isGuest, setIsGuest] = useState(false);
  const [authRequiredOpen, setAuthRequiredOpen] = useState(false);
  const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRange>('16-18');
  const [lastSurveyDate, setLastSurveyDate] = useState(new Date('2026-05-10T00:00:00+09:00'));

  const showReminder = useMemo(() => {
    const elapsed = Date.now() - lastSurveyDate.getTime();
    return elapsed >= 30 * 24 * 60 * 60 * 1000;
  }, [lastSurveyDate]);

  const firstPageForUser = (user: AuthUser): Page => (user.track_type === null ? 'welcome' : 'dashboard');

  const moveTo = (next: Page) => {
    setTransitionKey((key) => key + 1);
    setPage(next);
  };

  const go = (next: Page) => {
    if (currentUser && (next === 'home' || next === 'start' || next === 'login' || next === 'signup')) {
      moveTo(firstPageForUser(currentUser));
      return;
    }

    moveTo(next);
  };

  useEffect(() => {
    if (!savedSession) {
      setCheckingSession(false);
      return;
    }

    let ignore = false;

    const restoreSession = async () => {
      try {
        const result = await getMe();

        if (!result.user) {
          throw new Error('사용자 정보를 불러오지 못했습니다.');
        }

        if (!ignore) {
          setCurrentUser(result.user);
          saveAuthUser(result.user);
          moveTo(firstPageForUser(result.user));
        }
      } catch {
        if (!ignore) {
          clearAuthSession();
          setCurrentUser(null);
          moveTo('home');
        }
      } finally {
        if (!ignore) {
          setCheckingSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  const goWithAuthGuard = (next: Page) => {
    if (isGuest && (next === 'mypage' || next === 'roadmap')) {
      setAuthRequiredOpen(true);
      return;
    }

    go(next);
  };

  const enterGuest = () => {
    setIsGuest(true);
    setCurrentUser(null);
    moveTo('welcome');
  };

  const completeLogin = (user: AuthUser) => {
    setIsGuest(false);
    setAuthRequiredOpen(false);
    setCurrentUser(user);
  };

  const completeTrackType = (ageRange: AgeRange) => {
    const trackType = ageRange === '16-18' ? 1 : 2;

    setSelectedAgeRange(ageRange);

    if (currentUser) {
      const updatedUser = { ...currentUser, track_type: trackType };
      setCurrentUser(updatedUser);
      saveAuthUser(updatedUser);
    }
  };

  const logout = () => {
    clearAuthSession();
    setCurrentUser(null);
    setIsGuest(false);
    setAuthRequiredOpen(false);
    moveTo('home');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-ivory">
        <Loading message="로그인 상태를 확인하는중" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div key={`${page}-${transitionKey}`} className="page-transition" style={{ animationDelay: `${transitionKey % 2}ms` }}>
        {page === 'home' && <Home go={go} enterGuest={enterGuest} />}
        {page === 'start' && <Start go={go} />}
        {page === 'login' && <Login go={go} onLogin={completeLogin} />}
        {page === 'loading' && <Loading />}
        {page === 'signup' && (
          <Signup
            go={go}
            markFirstUser={() => {
              setIsGuest(false);
            }}
          />
        )}
        {page === 'welcome' && <Welcome go={go} />}
        {page === 'intro' && <Intro go={go} />}
        {page === 'personalInfo' && <PersonalInfo go={go} onAgeRangeSelect={completeTrackType} isGuest={isGuest} />}
        {page === 'gettingStarted' && <GettingStarted go={go} ageRange={selectedAgeRange} />}
        {page === 'surveyStart' && <SurveyStart go={go} />}
        {page === 'dashboard' && <Dashboard go={goWithAuthGuard} isGuest={isGuest} user={currentUser} />}
        {page === 'mypage' && <MyPage go={goWithAuthGuard} user={currentUser} onUserChange={setCurrentUser} onLogout={logout} />}
        {page === 'surveyResult' && <SurveyResult go={goWithAuthGuard} showReminder={showReminder} />}
        {page === 'surveyForm' && (
          <SurveyForm
            go={go}
            completeSurvey={() => {
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
