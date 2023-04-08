const getFeedData = (document) => {
  const feedData = {
    title: document.querySelector('title').textContent,
    description: document.querySelector('description').textContent,
  };
  return feedData;
};

const getPostData = (document) => {
  const items = document.querySelectorAll('item');
  const postData = [];
  items.forEach((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    postData.push(post);
  });
  return postData;
};

export default (response) => {
  const parser = new DOMParser();
  const parsedXml = parser.parseFromString(response.data.contents, 'application/xml');
  if (parsedXml.querySelector('parsererror')) {
    const error = new Error();
    error.name = 'parsingError';
    throw error;
  }
  return {
    feed: getFeedData(parsedXml),
    posts: getPostData(parsedXml),
  };
};
