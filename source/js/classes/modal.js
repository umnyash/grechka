/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal.js
 */
class Modal {
  constructor(modalElement) {
    this.modalElement = modalElement;
    this.name = modalElement?.dataset.modal;
    this.initOpeners();
    this.modalElement.addEventListener('close', () => this.onModalClose());

    this.modalElement.addEventListener('click', (evt) => {
      if (evt.target === this.modalElement || evt.target.closest('[data-modal-close-button]')) {
        evt.preventDefault();
        this.close();
      }
    })
  }

  initOpeners = () => {
    const openerElements = document.querySelectorAll(`[data-modal-opener="${this.name}"]`);

    openerElements.forEach((openerElement) => {
      openerElement.addEventListener('click', (evt) => {
        evt.preventDefault();

        this.open();
      });
    });
  }

  open = () => {
    requestAnimationFrame(() => {
      this.modalElement.showModal();
    })
  }

  close = () => {
    this.modalElement.close();
  }

  onModalClose = () => {
    if (!this.modalElement.classList.contains('modal--with_alert')) {
      return;
    }
    setTimeout(() => {
      this.modalElement.remove();
      this.modalElement = null;
    }, MODAL_ANIMATION_DURATION);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
