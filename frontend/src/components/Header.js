import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

const Header = () => {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <GavelIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        eCFR ANALYZER
                    </Typography>

                    <GavelIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        eCFR
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        <Button
                            component={RouterLink}
                            to="/"
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Dashboard
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/agencies"
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Agencies
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/titles"
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Titles
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/about"
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            About
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;