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
  makeStyles,
  Button,
} from "@material-ui/core";
import Pagination from "@mui/material/Pagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import queryString from "query-string";
import pulpGif from "../static/images/pulp.gif";
import NavBar from "./NavBar";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  paper: {
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#1c1f23",
    color: "white",
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  username: {
    color: "#00A346",
    marginBottom: theme.spacing(2),
  },
  list: {
    maxHeight: "800px",
    minHeight: "900px",
  },
  listItem: {
    marginBottom: theme.spacing(2),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:not(:last-child)": {
      borderBottom: `1px solid #667788`,
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
    },
  },
  poster: {
    width: "50px",
    height: "75px",
    objectFit: "cover",
    marginRight: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  movieInfo: {
    flexGrow: 1,
  },
  movieTitle: {
    color: "white",
    fontFamily: "TiemposTextWeb-Semibold, Georgia, serif",
    fontSize: "1.38461538rem",
    fontWeight: "400",

    "&:hover": {
      color: "var(--primary)",
    },
  },
  movieYear: {
    color: "#667788",
  },
  watchedDate: {
    color: "#667788",
    textAlign: "center",
  },
  watchedDay: {
    fontSize: "2rem",
  },
  refreshButton: {
    marginTop: theme.spacing(2),
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
  progressContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "200px",
  },
  progressLabel: {
    marginTop: theme.spacing(2),
    color: "white",
  },
  noMoviesContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "400px",
  },
  gifContainer: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
    width: "200px",
    height: "200px",
    marginBottom: theme.spacing(2),
  },
  circleBackground: {
    position: "absolute",
    width: "120%",
    height: "120%",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    clipPath: "inset(0 0 25% 0)",
    bottom: "-28%",
  },
  gif: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  backButton: {
    marginTop: theme.spacing(2),
    backgroundColor: "#00A346",
    color: "white",
    "&:hover": {
      backgroundColor: "#008036",
    },
  },
}));

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
  const classes = useStyles();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const moviesPerPage = 10;

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const pageNumber = parsed.page ? parseInt(parsed.page, 10) : 1;
    setPage(pageNumber);

    fetchMovies(pageNumber).then(r => console.log(r));
    // fetchUsername();
  }, [location.search]);

  const fetchUsername = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/username");
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const fetchMovies = async (pageNumber) => {
    try {
      setLoading(true);
      setProgress(0);

      const response = await axios.get(
        `http://localhost:5000/api/movies?page=${pageNumber}&limit=${moviesPerPage}`,
        {
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
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

  const handleMovieClick = (movieName, movieYear) => {
    navigate(
      `/posters/${encodeURIComponent(movieName)}/${encodeURIComponent(
        movieYear
      )}`
    );
  };

  const handleRefreshFiles = async () => {
    try {
      await axios.delete("http://localhost:5000/api/delete-csv");
      navigate("/");
    } catch (error) {
      console.error("Error deleting CSV file:", error);
    }
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
      <Container className={classes.root}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h4" gutterBottom className={classes.title}>
            Your diary
          </Typography>
          {username && (
              <Typography variant="h6" className={classes.username}>
                Letterboxd User: {username}
              </Typography>
          )}
          {loading ? (
              <Box className={classes.progressContainer}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography className={classes.progressLabel}>
                  Downloading movies...
                </Typography>
              </Box>
          ) : movies.length > 0 ? (
              <>
                <List className={classes.list}>
                  {movies.map((movie, index) => (
                      <ListItem
                          button
                          key={index}
                          onClick={() => handleMovieClick(movie.Name, movie.Year)}
                          className={classes.listItem}
                      >
                        <Grid container alignItems="center">
                          <Grid item>
                            <img
                                src={
                                    `https://image.tmdb.org/t/p/w500${movie.Poster.file_path}` ||
                                    `/api/placeholder/50/75`
                                }
                                alt={movie.Name}
                                className={classes.poster}
                            />
                          </Grid>
                          <Grid item className={classes.movieInfo}>
                            <Typography
                                variant="subtitle1"
                                className={classes.movieTitle}
                            >
                              {movie.Name}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                className={classes.movieYear}
                            >
                              {movie.Year}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Box className={classes.watchedDate}>
                              {(() => {
                                const { day, month } = formatWatchedDate(
                                    movie["Watched Date"]
                                );
                                return (
                                    <>
                                      <Typography
                                          variant="body2"
                                          className={classes.watchedDay}
                                      >
                                        {day}
                                      </Typography>
                                      <Typography
                                          variant="body2"
                                          className={classes.watchedMonth}
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
                <Box className={classes.paginationContainer}>
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
              <Box className={classes.noMoviesContainer}>
                <div className={classes.gifContainer}>
                  <div className={classes.circleBackground}></div>
                  <img
                      src={pulpGif}
                      alt="Confused reaction"
                      className={classes.gif}
                  />
                </div>
                <Typography variant="body1" gutterBottom>
                  No movies found in your diary. Please check your Letterboxd
                  username or CSV file.
                </Typography>
                <Button
                    variant="contained"
                    className={classes.backButton}
                    onClick={handleGoBack}
                >
                  Go Back
                </Button>
              </Box>
          )}
        </Paper>
      </Container>
      <NavBar onRefreshFiles={handleRefreshFiles} />
    </>
  );
};

export default PosterSelector;
