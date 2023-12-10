import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { getPhoto } from './api';

const form = document.querySelector('.search-form');
const btn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const load = document.querySelector('.load-btn');

load.style.display = 'none';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

let currentPage = 1;
let maxPages;
let firstSearch = true;

let currentQuery = '';

form.addEventListener('submit', sendForm);

// function sendForm(evt) {
//     evt.preventDefault();
//     page = 1;
//     photoCard.innerHTML = '';
//   currentQuery = evt.currentTarget.searchQuery.value;

//    getPhoto(page, currentQuery).then(responce => createMarkup(responce.hits));

// }

async function sendForm(evt) {
  evt.preventDefault();

  // load.style.display = 'none';
  currentPage = 1;

  gallery.innerHTML = '';

  lightbox.refresh();

  currentQuery = evt.currentTarget.searchQuery.value;

  // getPhoto(currentPage, currentQuery).then(responce =>
  //   createMarkup(responce.hits)
  // );

  try {
    const { totalHits, hits } = await getPhoto(currentPage, currentQuery);

    Notiflix.Loading.remove();

    maxPages = Math.ceil(totalHits / 40);

    if (totalHits === 0 || currentQuery.trim() === '') {
      Notify.warning('Please, fill the main field');
      return;
      // Notiflix.Notify.warning(
      //   'Sorry, there are no images matching your search query. Please try again.'
      // );
    } else {
      gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      //if (!firstSearch) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      //}
      lightbox.refresh();

      if (currentPage < maxPages) {
        load.style.display = '';
      }
    }
  } catch (error) {
    Notiflix.Loading.remove();

    Notiflix.Notify.failure(error.message);
  }
  firstSearch = false;
}

function createMarkup(data) {
  const photosArray = data.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card"><a class="gallery_link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a><div class="info"><p class="info-item"><b>Likes: ${likes}</b></p><p class="info-item"><b>Views: ${views}</b></p><p class="info-item"><b>Comments: ${comments}</b></p><p class="info-item"><b>Downloads: ${downloads}</b></p></div></div>`;
    }
  );
  //gallery.insertAdjacentHTML('beforeend', photosArray.join(''));

  //lightbox.refresh(); // оновлюе слухачів на зоображе
  return photosArray;
}

load.addEventListener('click', loadMore);

async function loadMore(evt) {
  evt.preventDefault();
  currentPage += 1;
  const searchQuery = document.querySelector('input[name="searchQuery"]');
  currentQuery = searchQuery.value;
  if (currentPage > maxPages) {
    load.style.display = 'none';
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    Notiflix.Loading.circle('Searching...');
    try {
      const images = await getPhoto(currentPage, currentQuery);

      Notiflix.Loading.remove();

      gallery.insertAdjacentHTML('beforeend', createMarkup(images.hits));

      lightbox.refresh();
    } catch (error) {
      Notiflix.Loading.remove();

      Notiflix.Notify.failure(error.message);
    }
  }
}
