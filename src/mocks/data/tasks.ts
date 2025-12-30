import type { TaskStatus } from '@/types/api';

export interface MockTask {
  id: string;
  title: string;
  memo: string;
  status: TaskStatus;
  registerDatetime: string;
}

// Generate 47 mock tasks for infinite scroll testing (3 pages: 20+20+7)
export const mockTasks: MockTask[] = Array.from({ length: 47 }, (_, index) => {
  const id = `task-${String(index + 1).padStart(3, '0')}`;
  const status: TaskStatus = Math.random() > 0.3 ? 'TODO' : 'DONE';

  // Register datetime: random within last 30 days
  const daysAgo = Math.floor(Math.random() * 30);
  const registerDate = new Date();
  registerDate.setDate(registerDate.getDate() - daysAgo);

  return {
    id,
    title: `할 일 ${index + 1}`,
    memo: `할 일 ${index + 1}에 대한 메모입니다.\n세부 내용이 여기에 들어갑니다.`,
    status,
    registerDatetime: registerDate.toISOString(),
  };
});

// Sort by most recent first
mockTasks.sort(
  (a, b) =>
    new Date(b.registerDatetime).getTime() -
    new Date(a.registerDatetime).getTime()
);
