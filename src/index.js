import './sass/index.scss';

import NewsApiService from './js/api-service';
import renderCard from './js/rendercard';
import { lightbox } from './js/onslidermaker';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),  
  loadMoreBtn: document.querySelector('.load-more'),   
};
const newsApiService = new NewsApiService();   
  
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);


////---- FUNCTION ----////
function onSearch(e) {
  e.preventDefault(); 

  refs.galleryContainer.innerHTML = '';       
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  newsApiService.resetPage();   
  if (newsApiService.query === '') {
    Notify.warning('Please, fill the main field');  
  return;
  }
  newsApiService.fetchGalleryCards()   
  .then(data => {
  refs.galleryContainer.innerHTML = '';
  refs.loadMoreBtn.classList.remove('is-hidden');  
  
  data.totalPages = Math.ceil(data.totalHits / data.PER_PAGE);
   

  if (!data.totalHits) {        
    Notify.warning(
    `Sorry, there are no images matching your search query. Please try again.`,
  );
   refs.loadMoreBtn.classList.add('is-hidden');
   return;
  };  

onRenderGallery(data);

if (data.totalHits === data.totalPages) {
  refs.loadMoreBtn.classList.add('is-hidden');
  newsApiService.incrementPage();
  Notiflix.info("We're sorry, but you've reached the end of search results.");
};

if (data.totalHits > 1) {
  Notify.success(`Hooray! We found ${data.totalHits} images !!!`);       ;
  refs.loadMoreBtn.classList.remove('is-hidden');
        
// Безкінечний скрол 
const options = {
  rootMargin: '50px',
  root: null,
  threshold: 0.3
};
const observer = new IntersectionObserver(onLoadMore, options);
observer.observe(refs.loadMoreBtn);  
}      
});           
}

// Функція кнопки, яка додає картинки (onScrollmake)
async function onLoadMore() {
  newsApiService.fetchGalleryCards().then(onScrollmake);
}   


// Функція рендерить масив (дата) картинок відповідно до розмітки (renderсard)
function  onRenderGallery(data) {     
const markup = data.hits.map(data => renderCard(data)).join('');
refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
lightbox.refresh();      
}   


// Функція скролу для подальшого відкриття картинок *більше 40 шт)
function onScrollmake(data) {
  onRenderGallery(data); 
  lightbox.refresh(); 
const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect(); 
window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}
