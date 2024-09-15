const API_KEY = "0e7caaa451bd63724c4d4ff302137c3e";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export function getLatest() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRated() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcoming() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTvTrending() {
  return fetch(`${BASE_PATH}/trending/tv/day?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTvAiringToday() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTvPopular() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTvTopRated() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getSearchMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export function getSearchTv(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
