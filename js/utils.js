
// Date function
export function getRelativeDayString(targetDateString) {
  //Parse dates and strip hours to compare calendar days only
  const targetDate = new Date(targetDateString);
  const today = new Date();

  const timeString = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(targetDate);
  
  const targetDay = new Date(targetDate).setHours(0, 0, 0, 0);
  const todayDay = new Date(today).setHours(0, 0, 0, 0);

  // Calculate the difference in days
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((targetDate - today) / msPerDay);

  // Handle 'today', 'yesterday', 'tomorrow' automatically
  if (Math.abs(diffDays) <= 1) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const relativeDay = rtf.format(diffDays, 'day'); // Returns "today", "yesterday", or "tomorrow"

    // Capitalize first letter
    const capitalizeDay = relativeDay.charAt(0).toUpperCase() + relativeDay.slice(1);
    return `${capitalizeDay}, ${timeString}`;
  }

  const absoluteDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZoneName: 'short'
  }).format(targetDate);

  return `${absoluteDate}, ${timeString}`;
};

// Count down timer function
export function getTimeRemaining(targetDateString) {
  const diff = new Date(targetDateString) - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

export function applyStatusClass(el, abbrev) {
  if (!el) return;
  if (abbrev === 'Go') el.classList.add('go');
  else if (abbrev === 'TBD') el.classList.add('tbd');
  else if (abbrev === 'TBC') el.classList.add('tbc');
}