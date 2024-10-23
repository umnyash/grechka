/* * * * * * * * * * * * * * * * * * * * * * * *
 * files-field.js
 */
class FilesField {
  allowedFormats = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    '.pdf',
    'application/pdf',
    '.doc',
    '.docx',
    '.xml',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  constructor(filesFieldElement) {
    this.element = filesFieldElement;
    this.controlElement = this.element.querySelector('.files-field__control');
    this.filesWrapperElement = this.element.querySelector('.files-field__files');
    this.filesListElement = this.element.querySelector('.files-field__list');
    this.files = new Set();
    this.init();
  }

  checkFileFormat = (file) => {
    return this.allowedFormats.includes(file.type);
  };

  updateFilesList = () => {
    this.errorTextElement?.remove();
    const fragment = document.createDocumentFragment();

    this.files.forEach((file) => {
      const listItemElement = createElementByString(`
        <li class="files-field__list-item">
          <p class="files-field__file-name">${file.name}</p>
          <button class="files-field__flle-delete-button" type="button">
            <span class="visually-hidden">Открепить файл</span>
          </button>
        </li>
      `);

      const deleteButtonElement = listItemElement.querySelector('.files-field__flle-delete-button');

      deleteButtonElement.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.files.delete(file);
        this.updateFilesList();
      });

      fragment.append(listItemElement);
    });

    this.filesListElement.innerHTML = '';
    this.filesListElement.append(fragment);

    if (this.files.size) {
      this.filesWrapperElement.classList.remove('files-field__files--hidden');
    } else {
      this.filesWrapperElement.classList.add('files-field__files--hidden');
    }
  };

  onControlChange = (evt) => {
    this.errorTextElement?.remove();
    const newFiles = Array.from(evt.target.files);

    if (!newFiles.length && !this.files.size) {
      this.filesWrapperElement.classList.add('files-field__files--hidden');
    }

    newFiles.forEach((file) => {
      if (this.checkFileFormat(file)) {
        this.files.add(file);
        this.updateFilesList();
      } else {
        this.errorTextElement = createElementByString(`<p class="files-field__error-text">Не удалось прикрепить файл</p>`);
        this.filesWrapperElement.insertAdjacentElement('beforeend', this.errorTextElement);
        this.filesWrapperElement.classList.remove('files-field__files--hidden');
      }
    });
  };

  reset = () => {
    this.filesWrapperElement.classList.add('files-field__files--hidden');
    this.errorTextElement?.remove();
    this.filesListElement.innerHTML = '';
    this.files.clear();
  }

  init = () => {
    this.controlElement.addEventListener('change', this.onControlChange);
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */
