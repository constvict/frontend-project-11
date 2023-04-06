import onChange from 'on-change';

export default (state, elements, i18n) => onChange(state, (path, value) => {
  if (path === 'form.error' && value === 'invalidURL') {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = i18n.t('messages.errors.invalidURL');
    elements.form.reset();
    elements.input.focus();
  }

  if (path === 'form.error' && value === 'alreadyExists') {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = i18n.t('messages.errors.alreadyExists');
    elements.form.reset();
    elements.input.focus();
  }

  if (path === 'form.validURL') {
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.input.classList.remove('is-invalid');
    elements.feedback.textContent = i18n.t('messages.success');
    elements.form.reset();
    elements.input.focus();
  }
});
