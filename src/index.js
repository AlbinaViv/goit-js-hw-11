import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { getPhoto } from "./api";


const form = document.querySelector('.search-form');
const btn = document.querySelector('button');
const photoCard = document.querySelector('.gallery');

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
});
  
let page = 1;
let currentQuery = "";

form.addEventListener('submit', sendForm);

function sendForm(evt) {
    evt.preventDefault();
    page = 1;
    photoCard.innerHTML = '';
    currentQuery = evt.currentTarget.searchQuery.value;

   getPhoto(page, currentQuery).then(responce => createMarkup(responce.hits));
 
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
    photoCard.insertAdjacentHTML('beforeend', photosArray.join(''));
    
  lightbox.refresh(); // оновлюе слухачів на зоображе
  
}
