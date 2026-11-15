import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { TasksActions } from './tasks.actions';
import { StatusFilter, Task, TaskStatus } from './task.model';

export interface TasksState extends EntityState<Task> {
  loading: boolean;
  error: string | null;
  filter: StatusFilter;
}

// Entity adapter: normalized storage (ids + entities) with helpers for CRUD.
export const adapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => a.createdAt - b.createdAt,
});

const initialState: TasksState = adapter.getInitialState({
  loading: false,
  error: null,
  filter: 'all',
});

const nextStatus: Record<TaskStatus, TaskStatus> = { todo: 'doing', doing: 'done', done: 'todo' };

/**
 * A single feature groups the reducer, name and auto-generated feature selectors.
 * The reducer is pure; side effects live in tasks.effects.ts.
 */
export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(
    initialState,
    on(TasksActions.loadTasks, (state) => ({ ...state, loading: true, error: null })),
    on(TasksActions.loadTasksSuccess, (state, { tasks }) => adapter.setAll(tasks, { ...state, loading: false })),
    on(TasksActions.loadTasksFailure, (state, { error }) => ({ ...state, loading: false, error })),
    on(TasksActions.addTask, (state, { title }) =>
      adapter.addOne(
        { id: `t${Date.now()}${Math.floor(Math.random() * 1000)}`, title, status: 'todo', createdAt: Date.now() },
        state,
      ),
    ),
    on(TasksActions.toggleStatus, (state, { id, status }) =>
      adapter.updateOne({ id, changes: { status: nextStatus[status] } }, state),
    ),
    on(TasksActions.removeTask, (state, { id }) => adapter.removeOne(id, state)),
    on(TasksActions.setFilter, (state, { filter }) => ({ ...state, filter })),
  ),
  extraSelectors: ({ selectTasksState, selectFilter }) => {
    const { selectAll } = adapter.getSelectors(selectTasksState);
    // Memoized derived state: these recompute only when their inputs change.
    const selectAllTasks = selectAll;
    const selectFilteredTasks = createSelector(selectAllTasks, selectFilter, (tasks, filter) =>
      filter === 'all' ? tasks : tasks.filter((t) => t.status === filter),
    );
    const selectStats = createSelector(selectAllTasks, (tasks) => ({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      doing: tasks.filter((t) => t.status === 'doing').length,
      done: tasks.filter((t) => t.status === 'done').length,
    }));
    return { selectAllTasks, selectFilteredTasks, selectStats };
  },
});
