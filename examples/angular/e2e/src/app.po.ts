import { browser, $ } from 'protractor';

export class AppPage {
  field = $('#name-field');
  message = $('#message');
  sample = $('#sample');
  submitBtn = $('#submit-btn');

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  submit() {
    return this.submitBtn.click();
  }
}
