import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TasksActions } from './tasks.actions';
import { TasksService } from './tasks.service';

/**
 * Effects isolate side effects (async, I/O) from the reducer. Entering the page
 * triggers a load; the load calls the service and maps success/failure back to
 * actions. switchMap cancels an in-flight load if another is requested.
 */
export const loadOnEnter$ = createEffect(
  (actions$ = inject(Actions)) => actions$.pipe(ofType(TasksActions.enterPage), map(() => TasksActions.loadTasks())),
  { functional: true },
);

export const loadTasks$ = createEffect(
  (actions$ = inject(Actions), service = inject(TasksService)) =>
    actions$.pipe(
      ofType(TasksActions.loadTasks),
      switchMap(() =>
        service.getTasks().pipe(
          map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
          catchError((error: unknown) =>
            of(TasksActions.loadTasksFailure({ error: error instanceof Error ? error.message : 'Failed to load tasks' })),
          ),
        ),
      ),
    ),
  { functional: true },
);
