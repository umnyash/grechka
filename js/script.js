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
 * main.js
 */
const tabletWidthMediaQueryList = window.matchMedia(TABLET_WIDTH_MEDIA_QUERY);
initPageSlider();
initBanners(document.querySelector('.banners'));
initSocials(document.querySelector('.socials'));
/* * * * * * * * * * * * * * * * * * * * * * * */