import { http, HttpResponse, delay } from 'msw';
import { checkAuth } from '../utils/auth';
import { mockTasks } from '../data/tasks';
import { MESSAGES } from '@/constants/messages';

// Page size constant
const PAGE_SIZE = 20;

export const taskHandlers = [
  /**
   * Get task list
   *
   * IMPORTANT: Returns array directly (no meta object)
   * This matches the API spec exactly
   */
  http.get('/api/task', async ({ request }) => {
    await delay(300);

    // Authentication check
    const authError = checkAuth(request);
    if (authError) return authError;

    // Extract pagination params
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;

    // Calculate pagination
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    // Extract current page data
    const data = mockTasks.slice(startIndex, endIndex).map((task) => ({
      id: task.id, // Required for navigation to detail page
      title: task.title,
      memo: task.memo,
      status: task.status,
    }));

    // Return array directly (no meta object per spec)
    return HttpResponse.json(data);
  }),

  /**
   * Get task detail
   */
  http.get('/api/task/:id', async ({ request, params }) => {
    await delay(200);

    // Authentication check
    const authError = checkAuth(request);
    if (authError) return authError;

    const { id } = params;
    const task = mockTasks.find((t) => t.id === id);

    if (!task) {
      return HttpResponse.json(
        { errorMessage: MESSAGES.TASK_NOT_FOUND },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      id: task.id,
      title: task.title,
      memo: task.memo,
      status: task.status,
      registerDatetime: task.registerDatetime,
    });
  }),

  /**
   * Delete task
   */
  http.delete('/api/task/:id', async ({ request, params }) => {
    await delay(300);

    // Authentication check
    const authError = checkAuth(request);
    if (authError) return authError;

    const { id } = params;
    const taskIndex = mockTasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return HttpResponse.json(
        { errorMessage: MESSAGES.TASK_NOT_FOUND },
        { status: 404 }
      );
    }

    // In real implementation, would remove from array
    // For mock, just return success
    return HttpResponse.json({
      message: MESSAGES.TASK_DELETE_SUCCESS,
    });
  }),
];
