for (const btn of document.querySelectorAll('.heart')) {
    btn.addEventListener('click', event => {
      event.currentTarget.classList.toggle('is-active');
    });
}


