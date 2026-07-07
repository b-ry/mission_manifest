// const spinnerWrapper = document.querySelector('.spinner-wrapper');

// async function getLaunches() {
//   const base = 'https://lldev.thespacedevs.com/2.3.0/launches';
//   spinnerWrapper.classList.remove('hidden');
//   spinnerWrapper.setAttribute('aria-hidden', 'false');
  
//   try {
//     const [upcomingRes, previousRes] = await Promise.all([
//       fetch(`${base}/upcoming/?limit=50`),
//       fetch(`${base}/previous/?limit=50`)
//     ]);
    
//     // Check if the response is successful
//     if (!upcomingRes.ok || !previousRes.ok) {
//       throw new Error('HTTP Error');
//     }

//     const [upcomingData, previousData] = await Promise.all([
//       upcomingRes.json(),
//       previousRes.json()
//     ]);

//     const now = new Date();
//     card(upcomingData.results.filter(item => new Date(item.net) > now), ".l-upcoming");
//     card(previousData.results.filter(item => new Date(item.net) <= now), ".l-previous");
//     console.log(upcomingData.results);

//   } catch (error) {
//     console.error('Failed to fetch space data:', error);

//   } finally {
//     spinnerWrapper.classList.add('hidden');
//     spinnerWrapper.setAttribute('aria-hidden', 'true');
//   }
// }

// getLaunches();

// // Date function
// function getRelativeDayString(targetDateString) {
//   //Parse dates and strip hours to compare calendar days only
//   const targetDate = new Date(targetDateString);
//   const today = new Date();

//   const timeString = new Intl.DateTimeFormat('en-US', {
//     hour: 'numeric',
//     minute: '2-digit',
//   }).format(targetDate);
  
//   const targetDay = new Date(targetDate).setHours(0, 0, 0, 0);
//   const todayDay = new Date(today).setHours(0, 0, 0, 0);

//   // Calculate the difference in days
//   const msPerDay = 24 * 60 * 60 * 1000;
//   const diffDays = Math.round((targetDate - today) / msPerDay);

//   // Handle 'today', 'yesterday', 'tomorrow' automatically
//   if (Math.abs(diffDays) <= 1) {
//     const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
//     const relativeDay = rtf.format(diffDays, 'day'); // Returns "today", "yesterday", or "tomorrow"

//     // Capitalize first letter
//     const capitalizeDay = relativeDay.charAt(0).toUpperCase() + relativeDay.slice(1);
//     return `${capitalizeDay}, ${timeString}`;
//   }

//   const absoluteDate = new Intl.DateTimeFormat('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//     timeZoneName: 'short'
//   }).format(targetDate);

//   return `${absoluteDate}, ${timeString}`;
// };

// // Count down timer function
// function getTimeRemaining(targetDateString) {
//   const diff = new Date(targetDateString) - Date.now();
//   if (diff <= 0) return null;

//   return {
//     days: Math.floor(diff / (1000 * 60 * 60 * 24)),
//     hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//     mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
//     seconds: Math.floor((diff % (1000 * 60)) / 1000)
//   }
// }

// function applyStatusClass(el, abbrev) {
//   if (!el) return;
//   if (abbrev === 'Go') el.classList.add('go');
//   else if (abbrev === 'TBD') el.classList.add('tbd');
//   else if (abbrev === 'TBC') el.classList.add('tbc');
// }

function card(itemsArray, containerSelector) {
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
        <button class="c-card__more-button button btn-primary" aria-haspopup="true" aria-controls="more-dropdown" aria-expanded="false">
          View Details
          <span aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
          </span>
          </button>
      </div>
    `;

    container.appendChild(card);

    button.addEventListener('click', async () => {
      const isExpanded = card.classList.contains('is-expanded');

      //Reset all cards
      document.querySelectorAll('.c-card.is-expanded').forEach(c => {
        c.classList.remove('is-expanded');
        c.querySelector('.c-card__more-button').setAttribute('aria-expanded', 'false');
      });

      if (isExpanded) {
        drawer.classList.remove('is-expanded');
        return;
      }

      const button = card.querySelector('.c-card__more-button');

      // mark this card open
      card.classList.add('is-expanded');
      button.setAttribute('aria-expanded', 'true');
      

    //   drawerContent.innerHTML = '<div class="spinner-wrapper"  aria-hidden="true"><div class="spinner"></div></div>';
    //   drawer.classList.add('is-expanded');

    //   // Fetch full rocket configuration details
    //   let rocketData = null;

    //   try {
    //     const rocketRes = await fetch(item.rocket.configuration.url);
    //     if (rocketRes.ok) rocketData = await rocketRes.json();
    //   } catch (e) {
    //     console.error('Failed to fetch rocket data:', e);
    //   } 

    //   const totalLaunches = rocketData?.total_launch_count ?? item.rocket.configuration.total_launch_count ?? '--';
    //   const isReusable = rocketData?.reusable ?? item.rocket.configuration.reusable;
    //   const boosterFlights = item.rocket.launcher_stage?.[0]?.launcher?.flights ?? '--';

    //   const button = card.querySelector('.c-card__more-button');
    //   const drawer = document.querySelector('.c-drawer__overlay');
    //   const drawerContent = document.querySelector('.c-drawer__content');
    //   const drawerClose = document.querySelector('.c-drawer__close');

    //   drawerClose.addEventListener('click', () => {
    //     drawer.classList.remove('is-expanded');
    //     document.querySelectorAll('.c-card.is-expanded').forEach(c => {
    //       c.classList.remove('is-expanded');
    //       c.querySelector('.c-card__more-button').setAttribute('aria-expanded', 'false');
    //     });
    //   });

    //   drawerContent.innerHTML = `
    //     <div class="c-drawer__image-wrapper">
    //       <div class="c-drawer__image">
    //         <img src="${item.pad.image?.image_url ?? item.image?.image_url ?? ''}" alt="${item.pad.image?.name ?? item.image?.name ?? ''}" width="100%"/>
    //         <div class="c-drawer__image-overlay"></div>
    //       </div>
    //       <div class="c-drawer__title-group">
    //         <p class="c-drawer__title-brow">${item.mission?.type ?? ''}</p>
    //         <h3 class="c-drawer__mission-name">${item.mission?.name ?? ''}</h3>
    //       </div>
    //     </div>
    //     <div class="c-drawer__container">
    //       <div class="c-drawer__time-date">
    //         <p class="c-drawer__status">${item.status.abbrev}</p>
    //         <time class="c-drawer__countdown-date" datetime="${item.net}">
    //           <span aria-hidden="true">
    //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. --><path fill="currentColor" d="M464 256a208 208 0 1 1 -416 0 208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0 256 256 0 1 0 -512 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
    //           </span>
    //           ${getRelativeDayString(item.net)}
    //         </time>
    //       </div>
        

    //       <div class="c-drawer__section">
    //         <div class="c-drawer__section-group">
    //           ${item.program?.[0]?.mission_patches?.[0]?.image_url ? `<div class="c-card__drawer-patch"><img src="${item.program[0].mission_patches[0].image_url}" alt="Mission patch"/></div>` : ''}
    //           <div class="group">
    //             <h4>Mission</h4>
    //             <p class="c-drawer__body">${item.mission?.description ?? ''}</p>
    //           </div>
    //         </div>
    //         <span class="border-1"></span>
    //       </div>

    //       <div class="c-drawer__section border-1">
    //         <h4>Vehicle</h4>
    //         <h5 class="c-drawer__title">${item.rocket.configuration.full_name}</h5>
    //         <p class="c-drawer__subtitle">${item.rocket.configuration.variant ?? ''}</p>

            
    //         <div class="c-drawer__rocket-details">
    //           <div class="c-drawer_sub-section">
    //             <p class="c-drawer__rocket-details-number">${totalLaunches}</p>
    //             <p class="c-drawer__rocket-details-flights">Total flights</p>
    //           </div>
    //           <div class="c-drawer_sub-section">
    //             <p class="c-drawer__rocket-details-number">${boosterFlights}</p>
    //             <p class="c-drawer__rocket-details-flights">Booster flights</p>
    //           </div>
    //           <div class="c-drawer_sub-section">
    //             <p class="c-drawer__rocket-details-number">${isReusable ? 'Yes' : 'No'}</p>
    //             <p class="c-drawer__rocket-details-flights">Reusable</p>
    //           </div>
    //         </div>
    //       </div>

    //       <div class="c-drawer__section border-1">
    //         <h4>Provider</h4>
    //         <h5 class="c-drawer__title">${item.launch_service_provider.name}</h5>
    //         <p class="c-drawer__subtitle">${item.launch_service_provider.type.name} &middot; ${item.pad.country.name}</p>
    //       </div>

    //       <div class="c-drawer__section">
    //         <h4>Launch Site</h4>
    //         <h5 class="c-drawer__title">${item.pad.name}</h5>
    //         <p class="c-drawer__subtitle">${item.pad.location.name}</p>
    //         <div class="c-drawer__map">
    //           <img src="${item.pad.map_image}" />
    //         </div>
    //       </div>
    //     </div>
    //   `;

    //   // Status class on drawer
    //   applyStatusClass(drawerContent.querySelector('.c-drawer__status'), item.status.abbrev);
    // });

    
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

// // Search
// function runSearch() {
//   const input = document.querySelector('input[type="text"]');
//   const term = input.value.trim().toLowerCase();
//   const activeSection = document.querySelector('.l-upcoming:not([hidden]), .l-previous:not([hidden])');
//   const allCards = activeSection.querySelectorAll('.c-card');
//   const showMore = activeSection.querySelector('.show-more');

//   if( term === '') {
//     allCards.forEach((card, i) => card.classList.toggle('is-hidden', i >= 3));
//     showMore.hidden = false;
//     return;
//   }

//   showMore.hidden = true;
//   allCards.forEach(card => {
//     const title = card.querySelector('.c-card__mission-name').textContent.trim().toLowerCase();
//     card.classList.toggle('is-hidden', !title.includes(term));
//   });
// }

// // Search submit
// const searchBtn = document.querySelector('.c-search-bar__submit');
// searchBtn.addEventListener('click', runSearch);

// const headerTitle = document.querySelector('.c-header__brow .c-header__title');
// const pastBtn = document.querySelector('.toggle-button .past');
// const upcomingBtn = document.querySelector('.toggle-button .upcoming');

// // Swithces upcoming to passed and back.
// document.querySelectorAll('[data-target]').forEach(btn => {
//   btn.addEventListener('click', () => {
//     document.querySelectorAll('.l-upcoming, .l-previous').forEach(el => el.hidden = true);
//     document.querySelector(btn.dataset.target).hidden = false;
//     headerTitle.textContent = btn.dataset.target === '.l-upcoming' ? 'Live - Upcoming Launches' : 'Past Launches';
//     upcomingBtn.classList.toggle('active', btn.dataset.target === '.l-upcoming');
//     pastBtn.classList.toggle('active', btn.dataset.target === '.l-previous');
//     runSearch();
//   });
// });

// const searchInput = document.querySelector('.c-search-bar__keyword');
// const close = document.querySelector('.c-search-bar__clear');
// close.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. --><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>`;

// close.classList.add("hidden");

// close.addEventListener('click', () => {
//   searchInput.value = '';
//   close.classList.add("hidden");
//   runSearch();
// });

// searchInput.addEventListener('input', () => {
//   close.classList.toggle('hidden', searchInput.value === '');
// });