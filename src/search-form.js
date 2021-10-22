import { getDataServer } from './js/fetchData';
import { debounce } from 'debounce';
import { showPreloader } from './js/preload';

import countries from './countries.json';

function printOptions(data) {
  const optionList = document.querySelector('#choose-country');
  const markUp = data
    .map(item => {
      const { countryCode, countryName } = item;
      return `<option value='${countryName}'>${countryCode}</option>`;
    })
    .join('');
  optionList.insertAdjacentHTML('beforeend', markUp);
}

printOptions(countries);

document.querySelector('#search-form').addEventListener('input', debounce(getCards, 500));

function getCards() {
  const searchInput = document.querySelector('#search-input');
  const searchCountry = document.querySelector(`#search-country`);
  const searchCountryOption = document.querySelector(
    `#choose-country option[value="${searchCountry.value}"]`,
  );
  const keywordValidator = !searchInput.value ? '' : searchInput.value;
  const countryValidator = !searchCountryOption?.textContent
    ? ''
    : searchCountryOption?.textContent;

  localStorage.setItem('searchData', searchInput.value);
  localStorage.setItem('localCountryName', searchCountry.value);
  localStorage.setItem('localCountryCode', searchCountryOption.textContent);

  const promisePreload = showPreloader();

  getDataServer(keywordValidator, countryValidator)
    .then(() => promisePreload)
    .then(preloadNode => preloadNode.remove());
}
