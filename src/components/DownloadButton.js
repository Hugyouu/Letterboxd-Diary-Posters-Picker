import React from "react";
import { useSelector } from "react-redux";
import { Fab, makeStyles } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  downloadFab: {
    backgroundColor: "#1caff2",
    position: "fixed",
    bottom: theme.spacing(4),
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
  },
}));

const GlobalDownloadButton = () => {
  const classes = useStyles();
  const selectedPosters = useSelector((state) => {
    const selections = state.posterSelections;
    return Object.values(selections).flat();
  });

  const totalSelected = selectedPosters.length;

  if (totalSelected === 0) return null;

  const handleDownload = () => {
    // Implement your download logic here
    console.log("Downloading", totalSelected, "posters");
  };

  return (
    <Fab
      variant="extended"
      className={classes.downloadFab}
      onClick={handleDownload}
    >
      <GetAppIcon />
      Download ({totalSelected})
    </Fab>
  );
};

export default GlobalDownloadButton;
