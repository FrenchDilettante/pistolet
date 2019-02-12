import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

interface HelloWorldResponse {
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  input = '';
  message = '';

  constructor(
    public http: HttpClient,
  ) { }

  submit() {
    this.http.post<HelloWorldResponse>('http://localhost:8080/hello', { name: this.input })
      .subscribe((response) => this.message = response.message);
  }
}
