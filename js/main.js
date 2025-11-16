

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
