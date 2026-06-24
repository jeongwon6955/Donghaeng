/**
 * Ollama AI 서비스 연동 모듈
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_TIMEOUT_MS = parseInt(
  process.env.OLLAMA_TIMEOUT_MS || "120000",
  10,
);

const COMMON_BANNED_EXPRESSIONS = [
  "당신은",
  "해당합니다",
  "해당되며",
  "해당되므로",
  "받을 수 있습니다",
  "영케어러입니다",
  "가능합니다",
  "포함되므로",
];

const COUNSEL_BANNED_EXPRESSIONS = [
  ...COMMON_BANNED_EXPRESSIONS,
  "수급 자격",
  "급여 대상",
];

function containsBannedExpressions(text, isCounsel = false) {
  const bannedList = isCounsel
    ? COUNSEL_BANNED_EXPRESSIONS
    : COMMON_BANNED_EXPRESSIONS;
  for (const banned of bannedList) {
    if (text.includes(banned)) {
      console.warn(`[Ollama Warning] 금지어 감지됨: "${banned}"`);
      return true;
    }
  }
  return false;
}

const parseSummaryOutput = (raw) => {
  const oneLineMatch = raw.match(/##한줄결과##([\s\S]*?)(?=##상황요약##|$)/i);
  const summaryMatch = raw.match(/##상황요약##([\s\S]*?)$/i);

  if (oneLineMatch && summaryMatch) {
    return {
      valid: true,
      oneLine: oneLineMatch[1].trim(),
      summary: summaryMatch[1].trim(),
    };
  }
  return { valid: false };
};

const parseGuideOutput = (raw) => {
  const itemsMatch = raw.match(/##확인항목##([\s\S]*?)$/i);
  if (itemsMatch) {
    const items = itemsMatch[1]
      .trim()
      .split("\n")
      .map((i) => i.replace(/^[-\*]\s*/, "").trim())
      .filter((i) => i);
    return { valid: true, items };
  }
  return { valid: false };
};

const parseCounselOutput = (raw) => {
  const qMatch = raw.match(/##추천질문##([\s\S]*?)(?=##문의템플릿##|$)/i);
  const tMatch = raw.match(/##문의템플릿##([\s\S]*?)$/i);

  if (qMatch && tMatch) {
    const questions = qMatch[1]
      .trim()
      .split("\n")
      .map((q) => q.replace(/^[-\*]\s*/, "").trim())
      .filter((q) => q);
    return {
      valid: true,
      questions,
      template: tMatch[1].trim(),
    };
  }
  return { valid: false };
};

/**
 * Ollama 서버에 요청을 보내고 실패 시 재시도합니다.
 * 에러를 throw하지 않고, 프론트에서 처리할 수 있도록 { valid, reason } 형태를 반환합니다.
 */
async function callModelWithRetry(
  model,
  prompt,
  parserFunc,
  maxRetries = 2,
  isCounsel = false,
) {
  let attempt = 0;
  let lastFailReason = "UNKNOWN_ERROR";

  while (attempt <= maxRetries) {
    attempt++;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt, stream: false }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API 에러: 상태 코드 ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.response;

      if (containsBannedExpressions(rawText, isCounsel)) {
        lastFailReason = "BANNED_EXPRESSION";
        console.warn(`[Ollama] ${attempt}회차 실패: ${lastFailReason}`);
        continue;
      }

      const parsed = parserFunc(rawText);
      if (!parsed.valid) {
        lastFailReason = "FORMAT_ERROR";
        console.warn(`[Ollama] ${attempt}회차 실패: ${lastFailReason}`);
        continue;
      }

      return parsed;
    } catch (error) {
      lastFailReason =
        error.name === "AbortError" ? "TIMEOUT_ERROR" : "NETWORK_ERROR";
      console.error(`[Ollama] ${attempt}회차 에러:`, error.message);
    }
  }

  return { valid: false, reason: "MAX_RETRY_EXCEEDED" };
}

module.exports = {
  callModelWithRetry,
  parseSummaryOutput,
  parseGuideOutput,
  parseCounselOutput,
};
