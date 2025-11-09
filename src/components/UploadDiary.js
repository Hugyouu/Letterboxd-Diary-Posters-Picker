import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Box,
  Link,
} from "@material-ui/core";
import { CloudUploadOutlined } from "@material-ui/icons";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const VERSION = require("../../package.json").version;

const UploadDiary = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkCSVFile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/check-csv`, {
          withCredentials: true,
        });
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
    if (username || file) {
      setUploading(true);
      try {
        if (username) {
          const response = await axios.post(
            `${apiUrl}/api/fetch-diary`,
            { username },
            { withCredentials: true }
          );

          if (response.data && response.data.success) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            navigate("/PosterSelector");
          } else {
            console.error("Failed to fetch diary", response.data);
          }
        } else if (file) {
          const formData = new FormData();
          formData.append("file", file);

          await axios.post(`${apiUrl}/api/upload-csv`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          });

          navigate("/PosterSelector");
        }
      } catch (error) {
        console.error("Error processing diary:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Box>
      <Container className="upload-diary">
        <div className="upload-card">
          <div className="logo-container">
            <img src="/icon.svg" alt="logo" className="logo" />
          </div>
          <Typography variant="h4" className="title">
            Upload Letterboxd Diary
          </Typography>
          <TextField
            className="username-field"
            label="Letterboxd Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleUpload();
            }}
            placeholder="Enter your Letterboxd username"
          />
          <Typography variant="body2" className="or-text">
            Or upload a CSV file:
          </Typography>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {file ? (
              <>
                <CloudDoneOutlinedIcon className="dropzone-icon" />
                <Typography variant="h6" className="dropzone-text">
                  Your file has been uploaded: {file.name}
                </Typography>
              </>
            ) : (
              <>
                <CloudUploadOutlined className="dropzone-icon" />
                <Typography variant="h6" className="dropzone-text">
                  Drag and drop a CSV file here or click to select
                </Typography>
              </>
            )}
          </div>
          <Grid container justify="center" className="progress-container">
            {uploading ? (
              <CircularProgress />
            ) : (
              <Button
                className="submit-button"
                variant="contained"
                onClick={handleUpload}
                disabled={!username && !file}
              >
                SUBMIT
              </Button>
            )}
          </Grid>
        </div>
        <Typography variant="body1" className="overview-text">
          This tool allows you to easily import your Letterboxd diary and select
          your favorite movie poster. Follow these simple steps:
          <br />
          <strong>1. Enter Your Letterboxd Username:</strong> Type your
          Letterboxd username to automatically fetch your diary.
          <br />
          <strong>2. Or Upload Your CSV File:</strong> If you prefer, you can
          still upload your diary.csv file directly.
          <br />
          <strong>3. Automatic Processing:</strong> Once submitted, the
          application will process your diary.
          <br />
          <strong>4. Poster Selection:</strong> After processing, you'll be
          redirected to the Poster Selector page, where you can browse and
          choose your favorite movie poster based on your Letterboxd diary.
        </Typography>
      </Container>
      <Box
        component="footer"
        className="footer"
      >
        <Box
          className="footer-text"
        >
          <Typography variant="body2" style={{ opacity: 0.7 }}>
            v{VERSION}
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.5 }}>
            •
          </Typography>
          <Link
            href="https://github.com/Hugyouu/Letterboxd-Diary-Posters-Picker"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
          >
            <span>Hugyouu</span>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadDiary;
