import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { differenceBy, uniqueId } from 'lodash';
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
    modal: document.querySelector('#modal'),
  };

  const initalState = {
    form: {
      processState: '',
      processError: null,
    },
    uiState: {
      viewedPostsIds: [],
      currentPostId: '',
    },
    feeds: [],
    posts: [],
  };

  const state = watcher(initalState, elements, i18n);

  const handleSubmit = (event) => {
    event.preventDefault();

    state.form.processState = 'request';
    state.form.processError = null;

    const formData = new FormData(event.target);
    const url = formData.get('url').trim();
    const schema = yup
      .string()
      .required()
      .url()
      .notOneOf(state.feeds.map((feed) => feed.link));

    schema.validate(url, { abortEarly: false }).then(() => {
      const proxyLink = proxy(url);
      axios
        .get(proxyLink)
        .then((response) => {
          const { feed, posts } = domParser(response);

          feed.id = uniqueId();
          feed.link = url;
          addPostsId(posts, feed.id);

          state.feeds.unshift(feed);
          state.posts.unshift(...posts);

          state.form.processState = 'response';
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

  const handleClick = (event) => {
    const targetId = event.target.dataset.id;
    if (targetId) {
      state.uiState.viewedPostsIds.push(targetId);
      state.uiState.currentPostId = targetId;
    }
  };

  const checkUpdates = () => {
    const promises = state.feeds.map(({ link, id }) => {
      const promise = axios.get(proxy(link));
      return promise
        .then((response) => {
          const { posts } = domParser(response);

          const newPosts = differenceBy(posts, state.posts, 'link');
          addPostsId(newPosts, id);
          state.posts = newPosts.concat(state.posts);
        })
        .catch(() => {
          state.form.processState = 'error';
          state.form.processError = 'updateError';
        });
    });
    Promise.all(promises).finally(() => setTimeout(() => checkUpdates(), 5000000));
  };

  elements.form.addEventListener('submit', handleSubmit);
  elements.posts.addEventListener('click', handleClick);
  checkUpdates();
};
