// Функция создания карточки
function createCard(cardAttributesObject) {
  const cardTemplate = document.getElementById('card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const cardOpened = document.querySelector('.popup_type_image');
  const cardOpenedImg = cardOpened.querySelector('.popup__image');
  const cardOpenedCaption = cardOpened.querySelector('.popup__caption');
  const likes = cardElement.querySelector('.card__like-count');
  
  // Устанока имени, картинки, состояние лайка и кол-ва лайков карточки
  cardTitle.textContent = cardAttributesObject.cardName;
  // Установка картинки карточки
  cardImage.src = cardAttributesObject.cardLink;
  cardImage.alt = cardAttributesObject.cardName;
  // Устанока состояние лайка и кол-ва лайков карточки
  if (cardAttributesObject.likesArray.find(element => {
    return element['_id'] === cardAttributesObject.profileId;
  })) {
    cardAttributesObject.togglelikeInMarkup(likeButton, likes, cardAttributesObject.likesArray.length);
  } else {
    likes.textContent = cardAttributesObject.likesArray.length;
  }
  // Установка id карточки
  cardElement.id = cardAttributesObject.cardId;


  // Повесить слушателей клика на кнопку удаления карточки
  if (cardAttributesObject.cardOwnerId === cardAttributesObject.profileId) {
    deleteButton.classList.remove('card__delete-button_hidden');
    deleteButton.addEventListener('click', () => {
      // Ищем зону контента попапа:
      const popupContentZone = cardAttributesObject.popupDelete.querySelector(cardAttributesObject.hideConfigObject.popupContenSelector);
      
      cardAttributesObject.openFunction(cardAttributesObject.popupDelete);
      cardAttributesObject.formDelete.dataset.cardId = `${cardAttributesObject.cardId}`;
      if (cardAttributesObject.formDelete.classList.contains(cardAttributesObject.hideConfigObject.formHiddenClass)) {
        cardAttributesObject.hideFormError(cardAttributesObject.formDelete, cardAttributesObject.hideConfigObject);
        cardAttributesObject.changeButtonLabel(cardAttributesObject.formDelete, 'Да');
        cardAttributesObject.clearValidation(cardAttributesObject.formDelete, cardAttributesObject.validationConfig);
      } else {
        cardAttributesObject.clearValidation(cardAttributesObject.formDelete, cardAttributesObject.validationConfig);
      }
      popupContentZone.classList.add(cardAttributesObject.hideConfigObject.popupContenFitClass);
    });
  } else {
    deleteButton.classList.add('card__delete-button_hidden');
  }
  
  // Повесить слушателей клика на кнопку лайка
  likeButton.addEventListener('click', evt => {
    if (evt.target.classList.contains('card__like-button_is-active')) {
      cardAttributesObject.deleteLikeFromServer(cardAttributesObject.cardId)
        .then(res => {
          cardAttributesObject.togglelikeInMarkup(likeButton, likes, res.likes.length);
        })
        .catch(err => console.log(err))
    } else {
      cardAttributesObject.putLikeOnServer(cardAttributesObject.cardId)
        .then(res => {
          cardAttributesObject.togglelikeInMarkup(likeButton, likes, res.likes.length);
        })
        .catch(err => console.log(err))
    }
  });

  // Повесить слушателей клика на картинку карточки
  cardImage.addEventListener('click', () => {
    cardOpenedImg.src = cardAttributesObject.cardLink;
    cardOpenedImg.alt = cardAttributesObject.cardName;
    cardOpenedCaption.textContent = cardAttributesObject.cardName;
    cardAttributesObject.openFunction(cardOpened);
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
