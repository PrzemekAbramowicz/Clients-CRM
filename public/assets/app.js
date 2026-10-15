'use strict';

const rows = [...document.querySelectorAll('.client-row')];
const today = new Date();
today.setHours(0, 0, 0, 0);
const weekEnd = new Date(today);
weekEnd.setDate(weekEnd.getDate() + 7);
let overdue = 0;
let upcoming = 0;
for (const row of rows) {
  const name = row.dataset.name;
  row.querySelector('.client-avatar').textContent = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const date = row.dataset.date ? new Date(`${row.dataset.date}T00:00:00`) : null;
  const validDate = date && !Number.isNaN(date.getTime());
  const status = validDate ? (date < today ? 'overdue' : 'upcoming') : 'none';
  row.dataset.status = status;
  if (status === 'overdue') overdue++;
  if (validDate && date >= today && date < weekEnd) upcoming++;
  const badge = row.querySelector('.status-badge');
  badge.textContent = { overdue: 'Po terminie', upcoming: 'Zaplanowany', none: 'Bez terminu' }[
    status
  ];
  badge.classList.add(status);
  if (validDate)
    row.querySelector('.contact-date').textContent = date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
}
if (document.querySelector('#week-count')) {
  document.querySelector('#week-count').textContent = upcoming;
  document.querySelector('#overdue-count').textContent = overdue;
}
const search = document.querySelector('#client-search');
const filter = document.querySelector('#status-filter');
function filterClients() {
  const query = search.value.trim().toLocaleLowerCase('pl');
  let visible = 0;
  for (const row of rows) {
    const matchesText = `${row.dataset.name} ${row.dataset.mail}`
      .toLocaleLowerCase('pl')
      .includes(query);
    row.hidden = !matchesText || (filter.value !== 'all' && row.dataset.status !== filter.value);
    if (!row.hidden) visible++;
  }
  document.querySelector('#results-count').textContent =
    `Wyświetlono ${visible} z ${rows.length} klientów`;
  document.querySelector('#empty-state').hidden = visible !== 0;
  document.querySelector('#empty-state h3').textContent = rows.length
    ? 'Nie znaleziono klientów'
    : 'Jeszcze nic tu nie ma';
  document.querySelector('#empty-description').textContent = rows.length
    ? 'Spróbuj innego imienia, adresu e-mail lub zmień filtr.'
    : 'Dodaj pierwszego klienta i zacznij budować relacje.';
}
search?.addEventListener('input', filterClients);
filter?.addEventListener('change', filterClients);
if (search) filterClients();
for (const form of document.querySelectorAll('[data-confirm]')) {
  form.addEventListener('submit', (event) => {
    if (!window.confirm(form.dataset.confirm)) event.preventDefault();
  });
}
for (const link of document.querySelectorAll('.nav-item')) {
  const active =
    location.pathname === '/client/form/add'
      ? link.pathname === '/client/form/add'
      : link.pathname === '/client';
  link.classList.toggle('active', active);
  if (active) link.setAttribute('aria-current', 'page');
}
