import { card } from './card.js';

const spinnerWrapper = document.querySelector('.spinner-wrapper');
const loadingAnnouncer = document.getElementById('loading-announcer');

export async function getLaunches() {
  const base = 'https://lldev.thespacedevs.com/2.3.0/launches';
  spinnerWrapper.classList.remove('hidden');
  loadingAnnouncer.textContent = 'Loading launches, please wait.';

  try {
    const [upcomingRes, previousRes] = await Promise.all([
      fetch(`${base}/upcoming/?limit=50`),
      fetch(`${base}/previous/?limit=50`)
    ]);
    
    // Check if the response is successful
    if (!upcomingRes.ok || !previousRes.ok) {
      throw new Error('HTTP Error');
    }

    const [upcomingData, previousData] = await Promise.all([
      upcomingRes.json(),
      previousRes.json()
    ]);

    const now = new Date();
    card(upcomingData.results.filter(item => new Date(item.net) > now), '.l-upcoming');
    card(previousData.results.filter(item => new Date(item.net) <= now), '.l-previous');
    console.log(upcomingData.results);

  } catch (error) {
    console.error('Failed to fetch space data:', error);

  } finally {
    spinnerWrapper.classList.add('hidden');
    loadingAnnouncer.textContent = 'Launches loaded.';
  }
}
