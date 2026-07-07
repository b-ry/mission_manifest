// Search
function runSearch() {
  const input = document.querySelector('input[type="text"]');
  const term = input.value.trim().toLowerCase();
  const activeSection = document.querySelector('.l-upcoming:not([hidden]), .l-previous:not([hidden])');
  const allCards = activeSection.querySelectorAll('.c-card');
  const showMore = activeSection.querySelector('.show-more');

  if( term === '') {
    allCards.forEach((card, i) => card.classList.toggle('is-hidden', i >= 3));
    showMore.hidden = false;
    return;
  }

  showMore.hidden = true;
  allCards.forEach(card => {
    const title = card.querySelector('.c-card__mission-name').textContent.trim().toLowerCase();
    card.classList.toggle('is-hidden', !title.includes(term));
  });
}

// Search submit
const searchBtn = document.querySelector('.c-search-bar__submit');
searchBtn.addEventListener('click', runSearch);

// Allow Enter key to trigger search from the text input
document.querySelector('.c-search-bar__keyword').addEventListener('keydown', e => {
  if (e.key === 'Enter') runSearch();
});

const headerTitle = document.querySelector('.c-header__brow .c-header__title');
const pastBtn = document.querySelector('.toggle-button .past');
const upcomingBtn = document.querySelector('.toggle-button .upcoming');

// Switches upcoming to passed and back.
document.querySelectorAll('[data-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.l-upcoming, .l-previous').forEach(el => el.hidden = true);
    document.querySelector(btn.dataset.target).hidden = false;
    headerTitle.textContent = btn.dataset.target === '.l-upcoming' ? 'Live - Upcoming Launches' : 'Past Launches';
    upcomingBtn.classList.toggle('active', btn.dataset.target === '.l-upcoming');
    pastBtn.classList.toggle('active', btn.dataset.target === '.l-previous');
    upcomingBtn.setAttribute('aria-pressed', btn.dataset.target === '.l-upcoming' ? 'true' : 'false');
    pastBtn.setAttribute('aria-pressed', btn.dataset.target === '.l-previous' ? 'true' : 'false');
    runSearch();
  });
});

const searchInput = document.querySelector('.c-search-bar__keyword');
const close = document.querySelector('.c-search-bar__clear');
close.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. --><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>`;

close.classList.add("hidden");

close.addEventListener('click', () => {
  searchInput.value = '';
  close.classList.add("hidden");
  runSearch();
});

searchInput.addEventListener('input', () => {
  close.classList.toggle('hidden', searchInput.value === '');
});