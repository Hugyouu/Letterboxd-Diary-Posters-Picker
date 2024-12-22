import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppBar, Toolbar, IconButton, Badge, Button } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';

const selectPosterSelections = (state) => state.posterSelections;

const NavBar = ({ onRefreshFiles }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const posterSelections = useSelector(selectPosterSelections);
    const selectedPosters = useMemo(() => {
        return Object.values(posterSelections).flat();
    }, [posterSelections]);

    const totalSelected = selectedPosters.length;

    const handleBack = () => {
        navigate(-1);
    };

    const handleCart = () => {
        navigate('/Cart');
    };

    const isPosterSelectorPage = location.pathname !== '/PosterSelector';

    return (
        <AppBar position="fixed" className="navbar">
            <Toolbar className="toolbar">
                {isPosterSelectorPage ? (
                    <IconButton
                        edge="start"
                        className="back-button"
                        onClick={handleBack}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        edge="start"
                        className="back-button"
                        disabled
                    >
                        {/* Disabled IconButton */}
                    </IconButton>
                )}
                <div>
                    <Button
                        className="refresh-button"
                        onClick={onRefreshFiles}
                    >
                        Refresh Files
                    </Button>
                    <IconButton
                        edge="end"
                        className="cart-button"
                        onClick={handleCart}
                    >
                        <Badge
                            badgeContent={totalSelected}
                            color="secondary"
                            overlap="rectangular"
                        >
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;