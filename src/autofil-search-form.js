import countries from './countries.json';
import { getDataServer, firstQueryDataServer } from './js/fetchData';

const countryNode = document.querySelector('#search-country');
const searchInput = document.querySelector('#search-input');

const localPosition = localStorage.getItem('localCountryName');
const inputData = localStorage.getItem('searchData');

(async () => {
  if (inputData) {
    searchInput.value = inputData;
  }
  if (!localPosition) {
    autofill().then(data => getDataServer('', data, ''));
  } else {
    countryNode.value = localPosition;
    const localCode = localStorage.getItem('localCountryCode');
    getDataServer(searchInput.value, localCode, '');
  }
})();

async function autofill() {
  const getCountryCodeByIP = await firstQueryDataServer();
  const countryCodeValidator = getCountryCodeByIP ? getCountryCodeByIP.data.countryCode : 'AU';
  const countryCodeCheck = countries.find(item => item.countryCode === countryCodeValidator);
  countryNode.value = countryCodeCheck.countryName;
  if (!localStorage.getItem('localCountryName') && !localStorage.getItem('localCountryCode')) {
    localStorage.setItem('localCountryName', countryNode.value);
    localStorage.setItem('localCountryCode', countryCodeValidator);
  }
  return countryCodeValidator;
}
