"use strict";

/* * * * * * * * * * * * * * * * * * * * * * * *
 * const.js
 */
const TABLET_WIDTH_MEDIA_QUERY = '(min-width: 768px)';
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
    pagination: {
      el: '.banners__slider-pagination',
      bulletClass: 'banners__slider-pagination-button',
      bulletActiveClass: 'banners__slider-pagination-button--current',
      renderBullet: getPaginationButtonCreator(),
      clickable: true
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
initPageSlider();
initBanners(document.querySelector('.banners'));
initSocials(document.querySelector('.socials'));
initTariffs();
initLicenses();
document.querySelectorAll('.dropdown').forEach(initDropdown);
initAnchors();
/* * * * * * * * * * * * * * * * * * * * * * * */