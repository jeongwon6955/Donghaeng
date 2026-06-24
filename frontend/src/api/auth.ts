export type AuthUser = {
  user_id: string;
  name: string;
  track_type: number | null;
};

type ApiResult = {
  success: boolean;
  message?: string;
};

type SigninResult = ApiResult & {
  token?: string;
  user?: AuthUser;
};

type MeResult = ApiResult & {
  user?: AuthUser;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const AUTH_TOKEN_KEY = 'donghaeng_auth_token';
const AUTH_USER_KEY = 'donghaeng_auth_user';

async function requestJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = (await response.json().catch(() => ({
    success: false,
    message: '서버 응답을 확인할 수 없습니다. 백엔드 서버를 재시작한 뒤 다시 시도해 주세요.'
  }))) as ApiResult;

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || '요청 처리 중 오류가 발생했습니다.', response.status);
  }

  return data as T;
}

async function requestJsonWithAuth<T>(url: string, method: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    throw new Error('로그인 정보가 없습니다. 다시 로그인해 주세요.');
  }

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const data = (await response.json().catch(() => ({
    success: false,
    message: '서버 응답을 확인할 수 없습니다. 백엔드 서버를 재시작한 뒤 다시 시도해 주세요.'
  }))) as ApiResult;

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || '요청 처리 중 오류가 발생했습니다.', response.status);
  }

  return data as T;
}

export function signup(payload: {
  user_id: string;
  name: string;
  password: string;
}) {
  return requestJson<ApiResult>('/user/signup', payload);
}

export function signin(payload: { user_id: string; password: string }) {
  return requestJson<SigninResult>('/user/signin', payload);
}

export function updateTrackType(trackType: number) {
  return requestJsonWithAuth<ApiResult & { track_type?: number }>('/user/track-type', 'PUT', {
    track_type: trackType
  });
}

export function updatePassword(payload: { current_password: string; new_password: string }) {
  return requestJsonWithAuth<ApiResult>('/user/password', 'PUT', payload);
}

export function getMe() {
  return requestJsonWithAuth<MeResult>('/user/me', 'GET');
}

export function saveAuthSession(token: string, user: AuthUser) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function saveAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getSavedAuthSession() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!token || !rawUser) {
    return null;
  }

  try {
    return { token, user: JSON.parse(rawUser) as AuthUser };
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}
