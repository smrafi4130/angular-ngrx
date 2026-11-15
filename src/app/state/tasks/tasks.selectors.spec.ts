import { tasksFeature } from './tasks.reducer';
import { TasksActions } from './tasks.actions';
import { Task } from './task.model';

const { reducer, selectFilteredTasks, selectStats } = tasksFeature;
const tasks: Task[] = [
  { id: 't1', title: 'A', status: 'todo', createdAt: 1 },
  { id: 't2', title: 'B', status: 'doing', createdAt: 2 },
  { id: 't3', title: 'C', status: 'done', createdAt: 3 },
  { id: 't4', title: 'D', status: 'todo', createdAt: 4 },
];

function stateWith(filter: Parameters<typeof TasksActions.setFilter>[0]['filter']) {
  let s = reducer(undefined, TasksActions.loadTasksSuccess({ tasks }));
  s = reducer(s, TasksActions.setFilter({ filter }));
  return { tasks: s };
}

describe('tasks selectors', () => {
  it('selectFilteredTasks returns all when filter is "all"', () => {
    expect(selectFilteredTasks(stateWith('all')).map((t) => t.id)).toEqual(['t1', 't2', 't3', 't4']);
  });

  it('selectFilteredTasks filters by status', () => {
    expect(selectFilteredTasks(stateWith('todo')).map((t) => t.id)).toEqual(['t1', 't4']);
  });

  it('selectStats counts per status', () => {
    expect(selectStats(stateWith('all'))).toEqual({ total: 4, todo: 2, doing: 1, done: 1 });
  });

  it('is memoized: same inputs return the same reference', () => {
    const s = stateWith('all');
    expect(selectStats(s)).toBe(selectStats(s));
  });
});
