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
  })

  buttonElements.forEach((buttonElement) => {
    buttonElement.addEventListener('click', (evt) => {
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
    })
  })
}
/* * * * * * * * * * * * * * * * * * * * * * * */
