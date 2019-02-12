import { browser, by, element, $, ExpectedConditions } from 'protractor';

export class AppPage {
  field = $('#name-field');
  message = $('#message');
  submitBtn = $('#submit-btn');

  navigateTo() {
    browser.get(browser.baseUrl);
  }

  submit() {
    return this.submitBtn.click();
  }
}
