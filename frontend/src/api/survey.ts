type SurveyQuestionsResult = {
  success: boolean;
  message?: string;
  data?: SurveyQuestionResponse[];
};

export type SurveyQuestionResponse = {
  question_code: string;
  question_text: string;
  question_type: string;
  options: string[] | string | null;
};

export type SurveyQuestion = {
  code: string;
  title: string;
  type: string;
  options: string[];
};

function parseOptions(options: SurveyQuestionResponse['options']) {
  if (Array.isArray(options)) {
    return options.map(String);
  }

  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  return [];
}

export async function getSurveyQuestions() {
  const response = await fetch('/user/survey-questions');
  const data = (await response.json().catch(() => ({
    success: false,
    message: '설문 문항을 불러오지 못했습니다.'
  }))) as SurveyQuestionsResult;

  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.message || '설문 문항을 불러오지 못했습니다.');
  }

  return data.data.map((question) => ({
    code: question.question_code,
    title: question.question_text,
    type: question.question_type,
    options: parseOptions(question.options)
  }));
}
