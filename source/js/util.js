/* * * * * * * * * * * * * * * * * * * * * * * *
 * util.js
 */
function getPaginationButtonCreator(slideName = 'Слайд') {
  return (index, className) => `
    <button class='${className}' type='button'>
      <span class='visually-hidden'>${slideName} ${index + 1}.</span>
    </button>
  `;
}

function createElementByString(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

function initFormResending(form, alert) {
  alert.buttonElement.addEventListener('click', (evt) => {
    evt.preventDefault();

    form.addListener(FormEvents.SUBMIT_START, onFormSubmitStart);
    form.element.requestSubmit();
  });

  function onFormSubmitStart() {
    form.removeListener(FormEvents.SUBMIT_START, onFormSubmitStart);

    form.addListener(FormEvents.SUBMIT_END, onFormSubmitEnd);

    alert.buttonElement.disabled = true;
    alert.buttonElement.classList.add('button--pending');
  };

  function onFormSubmitEnd() {
    form.removeListener(FormEvents.SUBMIT_END, onFormSubmitEnd);
    alert?.close();
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
