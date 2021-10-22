export const showPreloader = () => {
  const preloadNode = document.createElement('div');
  preloadNode.classList.add('preloader');
  document.body.insertAdjacentElement('beforeend', preloadNode);
  return Promise.resolve(preloadNode);
};
