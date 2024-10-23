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
  })
}
/* * * * * * * * * * * * * * * * * * * * * * * */
