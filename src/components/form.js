function changeButtonLabel(form, newLabel) {
  const button = form.querySelector("button[type='submit']");
  button.textContent = newLabel;
}

function showFormError(formElement, errorMessage, displayConfig) {
  const errorElement = formElement.querySelector(`.${formElement.id}-error`);
  const popupContentElement = formElement.closest(displayConfig.popupContenSelector);
  
  formElement.classList.add(displayConfig.formHiddenClass);
  popupContentElement.classList.add(displayConfig.popupContenFitClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(displayConfig.errorClass, displayConfig.errorFormClass);
}

function hideFormError(formElement, displayConfig) {
  const errorElement = formElement.querySelector(`.${formElement.id}-error`);
  const popupContentElement = formElement.closest(displayConfig.popupContenSelector);
  
  formElement.classList.remove(displayConfig.formHiddenClass);
  popupContentElement.classList.remove(displayConfig.popupContenFitClass);
  errorElement.classList.remove(displayConfig.errorClass, displayConfig.errorFormClass);
}

export { changeButtonLabel, showFormError, hideFormError }