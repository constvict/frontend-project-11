import onChange from 'on-change';

const handleProcessState = (elements, processState, i18n) => {
  switch (processState) {
    case 'received':
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.input.classList.remove('is-invalid');
      elements.feedback.textContent = i18n.t('messages.success');
      elements.submitButton.disabled = false;
      elements.form.reset();
      elements.input.focus();
      break;
    case 'sending':
      elements.submitButton.disabled = true;
      break;
    case 'filling':
      elements.submitButton.textContent = false;
      break;
    case 'error':
      elements.submitButton.disabled = false;
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const handleProcessError = (elements, processError, i18n) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
  elements.input.classList.add('is-invalid');
  if (processError) {
    elements.feedback.textContent = i18n.t(`messages.errors.${processError}`);
  }
};

const renderFeeds = (elements, feeds, i18n) => {
  elements.feeds.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('ui.feeds');

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const liTitle = document.createElement('h3');
    liTitle.classList.add('h6', 'm-0');
    liTitle.textContent = feed.title;

    const liDescription = document.createElement('p');
    liDescription.classList.add('small', 'm-0', 'text-black-50');
    liDescription.textContent = feed.description;

    listItem.append(liTitle, liDescription);
    list.append(listItem);
  });

  cardBody.append(cardTitle);
  card.append(cardBody, list);

  elements.feeds.append(card);
};

const renderPosts = (elements, posts, i18n) => {
  elements.posts.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('ui.posts');

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const postLink = document.createElement('a');
    postLink.classList.add('fw-bold');
    postLink.setAttribute('href', post.link);
    postLink.setAttribute('data-id', post.id);
    postLink.setAttribute('target', '_blank');
    postLink.setAttribute('rel', 'noopener noreferrer');
    postLink.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.textContent = i18n.t('ui.button');
    listItem.append(postLink, button);
    list.append(listItem);
  });

  cardBody.append(cardTitle);
  card.append(cardBody, list);

  elements.posts.append(card);
};

export default (state, elements, i18n) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value, i18n);
      break;
    case 'form.processError':
      handleProcessError(elements, value, i18n);
      break;
    case 'feeds':
      renderFeeds(elements, value, i18n);
      break;
    case 'posts':
      renderPosts(elements, value, i18n);
      break;
    default:
      break;
  }
});
