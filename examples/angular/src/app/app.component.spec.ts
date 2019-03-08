import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Pistolet } from 'pistolet';
import { HttpClientModule } from 'pistolet-angular';
import { AppComponent } from './app.component';
import { HelloWorldScenario } from 'src/scenarios/helloWorld.scenario';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let pistolet: Pistolet;

  beforeAll(() => pistolet = new Pistolet([
    require('src/scenarios/sampleGet.json'),
    new HelloWorldScenario(),
  ]));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [ FormsModule, HttpClientModule ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.baseUrl = '';
    fixture.detectChanges();
  }));

  afterEach(() => pistolet.reset());
  afterAll(() => pistolet.stop());

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load a JSON scenario', () => {
    expect(component.sample).toEqual('Sample Response');
    expect(pistolet.requestsMade()[0]).toEqual({ method: 'GET', path: '/sample' });
  });

  it('should make a POST request', () => {
    component.input = 'Bob';
    component.submit();
    expect(component.message).toEqual('Hello Bob!');
    expect(pistolet.requestsMade()[1]).toEqual({ method: 'POST', path: '/hello' });
  });
});
