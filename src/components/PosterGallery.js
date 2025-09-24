import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
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
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import NavBar from "./NavBar";
import { Dialog } from "@mui/material";

const apiUrl = process.env.REACT_APP_API_URL;

const PosterGallery = () => {
  const location = useLocation();
  const { watchedDate } = location.state || {};
  const { movieName, movieYear } = useParams();
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const movieId = `${movieName}-${movieYear}`;

  const selectedPosters = useSelector(
    (state) => state.posterSelections[movieId] || []
  );

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setLoading(true);
        setError(null);

        const encodedName = encodeURIComponent(movieName);
        const encodedYear = encodeURIComponent(movieYear);

        const response = await axios.get(
          `${apiUrl}/api/posters/${encodedName}/${encodedYear}`
        );

        if (response.data && response.data.posters) {
          setPosters(response.data.posters);
        } else {
          throw new Error("No posters data in response");
        }
      } catch (error) {
        console.error("Error fetching posters:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieName && movieYear) {
      fetchPosters();
    }
  }, [movieName, movieYear]);

  const isPosterSelected = (posterId) => {
    return selectedPosters.some((poster) => poster.posterId === posterId);
  };

  const handlePosterSelect = (posterId) => {
    const isSelected = isPosterSelected(posterId);

    if (selectedPosters.length > 0 && !isSelected) {
      setDialogOpen(true);
      return;
    }
    if (isSelected) {
      dispatch(deselectPoster(movieName, movieYear, posterId));
    } else {
      dispatch(selectPoster(movieName, movieYear, posterId, watchedDate));
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (error) {
    return (
      <Container>
        <Paper elevation={3} className="content-paper">
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Paper>
        <NavBar />
      </Container>
    );
  }

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
          ) : posters.length > 0 ? (
            <Grid container spacing={3}>
              {posters.map((poster, index) => {
                const isSelected = isPosterSelected(poster.file_path);
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                      className={`poster-card ${
                        isSelected ? "selected-poster" : ""
                      }`}
                      onClick={() => handlePosterSelect(poster.file_path)}
                    >
                      <CardMedia
                        className="poster-image"
                        image={`https://image.tmdb.org/t/p/original${poster.file_path}`}
                        title={`${movieName} poster ${index + 1}`}
                      />
                      {isSelected && <CheckIcon className="check-icon" />}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography align="center">
              No posters found for this movie.
            </Typography>
          )}
        </Paper>
      </Container>
      <NavBar />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Poster already selected</DialogTitle>
        <DialogContent>
          <Typography>
            You can only select one poster per movie. Please deselect the
            current poster first.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PosterGallery;
