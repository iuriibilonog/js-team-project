// MODAL TEAM

(() => {
  const refs = {
    openModalBtn: document.querySelector('[data-modal-team-open]'),
    closeModalBtn: document.querySelector('[data-modal-team-close]'),
    closeModalBody: document.querySelector('.backdrop-team'),
    modal: document.querySelector('[data-modal-team]'),
  };
  refs.openModalBtn.addEventListener('click', toggleModal);
  refs.closeModalBtn.addEventListener('click', toggleModal);
  refs.closeModalBody.addEventListener('click', function (e) {
    if (e.target == document.querySelector('.backdrop-team')) {
      toggleModal();
    }
  });
  function toggleModal() {
    refs.modal.classList.toggle('is-hidden-team');
  }
}
)();