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
  makeStyles,
  Paper,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import NavBar from "./NavBar";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#1c1f23",
  },
  title: {
    color: "white",
    marginBottom: theme.spacing(3),
    fontSize: "2rem",
    fontWeight: "400",
  },
  posterCard: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "transparent",
    boxShadow: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  selectedPoster: {
    border: `4px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
  checkIcon: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: "50%",
    padding: theme.spacing(0.5),
  },
  posterImage: {
    paddingTop: "150%",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: theme.shape.borderRadius,
    transition: "transform 0.3s ease-in-out",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
}));

const PosterGallery = ({ movieId }) => {
  const classes = useStyles();
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { movieName, movieYear } = useParams();
  const dispatch = useDispatch();
  const selectedPosters = useSelector(
    (state) => state.posterSelections[movieId] || []
  );

  console.log(movieId);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/posters/${movieName}/${movieYear}`
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
      <Container className={classes.root}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h4" gutterBottom className={classes.title}>
            Posters for {movieName} ({movieYear})
          </Typography>
          {loading ? (
              <Box className={classes.loadingContainer}>
                <CircularProgress />
              </Box>
          ) : (
              <Grid container spacing={3}>
                {posters.map((poster, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Card
                          className={`${classes.posterCard} ${
                              selectedPosters.includes(poster.file_path)
                                  ? classes.selectedPoster
                                  : ""
                          }`}
                          onClick={() => handlePosterSelect(poster.file_path)}
                      >
                        <CardMedia
                            className={classes.posterImage}
                            image={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                            title={`${movieName} poster ${index + 1}`}
                        />
                        {selectedPosters.includes(poster.file_path) && (
                            <CheckIcon className={classes.checkIcon} />
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
