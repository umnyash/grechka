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
