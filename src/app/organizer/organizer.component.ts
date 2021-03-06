import { Component, OnInit } from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Task, TaskService} from '../shared/task.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  titleForm: FormControl;
  tasks: Task[] = [];

  constructor(
    private dateService: DateService,
    private taskService: TaskService
  ) {

  }

  ngOnInit() {
    this.dateService.date
      .pipe(switchMap(value => this.taskService.read(value)))
      .subscribe(tasks => {
        this.tasks = tasks;
      });

    this.titleForm = new FormControl('', Validators.required);
  }

  submit() {
    const title = this.titleForm.value;
    const date = this.dateService.date.value.format('DD-MM-YYYY');

    const task: Task = {title, date};

    this.taskService.create(task).subscribe(res => {
      this.titleForm.reset();
      this.titleForm.setErrors(null);

      this.tasks.push(res);
    }, err => {
      alert('ERROR CREATE: ' + err);
    });
  }

  remove(task: Task) {
    this.taskService.delete(task).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }, err => {
      alert('ERROR DELETE: ' + err);
    });
  }
}
