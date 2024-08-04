// Функция создания карточки
function createCard(profileId, cardObject, cardFunctionsObject, cardHandlersObject) {
  const cardTemplate = document.getElementById('card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likes = cardElement.querySelector('.card__like-count');

  // Устанока имени, картинки, состояние лайка и кол-ва лайков карточки
  cardTitle.textContent = cardObject.name;
  // Установка картинки карточки
  cardImage.src = cardObject.link;
  cardImage.alt = cardObject.name;
  // Устанока состояние лайка и кол-ва лайков карточки
  if (cardObject.likes.find(element => {
    return element['_id'] === profileId;
  })) {
    cardFunctionsObject.toggleLikeInMarkup(likeButton, likes, cardObject.likes.length);
  } else {
    likes.textContent = cardObject.likes.length;
  }
  // Установка id карточки
  cardElement.id = cardObject['_id'];


  // Повесить слушателей клика на кнопку удаления карточки
  if (cardObject.owner['_id'] === profileId) {
    deleteButton.classList.remove('card__delete-button_hidden');
    deleteButton.addEventListener('click', () => {
      cardHandlersObject.handleCardDeleteClick(cardObject['_id'])
    });
  } else {
    deleteButton.classList.add('card__delete-button_hidden');
  }

  // Повесить слушателей клика на кнопку лайка
  likeButton.addEventListener('click', evt => {
    cardHandlersObject.handleCardLikeClick(
      evt,
      cardObject['_id'], cardFunctionsObject.toggleLikeInMarkup,
      likeButton, 'card__like-button_is-active', likes)
  });

  // Повесить слушателей клика на картинку карточки
  cardImage.addEventListener('click', () => {
    cardHandlersObject.handleCardImageClick(cardObject.name, cardObject.link)
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
