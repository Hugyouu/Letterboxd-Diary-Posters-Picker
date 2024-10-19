import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container, Typography, Card, CardMedia, CardContent,
    Button, Checkbox, FormControlLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import EditIcon from '@material-ui/icons/Edit';
import { removePoster } from '../services/action';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(8),
        display: 'flex',
    },
    posterList: {
        flex: 2,
        marginRight: theme.spacing(2),
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
    },
    actionPanel: {
        flex: 1,
        position: 'sticky',
        top: theme.spacing(4),
        height: 'fit-content',
    },
    card: {
        display: 'flex',
        marginBottom: theme.spacing(2),
        backgroundColor: '#2c3e50',
    },
    cardMedia: {
        width: 100,
    },
    cardContent: {
        flex: '1 0 auto',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
    },
    slider: {
        width: '100%',
        marginTop: theme.spacing(2),
    },
    button: {
        width: '100%',
    },
    typography: {
        color: '#ecf0f1',
    },
    formControl: {
        marginBottom: theme.spacing(2),
    },
    checkbox: {
        color: '#3498db',
    },
    paper: {
        padding: theme.spacing(3),
        backgroundColor: '#34495e',
    },
}));

const Cart = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectedPosters = useSelector((state) => {
        const selections = state.posterSelections;
        return Object.entries(selections).flatMap(([movieId, posters]) =>
            posters.map(posterId => ({ movieId, posterId }))
        );
    });

    const [selectedForDownload, setSelectedForDownload] = useState(selectedPosters.map(() => true));
    const [downloadFormat, setDownloadFormat] = useState('zip');
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [currentPosterIndex, setCurrentPosterIndex] = useState(null);
    const [newPosterName, setNewPosterName] = useState('');

    const handleRemovePoster = (index) => {
        dispatch(removePoster(selectedPosters[index].movieId, selectedPosters[index].posterId));
    };

    const handleDownload = async () => {
        const postersToDownload = selectedPosters
            .filter((_, index) => selectedForDownload[index])
            .map((poster) => ({
                movieId: poster.movieId,
                posterId: poster.posterId,
                movieName: poster.movieName,
                movieYear: poster.movieYear
            }));

        console.log('Downloading posters:', postersToDownload);

        try {
            const response = await axios.post('http://localhost:5000/api/download-posters', {
                posters: postersToDownload,
                format: downloadFormat,
            }, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `posters.${downloadFormat}`;
            link.click();
        } catch (error) {
            console.error('Failed to download posters:', error);
        }
    };

    const handleShare = () => {
        console.log('Sharing selected posters');
    };

    const handleRename = (index) => {
        setCurrentPosterIndex(index);
        setNewPosterName(selectedPosters[index].posterId);
        setRenameDialogOpen(true);
    };

    const handleRenameConfirm = () => {
        console.log(`Renaming poster ${currentPosterIndex} to ${newPosterName}`);
        setRenameDialogOpen(false);
    };

    return (
        <Container className={classes.root}>
            <div className={classes.posterList}>
                <Typography variant="h4" gutterBottom className={classes.typography}>Your Cart</Typography>
                {selectedPosters.map((poster, index) => (
                    <Card key={index} className={classes.card}>
                        <CardMedia
                            className={classes.cardMedia}
                            image={`https://image.tmdb.org/t/p/w500${poster.posterId}`}
                            title={`Poster ${index + 1}`}
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography variant="h6"
                                        className={classes.typography}>{`Movie ID: ${poster.movieId}`}</Typography>
                            <Typography variant="body2"
                                        className={classes.typography}>{poster.posterId}</Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedForDownload[index]}
                                        onChange={(e) => {
                                            const newSelected = [...selectedForDownload];
                                            newSelected[index] = e.target.checked;
                                            setSelectedForDownload(newSelected);
                                        }}
                                        className={classes.checkbox}
                                    />
                                }
                                label="Select for download"
                                className={classes.typography}
                            />
                            <Button startIcon={<DeleteIcon/>} onClick={() => handleRemovePoster(index)}
                                    className={classes.typography}>Remove</Button>
                            <Button startIcon={<EditIcon/>} onClick={() => handleRename(index)}
                                    className={classes.typography}>Rename</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Paper className={classes.actionPanel} elevation={3}>
                <div className={classes.actions}>
                    <Typography gutterBottom>Download Format</Typography>
                    <TextField
                        select
                        value={downloadFormat}
                        onChange={(e) => setDownloadFormat(e.target.value)}
                        SelectProps={{
                            native: true,
                        }}
                        className={classes.formControl}
                    >
                        <option value="zip">ZIP</option>
                        <option value="tar">TAR</option>
                        <option value="7z">7Z</option>
                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GetAppIcon/>}
                        onClick={handleDownload}
                        disabled={selectedForDownload.every((selected) => !selected)}
                        className={classes.button}
                    >
                        Download Selected
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ShareIcon/>}
                        onClick={handleShare}
                        className={classes.button}
                    >
                        Share Selection
                    </Button>
                </div>
            </Paper>
            <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
                <DialogTitle>Rename Poster</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Name"
                        type="text"
                        fullWidth
                        value={newPosterName}
                        onChange={(e) => setNewPosterName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRenameDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleRenameConfirm} color="primary">
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Cart;