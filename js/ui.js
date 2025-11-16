import { API_IMG_URL } from './api.js';

export function renderMedia(mediaItems, mediaType) {
    const container = document.getElementById('movie-list-container');
    container.innerHTML = '';

    if (!mediaItems || mediaItems.length === 0) {
        container.innerHTML = '<p>Nenhum item encontrado.</p>';
        return;
    }

    mediaItems.forEach(item => {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('movie-card');
        mediaCard.dataset.mediaId = item.id;
        mediaCard.dataset.mediaType = mediaType; 

        const title = item.title || item.name || "Título não disponível";
        const releaseDate = item.release_date || item.first_air_date || "";
        const year = releaseDate ? releaseDate.split('-')[0] : "Ano desconhecido";
        
        const imagePath = item.poster_path 
            ? `${API_IMG_URL}${item.poster_path}`
            : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

        mediaCard.innerHTML = `
            <img src="${imagePath}" alt="Pôster de ${title}">
            <div class="movie-card-info">
                <h3>${title}</h3>
                <p>Ano: ${year}</p>
            </div>
        `;
        
        container.appendChild(mediaCard);
    });
}
