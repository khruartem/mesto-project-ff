import { popupEdit } from '../components/index.js';
import { popupPlace } from '../components/index.js';

// @todo: Функция открытия попапа
function openPopup(popup, evt) {    
  if (evt.target.classList.contains('profile__edit-button')) {
    const form = popupEdit.querySelector('.popup__form');
    const name = form.elements.name;
    const job = form.elements.description;

    name.value = document.querySelector('.profile__title').textContent;
    job.value = document.querySelector('.profile__description').textContent;
  } else if (evt.target.classList.contains('card__image')) {
    const placeImg = popupPlace.querySelector('.popup__image');
    const placeCaption = popupPlace.querySelector('.popup__caption');

    placeImg.src = evt.target.src;
    placeCaption.textContent = evt.target.alt;
  }

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