import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectPoster, deselectPoster } from "../services/action";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CircularProgress,
  Box,
  Paper,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import NavBar from "./NavBar";

const apiUrl = process.env.REACT_APP_API_URL;

const PosterGallery = ({ movieId }) => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { movieName, movieYear } = useParams();
  const dispatch = useDispatch();
  const selectedPosters = useSelector(
    (state) => state.posterSelections[movieId] || []
  );

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiUrl}/api/posters/${movieName}/${movieYear}`
        );
        setPosters(response.data.posters);
      } catch (error) {
        console.error("Error fetching posters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosters();
  }, [movieName, movieYear]);

  const handlePosterSelect = (posterId) => {
    if (selectedPosters.includes(posterId)) {
      dispatch(deselectPoster(movieId, posterId));
    } else {
      dispatch(selectPoster(movieId, posterId));
    }
  };

  return (
    <>
      <Container className="poster-gallery">
        <Paper elevation={3} className="content-paper">
          <Typography variant="h4" gutterBottom className="title">
            Posters for {movieName} ({movieYear})
          </Typography>
          {loading ? (
            <Box className="loading-container">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {posters.map((poster, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card
                    className={`poster-card ${
                      selectedPosters.includes(poster.file_path)
                        ? "selected-poster"
                        : ""
                    }`}
                    onClick={() => handlePosterSelect(poster.file_path)}
                  >
                    <CardMedia
                      className="poster-image"
                      image={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                      title={`${movieName} poster ${index + 1}`}
                    />
                    {selectedPosters.includes(poster.file_path) && (
                      <CheckIcon className="check-icon" />
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
      <NavBar />
    </>
  );
};

export default PosterGallery;
