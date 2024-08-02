// Импорты
import '../pages/index.css';
import { createCard, deleteCard, cardLike } from '../components/card.js';
import { openPopup, closePopup, makePopupAnimated } from '../components/popup.js';
import { enableValidation, clearValidation, showFormError, hideFormError } from '../components/validation.js';
import { getProfileData, getInitialCards, editProfileData, addNewCard, deleteNewCard, putLike, deleteLike, checkImgByUrl, editAvatar } from '../components/api.js';
import { renderLoading } from '../components/spinner.js';
import { changeButtonLabel } from '../components/form.js';


// DOM узлы страницы 
const content = document.querySelector('.page__content');
const spinner = document.querySelector('.page__spinner');

// DOM узлы карточек
const cardElements = document.querySelector('.places__list');
const popupNew = document.querySelector('.popup_type_new-card');
const formNew = document.forms['new-place'];
const placeInput = formNew.elements['place-name'];
const linkInput = formNew.elements.link;

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

// Получить данные с сервера
const promises = [getProfileData(), getInitialCards()];

Promise.all(promises)
  .then((results) => {
    const profileData = results[0];
    const cards = results[1];

    renderLoading(content, spinner, true);

    // Выводим полученные данные пользователя
    avatar.style.backgroundImage = `url(${profileData.avatar})`;
    name.textContent = profileData.name;
    job.textContent = profileData.about;
    profileId = profileData['_id'];

    // Выводим полученные карточки
    cards.forEach((card) => {
      cardElements.append(createCard({
        profileId: profileId,
        cardOwnerId: card.owner['_id'],
        cardId: card['_id'],
        cardName: card.name,
        cardLink: card.link,
        deleteFromMarkup: deleteCard,
        togglelikeInMarkup: cardLike,
        putLikeOnServer: putLike,
        deleteLikeFromServer: deleteLike,
        likesArray: card.likes,
        openFunction: openPopup,
        deleteFromServer: deleteNewCard,
        popupDelete: popupDelete,
        formDelete: formDelete,
        hideFormError: hideFormError,
        hideConfigObject: {
          formHiddenClass: 'popup__form_hidden',
          errorClass: 'popup__error_visible',
          errorFormClass: 'popup__error_form',
          popupContenSelector: '.popup__content',
          popupContenFitClass: 'popup__content_fit'
        },
        changeButtonLabel: changeButtonLabel,
        clearValidation: clearValidation,
        validationConfig: {
          formSelector: '.popup__form',
          inputSelector: '.popup__input',
          submitButtonSelector: '.popup__button',
          inactiveButtonClass: 'popup__button_disabled',
          inputErrorClass: 'popup__input_type_error',
          errorClass: 'popup__error_visible'
        }
      }));
    })
  })
  .catch((err) => console.log(err))
  .finally(() => renderLoading(content, spinner, false));

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
        showFormError(evt.target, err, {
          formHiddenClass: 'popup__form_hidden',
          errorClass: 'popup__error_visible',
          errorFormClass: 'popup__error_form',
          popupContenSelector: '.popup__content',
          popupContenFitClass: 'popup__content_fit'
        })
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
      .then(newCardData => {
        cardElements.prepend(createCard({
          profileId: profileId,
          cardOwnerId: newCardData.owner['_id'],
          cardId: newCardData['_id'],
          cardName: newCardData.name,
          cardLink: newCardData.link,
          deleteFromMarkup: deleteCard,
          togglelikeInMarkup: cardLike,
          putLikeOnServer: putLike,
          deleteLikeFromServer: deleteLike,
          likesArray: newCardData.likes,
          openFunction: openPopup,
          deleteFromServer: deleteNewCard,
          popupDelete: popupDelete,
          formDelete: formDelete,
          hideFormError: hideFormError,
          hideConfigObject: {
            formHiddenClass: 'popup__form_hidden',
            errorClass: 'popup__error_visible',
            errorFormClass: 'popup__error_form',
            popupContenSelector: '.popup__content',
            popupContenFitClass: 'popup__content_fit'
          },
          changeButtonLabel: changeButtonLabel,
          clearValidation: clearValidation,
          validationConfig: {
            formSelector: '.popup__form',
            inputSelector: '.popup__input',
            submitButtonSelector: '.popup__button',
            inactiveButtonClass: 'popup__button_disabled',
            inputErrorClass: 'popup__input_type_error',
            errorClass: 'popup__error_visible'
          }
        }))
        formNew.reset();
        closePopup(evt.type);
        changeButtonLabel(evt.target, 'Сохранить');
      })
      .catch(err => {
        showFormError(evt.target, err, {
          formHiddenClass: 'popup__form_hidden',
          errorClass: 'popup__error_visible',
          errorFormClass: 'popup__error_form',
          popupContenSelector: '.popup__content',
          popupContenFitClass: 'popup__content_fit'
        })
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
              showFormError(evt.target, err, {
                formHiddenClass: 'popup__form_hidden',
                errorClass: 'popup__error_visible',
                errorFormClass: 'popup__error_form',
                popupContenSelector: '.popup__content',
                popupContenFitClass: 'popup__content_fit'
              })
              changeButtonLabel(evt.target, 'OK');
            })
          changeButtonLabel(evt.target, 'Сохранить');
        }
      })
      .catch(err => {
        showFormError(evt.target, err, {
          formHiddenClass: 'popup__form_hidden',
          errorClass: 'popup__error_visible',
          errorFormClass: 'popup__error_form',
          popupContenSelector: '.popup__content',
          popupContenFitClass: 'popup__content_fit'
        })
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
        showFormError(evt.target, err, {
          formHiddenClass: 'popup__form_hidden',
          errorClass: 'popup__error_visible',
          errorFormClass: 'popup__error_form',
          popupContenSelector: '.popup__content',
          popupContenFitClass: 'popup__content_fit'
        })
        changeButtonLabel(evt.target, 'OK');
      })
  }
}

// Повесить на попапы класс для анимации
popups.forEach((popup) => makePopupAnimated(popup));

// Повесить слушателей клика на аватар
avatar.addEventListener('click', () => {
  formEditAvatar.reset();
  openPopup(popupEditAvatar);
  if (formEditAvatar.classList.contains('popup__form_hidden')) {
    hideFormError(formEditAvatar, {
      formHiddenClass: 'popup__form_hidden',
      errorClass: 'popup__error_visible',
      errorFormClass: 'popup__error_form',
      popupContenSelector: '.popup__content',
      popupContenFitClass: 'popup__content_fit'
    });
    changeButtonLabel(formEditAvatar, 'Сохранить');
    clearValidation(formEditAvatar, {
      formSelector: '.popup__form',
      inputSelector: '.popup__input',
      submitButtonSelector: '.popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    });
  } else {
    clearValidation(formEditAvatar, {
      formSelector: '.popup__form',
      inputSelector: '.popup__input',
      submitButtonSelector: '.popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    });
  }
})

// Повесить слушателей клика на кнопкy редактирования профиля
buttonEdit.addEventListener('click', () => {
  nameInput.value = name.textContent;
  jobInput.value = job.textContent;
  openPopup(popupEdit);
  if (formEdit.classList.contains('popup__form_hidden')) {
    hideFormError(formEdit, {
      formHiddenClass: 'popup__form_hidden',
      errorClass: 'popup__error_visible',
      errorFormClass: 'popup__error_form',
      popupContenSelector: '.popup__content',
      popupContenFitClass: 'popup__content_fit'
    });
    changeButtonLabel(formEdit, 'Сохранить');
  } else {
    clearValidation(formEdit, {
      formSelector: '.popup__form',
      inputSelector: '.popup__input',
      submitButtonSelector: '.popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    });
  }
});

// Повесить слушателей клика на кнопку создания новой карточки
buttonNew.addEventListener('click', () => {
  formNew.reset();
  openPopup(popupNew);
  if (formNew.classList.contains('popup__form_hidden')) {
    hideFormError(formNew, {
      formHiddenClass: 'popup__form_hidden',
      errorClass: 'popup__error_visible',
      errorFormClass: 'popup__error_form',
      popupContenSelector: '.popup__content',
      popupContenFitClass: 'popup__content_fit'
    });
    changeButtonLabel(formNew, 'Сохранить');
    clearValidation(formNew, {
      formSelector: '.popup__form',
      inputSelector: '.popup__input',
      submitButtonSelector: '.popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    });
  } else {
    clearValidation(formNew, {
      formSelector: '.popup__form',
      inputSelector: '.popup__input',
      submitButtonSelector: '.popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    });
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

// Включить валидацию
enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});

