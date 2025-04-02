import React from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Divider,
    Link,
} from '@mui/material';

const About = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    About eCFR Analyzer
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body1" paragraph>
                    The eCFR Analyzer is a tool designed to help users explore and analyze the Code of Federal Regulations (CFR). This application allows users to examine the content, structure, and historical changes of federal regulations published by various government agencies.
                </Typography>

                <Typography variant="body1" paragraph>
                    The Code of Federal Regulations is the codification of the general and permanent rules published in the Federal Register by the executive departments and agencies of the Federal Government. It is divided into 50 titles that represent broad areas subject to Federal regulation.
                </Typography>

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    Features
                </Typography>

                <Box component="ul" sx={{ ml: 4 }}>
                    <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            <strong>Content Analysis:</strong> Examine word count and content size of regulations by agency and title
                        </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            <strong>Historical Tracking:</strong> Track changes to regulations over time
                        </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            <strong>Agency Comparison:</strong> Compare regulatory activity across different federal agencies
                        </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            <strong>Visualization:</strong> Interactive charts and graphs to help understand regulatory patterns
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    Data Source
                </Typography>

                <Typography variant="body1" paragraph>
                    All data is sourced from the Electronic Code of Federal Regulations (eCFR) available at{' '}
                    <Link href="https://www.ecfr.gov/" target="_blank" rel="noopener">
                        https://www.ecfr.gov/
                    </Link>
                    . The eCFR is a regularly updated version of the CFR, and this application uses the public API provided by the eCFR to retrieve and analyze regulatory content.
                </Typography>

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    Technology Stack
                </Typography>

                <Box component="ul" sx={{ ml: 4 }}>
                    <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            <strong>Backend:</strong> Java with Spring Boot
                        </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            <strong>Frontend:</strong> React with Material-UI
                        </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            <strong>Data Visualization:</strong> Chart.js
                        </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            <strong>Database:</strong> H2 Database (in-memory)
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        This project was created for DOGE as a demonstration of using the eCFR API.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} - All Rights Reserved
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default About;