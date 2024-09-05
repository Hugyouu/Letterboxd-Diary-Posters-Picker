import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { CloudUploadOutlined } from "@material-ui/icons";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: "#14181c",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#1c1f23",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: "bold",
    color: "#ffffff",
  },
  dropzone: {
    border: `2px dashed #00A346`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#1f252a",
    },
  },
  dropzoneIcon: {
    marginBottom: theme.spacing(2),
    color: "#00A346",
  },
  dropzoneText: {
    marginBottom: theme.spacing(2),
    color: "#ffffff",
  },
  progressContainer: {
    marginTop: theme.spacing(2),
  },
  submitButton: {
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    lineHeight: "2.8rem",
    display: "inline-block",
    cursor: "pointer",
    padding: "0 1rem",
    border: "0",
    borderRadius: "4px",
    outline: "none",
    background: "#526e89",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#1caff2",
    },
  },
  overviewText: {
    color: "#456",
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
  },
}));

const UploadDiary = () => {
  const classes = useStyles();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCSVFile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/check-csv");
        if (response.data.fileExists) {
          navigate("/PosterSelector");
        }
      } catch (error) {
        console.error("Error checking CSV file:", error);
      }
    };
    checkCSVFile();
  }, [navigate]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
    maxFiles: 1,
    accept: ".csv",
  });

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post("http://localhost:5000/api/upload-csv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        navigate("/PosterSelector");
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Container className={classes.root}>
      <div className={classes.card}>
        <Typography variant="h4" className={classes.title}>
          Upload CSV File
        </Typography>
        <div {...getRootProps()} className={classes.dropzone}>
          <input {...getInputProps()} />
          {file ? (
            <>
              <CloudDoneOutlinedIcon
                className={classes.dropzoneIcon}
                style={{ fontSize: "4rem" }}
              />
              <Typography variant="h6" className={classes.dropzoneText}>
                Your file has been uploaded: {file.name}
              </Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlined
                className={classes.dropzoneIcon}
                style={{ fontSize: "4rem" }}
              />
              <Typography variant="h6" className={classes.dropzoneText}>
                Drag and drop a CSV file here or click to select
              </Typography>
            </>
          )}
        </div>
        {file && (
          <Grid
            container
            justify="center"
            className={classes.progressContainer}
          >
            {uploading ? (
              <CircularProgress />
            ) : (
              <Button
                className={classes.submitButton}
                variant="contained"
                onClick={handleUpload}
              >
                SUBMIT
              </Button>
            )}
          </Grid>
        )}
      </div>
      <Typography variant="body1" className={classes.overviewText}>
        This tool allows you to easily upload your diary.csv file from
        Letterboxd and select your favorite movie poster. Follow these simple
        steps:
        <br />
        <strong>1. Upload Your CSV File:</strong> Drag and drop your diary.csv
        file or click to select it from your device.
        <br />
        <strong>2. Automatic Processing:</strong> Once uploaded, the application
        will automatically process the file.
        <br />
        <strong>3. Poster Selection:</strong> After the file is successfully
        uploaded, you'll be redirected to the Poster Selector page, where you
        can browse and choose your favorite movie poster based on your
        Letterboxd diary.
      </Typography>
    </Container>
  );
};

export default UploadDiary;