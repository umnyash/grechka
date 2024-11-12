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
    enterpriseMonthPriceElements.forEach((priceElement) => {
      if (monthPrice) {
        priceElement.textContent = `${Number(monthPrice).toLocaleString()} ₽/мес.`;
      }
    })

    if (enterpriseYearPriceElement && yearPrice) {
      enterpriseYearPriceElement.textContent = `${Number(yearPrice).toLocaleString()} ₽/мес.`;
    }
  };

  enterpriseDropdownListElement?.addEventListener('click', (evt) => {
    const buttonElement = evt.target.closest('.dropdown__item-button');

    if (!buttonElement) {
      return;
    }

    const { monthPrice, yearPrice } = buttonElement.dataset;
    setEnterprisePrices(monthPrice, yearPrice);
  });

  const toggleTariffsNavigationButtons = (swiper) => {
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
        spaceBetween: 16,
      },
      1920: {
        slidesPerView: 5,
        spaceBetween: 16,
      },
    }
  })

  slider.on('toEdge', () => {
    toggleTariffsNavigationButtons(slider);
  })

  toggleTariffsNavigationButtons(slider);

  firstSlideNavigationButtonElement.addEventListener('click', () => {
    slider.slideTo(0);
  });

  lastSlideNavigationButtonElement.addEventListener('click', () => {
    slider.slideTo(4);
  });

  const swithTariffCardsPaymentType = (paymentType) => {
    tariffCardElements.forEach((cardElement) => {
      if (paymentType === 'month') {
        cardElement.classList.remove('tariff-card--payment-type_year');
        cardElement.classList.add('tariff-card--payment-type_month');
      } else {
        cardElement.classList.add('tariff-card--payment-type_year');
        cardElement.classList.remove('tariff-card--payment-type_month');
      }
    })
  };

  paymentTypeButtonElements.forEach((buttonElement) => {
    buttonElement.addEventListener('click', (evt) => {
      evt.preventDefault();

      paymentTypeButtonElements.forEach((buttonElement) => buttonElement.classList.remove('pricing__toggle-button--active'));
      evt.currentTarget.classList.add('pricing__toggle-button--active');

      const paymentType = evt.currentTarget.dataset.type;
      swithTariffCardsPaymentType(paymentType);
    });
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
