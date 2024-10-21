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
        spaceBetween: 30,
      }
    }
  })

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

  usersQuantityButtonlistElement?.addEventListener('click', (evt) => {
    const buttonElement = evt.target.closest('.license-card__users-button');

    if (!buttonElement) {
      return;
    }

    usersQuantityButtonElements.forEach((buttonElement) => buttonElement.classList.remove('license-card__users-button--active'));
    buttonElement.classList.add('license-card__users-button--active');

    const { price, oldPrice } = buttonElement.dataset;
    setCorporatePrices(price, oldPrice);
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
