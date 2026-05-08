import { Auth } from './data.js';

document.addEventListener('DOMContentLoaded', async function() {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  await loadUserData();

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => Auth.logout());

  // Stub other things for now, user can update them later
  const saveChangesBtn = document.getElementById('saveChangesBtn');
  if (saveChangesBtn) saveChangesBtn.addEventListener('click', () => alert('Update profile coming soon!'));
});

async function loadUserData() {
  try {
    const payload = JSON.parse(atob(localStorage.getItem('se_token').split('.')[1]));
    document.getElementById('display-name').textContent = payload.username;
    document.getElementById('display-email').textContent = payload.email;
    document.getElementById('name').value = payload.username;
    document.getElementById('email').value = payload.email;
  } catch (e) {
    console.error('Error decoding token', e);
  }
}

window.toggleEdit = function(fieldId) {
  const input = document.getElementById(fieldId);
  input.disabled = !input.disabled;
  if (!input.disabled) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}