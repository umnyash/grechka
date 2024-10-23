/* * * * * * * * * * * * * * * * * * * * * * * *
 * form-validator.js
 */
class FormValidator {
  constructor(formElement) {
    this.formElement = formElement;
    this.addCustomErrorMessages();
    this.init();
  }

  addCustomErrorMessages() {
    const nameFieldElement = this.formElement.querySelector('[data-name="name"]');
    const phoneFieldElement = this.formElement.querySelector('[data-name="phone"]');

    if (nameFieldElement) {
      nameFieldElement.closest('.text-field').classList.add('pristine-item');
      nameFieldElement.dataset.pristinePattern = '/^[a-zа-яЁё -]+$/i';
      nameFieldElement.dataset.pristineRequiredMessage = 'Заполните это поле.';
      nameFieldElement.dataset.pristinePatternMessage = 'Допустимы только буквы, дефисы и пробелы.';
    }

    if (phoneFieldElement) {
      phoneFieldElement.closest('.text-field').classList.add('pristine-item');
      phoneFieldElement.dataset.pristineRequiredMessage = 'Заполните это поле.';
    }
  }

  validate() {
    return this.pristine.validate();
  }

  reset() {
    this.pristine.reset();
    this.formElement.querySelectorAll('.shake').forEach((element) => element.classList.remove('shake'));
  }

  init() {
    this.pristine = new Pristine(this.formElement, {
      classTo: 'pristine-item',
      errorClass: 'pristine-item--invalid',
      errorTextParent: 'pristine-item',
      errorTextTag: 'p',
      errorTextClass: 'pristine-item__error-text',
    });
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
