import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  List,
  ListItem,
  Grid,
  Typography,
  LinearProgress,
  Box,
  Paper,
  Button,
} from "@material-ui/core";
import Pagination from "@mui/material/Pagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import queryString from "query-string";
import pulpGif from "../static/images/pulp.gif";
import NavBar from "./NavBar";

const apiUrl = process.env.REACT_APP_API_URL;

const paginationTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#667788",
    },
    text: {
      primary: "#ffffff",
      secondary: "#667788",
    },
    action: {
      hover: "rgba(102, 119, 136, 0.2)",
    },
  },
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#667788",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#778899",
            },
          },
        },
      },
    },
  },
});

const PosterSelector = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  //const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const moviesPerPage = 8;

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const pageNumber = parsed.page ? parseInt(parsed.page, 10) : 1;
    setPage(pageNumber);

    fetchMovies(pageNumber);
  }, [location.search]);

  // const fetchUsername = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/api/username`);
  //     setUsername(response.data.username);
  //   } catch (error) {
  //     console.error("Error fetching username:", error);
  //   }
  // };

  const fetchMovies = async (pageNumber) => {
    try {
      setLoading(true);
      // setProgress(0);

      const response = await axios.get(
        `${apiUrl}/api/movies?page=${pageNumber}&limit=${moviesPerPage}`,
        { withCredentials: true }
      );

      if (response.data.movies) {
        setMovies(response.data.movies);
        setTotalPages(Math.ceil(response.data.total / moviesPerPage));
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieName, movieYear, watchedDate) => {
    navigate(
      `/posters/${encodeURIComponent(movieName)}/${encodeURIComponent(
        movieYear
      )}`,
      { state: { watchedDate } }
    );
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    navigate(`?page=${value}`);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const formatWatchedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    return { day, month };
  };

  return (
    <>
      <Container className="poster-selector">
        <Paper elevation={3} className="content-paper">
          <Typography variant="h4" className="title">
            Your diary
          </Typography>

          {username && (
            <Typography variant="h6" className="username">
              Letterboxd User: {username}
            </Typography>
          )}

          {loading ? (
            <Box className="progress-container">
              <LinearProgress />
              <Typography className="progress-label">
                Downloading movies...
              </Typography>
            </Box>
          ) : movies.length > 0 ? (
            <>
              <List className="movies-list">
                {movies.map((movie, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() =>
                      handleMovieClick(
                        movie.Name,
                        movie.Year,
                        movie["Watched Date"]
                      )
                    }
                    className="movie-item"
                  >
                    <Grid container alignItems="center">
                      <Grid item>
                        <img
                          src={
                            `https://image.tmdb.org/t/p/w500${movie.Poster}` ||
                            `/api/placeholder/50/75`
                          }
                          alt={movie.Name}
                          className="movie-poster"
                        />
                      </Grid>
                      <Grid item className="movie-info">
                        <Typography variant="subtitle1" className="movie-title">
                          {movie.Name}
                        </Typography>
                        <Typography variant="body2" className="movie-year">
                          {movie.Year}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Box className="watched-date">
                          {(() => {
                            const { day, month } = formatWatchedDate(
                              movie["Watched Date"]
                            );
                            return (
                              <>
                                <Typography
                                  variant="body2"
                                  className="watched-day"
                                >
                                  {day}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="watched-month"
                                >
                                  {month}
                                </Typography>
                              </>
                            );
                          })()}
                        </Box>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
              <Box className="pagination-container">
                <ThemeProvider theme={paginationTheme}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </ThemeProvider>
              </Box>
            </>
          ) : (
            <Box className="no-movies-container">
              <div className="gif-container">
                <div className="circle-background"></div>
                <img
                  src={pulpGif}
                  alt="Confused reaction"
                  className="reaction-gif"
                />
              </div>
              <Typography variant="body1" gutterBottom>
                No movies found in your diary. Please check your Letterboxd
                username or CSV file.
              </Typography>
              <Button
                variant="contained"
                className="back-button"
                onClick={handleGoBack}
              >
                Go Back
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
      <NavBar />
    </>
  );
};

export default PosterSelector;
