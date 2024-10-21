/* * * * * * * * * * * * * * * * * * * * * * * *
 * dropdown.js
 */
function initDropdown(dropdownElement) {
  dropdownElement.addEventListener('click', (evt) => {
    if (evt.target.closest('.dropdown__toggle-button')) {
      if (dropdownElement.classList.contains('dropdown--open')) {
        close();
      } else {
        open();
      }
    } else {
      const listItemElement = evt.target.closest('.dropdown__item');

      if (listItemElement) {
        const selectedElement = listItemElement.querySelector('.dropdown__item-button');
        dropdownElement.querySelector('.dropdown__toggle-button-text').textContent = selectedElement.textContent;
        close();
      }
    }
  });

  function onDocumentClick(evt) {
    const targetElement = evt.target.closest('.dropdown');

    if (targetElement !== dropdownElement || evt.target.matches('.dropdown__list-wrapper')) {
      evt.preventDefault();
      close();
    }
  }

  function open() {
    dropdownElement.classList.add('dropdown--open');

    setTimeout(() => {
      document.addEventListener('click', onDocumentClick);
    }, 0)
  };

  function close() {
    dropdownElement.classList.remove('dropdown--open');
    document.removeEventListener('click', onDocumentClick);
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */
