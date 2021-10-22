import sprite from '../img/sprite.svg';

export const showData = data =>
  new Promise(res => {
    let cur = 0;
    let counter = 0;
    const markUp = data.map(events => {
      let embedded = '';
      if (!events._embedded) {
        embedded = events.place.address.line1;
      }

      if (events._embedded)
        if (events._embedded.venues[0].name) {
          embedded = events._embedded.venues[0].name;
        } else {
          embedded = events._embedded.venues[0].address.line1;
        }

      const markupOneCard = `<li class="events__item" id = ${events.id} data-modal-open>
        <a href="" class="link events__link">
           <div class="events__image-wrap">
              <picture>
                 <img src="${events.images[3].url}" alt="" title="" class="events__image"  />
              </picture>
           </div>
           <div class="events__descr" >

              <h3 class="events__name">${events.name}</h3>
              <p class="events__date">${events.dates.start.localDate}</p>
              <a class="events__location"  href="">

              <svg class="modal__icon" width="29" height="19">
              <use href="${sprite}#icon-location" style="fill:#fff"></use>
          </svg>
                 ${embedded}
               </a>
           </div>
        </a>
     </li>`;

      setTimeout(() => {
        document.querySelector('.events__list').insertAdjacentHTML('beforeend', markupOneCard);
        if (++cur >= data.length) res();
      }, ++counter * 150);
    });
  });
