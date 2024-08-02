export function renderLoading(content, spinner, isLoading) {
  if (isLoading) {
    spinner.style.display = 'block';
    content.style.display = 'none';
  } else {
    spinner.style.display = 'none';
    content.style.display = 'block';
  }
}