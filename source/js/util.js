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
