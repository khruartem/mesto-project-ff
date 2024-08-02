export function changeButtonLabel(form, newLabel) {
  const button = form.querySelector("button[type='submit']");
  button.textContent = newLabel;
}