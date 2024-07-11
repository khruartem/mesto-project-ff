import { cardTemplate } from '../components/index.js';
import { popupPlace } from '../components/index.js';

// @todo: Функция создания карточки
function createCard(cardName, cardLink, callback1, callback2, callback3) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  
  cardTitle.textContent = cardName;
  cardImage.src = cardLink;
  cardImage.alt = cardName;

  deleteButton.addEventListener('click', callback1);
  likeButton.addEventListener('click', callback2);
  cardImage.addEventListener('click', (evt) => callback3(popupPlace, evt));

  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(evt) {
  evt.target.closest('.card').remove();
}

//@todo: Функция лайка карточки
function cardLike(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, cardLike };
