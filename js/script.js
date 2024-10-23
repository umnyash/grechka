"use strict";

/* * * * * * * * * * * * * * * * * * * * * * * *
 * const.js
 */
const MODAL_ANIMATION_DURATION = 400; // Соответствует $duration-m в variables.scss
const TABLET_WIDTH_MEDIA_QUERY = '(min-width: 768px)';
const FormEvents = {
  SUBMIT_START: 'formSubmitStart',
  SUBMIT_END: 'formSubmitEnd'
};
/* * * * * * * * * * * * * * * * * * * * * * * */

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
  alert.buttonElement.addEventListener('click', evt => {
    evt.preventDefault();
    form.addListener(FormEvents.SUBMIT_START, onFormSubmitStart);
    form.element.requestSubmit();
  });
  function onFormSubmitStart() {
    form.removeListener(FormEvents.SUBMIT_START, onFormSubmitStart);
    form.addListener(FormEvents.SUBMIT_END, onFormSubmitEnd);
    alert.buttonElement.disabled = true;
    alert.buttonElement.classList.add('button--pending');
  }
  ;
  function onFormSubmitEnd() {
    form.removeListener(FormEvents.SUBMIT_END, onFormSubmitEnd);
    alert.close();
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * api.js
 */
async function sendData(url, body, onSuccess = () => {}, onFail = () => {}, onFinally = () => {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`${response.status} – ${response.statusText}: ${errorData}`);
    }
    const data = await response.json();
    onSuccess(data);
  } catch (err) {
    console.error(err.message);
    onFail();
  } finally {
    onFinally();
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * pub-sub.js
 */
class PubSub {
  constructor() {
    this.listeners = {};
  }
  addListener(event, fn) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }
  removeListener(event, fn) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter(listener => listener !== fn);
  }
  emit(event, data) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach(listener => listener(data));
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal.js
 */
class Modal {
  constructor(modalElement) {
    this.modalElement = modalElement;
    this.name = modalElement?.dataset.modal;
    this.initOpeners();
    this.modalElement.addEventListener('close', () => this.onModalClose());
    this.modalElement.addEventListener('click', evt => {
      if (evt.target === this.modalElement || evt.target.closest('[data-modal-close-button]')) {
        evt.preventDefault();
        this.close();
      }
    });
  }
  initOpeners = () => {
    const openerElements = document.querySelectorAll(`[data-modal-opener="${this.name}"]`);
    openerElements.forEach(openerElement => {
      openerElement.addEventListener('click', evt => {
        evt.preventDefault();
        this.open();
      });
    });
  };
  open = () => {
    requestAnimationFrame(() => {
      this.modalElement.showModal();
    });
  };
  close = () => {
    this.modalElement.close();
  };
  onModalClose = () => {
    if (!this.modalElement.classList.contains('modal--with_alert')) {
      return;
    }
    setTimeout(() => {
      this.modalElement.remove();
      this.modalElement = null;
    }, MODAL_ANIMATION_DURATION);
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * alert.js
 */
class Alert extends Modal {
  constructor({
    heading,
    text,
    status = 'success'
  }) {
    const modalElement = Alert.createElement({
      heading,
      text,
      status
    });
    document.body.append(modalElement);
    super(modalElement);
    this.buttonElement = modalElement.querySelector('.alert__button');
  }
  static createElement({
    heading,
    text,
    status
  }) {
    const modalString = `
      <dialog class="modal modal--with_alert">
        <div class="modal__inner">
          <button class="modal__close-button" type="button" data-modal-close-button>
            <span class="visually-hidden">Закрыть</span>
          </button>
          <section class="alert modal__alert">
            <h2 class="alert__heading heading">${heading}</h2>
            ${text ? `<p class="alert__text">${text}</p>` : ''}
            <button class="alert__button button button--primary" type="button" ${status === 'success' && 'data-modal-close-button'}>
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

/* * * * * * * * * * * * * * * * * * * * * * * *
 * files-field.js
 */
class FilesField {
  allowedFormats = ['image/png', 'image/jpg', 'image/jpeg', '.pdf', 'application/pdf', '.doc', '.docx', '.xml', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  constructor(filesFieldElement) {
    this.element = filesFieldElement;
    this.controlElement = this.element.querySelector('.files-field__control');
    this.filesWrapperElement = this.element.querySelector('.files-field__files');
    this.filesListElement = this.element.querySelector('.files-field__list');
    this.files = new Set();
    this.init();
  }
  checkFileFormat = file => {
    return this.allowedFormats.includes(file.type);
  };
  updateFilesList = () => {
    this.errorTextElement?.remove();
    const fragment = document.createDocumentFragment();
    this.files.forEach(file => {
      const listItemElement = createElementByString(`
        <li class="files-field__list-item">
          <p class="files-field__file-name">${file.name}</p>
          <button class="files-field__flle-delete-button" type="button">
            <span class="visually-hidden">Открепить файл</span>
          </button>
        </li>
      `);
      const deleteButtonElement = listItemElement.querySelector('.files-field__flle-delete-button');
      deleteButtonElement.addEventListener('click', evt => {
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
  onControlChange = evt => {
    this.errorTextElement?.remove();
    const newFiles = Array.from(evt.target.files);
    if (!newFiles.length && !this.files.size) {
      this.filesWrapperElement.classList.add('files-field__files--hidden');
    }
    newFiles.forEach(file => {
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
  };
  init = () => {
    this.controlElement.addEventListener('change', this.onControlChange);
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */

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
    this.formElement.querySelectorAll('.shake').forEach(element => element.classList.remove('shake'));
  }
  init() {
    this.pristine = new Pristine(this.formElement, {
      classTo: 'pristine-item',
      errorClass: 'pristine-item--invalid',
      errorTextParent: 'pristine-item',
      errorTextTag: 'p',
      errorTextClass: 'pristine-item__error-text'
    });
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */

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
    this.element.addEventListener('submit', evt => {
      evt.preventDefault();
      const isValid = this.validator.validate();
      if (isValid) {
        this.emit(FormEvents.SUBMIT_START);
        this.submitButtonElement.disabled = true;
        this.submitButtonElement.classList.add('button--pending');
        const formData = new FormData(evt.target);
        this.filesField?.files.forEach(file => {
          formData.append('files[]', file);
        });
        sendData(this.actionUrl, formData, data => {
          this.successHandler(data);
          this.element.reset();
        }, data => {
          this.errorHandler(data);
        }, () => {
          this.emit(FormEvents.SUBMIT_END);
          this.submitButtonElement.disabled = false;
          this.submitButtonElement.classList.remove('button--pending');
        });
      } else {
        const invalidItemElements = this.element.querySelectorAll('.pristine-item--invalid');
        invalidItemElements.forEach(element => {
          element.classList.remove('shake');
          requestAnimationFrame(() => element.classList.add('shake'));
        });
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
    this.form.setHandlers(() => {
      successHandler();
      this.modalElement.close();
    }, () => {
      errorHandler();
    });
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * anchors.js
 */
function initAnchors() {
  const scrollWrapperElement = document.querySelector('.page__inner');
  const anchorElements = document.querySelectorAll('.pricing__anchor');
  anchorElements.forEach(anchorElement => {
    anchorElement.addEventListener('click', evt => {
      evt.preventDefault();
      const targetElement = document.querySelector(anchorElement.getAttribute('href'));
      const targetElementPosition = targetElement.getBoundingClientRect().top;
      scrollWrapperElement.scrollTo({
        top: scrollWrapperElement.scrollTop + targetElementPosition,
        behavior: 'smooth'
      });
    });
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * banners.js
 */
function initBanners(bannersElement) {
  const sliderElement = bannersElement.querySelector('.banners__slider');
  new Swiper(sliderElement, {
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.banners__slider-pagination',
      bulletClass: 'banners__slider-pagination-button',
      bulletActiveClass: 'banners__slider-pagination-button--current',
      renderBullet: getPaginationButtonCreator(),
      clickable: true
    },
    on: {
      autoplayTimeLeft: (_s, _time, progress) => {
        sliderElement.style.setProperty('--slider-progress', 1 - progress);
      }
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * dropdown.js
 */
function initDropdown(dropdownElement) {
  dropdownElement.addEventListener('click', evt => {
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
    }, 0);
  }
  ;
  function close() {
    dropdownElement.classList.remove('dropdown--open');
    document.removeEventListener('click', onDocumentClick);
  }
  ;
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * licenses.js
 */
function initLicenses() {
  const licensesElement = document.querySelector('.licenses');
  const sliderElement = licensesElement.querySelector('.licenses__slider');
  new Swiper(sliderElement, {
    slidesPerView: 'auto',
    spaceBetween: 16,
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });
  const usersQuantityButtonlistElement = licensesElement.querySelector('.license-card__users-list');
  if (!usersQuantityButtonlistElement) {
    return;
  }
  const corporateCardElement = usersQuantityButtonlistElement.closest('.license-card');
  const usersQuantityButtonElements = usersQuantityButtonlistElement.querySelectorAll('.license-card__users-button');
  const corporateOldPriceElement = corporateCardElement.querySelector('.license-card__price-wrapper [data-old-price]');
  const corporatePriceElement = corporateCardElement.querySelector('.license-card__price-wrapper [data-price]');
  const setCorporatePrices = (price, oldPrice) => {
    if (price && corporatePriceElement) {
      corporatePriceElement.textContent = `${Number(price).toLocaleString()} ₽`;
    }
    if (oldPrice && corporateOldPriceElement) {
      corporateOldPriceElement.textContent = `${Number(oldPrice).toLocaleString()} ₽`;
    }
  };
  usersQuantityButtonlistElement?.addEventListener('click', evt => {
    const buttonElement = evt.target.closest('.license-card__users-button');
    if (!buttonElement) {
      return;
    }
    usersQuantityButtonElements.forEach(buttonElement => buttonElement.classList.remove('license-card__users-button--active'));
    buttonElement.classList.add('license-card__users-button--active');
    const {
      price,
      oldPrice
    } = buttonElement.dataset;
    setCorporatePrices(price, oldPrice);
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * page-slider.js
 */
function initPageSlider() {
  const PAGES = ['about', 'capabilities', 'prices'];
  const sliderElement = document.querySelector('.page-slider');
  const buttonElements = document.querySelectorAll('.logo, .site-navigation__link');
  let currentButtonElement = null;
  const slider = new Swiper(sliderElement, {
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    autoHeight: true,
    allowTouchMove: false
  });
  buttonElements.forEach(buttonElement => {
    buttonElement.addEventListener('click', evt => {
      evt.preventDefault();
      if (currentButtonElement?.classList.contains('site-navigation__link')) {
        currentButtonElement?.classList.remove('site-navigation__link--active');
      }
      const pageName = evt.currentTarget.getAttribute('href').slice(1);
      const pageIndex = PAGES.indexOf(pageName);
      slider.slideTo(pageIndex);
      if (evt.currentTarget.classList.contains('site-navigation__link')) {
        evt.currentTarget.classList.add('site-navigation__link--active');
      }
      currentButtonElement = evt.currentTarget;
    });
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * phone-field.js
 */
function initPhoneField(fieldElement) {
  function getInputNumbersValue(input) {
    return input.value.replace(/\D/g, '');
  }
  function onFieldInput(evt) {
    const input = evt.target;
    let fieldNumbersValue = getInputNumbersValue(input);
    let formattedInputValue = '';
    const selectionStart = input.selectionStart;
    if (!fieldNumbersValue) {
      input.value = '';
      return;
    }
    if (input.value.length !== selectionStart) {
      if (evt.data && /\D/g.test(evt.data)) {
        input.value = fieldNumbersValue;
      }
      return;
    }
    if (!['7', '8', '9'].includes(fieldNumbersValue[0])) {
      input.value = `+${fieldNumbersValue}`.substring(0, 16);
      return;
    }
    if (fieldNumbersValue[0] === '9') {
      fieldNumbersValue = `7${fieldNumbersValue}`;
    }
    const firstSymbol = fieldNumbersValue[0] === '8' ? '8' : '+7';
    formattedInputValue = `${firstSymbol} `;
    if (fieldNumbersValue.length > 1) {
      formattedInputValue += `(${fieldNumbersValue.substring(1, 4)}`;
    }
    if (fieldNumbersValue.length >= 5) {
      formattedInputValue += `) ${fieldNumbersValue.substring(4, 7)}`;
    }
    if (fieldNumbersValue.length >= 8) {
      formattedInputValue += `-${fieldNumbersValue.substring(7, 9)}`;
    }
    if (fieldNumbersValue.length >= 10) {
      formattedInputValue += `-${fieldNumbersValue.substring(9, 11)}`;
    }
    input.value = formattedInputValue;
  }
  function onFieldKeydown(evt) {
    const input = evt.target;
    if (evt.code === 'Backspace' && getInputNumbersValue(input).length === 1) {
      input.value = '';
      input.dispatchEvent(inputEvent);
      input.dispatchEvent(changeEvent);
    }
  }
  function onFieldPaste(evt) {
    const pasted = evt.clipboardData || window.clipboardData;
    const input = evt.target;
    const fieldNumbersValue = getInputNumbersValue(input);
    if (pasted) {
      const pastedText = pasted.getData('Text');
      if (/\D/g.test(pastedText)) {
        input.value = fieldNumbersValue;
      }
    }
  }
  fieldElement.addEventListener('input', onFieldInput);
  fieldElement.addEventListener('keydown', onFieldKeydown);
  fieldElement.addEventListener('paste', onFieldPaste);
}
/* * * * * * * * * * * * * * * * * * * * * * * */

function showAlert({
  heading,
  text,
  status
}) {
  const alert = new Alert({
    heading,
    text,
    status
  });
  requestAnimationFrame(() => alert.open());
  return alert;
}
function initSkeleton(skeletonElement) {
  const imgElement = skeletonElement.querySelector('img');
  if (imgElement) {
    if (imgElement.complete) {
      skeletonElement.classList.add('skeleton--loaded');
    } else {
      imgElement.addEventListener('load', () => skeletonElement.classList.add('skeleton--loaded'), {
        once: true
      });
    }
  } else {
    const videoElement = skeletonElement.querySelector('video');
    if (videoElement.readyState >= 1) {
      skeletonElement.classList.add('skeleton--loaded');
    } else {
      videoElement.addEventListener('loadeddata', () => skeletonElement.classList.add('skeleton--loaded'), {
        once: true
      });
    }
  }
}
function initSkeletons(wrapperElement = document) {
  const skeletonElements = wrapperElement.querySelectorAll('.skeleton');
  skeletonElements.forEach(initSkeleton);
}

/* * * * * * * * * * * * * * * * * * * * * * * *
 * socials.js
 */
function initSocials(socialsElement) {
  const pageInnerElement = document.querySelector('.page__inner');
  const pageContentElement = pageInnerElement.querySelector('.page__content');
  const moveSocialsElement = () => {
    if (tabletWidthMediaQueryList.matches) {
      pageContentElement.append(socialsElement);
    } else {
      pageInnerElement.append(socialsElement);
    }
  };
  moveSocialsElement();
  tabletWidthMediaQueryList.addEventListener('change', () => {
    moveSocialsElement();
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * tariffs.js
 */
function initTariffs() {
  const tariffsElement = document.querySelector('.tariffs');
  const sliderElement = tariffsElement.querySelector('.tariffs__slider');
  const tariffCardElements = tariffsElement.querySelectorAll('.tariff-card');
  const paymentTypeButtonElements = document.querySelectorAll('.pricing__toggle-button');
  const firstSlideNavigationButtonElement = tariffsElement.querySelector('.tariffs__button--left');
  const lastSlideNavigationButtonElement = tariffsElement.querySelector('.tariffs__button--right');
  const enterpriseCardElement = tariffsElement.querySelector('.tariff-card--enterprise');
  const enterpriseMonthPriceElements = enterpriseCardElement.querySelectorAll('.tariff-card__prices [data-month-price]');
  const enterpriseYearPriceElement = enterpriseCardElement.querySelector('.tariff-card__prices [data-year-price]');
  const enterpriseDropdownListElement = enterpriseCardElement.querySelector('.dropdown__list');
  const setEnterprisePrices = (monthPrice, yearPrice) => {
    enterpriseMonthPriceElements.forEach(priceElement => {
      if (monthPrice) {
        priceElement.textContent = `${Number(monthPrice).toLocaleString()} ₽/мес.`;
      }
    });
    if (enterpriseYearPriceElement && yearPrice) {
      enterpriseYearPriceElement.textContent = `${Number(yearPrice).toLocaleString()} ₽/мес.`;
    }
  };
  enterpriseDropdownListElement?.addEventListener('click', evt => {
    const buttonElement = evt.target.closest('.dropdown__item-button');
    if (!buttonElement) {
      return;
    }
    const {
      monthPrice,
      yearPrice
    } = buttonElement.dataset;
    setEnterprisePrices(monthPrice, yearPrice);
  });
  const toggleTariffsNavigationButtons = swiper => {
    if (swiper.isBeginning) {
      firstSlideNavigationButtonElement.classList.add('tariffs__button--hidden');
      lastSlideNavigationButtonElement.classList.remove('tariffs__button--hidden');
    } else if (swiper.isEnd) {
      firstSlideNavigationButtonElement.classList.remove('tariffs__button--hidden');
      lastSlideNavigationButtonElement.classList.add('tariffs__button--hidden');
    }
  };
  const slider = new Swiper(sliderElement, {
    slidesPerView: 'auto',
    spaceBetween: 16,
    breakpoints: {
      1440: {
        slidesPerView: 4,
        spaceBetween: 16
      },
      1920: {
        slidesPerView: 5,
        spaceBetween: 16
      }
    },
    on: {
      toEdge: () => {
        toggleTariffsNavigationButtons(slider);
      }
    }
  });
  toggleTariffsNavigationButtons(slider);
  firstSlideNavigationButtonElement.addEventListener('click', () => {
    slider.slideTo(0);
  });
  lastSlideNavigationButtonElement.addEventListener('click', () => {
    slider.slideTo(4);
  });
  const swithTariffCardsPaymentType = paymentType => {
    tariffCardElements.forEach(cardElement => {
      if (paymentType === 'month') {
        cardElement.classList.remove('tariff-card--payment-type_year');
        cardElement.classList.add('tariff-card--payment-type_month');
      } else {
        cardElement.classList.add('tariff-card--payment-type_year');
        cardElement.classList.remove('tariff-card--payment-type_month');
      }
    });
  };
  paymentTypeButtonElements.forEach(buttonElement => {
    buttonElement.addEventListener('click', evt => {
      evt.preventDefault();
      paymentTypeButtonElements.forEach(buttonElement => buttonElement.classList.remove('pricing__toggle-button--active'));
      evt.currentTarget.classList.add('pricing__toggle-button--active');
      const paymentType = evt.currentTarget.dataset.type;
      swithTariffCardsPaymentType(paymentType);
    });
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * main.js
 */
const tabletWidthMediaQueryList = window.matchMedia(TABLET_WIDTH_MEDIA_QUERY);
const inputEvent = new Event('input', {
  bubbles: true
});
initPageSlider();
initSkeletons();
initBanners(document.querySelector('.banners'));
initSocials(document.querySelector('.socials'));
initTariffs();
initLicenses();
document.querySelectorAll('.dropdown').forEach(initDropdown);
initAnchors();
document.querySelectorAll('input[type="tel"]').forEach(initPhoneField);
const successAlert = {
  heading: 'Спасибо за вашу заявку!',
  text: 'Ваша заявка успешно отправлена.<br> Мы свяжемся с вами в ближайшее время.'
};
const errorAlert = {
  heading: 'Что-то пошло не так',
  text: 'Не удалось отправить заявку.<br> Попробуйте снова или свяжитесь с нами по телефону.',
  status: 'error'
};
const feedbackModal = new ModalForm(document.querySelector('[data-modal="feedback-form"]'));
feedbackModal.setHandlers(() => {
  showAlert(successAlert);
}, () => {
  const alert = showAlert(errorAlert);
  initFormResending(feedbackModal.form, alert);
});
const priceModal = new ModalForm(document.querySelector('[data-modal="price-form"]'));
priceModal.setHandlers(() => {
  showAlert(successAlert);
}, () => {
  const alert = showAlert(errorAlert);
  initFormResending(feedbackModal.form, alert);
});
/* * * * * * * * * * * * * * * * * * * * * * * */