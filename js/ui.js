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


export function renderDetails(details, mediaType) {
    const container = document.getElementById('details-content');
    container.innerHTML = ''; 

    const title = details.title || details.name || "Título não disponível";
    const synopsis = details.overview || "Sinopse não disponível.";
    const rating = details.vote_average ? details.vote_average.toFixed(1) : "N/A";
    const imagePath = details.poster_path 
        ? `${API_IMG_URL}${details.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

    let detailsHTML = `
        <img src="${imagePath}" alt="Pôster de ${title}">
        <div>
            <h2>${title}</h2>
            <p><strong>Rating:</strong> ${rating} / 10</p>
            <h3>Sinopse</h3>
            <p class="synopsis">${synopsis}</p>
        </div>
    `;

    if (mediaType === 'tv' && details.seasons) {
        detailsHTML += '<div><h3>Temporadas</h3>'; 
        detailsHTML += '<div class="seasons-list">';
        
        details.seasons.forEach(season => {
            if (season.season_number > 0) { 
                detailsHTML += `
                    <div class="season-item">
                        <strong>${season.name}</strong> (${season.episode_count} episódios)
                    </div>
                `;
            }
        });
        detailsHTML += '</div></div>';
    }

    container.innerHTML = detailsHTML;
}

export function renderGenres(genres) {
    const select = document.getElementById('genre-filter');
    select.innerHTML = '<option value="">Todos</option>'; 
    
    if (!genres || genres.length === 0) return;

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        select.appendChild(option);
    });
}

export function showLoading(isLoading) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        if (isLoading) {
            spinner.classList.remove('hidden');
            document.getElementById('movie-list-container').classList.add('hidden');
            document.getElementById('error-message').classList.add('hidden');
        } else {
            spinner.classList.add('hidden');
            document.getElementById('movie-list-container').classList.remove('hidden');
        }
    }
}

export function showErrorMessage(show) {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        if (show) {
            errorEl.classList.remove('hidden');
        } else {
            errorEl.classList.add('hidden');
        }
    }
}
