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
    },
  })
}
/* * * * * * * * * * * * * * * * * * * * * * * */
