import React from "react";
import { useSelector } from "react-redux";
import { AppBar, Toolbar, IconButton, Badge, Button } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = ({ onRefreshFiles }) => {
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
        <AppBar position="fixed" className="navbar">
            <Toolbar className="toolbar">
                {isPosterSelectorPage ? (
                    <IconButton edge="start" className="back-button" onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                ) : (
                    <IconButton edge="start" className="back-button" disabled>
                        {/* Un IconButton vide et désactivé */}
                    </IconButton>
                )}
                <div>
                    <Button className="refresh-button" onClick={onRefreshFiles}>
                        Refresh Files
                    </Button>
                    <IconButton edge="end" className="cart-button" onClick={handleCart}>
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
