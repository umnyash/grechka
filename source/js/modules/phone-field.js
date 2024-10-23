/* * * * * * * * * * * * * * * * * * * * * * * *
 * phone-field.js
 */
function initPhoneField(fieldElement) {
  function getInputNumbersValue(input) {
    return input.value.replace(/\D/g, '');
  }

  function onFieldInput(evt) {
    const input = evt.target;
    let fieldNumbersValue = getInputNumbersValue(input);
    let formattedInputValue = '';
    const selectionStart = input.selectionStart;

    if (!fieldNumbersValue) {
      input.value = '';
      return;
    }

    if (input.value.length !== selectionStart) {
      if (evt.data && /\D/g.test(evt.data)) {
        input.value = fieldNumbersValue;
      }
      return;
    }

    if (!['7', '8', '9'].includes(fieldNumbersValue[0])) {
      input.value = `+${fieldNumbersValue}`.substring(0, 16);
      return;
    }

    if (fieldNumbersValue[0] === '9') {
      fieldNumbersValue = `7${fieldNumbersValue}`;
    }

    const firstSymbol = (fieldNumbersValue[0] === '8') ? '8' : '+7';
    formattedInputValue = `${firstSymbol} `;

    if (fieldNumbersValue.length > 1) {
      formattedInputValue += `(${fieldNumbersValue.substring(1, 4)}`;
    }

    if (fieldNumbersValue.length >= 5) {
      formattedInputValue += `) ${fieldNumbersValue.substring(4, 7)}`;
    }

    if (fieldNumbersValue.length >= 8) {
      formattedInputValue += `-${fieldNumbersValue.substring(7, 9)}`;
    }

    if (fieldNumbersValue.length >= 10) {
      formattedInputValue += `-${fieldNumbersValue.substring(9, 11)}`;
    }

    input.value = formattedInputValue;
  }

  function onFieldKeydown(evt) {
    const input = evt.target;
    if (evt.code === 'Backspace' && getInputNumbersValue(input).length === 1) {
      input.value = '';
      input.dispatchEvent(inputEvent);
      input.dispatchEvent(changeEvent);
    }
  }

  function onFieldPaste(evt) {
    const pasted = evt.clipboardData || window.clipboardData;
    const input = evt.target;
    const fieldNumbersValue = getInputNumbersValue(input);

    if (pasted) {
      const pastedText = pasted.getData('Text');

      if (/\D/g.test(pastedText)) {
        input.value = fieldNumbersValue;
      }
    }
  }

  fieldElement.addEventListener('input', onFieldInput);
  fieldElement.addEventListener('keydown', onFieldKeydown);
  fieldElement.addEventListener('paste', onFieldPaste);
}
/* * * * * * * * * * * * * * * * * * * * * * * */
