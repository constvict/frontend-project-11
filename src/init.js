import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import watcher from './view.js';
import resources from './locales/index.js';
import domParser from './parser.js';

const i18n = i18next.createInstance();

i18n.init({
  lng: 'ru',
  debug: false,
  resources,
});

const proxy = (link) => {
  const url = new URL('https://allorigins.hexlet.app/get');
  url.searchParams.set('disableCache', 'true');
  url.searchParams.set('url', link);
  return url;
};

const addPostsId = (posts, feedId) => {
  posts.forEach((post) => {
    post.feedId = feedId;
    post.id = uniqueId();
  });
};

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
    submitButton: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const initalState = {
    form: {
      processState: 'filling',
      processError: null,
    },
    feeds: [],
    posts: [],
    addedURLs: [],
  };

  const state = watcher(initalState, elements, i18n);

  const handleSubmit = (event) => {
    event.preventDefault();

    state.form.processState = 'sending';
    state.form.processError = null;

    const formData = new FormData(event.target);
    const inputValue = formData.get('url').trim();
    const schema = yup
      .string()
      .required()
      .url()
      .notOneOf(state.addedURLs);

    schema.validate(inputValue, { abortEarly: false }).then(() => {
      const proxyLink = proxy(inputValue);
      axios
        .get(proxyLink)
        .then((response) => {
          const { feed, posts } = domParser(response);
          feed.id = uniqueId();
          addPostsId(posts, feed.id);
          state.feeds.unshift(feed);
          state.posts.unshift(...posts);
          state.addedURLs.push(inputValue);
          state.form.processState = 'received';
          state.form.processError = null;
        })
        .catch((err) => {
          if (err.name === 'parsingError') {
            state.form.processState = 'error';
            state.form.processError = 'parsingError';
          } else {
            state.form.processState = 'error';
            state.form.processError = 'networkError';
          }
        });
    }).catch((err) => {
      state.form.processState = 'error';
      state.form.processError = err.message;
    });
  };

  elements.form.addEventListener('submit', handleSubmit);
};
