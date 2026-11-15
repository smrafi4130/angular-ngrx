import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import * as effects from './tasks.effects';
import { TasksActions } from './tasks.actions';
import { TasksService } from './tasks.service';
import { Task } from './task.model';

const tasks: Task[] = [{ id: 't1', title: 'A', status: 'todo', createdAt: 1 }];

describe('tasks effects', () => {
  let actions$: Observable<Action>;

  function configure(service: Partial<TasksService>) {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$), { provide: TasksService, useValue: service }],
    });
  }

  it('loadOnEnter$ maps enterPage to loadTasks', (done) => {
    configure({ getTasks: () => of(tasks) });
    actions$ = of(TasksActions.enterPage());
    TestBed.runInInjectionContext(() => {
      effects.loadOnEnter$().subscribe((action: unknown) => {
        expect(action).toEqual(TasksActions.loadTasks());
        done();
      });
    });
  });

  it('loadTasks$ emits success with the fetched tasks', (done) => {
    configure({ getTasks: () => of(tasks) });
    actions$ = of(TasksActions.loadTasks());
    TestBed.runInInjectionContext(() => {
      effects.loadTasks$().subscribe((action: unknown) => {
        expect(action).toEqual(TasksActions.loadTasksSuccess({ tasks }));
        done();
      });
    });
  });

  it('loadTasks$ emits failure when the service errors', (done) => {
    configure({ getTasks: () => throwError(() => new Error('network down')) });
    actions$ = of(TasksActions.loadTasks());
    TestBed.runInInjectionContext(() => {
      effects.loadTasks$().subscribe((action: unknown) => {
        expect(action).toEqual(TasksActions.loadTasksFailure({ error: 'network down' }));
        done();
      });
    });
  });
});
