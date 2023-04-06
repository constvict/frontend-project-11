import onChange from 'on-change';

export default (state, elements) => onChange(state, (path, value) => {
  if (path === 'form.error' && value === 'invalid') {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = 'Ссылка должна быть валидным URL';
    elements.form.reset();
    elements.input.focus();
  }
  if (path === 'form.error' && value === 'exists') {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = 'RSS уже существует';
    elements.form.reset();
    elements.input.focus();
  }

  if (path === 'form.validURL') {
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.input.classList.remove('is-invalid');
    elements.feedback.textContent = 'RSS успешно загружен';
    elements.form.reset();
    elements.input.focus();
  }
});
