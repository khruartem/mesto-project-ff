// теперь картинки можно импортировать,
// вебпак добавит в переменные правильные пути
import avatarImage from '../images/avatar.jpg';
import logoImage from '../images/logo.svg';

const images = [
  // меняем исходные пути на переменные
  { name: 'Avatar image', link: avatarImage },
  { name: 'Logo image', link: logoImage },
];

import '../pages/index.css'; // добавьте импорт главного файла стилей

// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const cardElements = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard (cardName, cardLink, callback) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  
  cardTitle.textContent = cardName;
  cardImage.src = cardLink;
  cardImage.alt = 'Фото места';

  deleteButton.addEventListener('click', () => callback(cardElement));

  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard (element) {
  element.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach((element) => {
  cardElements.append(createCard(element.name, element.link, deleteCard));
});