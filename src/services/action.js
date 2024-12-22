export const SELECT_POSTER = "SELECT_POSTER";
export const DESELECT_POSTER = "DESELECT_POSTER";
export const REMOVE_POSTER = "REMOVE_POSTER";

export const REMOVE_ALL_POSTERS = "REMOVE_ALL_POSTERS";

export const selectPoster = (movieName, movieYear, posterId, watchedDate) => {
  const movieId = `${movieName}-${movieYear}`;
  return {
    type: SELECT_POSTER,
    payload: { movieId, posterId, watchedDate },
  };
};

export const deselectPoster = (movieName, movieYear, posterId) => {
  const movieId = `${movieName}-${movieYear}`;
  return {
    type: DESELECT_POSTER,
    payload: { movieId, posterId },
  };
};


export const removePoster = (movieId, posterId) => ({
  type: "REMOVE_POSTER",
  movieId,
  posterId,
});

export const removeAllPosters = () => ({
  type: REMOVE_ALL_POSTERS,
});