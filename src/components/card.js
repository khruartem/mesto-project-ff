// @todo: Функция создания карточки
function createCard(cardName, cardLink, deleteCard, likeCard, openCard) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const cardOpened = document.querySelector('.popup_type_image');
  const cardOpenedImg = cardOpened.querySelector('.popup__image');
  const cardOpenedCaption = cardOpened.querySelector('.popup__caption');
  
  cardTitle.textContent = cardName;
  cardImage.src = cardLink;
  cardImage.alt = cardName;

  deleteButton.addEventListener('click', deleteCard);
  likeButton.addEventListener('click', likeCard);
  cardImage.addEventListener('click', () => {
    cardOpenedImg.src = cardLink;
    cardOpenedImg.alt = cardName;
    cardOpenedCaption.textContent = cardName;
    openCard(cardOpened)
  });

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
