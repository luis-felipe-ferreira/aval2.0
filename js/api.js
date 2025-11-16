import { showLoading } from './ui.js';

const API_KEY = '03a3fcf6ed4dd0026dd02ac22e5594c3'; 
const API_BASE_URL = 'https://api.themoviedb.org/3';
export const API_IMG_URL = 'https://image.tmdb.org/t/p/w500';

export async function fetchFromAPI(endpoint) {
    const separator = endpoint.includes('?') ? '&' : '?';

    const url = `${API_BASE_URL}/${endpoint}${separator}api_key=${API_KEY}&language=pt-BR`;

    showLoading(true); 
    let data = null;
    let error = null;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }
        data = await response.json();
    } catch (e) {
        console.error("Erro ao buscar dados: ", e);
        error = e; 
    } finally {
        showLoading(false);
    }

    return { data, error };
}


export async function fetchGenres(mediaType = 'movie') {
    const url = `${API_BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}&language=pt-BR`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar gêneros');
        }
        const data = await response.json();
        return data.genres;
    } catch (e) {
        console.error("Erro ao buscar gêneros: ", e);
        return null;
    }
}


export async function fetchDetails(mediaId, mediaType) {
    const endpoint = `${mediaType}/${mediaId}`;
    const { data, error } = await fetchFromAPI(endpoint); 
    return { data, error };
}
