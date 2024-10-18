"use strict";

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
 * page-slider.js
 */
function initPageSlider() {
  const PAGES = ['about', 'capabilities', 'prices'];
  const sliderElement = document.querySelector('.page-slider');
  const buttonElements = document.querySelectorAll('.logo, .site-navigation__link');
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
      const pageName = evt.currentTarget.getAttribute('href').slice(1);
      const pageIndex = PAGES.indexOf(pageName);
      slider.slideTo(pageIndex);
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.hash.slice(1);
    const pageIndex = Math.max(PAGES.indexOf(pageName), 0);
    slider.slideTo(pageIndex, 0, false);
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * main.js
 */
initPageSlider();
initBanners(document.querySelector('.banners'));
/* * * * * * * * * * * * * * * * * * * * * * * */