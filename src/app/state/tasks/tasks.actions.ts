import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StatusFilter, Task, TaskStatus } from './task.model';

/** Action groups keep action types namespaced and discoverable. */
export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Enter Page': emptyProps(),
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),
    'Add Task': props<{ title: string }>(),
    'Toggle Status': props<{ id: string; status: TaskStatus }>(),
    'Remove Task': props<{ id: string }>(),
    'Set Filter': props<{ filter: StatusFilter }>(),
  },
});
