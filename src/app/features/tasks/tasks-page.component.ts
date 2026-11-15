import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { tasksFeature } from '../../state/tasks/tasks.reducer';
import { TasksActions } from '../../state/tasks/tasks.actions';
import { StatusFilter, TASK_STATUSES, TaskStatus } from '../../state/tasks/task.model';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks-page.component.html',
})
export class TasksPageComponent implements OnInit {
  private readonly store = inject(Store);

  // Store signals: selectors exposed as signals for OnPush templates.
  protected readonly tasks = this.store.selectSignal(tasksFeature.selectFilteredTasks);
  protected readonly stats = this.store.selectSignal(tasksFeature.selectStats);
  protected readonly loading = this.store.selectSignal(tasksFeature.selectLoading);
  protected readonly error = this.store.selectSignal(tasksFeature.selectError);
  protected readonly filter = this.store.selectSignal(tasksFeature.selectFilter);

  protected readonly filters: StatusFilter[] = ['all', ...TASK_STATUSES];
  protected readonly statusLabel: Record<TaskStatus, string> = { todo: 'To do', doing: 'Doing', done: 'Done' };
  protected readonly newTitle = signal('');

  ngOnInit(): void {
    this.store.dispatch(TasksActions.enterPage());
  }

  setFilter(filter: StatusFilter): void {
    this.store.dispatch(TasksActions.setFilter({ filter }));
  }
  add(): void {
    const title = this.newTitle().trim();
    if (!title) return;
    this.store.dispatch(TasksActions.addTask({ title }));
    this.newTitle.set('');
  }
  toggle(id: string, status: TaskStatus): void {
    this.store.dispatch(TasksActions.toggleStatus({ id, status }));
  }
  remove(id: string): void {
    this.store.dispatch(TasksActions.removeTask({ id }));
  }
}
