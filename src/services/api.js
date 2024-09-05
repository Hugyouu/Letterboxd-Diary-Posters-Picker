import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchMovies = () => axios.get(`${API_BASE_URL}/movies`);
export const downloadPoster = (movieId) =>
  axios.post(`${API_BASE_URL}/download-poster`, { movie_id: movieId });
