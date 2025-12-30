// Error and UI messages
export const MESSAGES = {
  // Auth errors
  AUTH_REQUIRED: '인증이 필요합니다.',
  LOGIN_FAILED: '이메일 또는 비밀번호가 올바르지 않습니다.',
  TOKEN_EXPIRED: '토큰이 만료되었습니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',

  // Validation errors
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  INVALID_PASSWORD: '비밀번호는 영문, 한글, 숫자로 8~24자여야 합니다.',
  REQUIRED_FIELD: '필수 입력 항목입니다.',

  // Task errors
  TASK_NOT_FOUND: '할 일을 찾을 수 없습니다.',
  TASK_DELETE_CONFIRM: '정말 삭제하시겠습니까?',
  TASK_DELETE_SUCCESS: '할 일이 삭제되었습니다.',

  // UI messages
  NO_TASKS: '할 일이 없습니다.',
  LOADING: '로딩 중...',
  DELETE_INSTRUCTION: (id: string) => `삭제하려면 "${id}"를 입력하세요`,

  // Button labels
  BUTTON_SUBMIT: '제출',
  BUTTON_DELETE: '삭제',
  BUTTON_CANCEL: '취소',
  BUTTON_CONFIRM: '확인',
  BUTTON_RETRY: '다시 시도',
  BUTTON_BACK_TO_LIST: '목록으로 돌아가기',
} as const;
