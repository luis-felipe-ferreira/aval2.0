import { fetchFromAPI, fetchGenres, fetchDetails } from './api.js';
import { renderMedia, showErrorMessage, renderGenres, renderDetails } from './ui.js';


let currentPage = 1;
let totalPages = 1;
let currentGenre = '';
let currentMediaType = 'movie';

let homeView, detailsView, aboutView;


async function main() {
    homeView = document.getElementById('home-view');
    detailsView = document.getElementById('details-view');
    aboutView = document.getElementById('about-view');

    console.log("App iniciado...");
    
    setupPagination();
    setupGenreFilter();
    setupMediaTypeFilter();
    setupNavigation(); 

    await loadGenres(); 
    await loadMedia(currentPage);
}

async function loadMedia(page) {
    const currentYear = new Date().getFullYear();
    const discoverEndpoint = `discover/${currentMediaType}`;
    const yearParam = currentMediaType === 'movie' ? 'primary_release_year' : 'first_air_date_year';
    
    let endpoint = `${discoverEndpoint}?sort_by=popularity.desc&${yearParam}=${currentYear}&page=${page}`;

    if (currentGenre) {
        endpoint += `&with_genres=${currentGenre}`;
    }

    showErrorMessage(false); 
    const { data, error } = await fetchFromAPI(endpoint);

    if (error) {
        showErrorMessage(true); 
        return;
    }

    currentPage = data.page;
    totalPages = Math.min(data.total_pages, 500);

    renderMedia(data.results, currentMediaType); 
    updatePaginationUI();
}


async function loadGenres() {
    const genres = await fetchGenres(currentMediaType); 
    if (genres) {
        renderGenres(genres);
    }
}

function setupMediaTypeFilter() {
    document.querySelectorAll('input[name="media_type"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentMediaType = event.target.value;
            currentPage = 1;
            currentGenre = '';
            loadGenres(); 
            loadMedia(currentPage);
        });
    });
}


function setupGenreFilter() {
    const genreSelect = document.getElementById('genre-filter');
    
    genreSelect.addEventListener('change', (event) => {
        currentGenre = event.target.value;
        currentPage = 1; 
        loadMedia(currentPage);
    });
}


function setupPagination() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            loadMedia(currentPage - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadMedia(currentPage + 1);
        }
    });
}


function setupNavigation() {
    const homeContainer = document.getElementById('movie-list-container');
    const backButton = document.getElementById('back-to-home');
    const homeLink = document.getElementById('home-link');
    const navHome = document.getElementById('nav-home');
    const navAbout = document.getElementById('nav-about'); // 

    homeContainer.addEventListener('click', async (event) => {
        const card = event.target.closest('.movie-card');
        
        if (card) {
            const mediaId = card.dataset.mediaId;
            const mediaType = card.dataset.mediaType;
            
            const { data, error } = await fetchDetails(mediaId, mediaType);
            
            if (error) {
                showView('home'); 
                showErrorMessage(true);
            } else {
                renderDetails(data, mediaType);
                showView('details'); 
                window.scrollTo(0, 0); 
            }
        }
    });

    backButton.addEventListener('click', () => {
        showView('home');
    });

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView('home');
    });
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        showView('home');
    });

    navAbout.addEventListener('click', (e) => {
        e.preventDefault();
        showView('about');
        window.scrollTo(0, 0); 
    });
}


function updatePaginationUI() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageSpan = document.getElementById('current-page');

    pageSpan.textContent = `Página ${currentPage} de ${totalPages}`;
    prevButton.disabled = (currentPage === 1);
    nextButton.disabled = (currentPage === totalPages);
}

function showView(viewName) {
    homeView.classList.add('hidden');
    detailsView.classList.add('hidden');
    aboutView.classList.add('hidden');


    if (viewName === 'home') {
        homeView.classList.remove('hidden');
    } else if (viewName === 'details') {
        detailsView.classList.remove('hidden');
    } else if (viewName === 'about') {
        aboutView.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', main);
