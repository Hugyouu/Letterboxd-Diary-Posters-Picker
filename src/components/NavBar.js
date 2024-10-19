import React from "react";
import { useSelector } from "react-redux";
import { AppBar, Toolbar, IconButton, Badge, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    appBar: {
        top: 'auto',
        bottom: 0,
        backgroundColor: '#1c1f23',
    },
    toolbar: {
        justifyContent: 'space-between',
    },
    backButton: {
        color: 'white',
    },
    cartButton: {
        color: 'white',
    },
    refreshButton: {
        color: 'white',
        marginRight: theme.spacing(2),
    },
}));

const NavBar = ({onRefreshFiles}) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const selectedPosters = useSelector((state) => {
        const selections = state.posterSelections;
        return Object.values(selections).flat();
    });

    const totalSelected = selectedPosters.length;

    const handleBack = () => {
        navigate(-1);
    };

    const handleCart = () => {
        navigate('/Cart');
    };

    const isPosterSelectorPage = location.pathname !== '/PosterSelector';

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                {isPosterSelectorPage ? (
                    <IconButton edge="start" className={classes.backButton} onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                ) : (
                    <IconButton edge="start" className={classes.backButton} disabled>
                        {/* Un IconButton vide et désactivé */}
                    </IconButton>
                )}
                <div>
                    <Button className={classes.refreshButton} onClick={onRefreshFiles}>
                        Refresh Files
                    </Button>
                    <IconButton edge="end" className={classes.cartButton} onClick={handleCart}>
                        <Badge badgeContent={totalSelected} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
