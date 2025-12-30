import { http, HttpResponse, delay } from 'msw';
import { checkAuth } from '../utils/auth';
import { mockTasks } from '../data/tasks';

export const dashboardHandlers = [
  http.get('/api/dashboard', async ({ request }) => {
    await delay(300);

    // Authentication check
    const authError = checkAuth(request);
    if (authError) return authError;

    // Calculate statistics from mock tasks
    const numOfTask = mockTasks.length;
    const numOfRestTask = mockTasks.filter((t) => t.status === 'TODO').length;
    const numOfDoneTask = mockTasks.filter((t) => t.status === 'DONE').length;

    return HttpResponse.json({
      numOfTask,
      numOfRestTask,
      numOfDoneTask,
    });
  }),
];
