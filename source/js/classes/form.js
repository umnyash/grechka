/* * * * * * * * * * * * * * * * * * * * * * * *
 * form.js
 */
class Form extends PubSub {
  constructor(formElement) {
    super();
    this.element = formElement;
    this.actionUrl = this.element.action;
    this.submitButtonElement = this.element.querySelector('[data-submit-button]');
    this.validator = new FormValidator(this.element);
    this.successHandler = null;
    this.errorHandler = null;

    const filesFieldElement = this.element.querySelector('.files-field');
    if (filesFieldElement) {
      this.filesField = new FilesField(filesFieldElement);
    }

    this.init();
  }

  setHandlers = (successHandler, errorHandler) => {
    this.successHandler = successHandler;
    this.errorHandler = errorHandler;
  };

  init = () => {
    this.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const isValid = this.validator.validate();

      if (isValid) {
        this.emit(FormEvents.SUBMIT_START);
        this.submitButtonElement.disabled = true;
        this.submitButtonElement.classList.add('button--pending');

        const formData = new FormData(evt.target);

        this.filesField?.files.forEach((file) => {
          formData.append('files[]', file);
        });

        sendData(
          this.actionUrl,
          formData,
          (data) => {
            this.successHandler(data);
            this.element.reset();
          },
          (data) => {
            this.errorHandler(data);
          },
          () => {
            this.emit(FormEvents.SUBMIT_END);
            this.submitButtonElement.disabled = false;
            this.submitButtonElement.classList.remove('button--pending');
          }
        );
      } else {
        const invalidItemElements = this.element.querySelectorAll('.pristine-item--invalid');

        invalidItemElements.forEach((element) => {
          element.classList.remove('shake');
          requestAnimationFrame(() => element.classList.add('shake'));
        })

        invalidItemElements[0]?.querySelector('input').focus();
      }
    });

    this.element.addEventListener('reset', () => {
      this.validator.reset();
      this.filesField?.reset();
    });
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */
