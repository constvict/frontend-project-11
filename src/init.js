import * as yup from 'yup';
import i18next from 'i18next';
import watcher from './view.js';
import resources from './locales/index.js';

const i18n = i18next.createInstance();

i18n.init({
  lng: 'ru',
  debug: false,
  resources,
});

export default () => {
  yup.setLocale({
    string: {
      url: i18n.t('invalidURL'),
    },
    mixed: {
      notOneOf: i18n.t('alreadyExists'),
    },
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const initalState = {
    form: {
      valid: true,
      validURL: [],
      error: null,
    },
  };

  const state = watcher(initalState, elements, i18n);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputValue = formData.get('url').trim();
    const schema = yup.string().required().url().notOneOf(state.form.validURL);
    schema.validate(inputValue)
      .then(() => {
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
