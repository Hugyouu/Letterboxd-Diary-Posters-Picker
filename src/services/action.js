export const selectPoster = (movieId, posterId) => ({
  type: "SELECT_POSTER",
  movieId,
  posterId,
});

export const deselectPoster = (movieId, posterId) => ({
  type: "DESELECT_POSTER",
  movieId,
  posterId,
});

export const removePoster = (movieId, posterId) => ({
  type: "REMOVE_POSTER",
  movieId,
  posterId,
});