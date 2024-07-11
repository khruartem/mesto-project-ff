// @todo: Импорты
import '../pages/index.css';
import initialCards from '../components/cards.js';
import { createCard, deleteCard, cardLike } from '../components/card.js';
import { openPopup, closePopup, makePopupAnimated } from '../components/modal.js';

// @todo: Экспорты
export const cardTemplate = document.querySelector('#card-template').content;
export const popupEdit = document.querySelector('.popup_type_edit');
export const popupPlace = document.querySelector('.popup_type_image');

// @todo: DOM узлы
const cardElements = document.querySelector('.places__list');
const popupNew = document.querySelector('.popup_type_new-card');
const popups = document.querySelectorAll('.popup');
const buttonEdit = document.querySelector('.profile__edit-button');
const buttonNew = document.querySelector('.profile__add-button');
const formEdit = document.forms['edit-profile'];
const nameInput = formEdit.elements.name;
const jobInput = formEdit.elements.description;
const formNew = document.forms['new-place'];
const placeInput = formNew.elements['place-name'];
const linkInput = formNew.elements.link;

// @todo: Вывести карточки на страницу
initialCards.forEach((element) => {
  cardElements.append(createCard(element.name, element.link, deleteCard, cardLike, openPopup));
});

// @todo: Обработчик отправки формы редактирования профиля
function handleFormEditSubmit(evt) {
  evt.preventDefault();

  document.querySelector('.profile__title').textContent = nameInput.value;
  document.querySelector('.profile__description').textContent = jobInput.value;

  closePopup(evt.type);
}

// @todo: Обработчик отправки формы добавления новой карточки
function handleFormNewSubmit(evt) {
  evt.preventDefault();

  cardElements.prepend(createCard(placeInput.value, linkInput.value, deleteCard, cardLike, openPopup));

  formNew.reset();
  closePopup(evt.type);
}

// @todo: Повесить на попапы класс для анимации
popups.forEach((popup) => makePopupAnimated(popup));

// @todo: Повесить слушателей клика на кнопки редактирования профиля и создания новой карточки
buttonEdit.addEventListener('click', (evt) => openPopup(popupEdit, evt));
buttonNew.addEventListener('click', (evt) => openPopup(popupNew, evt));

// @todo: Повесить слушателей отправки форм для форм редактирования профиля и создания карточки
formEdit.addEventListener('submit', handleFormEditSubmit);
formNew.addEventListener('submit', handleFormNewSubmit);