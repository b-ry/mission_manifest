import { getRelativeDayString, getTimeRemaining, applyStatusClass } from './utils.js';
import { openDrawer, closeDrawer } from './drawer.js';

export function card(itemsArray, containerSelector) {
  const container = document.querySelector(`${containerSelector} .l-card-grid`);
  container.innerHTML = '';

  itemsArray.forEach(item => {
    const card = document.createElement('div');
    card.classList.add("c-card");

    card.innerHTML =  `
      <div class="c-card__image-wrapper">
        <div class="c-card__image">
          <img src="${item.pad.image?.image_url ?? item.image?.image_url ?? ''}" alt="${item.pad.image?.name ?? item.image?.name ?? ''}" width="100%"/>
          <div class="c-card__image-overlay"></div>
        </div>
        <p class="c-card__location">
          <span aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"/></svg>
          </span>
          ${item.pad.location.name}
        </p>
      </div>

      <div class="c-card__content">
        <div class="c-card__title-group">
          <h3 class="c-card__mission-name">${item.mission?.name}</h3>
        </div>
        <p class="c-card__agency-name">${item.launch_service_provider.name}</p>
        <div class="c-card__time-date">
          <p class="c-card__status">${item.status.abbrev}</p>
          <time class="c-card__countdown-date" datetime="${item.net}">
            <span aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M120 0c13.3 0 24 10.7 24 24l0 40 160 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-40c0-13.3 10.7-24 24-24zm0 112l-56 0c-8.8 0-16 7.2-16 16l0 48 352 0 0-48c0-8.8-7.2-16-16-16l-264 0zM48 224l0 192c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-192-352 0z"/></svg>
            </span>
            ${getRelativeDayString(item.net)}
          </time>
        </div>
        ${containerSelector === '.l-upcoming' ?`
        <div class="c-card__countdown-title">
          <h4 class="c-card__countdown-time">T-Minus</h4>
        </div>
        <div class="c-card__countdown">
          <div class="c-card__countdown-unit">
            <span class="c-card__countdown-value" data-unit="days">--</span>
            <span class="c-card__countdown-label">Days</span>
          </div>
          <div class="c-card__countdown-unit">
            <span class="c-card__countdown-value" data-unit="hours">--</span>
            <span class="c-card__countdown-label">Hours</span>
          </div>
          <div class="c-card__countdown-unit">
            <span class="c-card__countdown-value" data-unit="mins">--</span>
            <span class="c-card__countdown-label">Mins</span>
          </div>
          <div class="c-card__countdown-unit">
            <span class="c-card__countdown-value" data-unit="seconds">--</span>
            <span class="c-card__countdown-label">Secs</span>
          </div>
        </div>` : ''}
        <button class="c-card__more-button button btn-primary" aria-haspopup="dialog" aria-controls="c-drawer-dialog" aria-expanded="false">
          View Details
          <span aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
          </span>
          </button>
      </div>
    `;

    container.appendChild(card);

    const button = card.querySelector('.c-card__more-button');

    button.addEventListener('click', () => {
      const isExpanded = card.classList.contains('is-expanded');

      //Reset all cards
      document.querySelectorAll('.c-card.is-expanded').forEach(c => {
        c.classList.remove('is-expanded');
        c.querySelector('.c-card__more-button').setAttribute('aria-expanded', 'false');
      });

      if (isExpanded) {
        closeDrawer();
        return;
      }

      // mark this card open
      card.classList.add('is-expanded');
      button.setAttribute('aria-expanded', 'true');
      openDrawer(item, button);
    });
    
    // Status class on card
    applyStatusClass(card.querySelector('.c-card__status'), item.status.abbrev);


    // Countdown timer
    const interval = setInterval(() => {
      const time = getTimeRemaining(`${item.net}`);
      if (!time) { clearInterval(interval); return; }

      card.querySelector('[data-unit="days"]').textContent = String(time.days).padStart(2, '0');
      card.querySelector('[data-unit="hours"]').textContent = String(time.hours).padStart(2, '0');
      card.querySelector('[data-unit="mins"]').textContent = String(time.mins).padStart(2, '0');
      card.querySelector('[data-unit="seconds"]').textContent = String(time.seconds).padStart(2, '0');
    }, 1000);

  });

  // Setting card display to 3.
  container.querySelectorAll(".c-card").forEach((card, i) => {
    if (i >= 3) card.classList.add('is-hidden');
  });

  const showMoreBtn = document.querySelector(`${containerSelector} .show-more`);

  // Find the next 6 and display those. 
  showMoreBtn.addEventListener('click', () => {
    const hidden = container.querySelectorAll(".c-card.is-hidden");
    const batch = [...hidden].slice(0, 6);
    batch.forEach(card => {
      card.classList.remove('is-hidden');
      card.classList.add('is-visible');
    });
    if (hidden.length - batch.length === 0) showMoreBtn.classList.add('is-hidden');
  });
}
