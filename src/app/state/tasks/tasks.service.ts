import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Task } from './task.model';

/**
 * Stand-in for a backend. Returns Observables with latency so the effects and
 * loading states behave as they would against a real API. Swap this class for
 * an HttpClient-backed one and nothing in the store changes.
 */
@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly seed: Task[] = [
    { id: 't1', title: 'Design the board layout', status: 'done', createdAt: 1 },
    { id: 't2', title: 'Wire up NgRx store', status: 'doing', createdAt: 2 },
    { id: 't3', title: 'Write selector tests', status: 'todo', createdAt: 3 },
    { id: 't4', title: 'Add optimistic toggle', status: 'todo', createdAt: 4 },
  ];

  getTasks(): Observable<Task[]> {
    return of(this.seed.map((t) => ({ ...t }))).pipe(delay(150));
  }
}
