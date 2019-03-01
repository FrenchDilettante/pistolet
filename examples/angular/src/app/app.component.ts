import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface HelloWorldResponse {
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  baseUrl = 'http://localhost:8080';

  input = '';
  message = '';
  sample = '';

  constructor(
    public http: HttpClient,
  ) { }

  ngOnInit() {
    this.http.get<HelloWorldResponse>(`${this.baseUrl}/sample`)
      .subscribe((response) => this.sample = response.message);
  }

  submit() {
    this.http.post<HelloWorldResponse>(`${this.baseUrl}/hello`, { name: this.input })
      .subscribe((response) => this.message = response.message);
  }
}
