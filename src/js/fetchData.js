import axios from 'axios';
import Notiflix from 'notiflix';
import config from '../config.json';
import { showData } from './showData';
import { showPagination, checkPagesLimit } from './pagination';

export const sendParam = {
  apikey: config.key,
};

export async function firstQueryDataServer() {
  try {
    const response = await axios.get(`http://ip-api.com/json/?fields=countryCode`);
    return response;
  } catch (error) {
    return false;
  }
}

export async function getDataServer(keyword, countryCode, page) {
  keyword === '' ? delete sendParam.keyword : (sendParam.keyword = keyword);
  countryCode === '' ? delete sendParam.countryCode : (sendParam.countryCode = countryCode);

  page === '' ? delete sendParam.page : (sendParam.page = checkPagesLimit(page));

  if (!sendParam.countryCode && !sendParam.keyword) {
    return false;
  }

  const response = await axios.get(config.host, { params: sendParam });

  if (response.data.page.totalElements < 1) {
    document.querySelector('.events__list').innerHTML = '';
    let counter = 15;
    let id = setInterval(() => {
      --counter;
      document.querySelector('#clock').innerHTML = `${counter}`;
    }, 1000);
    document.querySelector(
      '#allert-modal-window',
    ).innerHTML = `<div class="allert-wrapper"><p class="allert-modal">Sorry, events not found! Please, change your search request! Or we show you most popular events in <span id="clock">15</span> seconds.</p>
<img class="allert-img" src="https://ouch-cdn2.icons8.com/a_9ZYSU4z_kNg-REiQtNDoybiZ3chJ-9TWnVZIHIfdI/rs:fit:784:523/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMTY5/LzZjZmIwYTdkLTk5/OTgtNGI5OS1hNTgx/LTQzMzIwOThkYTc4/ZS5zdmc.png" width="250" height="150" alt="404">
</div>`;
    document.querySelector('.pagination__container').innerHTML = '';

    setTimeout(() => {
      clearInterval(id);
      getDataServer('', 'US', '');
      // localStorage.setItem('localCountryCode', 'US');
      // localStorage.setItem('localCountryName', 'United States of America');
      // document.querySelector('#search-country').value = 'United States of America';
    }, 15000);
  }

  if (response.status >= 200 && response.status < 300) {
    if (response.data._embedded) {
      document.querySelector('.events__list').innerHTML = '';
      document.querySelector('#allert-modal-window').innerHTML = '';
      showData(response.data._embedded.events);
      showPagination(
        +response.data.page.number + 1,
        checkPagesLimit(response.data.page.totalPages),
      );
    }

    return response.data;
  }

  throw new Error(Notiflix.Notify.failure('Что-то пошло не так.'));
}
