/* * * * * * * * * * * * * * * * * * * * * * * *
 * main.js
 */
const tabletWidthMediaQueryList = window.matchMedia(TABLET_WIDTH_MEDIA_QUERY);
const inputEvent = new Event('input', { bubbles: true });

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
  text: 'Ваша заявка успешно отправлена.<br> Мы свяжемся с вами в ближайшее время.',
};

const errorAlert = {
  heading: 'Что-то пошло не так',
  text: 'Не удалось отправить заявку.<br> Попробуйте снова или свяжитесь с нами по телефону.',
  status: 'error'
};

const feedbackModal = new ModalForm(document.querySelector('[data-modal="feedback-form"]'));
feedbackModal.setHandlers(
  () => {
    showAlert(successAlert);
  },
  () => {
    const alert = showAlert(errorAlert);
    initFormResending(feedbackModal.form, alert);
  }
);

const priceModal = new ModalForm(document.querySelector('[data-modal="price-form"]'));
priceModal.setHandlers(
  () => {
    showAlert(successAlert);
  },
  () => {
    const alert = showAlert(errorAlert);
    initFormResending(feedbackModal.form, alert);
  }
);
/* * * * * * * * * * * * * * * * * * * * * * * */
