import { Pistolet } from 'pistolet';
import { AppPage } from './app.po';
import { HelloWorldScenario } from './helloWorld.scenario';

describe('workspace-project App', () => {
  let page: AppPage;
  let pistolet: Pistolet;

  beforeEach(() => {
    pistolet = new Pistolet([ new HelloWorldScenario() ]);
    page = new AppPage();
  });

  afterEach(() => pistolet.reset());
  afterAll(() => pistolet.stop());

  it('should simulate a REST server', async () => {
    await page.navigateTo();
    await page.field.sendKeys('Bob');
    await page.submit();
    expect(await page.message.getText()).toEqual('Hello Bob!');
    expect(pistolet.requestsMade()).toEqual([{ method: 'POST', path: '/hello' }]);
  });
});
