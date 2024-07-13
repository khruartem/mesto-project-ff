// @todo: Функция открытия попапа
function openPopup(popup) {    
  popup.classList.add('popup_is-opened');

  popup.addEventListener('click', closePopup);
  document.addEventListener('keydown', closePopup);
}

// @todo: Функция закрытия попапа
function closePopup(evt) {
  const popupOpened = document.querySelector('.popup_is-opened');

  if (evt === 'submit' || evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close') || evt.key === 'Escape') {
    popupOpened.classList.remove('popup_is-opened');
    popupOpened.removeEventListener('click', closePopup);
    document.removeEventListener('keydown', closePopup);
  }
}

// @todo: Функция добавления анимации при открытии/закрытии попапа
function makePopupAnimated(popup) {
  if (!popup.classList.contains('popup_is-animated')) {
    popup.classList.add('popup_is-animated');
  }
}

export { openPopup, closePopup, makePopupAnimated };