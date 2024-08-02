// Импорты
import '../pages/index.css';
import { createCard, deleteCard, cardLike } from '../components/card.js';
import { openPopup, closePopup, makePopupAnimated } from '../components/popup.js';
import { enableValidation, clearValidation } from '../components/validation.js';
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

// Отображение лоадера перед загрузкой страницы
/*document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    hideLoader(content, loader);
  }
}); */

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
        deleteFromServer: deleteNewCard
      }));
    })
  })
  .catch((err) => console.log(err))
  .finally(() => renderLoading(content, spinner, false));

// Обработчик отправки формы редактирования профиля
function handleFormEditSubmit(evt) {
  evt.preventDefault();

  changeButtonLabel(evt.target, 'Сохранение...');
  editProfileData(nameInput.value, jobInput.value)
    .then(newProfileData => {
      document.querySelector('.profile__title').textContent = newProfileData.name;
      document.querySelector('.profile__description').textContent = newProfileData.about;
      closePopup(evt.type);
    })
    .catch((err) => console.log(err))
    .finally(() => changeButtonLabel(evt.target, 'Сохранить'));
}

// Обработчик отправки формы добавления новой карточки
function handleFormNewSubmit(evt) {
  evt.preventDefault();

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
        deleteFromServer: deleteNewCard
      }))
      formNew.reset();
      closePopup(evt.type);
    })
    .catch((err) => console.log(err))
    .finally(() => changeButtonLabel(evt.target, 'Сохранить'));
}

// Обработчик отправки формы изменения аватара
function handleFormEditAvatarSubmit(evt) {
  evt.preventDefault();
  
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
          })
          .catch((err) => console.log(err))
          .finally(() => changeButtonLabel(evt.target, 'Сохранить'));
      }
    })
    .catch(err => console.log(err))
    .finally(() => changeButtonLabel(evt.target, 'Сохранить'));
}

// Повесить на попапы класс для анимации
popups.forEach((popup) => makePopupAnimated(popup));

// Повесить слушателей клика на аватар
avatar.addEventListener('click', () => {
  formEditAvatar.reset();
  openPopup(popupEditAvatar);
  clearValidation(popupEditAvatar, {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });
})

// Повесить слушателей клика на кнопкy редактирования профиля
buttonEdit.addEventListener('click', () => {
  nameInput.value = name.textContent;
  jobInput.value = job.textContent;
  openPopup(popupEdit);
  clearValidation(popupEdit, {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });
});

// Повесить слушателей клика на кнопку создания новой карточки
buttonNew.addEventListener('click', () => {
  formNew.reset();
  openPopup(popupNew);
  clearValidation(popupNew, {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });
});

// Повесить слушателя отправки формы редактирования профиля
formEdit.addEventListener('submit', handleFormEditSubmit);

// Повесить слушателя отправки формы создания карточки
formNew.addEventListener('submit', handleFormNewSubmit);

// Повесить слушателя отправки формы обновления аватара
formEditAvatar.addEventListener('submit', handleFormEditAvatarSubmit);

// Включить валидацию
enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});

