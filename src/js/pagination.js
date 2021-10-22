import config from '../config.json';
import { getDataServer, sendParam } from './fetchData';
import { showPreloader } from './preload';

export const checkPagesLimit = function (totalPages) {
  let validLastPage;
  if (totalPages) validLastPage = totalPages >= 50 ? 49 : +totalPages;
  return validLastPage;
};

export const showPagination = function (currentPage, lastPage) {
  let paginationMarkup = '';
  const paginationVisualElements = config.pagination.elements;

  if (lastPage <= paginationVisualElements)
    for (let i = 1; i <= lastPage; i++) {
      paginationMarkup += `<span `;
      if (i === currentPage) paginationMarkup += `class = 'pagination__selected'>`;
      else paginationMarkup += `class = 'pagination__simple'>`;
      paginationMarkup += `${i}</span>`;
    }

  if (lastPage > paginationVisualElements) {
    paginationMarkup += `<span `;

    /*show first page in pagination line*/
    if (currentPage === 1) paginationMarkup += `class = 'pagination__selected'>1</span>`;
    else paginationMarkup += `class = 'pagination__simple'>1</span>`;

    /*show inner elements in pagination line*/
    const innerElements = paginationVisualElements - 2;
    const centerOfInnerElements = Math.ceil(innerElements / 2);
    for (let i = 1; i <= innerElements; i++) {
      if (
        (currentPage > innerElements - 1 && i === 1) ||
        (currentPage <= lastPage - (innerElements - 1) && i === innerElements)
      ) {
        paginationMarkup += `<span class = 'pagination__dots'>&#8230</span>`;
        continue;
      }
      paginationMarkup += `<span `;

      if (i === centerOfInnerElements && currentPage != 1 && currentPage != lastPage)
        paginationMarkup += `class = 'pagination__selected'>${
          currentPage - centerOfInnerElements + i
        }</span>`;
      else if (
        currentPage - centerOfInnerElements + i < lastPage &&
        currentPage - centerOfInnerElements + i > 1
      )
        paginationMarkup += `class = 'pagination__simple'>${
          currentPage - centerOfInnerElements + i
        }</span>`;
    }

    /*show last page in pagination line*/
    paginationMarkup += `<span `;
    if (currentPage === lastPage)
      paginationMarkup += `class = 'pagination__selected'>${lastPage}</span>`;
    else paginationMarkup += `class = 'pagination__simple'>${lastPage}</span>`;
  }
  document.querySelector('.pagination__container').innerHTML = paginationMarkup;
};

document.querySelector('.pagination__container').addEventListener('click', e => {
  if (e.target.tagName === 'SPAN' && e.target.textContent != '…') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    const promisePreload = showPreloader();
    getDataServer(sendParam.keyword, sendParam.countryCode, +e.target.textContent - 1)
      .then(data => {
        return promisePreload;
      })
      .then(preloadNode => preloadNode.remove());
  }
});
