import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removePoster } from '../services/action';
import DeleteIcon from '@material-ui/icons/Delete';

const apiUrl = process.env.REACT_APP_API_URL;

const Cart = () => {
  const dispatch = useDispatch();
  const selectedPosters = useSelector((state) => {
    const selections = state.posterSelections;
    return Object.entries(selections).flatMap(([movieId, posters]) =>
        posters.map((posterId) => ({ movieId, posterId }))
    );
  });

  const [downloadFormat, setDownloadFormat] = useState('zip');

  const handleRemovePoster = (movieId, posterId) => {
    dispatch(removePoster(movieId, posterId));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/download-posters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          posters: selectedPosters,
          format: downloadFormat,
        }),
      });

      if (!response.ok) throw new Error('Download failed');

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/zip')) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'posters.zip';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to download posters:', error);
    }
  };

  return (
      <div className="cart-container">
        <div className="poster-grid">
          {selectedPosters.map((poster) => (
              <div key={`${poster.movieId}-${poster.posterId}`} className="poster-card">
                <img
                    src={`https://image.tmdb.org/t/p/w500${poster.posterId}`}
                    alt="Movie poster"
                    className="poster-image"
                />
                <div className="delete-overlay">
                  <button
                      className="delete-button"
                      onClick={() => handleRemovePoster(poster.movieId, poster.posterId)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
          ))}
        </div>

        <div className="action-panel">
          <h2>Download Options</h2>
          <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="format-select"
          >
            <option value="zip">ZIP</option>
            <option value="tar">TAR</option>
            <option value="7z">7Z</option>
          </select>
          <button
              className="download-button"
              onClick={handleDownload}
              disabled={selectedPosters.length === 0}
          >
            Download Selected
          </button>
        </div>
      </div>
  );
};

export default Cart;