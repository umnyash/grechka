/* * * * * * * * * * * * * * * * * * * * * * * *
 * anchors.js
 */
function initAnchors() {
  const scrollWrapperElement = document.querySelector('.page__inner');
  const anchorElements = document.querySelectorAll('.pricing__anchor');

  anchorElements.forEach((anchorElement) => {
    anchorElement.addEventListener('click', (evt) => {
      evt.preventDefault();

      const targetElement = document.querySelector(anchorElement.getAttribute('href'));
      const targetElementPosition = targetElement.getBoundingClientRect().top;

      scrollWrapperElement.scrollTo({
        top: scrollWrapperElement.scrollTop + targetElementPosition,
        behavior: 'smooth'
      })
    });
  })
}
/* * * * * * * * * * * * * * * * * * * * * * * */
