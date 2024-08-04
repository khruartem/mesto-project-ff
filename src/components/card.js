// Функция создания карточки
function createCard(profileId, cardAttributesObject, cardFunctionsObject, cardHandlersObject) {
  const cardTemplate = document.getElementById('card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likes = cardElement.querySelector('.card__like-count');

  // Устанока имени, картинки, состояние лайка и кол-ва лайков карточки
  cardTitle.textContent = cardAttributesObject.cardName;
  // Установка картинки карточки
  cardImage.src = cardAttributesObject.cardLink;
  cardImage.alt = cardAttributesObject.cardName;
  // Устанока состояние лайка и кол-ва лайков карточки
  if (cardAttributesObject.likesArray.find(element => {
    return element['_id'] === profileId;
  })) {
    cardFunctionsObject.toggleLikeInMarkup(likeButton, likes, cardAttributesObject.likesArray.length);
  } else {
    likes.textContent = cardAttributesObject.likesArray.length;
  }
  // Установка id карточки
  cardElement.id = cardAttributesObject.cardId;


  // Повесить слушателей клика на кнопку удаления карточки
  if (cardAttributesObject.cardOwnerId === profileId) {
    deleteButton.classList.remove('card__delete-button_hidden');
    deleteButton.addEventListener('click', () => {
      cardHandlersObject.handleCardDeleteClick(cardAttributesObject.cardId)
    });
  } else {
    deleteButton.classList.add('card__delete-button_hidden');
  }

  // Повесить слушателей клика на кнопку лайка +
  likeButton.addEventListener('click', evt => {
    cardHandlersObject.handleCardLikeClick(evt, cardAttributesObject.cardId, cardFunctionsObject.toggleLikeInMarkup, likeButton, likes)
  });

  // Повесить слушателей клика на картинку карточки
  cardImage.addEventListener('click', () => {
    cardHandlersObject.handleCardImageClick(cardAttributesObject.cardName, cardAttributesObject.cardLink)
  });

  return cardElement;
}

// Функция удаления карточки
function deleteCard(evt) {
  evt.remove();
}

// Функция лайка карточки
function cardLike(likeButton, likesCountElement, likesCount) {
  likesCountElement.textContent = likesCount;
  likeButton.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, cardLike };
