export default function renderCard(data) {

    return `<div class="photo-card">
    <a href="${data.largeImageURL}">
      <img class="photo-img" src="${data.webformatURL}" alt="${data.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${data.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${data.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${data.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${data.downloads}
      </p>
    </div>
    </div>`
  }