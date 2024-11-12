/* * * * * * * * * * * * * * * * * * * * * * * *
 * alert.js
 */
class Alert extends Modal {
  constructor({ heading, text, status = 'success' }) {
    const modalElement = Alert.createElement({ heading, text, status });
    document.body.append(modalElement);
    super(modalElement);
    this.buttonElement = modalElement.querySelector('.alert__button');
  }

  static createElement({ heading, text, status }) {
    const modalString = `
      <dialog class="modal modal--with_alert">
        <div class="modal__inner">
          <button class="modal__close-button" type="button" data-modal-close-button>
            <span class="visually-hidden">Закрыть</span>
          </button>
          <section class="alert modal__alert">
            <h2 class="alert__heading heading">${heading}</h2>
            ${text ? `<p class="alert__text">${text}</p>` : ''}
            <button class="alert__button button button--primary" type="button" ${status === 'success' ? 'data-modal-close-button' : ''}>
              <span class="button__text">${status === 'error' ? 'Попробовать снова' : 'Закрыть'}</span>
            </button>
          </section>
        </div>
      </dialog>
    `;

    return createElementByString(modalString);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
