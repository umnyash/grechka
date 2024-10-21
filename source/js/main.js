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
/* * * * * * * * * * * * * * * * * * * * * * * */
