import { tasksFeature, adapter } from './tasks.reducer';
import { TasksActions } from './tasks.actions';
import { Task } from './task.model';

const { reducer } = tasksFeature;
const initial = reducer(undefined, { type: '@@init' });
const tasks: Task[] = [
  { id: 't1', title: 'A', status: 'todo', createdAt: 1 },
  { id: 't2', title: 'B', status: 'doing', createdAt: 2 },
];

describe('tasks reducer', () => {
  it('sets loading on loadTasks', () => {
    const state = reducer(initial, TasksActions.loadTasks());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores tasks and clears loading on success', () => {
    const state = reducer(initial, TasksActions.loadTasksSuccess({ tasks }));
    expect(state.loading).toBe(false);
    expect(adapter.getSelectors().selectAll(state).map((t) => t.id)).toEqual(['t1', 't2']);
  });

  it('records an error on failure', () => {
    const state = reducer(initial, TasksActions.loadTasksFailure({ error: 'boom' }));
    expect(state.error).toBe('boom');
    expect(state.loading).toBe(false);
  });

  it('cycles status todo -> doing -> done -> todo on toggle', () => {
    let state = reducer(initial, TasksActions.loadTasksSuccess({ tasks }));
    state = reducer(state, TasksActions.toggleStatus({ id: 't1', status: 'todo' }));
    expect(state.entities['t1']!.status).toBe('doing');
    state = reducer(state, TasksActions.toggleStatus({ id: 't1', status: 'doing' }));
    expect(state.entities['t1']!.status).toBe('done');
    state = reducer(state, TasksActions.toggleStatus({ id: 't1', status: 'done' }));
    expect(state.entities['t1']!.status).toBe('todo');
  });

  it('adds and removes tasks', () => {
    let state = reducer(initial, TasksActions.addTask({ title: 'New' }));
    expect(adapter.getSelectors().selectTotal(state)).toBe(1);
    const id = adapter.getSelectors().selectAll(state)[0]!.id;
    state = reducer(state, TasksActions.removeTask({ id }));
    expect(adapter.getSelectors().selectTotal(state)).toBe(0);
  });

  it('updates the filter', () => {
    const state = reducer(initial, TasksActions.setFilter({ filter: 'done' }));
    expect(state.filter).toBe('done');
  });
});
