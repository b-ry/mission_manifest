import { getRelativeDayString, getTimeRemaining, applyStatusClass } from './utils.js';

const overlay = document.querySelector('.c-drawer__overlay');
const drawerPanel = document.querySelector('#c-drawer-dialog');
const drawerContent = document.querySelector('.c-drawer__content');
const closeBtn = document.querySelector('.c-drawer__close');

let triggerButton = null;

closeBtn.addEventListener('click', closeDrawer);

// Escape key closes drawer
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer.classList.contains('is-expanded')) {
    closeDrawer();
  }
});

// Closes drawer when clicking outside of drawer
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeDrawer();
});

function getFocusableElements() {
  return [...drawerPanel.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )];
} 

function handleFocusTrap(e) {
  if (e.key !== 'Tab') return;
  const focusable = getFocusableElements();
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function closeDrawer() {
  overlay.classList.remove('is-expanded');
  drawerPanel.removeEventListener('keydown', handleFocusTrap);
  document.querySelectorAll('.c-card.is-expanded').forEach(c => {
    c.classList.remove('is-expanded');
    c.querySelector('.c-card__more-button').setAttribute('aria-expanded', 'false');
  });
  if (triggerButton) {
    triggerButton.focus();
    triggerButton = null;
  }
}


export async function openDrawer(item, trigger) {
  triggerButton = trigger ?? null;
  drawerContent.innerHTML = '<div class="spinner-wrapper" aria-hidden="true"><div class="spinner"></div></div>';
  overlay.classList.add('is-expanded');

  // Move focus to close button so screen readers announce the dialog
  closeBtn.focus();
  drawerPanel.addEventListener('keydown', handleFocusTrap);

   // Fetch full rocket configuration details
  let rocketData = null;

  try {
    const rocketRes = await fetch(item.rocket.configuration.url);
    if (rocketRes.ok) rocketData = await rocketRes.json();
  } catch (e) {
    console.error('Failed to fetch rocket data:', e);
  } 

  const totalLaunches = rocketData?.total_launch_count ?? item.rocket.configuration.total_launch_count ?? '--';
  const isReusable = rocketData?.reusable ?? item.rocket.configuration.reusable;
  const boosterFlights = item.rocket.launcher_stage?.[0]?.launcher?.flights ?? '--';

  drawerContent.innerHTML = `
    <div class="c-drawer__image-wrapper">
      <div class="c-drawer__image">
        <img src="${item.pad.image?.image_url ?? item.image?.image_url ?? ''}" alt="${item.pad.image?.name ?? item.image?.name ?? ''}" width="100%"/>
        <div class="c-drawer__image-overlay"></div>
      </div>
      <div class="c-drawer__title-group">
        <p class="c-drawer__title-brow">${item.mission?.type ?? ''}</p>
        <h3 id="drawer-mission-name" class="c-drawer__mission-name">${item.mission?.name ?? ''}</h3>
      </div>
    </div>
    <div class="c-drawer__container">
      <div class="c-drawer__time-date">
        <p class="c-drawer__status">${item.status.abbrev}</p>
        <time class="c-drawer__countdown-date" datetime="${item.net}">
          <span aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. --><path fill="currentColor" d="M464 256a208 208 0 1 1 -416 0 208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0 256 256 0 1 0 -512 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
          </span>
          ${getRelativeDayString(item.net)}
        </time>
        ${getTimeRemaining(item.net)}
      </div>
    

      <div class="c-drawer__section">
        <div class="c-drawer__section-group">
          ${item.program?.[0]?.mission_patches?.[0]?.image_url ? `<div class="c-card__drawer-patch"><img src="${item.program[0].mission_patches[0].image_url}" alt="Mission patch"/></div>` : ''}
          <div class="group">
            <h4>Mission</h4>
            <p class="c-drawer__body">${item.mission?.description ?? ''}</p>
          </div>
        </div>
        <span class="border-1"></span>
      </div>

      <div class="c-drawer__section border-1">
        <h4>Vehicle</h4>
        <h5 class="c-drawer__title">${item.rocket.configuration.full_name}</h5>
        <p class="c-drawer__subtitle">${item.rocket.configuration.variant ?? ''}</p>

        
        <div class="c-drawer__rocket-details">
          <div class="c-drawer_sub-section">
            <p class="c-drawer__rocket-details-number">${totalLaunches}</p>
            <p class="c-drawer__rocket-details-flights">Total flights</p>
          </div>
          <div class="c-drawer_sub-section">
            <p class="c-drawer__rocket-details-number">${boosterFlights}</p>
            <p class="c-drawer__rocket-details-flights">Booster flights</p>
          </div>
          <div class="c-drawer_sub-section">
            <p class="c-drawer__rocket-details-number">${isReusable ? 'Yes' : 'No'}</p>
            <p class="c-drawer__rocket-details-flights">Reusable</p>
          </div>
        </div>
      </div>

      <div class="c-drawer__section border-1">
        <h4>Provider</h4>
        <h5 class="c-drawer__title">${item.launch_service_provider.name}</h5>
        <p class="c-drawer__subtitle">${item.launch_service_provider.type.name} &middot; ${item.pad.country.name}</p>
      </div>

      <div class="c-drawer__section">
        <h4>Launch Site</h4>
        <h5 class="c-drawer__title">${item.pad.name}</h5>
        <p class="c-drawer__subtitle">${item.pad.location.name}</p>
        <div class="c-drawer__map">
          <img src="${item.pad.map_image}" alt="${item.pad.name} launch site map" />
        </div>
      </div>
    </div>
  `;

  // Status class on drawer
  applyStatusClass(drawerContent.querySelector('.c-drawer__status'), item.status.abbrev);
}
