// press Ctrl Key to show 'rest-docs-current-content-detail-box'
window.addEventListener('keydown', ({ ctrlKey }) => {
  if (!ctrlKey) {
    return;
  }

  const detailElement = document.getElementById(
    'rest-docs-current-content-detail-box'
  );

  if (!detailElement) {
    return;
  }
  detailElement.classList.add('show');
});

window.addEventListener('keyup', ({ ctrlKey }) => {
  if (ctrlKey) {
    return;
  }

  const detailElement = document.getElementById(
    'rest-docs-current-content-detail-box'
  );

  if (!detailElement) {
    return;
  }
  detailElement.classList.remove('show');
});
