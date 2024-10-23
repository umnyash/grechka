/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal-form.js
 */
class ModalForm extends Modal {
  constructor(modalElement) {
    super(modalElement);
    this.formElement = modalElement.querySelector('.modal-form');
    this.form = new Form(this.formElement);
  }

  setHandlers = (successHandler, errorHandler) => {
    this.form.setHandlers(
      () => {
        successHandler();
        this.modalElement.close();
      },
      () => {
        errorHandler();
      });
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */
