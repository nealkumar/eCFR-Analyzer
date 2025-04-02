import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="xl">
                <Typography variant="body1" align="center">
                    eCFR Analyzer - A tool for analyzing Federal Regulations
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    {'Data source: '}
                    <Link color="inherit" href="https://www.ecfr.gov/" target="_blank" rel="noopener">
                        Electronic Code of Federal Regulations (eCFR)
                    </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    {`© Neal Kumar ${new Date().getFullYear()} for DOGE`}
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;