import * as yup from 'yup';
import watcher from './view.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const initalState = {
    form: {
      valid: false,
      validURL: [],
      error: null,
    },
  };

  const state = watcher(initalState, elements);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputValue = formData.get('url').trim();
    const schema = yup.string().required().url('invalid').notOneOf(state.form.validURL, 'exists');
    schema.validate(inputValue).then(() => {
      state.form.validURL.push(inputValue);
      state.form.valid = true;
      state.form.error = null;
    })
      .catch((e) => {
        state.form.error = e.message;
        state.form.valid = false;
      });
  });
};
