import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { getPhoto } from "./api";


const form = document.querySelector('.search-form');
const btn = document.querySelector('button');
const photoCard = document.querySelector('.gallery');
const load = document.querySelector('.load-btn');



const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
});
 
let currentPage = 1;
let maxPages;
let firstSearch = true;
let searchQuery = "";

load.style.display = 'none';


form.addEventListener('submit', sendForm);


async function sendForm(evt) {
  evt.preventDefault();

 load.style.display = 'none';

  photoCard.innerHTML = '';

 lightbox.refresh();

  searchQuery = form.elements.searchQuery.value;
  currentPage = 1;
  
 Notiflix.Loading.arrows('Loading...');

  
  // getPhoto(searchQuery, currentPage).then(responce => createMarkup(responce.hits));

  try {
    const { totalHits, hits } = await getPhoto(searchQuery, currentPage);

    Notiflix.Loading.remove();

    maxPages = Math.ceil(totalHits / 40);

    if (totalHits === 0 || searchQuery.trim() === '') {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      if (!firstSearch) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
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

function createMarkup(images) {
    
  const photosArray = images.map(
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
    photoCard.insertAdjacentHTML('beforeend', photosArray.join(''));
    
  lightbox.refresh(); // оновлюе слухачів на зоображе
  
}

load.addEventListener('click', loadMore);



async function loadMore(evt) {
  evt.preventDefault();
  currentPage += 1;

  if (currentPage > maxPages) {
   load.style.display = 'none';
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    Notiflix.Loading.circle('Searching...');
    try {
      const images = await getPhoto(searchQuery, currentPage);

      Notiflix.Loading.remove();

      gallery.insertAdjacentHTML('beforeend', createMarkup(images.hits));

      lightbox.refresh();
    } catch (error) {
      Notiflix.Loading.remove();

      Notiflix.Notify.failure(error.message);
    }
  }
}