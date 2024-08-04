// Импорты
import '../pages/index.css';
import { createCard, deleteCard, cardLike } from '../components/card.js';
import { openPopup, closePopup, makePopupAnimated } from '../components/popup.js';
import { enableValidation, clearValidation } from '../components/validation.js';
import { getProfileData, getInitialCards, editProfileData, addNewCard, deleteNewCard, putLike, deleteLike, checkImgByUrl, editAvatar } from '../components/api.js';
import { renderLoading } from '../components/spinner.js';
import { changeButtonLabel, showFormError, hideFormError } from '../components/form.js';


// DOM узлы страницы 
const content = document.querySelector('.page__content');
const spinner = document.querySelector('.page__spinner');

// DOM узлы карточек
const cardElements = document.querySelector('.places__list');
const popupNew = document.querySelector('.popup_type_new-card');
const formNew = document.forms['new-place'];
const placeInput = formNew.elements['place-name'];
const linkInput = formNew.elements.link;
const popupImage = document.querySelector('.popup_type_image');

// DOM узлы для профиля
const popupEdit = document.querySelector('.popup_type_edit');
const popupEditAvatar = document.querySelector('.popup_type_avatar');
const buttonEdit = document.querySelector('.profile__edit-button');
const buttonNew = document.querySelector('.profile__add-button');
const formEdit = document.forms['edit-profile'];
const formEditAvatar = document.forms.avatar;
const nameInput = formEdit.elements.name;
const jobInput = formEdit.elements.description;
const avatarInput = formEditAvatar.elements.avatar;
const avatar = document.querySelector('.profile__image');
const name = document.querySelector('.profile__title');
const job = document.querySelector('.profile__description');
// ID профиля пользователя
let profileId = undefined;

// DOM узлы для попапов
const popups = document.querySelectorAll('.popup');
const popupDelete = document.querySelector('.popup_type_delete');
const formDelete = document.getElementById('delete-form');
const popupError = document.querySelector('.popup_type_error');
const formError = document.getElementById('error-form');

// Объекты настроек
// Настройки для отображения ошибок на форме
const formDisplayConfig = {
  formHiddenClass: 'popup__form_hidden',
  errorClass: 'popup__error_visible',
  errorFormClass: 'popup__error_form',
  popupContenSelector: '.popup__content',
  popupContenFitClass: 'popup__content_fit'
}
// Настройки валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

// Функция получения данных профиля и карточек с сервера
function getProfileAndCards() {
  const promises = [getProfileData(), getInitialCards()];

  Promise.all(promises)
    .then(([profileData, cards]) => {
      renderLoading(content, spinner, true);

      // Выводим полученные данные пользователя
      avatar.style.backgroundImage = `url(${profileData.avatar})`;
      name.textContent = profileData.name;
      job.textContent = profileData.about;
      profileId = profileData['_id'];

      // Выводим полученные карточки
      cards.forEach((card) => {
        cardElements.append(createCard(
          profileId,
          card,
          {
            deleteFromMarkup: deleteCard,
            toggleLikeInMarkup: cardLike
          },
          {
            handleCardDeleteClick: handleCardDeleteClick,
            handleCardLikeClick: handleCardLikeClick,
            handleCardImageClick: handleCardImageClick
          }
        ));
      })
    })
    .catch(err => {
      changeButtonLabel(formError, 'Попробовать еще раз');
      openPopup(popupError);
      showFormError(formError, err, formDisplayConfig)
    })
    .finally(() => renderLoading(content, spinner, false));
}

// Обработчик отправки формы редактирования профиля
function handleFormEditSubmit(evt) {
  evt.preventDefault();

  if (evt.target.classList.contains('popup__form_hidden')) {
    changeButtonLabel(evt.target, 'Обработка...');
    closePopup(evt.type);
  } else {
    changeButtonLabel(evt.target, 'Сохранение...');
    editProfileData(nameInput.value, jobInput.value)
      .then(newProfileData => {
        document.querySelector('.profile__title').textContent = newProfileData.name;
        document.querySelector('.profile__description').textContent = newProfileData.about;
        closePopup(evt.type);
        changeButtonLabel(evt.target, 'Сохранить');
      })
      .catch(err => {
        showFormError(evt.target, err, formDisplayConfig)
        changeButtonLabel(evt.target, 'OK');
      })
  }
}

// Обработчик отправки формы добавления новой карточки
function handleFormNewSubmit(evt) {
  evt.preventDefault();

  if (evt.target.classList.contains('popup__form_hidden')) {
    changeButtonLabel(evt.target, 'Обработка...');
    closePopup(evt.type);
  } else {
    changeButtonLabel(evt.target, 'Сохранение...');
    addNewCard(placeInput.value, linkInput.value)
      .then(newCard => {
        cardElements.prepend(createCard(
          profileId,
          newCard,
          {
            deleteFromMarkup: deleteCard,
            toggleLikeInMarkup: cardLike
          },
          {
            handleCardDeleteClick: handleCardDeleteClick,
            handleCardLikeClick: handleCardLikeClick,
            handleCardImageClick: handleCardImageClick
          }
        ));
        formNew.reset();
        closePopup(evt.type);
        changeButtonLabel(evt.target, 'Сохранить');
      })
      .catch(err => {
        showFormError(evt.target, err, formDisplayConfig)
        changeButtonLabel(evt.target, 'OK');
      })
  }
}

// Обработчик отправки формы изменения аватара
function handleFormEditAvatarSubmit(evt) {
  evt.preventDefault();

  if (evt.target.classList.contains('popup__form_hidden')) {
    changeButtonLabel(evt.target, 'Обработка...');
    closePopup(evt.type);
  } else {
    changeButtonLabel(evt.target, 'Проверка URL...');
    checkImgByUrl(avatarInput.value)
      .then(res => {
        if (res) {
          changeButtonLabel(evt.target, 'Сохранение...');
          editAvatar(avatarInput.value)
            .then(newAvatar => {
              avatar.style.backgroundImage = `url(${newAvatar.avatar})`;
              formEditAvatar.reset();
              closePopup(evt.type);
              changeButtonLabel(evt.target, 'Сохранить');
            })
            .catch(err => {
              showFormError(evt.target, err, formDisplayConfig)
              changeButtonLabel(evt.target, 'OK');
            })
        } else {
          showFormError(evt.target, 'Переданная ссылка не содержит изображение.', formDisplayConfig)
          changeButtonLabel(evt.target, 'OK');
        }
      })
      .catch(err => {
        showFormError(evt.target, err, formDisplayConfig)
        changeButtonLabel(evt.target, 'OK');
      })
  }
}

// Обработчик отправки формы удаления карточки
function handleFormConfirmDelete(evt) {
  evt.preventDefault();

  if (evt.target.classList.contains('popup__form_hidden')) {
    changeButtonLabel(evt.target, 'Обработка...');
    closePopup(evt.type);
  } else {
    changeButtonLabel(evt.target, 'Удаление...');
    deleteNewCard(evt.target.dataset.cardId)
      .then(() => {
        const cardToDelete = document.getElementById(evt.target.dataset.cardId);
        deleteCard(cardToDelete);
        closePopup(evt.type);
        evt.target.dataset.cardId = '';
        changeButtonLabel(evt.target, 'Да');
      })
      .catch(err => {
        showFormError(evt.target, err, formDisplayConfig)
        changeButtonLabel(evt.target, 'OK');
      })
  }
}

// Обработчик отправки формы ошибки
function handleFormError(evt) {
  evt.preventDefault();

  changeButtonLabel(evt.target, 'Обработка...');
  if (!profileId) {
    getProfileAndCards();
  }

  if (evt.target.dataset.actionType === 'put-like') {
    putLike(evt.target.dataset.cardId)
      .then(() => {
        closePopup(popupError);
        evt.target.dataset.cardId = '';
        evt.target.dataset.actionType = '';
        changeButtonLabel(evt.target, 'OK');
      })
      .catch(err => {
        showFormError(evt.target, err, formDisplayConfig)
        changeButtonLabel(evt.target, 'Попробовать еще раз');
      });
  }

  if (evt.target.dataset.actionType === 'delete-like') {
    deleteLike(evt.target.dataset.cardId)
      .then(() => {
        closePopup(popupError);
        changeButtonLabel(evt.target, 'OK');
      })
      .catch(err => {
        showFormError(evt.target, err, formDisplayConfig)
        changeButtonLabel(evt.target, 'Попробовать еще раз');
      });
  }
}

// Обработчик клика на кнопку удаления карточки
function handleCardDeleteClick(cardId) {
  // Ищем зону контента попапа
  const popupContentZone = popupDelete.querySelector(formDisplayConfig.popupContenSelector);

  openPopup(popupDelete);
  formDelete.dataset.cardId = `${cardId}`;
  if (formDelete.classList.contains(formDisplayConfig.formHiddenClass)) {
    hideFormError(formDelete, formDisplayConfig);
    changeButtonLabel(formDelete, 'Да');
    clearValidation(formDelete, validationConfig);
  } else {
    clearValidation(formDelete, validationConfig);
  }
  popupContentZone.classList.add(formDisplayConfig.popupContenFitClass);
}

// Обработчик клика на кнопку лайка карточки
function handleCardLikeClick(evt, cardId, toggleLikeInMarkup, likeButton, likeButtonActiveClass, likesElement) {
  formError.dataset.cardId = `${cardId}`;
  hideFormError(formError, formDisplayConfig);
  changeButtonLabel(formError, 'OK');

  if (evt.target.classList.contains(likeButtonActiveClass)) {
    formError.dataset.actionType = 'delete-like';
    deleteLike(cardId)
      .then(res => {
        toggleLikeInMarkup(likeButton, likesElement, res.likes.length);
      })
      .catch(err => {
        openPopup(popupError);
        showFormError(formError, err, formDisplayConfig);
      })
  } else {
    formError.dataset.actionType = 'put-like';
    putLike(cardId)
      .then(res => {
        toggleLikeInMarkup(likeButton, likesElement, res.likes.length);
      })
      .catch(err => {
        openPopup(popupError);
        showFormError(formError, err, formDisplayConfig);
      })
  }
}

// Обработчик клика на картинку карточки
function handleCardImageClick(cardName, cardLink) {
  const cardOpenedImg = popupImage.querySelector('.popup__image');
  const cardOpenedCaption = popupImage.querySelector('.popup__caption');
  
  cardOpenedImg.src = cardLink;
  cardOpenedImg.alt = cardName;
  cardOpenedCaption.textContent = cardName;
  openPopup(popupImage);
}

// Получить данные с сервера
getProfileAndCards();

// Повесить на попапы класс для анимации
popups.forEach((popup) => makePopupAnimated(popup));

// Повесить слушателей клика на аватар
avatar.addEventListener('click', () => {
  formEditAvatar.reset();
  openPopup(popupEditAvatar);
  if (formEditAvatar.classList.contains('popup__form_hidden')) {
    hideFormError(formEditAvatar, formDisplayConfig);
    changeButtonLabel(formEditAvatar, 'Сохранить');
    clearValidation(formEditAvatar, validationConfig);
  } else {
    clearValidation(formEditAvatar, validationConfig);
  }
})

// Повесить слушателей клика на кнопкy редактирования профиля
buttonEdit.addEventListener('click', () => {
  nameInput.value = name.textContent;
  jobInput.value = job.textContent;
  openPopup(popupEdit);
  if (formEdit.classList.contains('popup__form_hidden')) {
    hideFormError(formEdit, formDisplayConfig);
    changeButtonLabel(formEdit, 'Сохранить');
  } else {
    clearValidation(formEdit, validationConfig);
  }
});

// Повесить слушателей клика на кнопку создания новой карточки
buttonNew.addEventListener('click', () => {
  formNew.reset();
  openPopup(popupNew);
  if (formNew.classList.contains('popup__form_hidden')) {
    hideFormError(formNew, formDisplayConfig);
    changeButtonLabel(formNew, 'Сохранить');
    clearValidation(formNew, validationConfig);
  } else {
    clearValidation(formNew, validationConfig);
  }
});

// Повесить слушателя отправки формы редактирования профиля
formEdit.addEventListener('submit', handleFormEditSubmit);

// Повесить слушателя отправки формы создания карточки
formNew.addEventListener('submit', handleFormNewSubmit);

// Повесить слушателя отправки формы обновления аватара
formEditAvatar.addEventListener('submit', handleFormEditAvatarSubmit);

// Повесить слушателя отправки формы удаления карточки
formDelete.addEventListener('submit', handleFormConfirmDelete);

// Повесить слушателя отправки формы ошибки
formError.addEventListener('submit', handleFormError);

// Включить валидацию
enableValidation(validationConfig);
