import { getDataServer } from './fetchData';
import config from '../config.json';
import axios from 'axios';
import Notiflix from 'notiflix';
import { showModal } from './renderModalWindow';
import { showPreloader } from './preload';
import { convertMs, addLeadingZero } from './convertMS';

export async function getEventDetails(id) {
  const preloadNode = await showPreloader();
  const response = await axios.get(
    `http://app.ticketmaster.com/discovery/v2/events/${id}?apikey=${config.key}`,
  );
  preloadNode.remove();
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(
    Notiflix.Notify.failure(
      'К сожалению, по Вашему запросу событий не найдено. Попробуйте изменить запрос.',
    ),
  );
}

document.querySelector('.events__list').addEventListener('click', async e => {
  e.preventDefault();
  const id = e.target.closest('.events__item').id;
  const data = await getEventDetails(id);
  showModal(data);
  updateTime(new Date(data.dates.start.localDate).getTime() - Date.now());

  const refs = {
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
    backdropNode: document.querySelector('.cards__backdrop'),
    moreFromAuthorBtn: document.querySelector('.infoauthor-button'),
    eventsNode: document.querySelector('.events__list'),
  };

  refs.closeModalBtn.addEventListener('click', e => {
    refs.modal.classList.add('is-hidden');
  });

  refs.backdropNode.addEventListener('click', e => {
    if (e.target.dataset.modal === '') refs.modal.classList.add('is-hidden');
  });
  refs.moreFromAuthorBtn.addEventListener('click', async e => {
    refs.eventsNode.innerHTML = '';
    refs.modal.classList.add('is-hidden');

    if (data.classifications[0].segment.name === 'Music') {
      const authorData = await getDataServer(data.name);
    } else if (data.classifications[0].segment.name === 'Arts & Theatre') {
      const authorData = await getDataServer(data.classifications[0].genre.name);
    } else if (data.classifications[0].segment.name === 'Sports') {
      const authorData = await getDataServer(data.classifications[0].genre.name);
    }
  });
});

// let time = new Date(2022, 2, 12).getTime() - Date.now();

const updateTime = function (time) {
  const { days, hours, minutes } = convertMs(time);
  const timeTo = `Days: ${addLeadingZero(days)} Hours: ${addLeadingZero(
    hours,
  )}  Minutes: ${addLeadingZero(minutes)}`;
  Notiflix.Notify.info(`Time to event: ${timeTo}`);
};
