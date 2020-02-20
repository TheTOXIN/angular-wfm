import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';

export interface Task {
  id?: string;
  title: string;
  date: string;
}

export interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  static URL = 'https://angularwfm.firebaseio.com/tasks';

  constructor(private  http: HttpClient) {

  }

  read(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TaskService.URL}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return [];
        }

        return Object.keys(tasks)
          .map(key => ({
            ...tasks[key],
            id: key
          }));
      }));
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TaskService.URL}/${task.date}.json`, task)
      .pipe(map(res => {
        return {
          ...task, id: res.name
        };
      }));
  }

  delete(task: Task) {
    return this.http
      .delete<void>(`${TaskService.URL}/${task.date}/${task.id}.json`);
  }
}
