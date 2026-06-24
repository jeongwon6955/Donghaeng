import { useEffect, useState } from 'react';
import { getSurveyQuestions, type SurveyQuestion } from '../api/survey';
import type { GoToPage } from '../types';
import { Icon, Phone, Toast } from '../components';

type SurveyAnswers = Record<string, string[]>;

const isMultiQuestion = (type: string) => type !== 'SINGLE';
const NONE_OPTION = '해당 없음';
const OTHER_OPTION = '기타';
const UNKNOWN_OPTION = '잘 모르겠음';
const EXCLUSIVE_OPTIONS = [NONE_OPTION, UNKNOWN_OPTION];

const maxSelectionsForQuestion = (question: SurveyQuestion) => {
  const match = question.title.match(/최대\s*(\d+)\s*개/);
  return match ? Number(match[1]) : null;
};

export function SurveyForm({ go, completeSurvey }: { go: GoToPage; completeSurvey: () => void }) {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const total = questions.length;
  const current = questions[index];
  const selectedAnswers = current ? answers[current.code] ?? [] : [];
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;
  const canContinue = selectedAnswers.length > 0;

  const showToast = (nextMessage: string) => {
    setMessage(nextMessage);
    window.setTimeout(() => {
      setMessage((currentMessage) => (currentMessage === nextMessage ? '' : currentMessage));
    }, 2600);
  };

  useEffect(() => {
    let ignore = false;

    const loadQuestions = async () => {
      try {
        setLoading(true);
        const nextQuestions = await getSurveyQuestions();

        if (!ignore) {
          setQuestions(nextQuestions);
          setIndex(0);
          setAnswers({});
        }
      } catch (error) {
        if (!ignore) {
          showToast(error instanceof Error ? error.message : '설문 문항을 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      ignore = true;
    };
  }, []);

  const toggleAnswer = (option: string) => {
    if (!current) return;

    setAnswers((currentAnswers) => {
      const previous = currentAnswers[current.code] ?? [];
      let next: string[];

      if (!isMultiQuestion(current.type)) {
        next = [option];
      } else if (EXCLUSIVE_OPTIONS.includes(option)) {
        next = previous.includes(option) ? [] : [option];
      } else if (option === OTHER_OPTION) {
        next = previous.includes(OTHER_OPTION) ? [] : [OTHER_OPTION];
      } else if (previous.includes(option)) {
        next = previous.filter((answer) => answer !== option);
      } else {
        const withoutExclusive = previous.filter((answer) => !EXCLUSIVE_OPTIONS.includes(answer) && answer !== OTHER_OPTION);
        const maxSelections = maxSelectionsForQuestion(current);
        const withNewOption = [...withoutExclusive, option];

        next = maxSelections && withNewOption.length > maxSelections
          ? withNewOption.slice(withNewOption.length - maxSelections)
          : withNewOption;
      }

      return {
        ...currentAnswers,
        [current.code]: next
      };
    });
  };

  const next = () => {
    if (!current) return;

    if (!canContinue) {
      showToast('답변을 선택해 주세요.');
      return;
    }

    if (index >= total - 1) {
      completeSurvey();
      go('surveyComplete');
      return;
    }

    setIndex((value) => value + 1);
  };

  const previous = () => {
    setIndex((value) => Math.max(0, value - 1));
  };

  return (
    <Phone>
      {message ? <Toast message={message} onClose={() => setMessage('')} /> : null}
      <div className="flex flex-1 flex-col gap-5 px-5 py-6">
        <div>
          <div className="mb-2 flex justify-between text-[14px]">
            <span className="text-[#7a9a82]">자가진단 진행</span>
            <span className="font-medium text-greenMain">{loading || total === 0 ? '0 / 0' : `${index + 1} / ${total}`}</span>
          </div>
          <div className="h-[7px] overflow-hidden rounded bg-[#ddf0e5]">
            <div className="survey-progress-fill h-full rounded bg-greenMain" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-[#7a9a82]">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-[3px] border-[#cde8d8] border-t-greenMain" />
            <span className="text-[16px]">설문 문항을 불러오는 중입니다</span>
          </div>
        ) : current ? (
          <>
            <div>
              <div className="mb-1 text-[14px] text-[#9ab8a4]">{current.code}.</div>
              <h1 className="text-[22px] font-medium leading-normal text-greenDeep">{current.title}</h1>
              {isMultiQuestion(current.type) ? (
                <div className="mt-2 text-[14px] font-medium text-[#c0392b]">
                  * 복수 선택 가능{maxSelectionsForQuestion(current) ? ` (최대 ${maxSelectionsForQuestion(current)}개)` : ''}
                </div>
              ) : null}
            </div>

            <div key={current.code} className="flex flex-1 flex-col gap-2">
              {current.options.map((option, optionIndex) => {
                const checked = selectedAnswers.includes(option);

                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => toggleAnswer(option)}
                    className={`survey-option flex min-h-[56px] items-center gap-3 rounded-xl px-4 py-3 text-left ${
                      checked ? 'border-2 border-greenMain bg-[#e8f5ee]' : 'border-[1.5px] border-[#cde8d8] bg-input'
                    }`}
                    style={{ animationDelay: `${120 + optionIndex * 95}ms` }}
                  >
                    <span className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full ${checked ? 'bg-greenMain' : 'border-[1.5px] border-[#c5d8cc]'}`}>
                      {checked ? <span className="h-[7px] w-[7px] rounded-full bg-white" /> : null}
                    </span>
                    <span className={`text-[16px] ${checked ? 'font-medium text-greenDeep' : 'text-[#5a7a65]'}`}>{option}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center text-[16px] text-[#7a9a82]">
            표시할 설문 문항이 없습니다.
          </div>
        )}

        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            className="flex h-[52px] flex-1 items-center justify-center gap-1 rounded-xl border-[1.5px] border-[#cde8d8] bg-input text-[16px] text-[#5a7a65]"
            onClick={previous}
            disabled={loading || index === 0}
          >
            <Icon name="arrow_back" className="text-base" />
            이전
          </button>
          <button type="button" className={`primary-button flex-[2] ${loading || !current ? 'opacity-60' : ''}`} disabled={loading || !current} onClick={next}>
            {index >= total - 1 ? '완료' : '다음'} <Icon name="arrow_forward" className="text-base" />
          </button>
        </div>
      </div>
    </Phone>
  );
}
