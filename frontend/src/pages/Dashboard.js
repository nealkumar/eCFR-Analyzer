import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress,
    Divider,
    Alert,
    AlertTitle,
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import ReactMarkdown from 'react-markdown';
import apiService from '../services/apiService';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [wordCountData, setWordCountData] = useState(null);
    const [changeFrequencyData, setChangeFrequencyData] = useState(null);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if backend is ready
                try {
                    const statusResponse = await apiService.getStatus();
                    if (statusResponse.data.status !== 'running') {
                        setDataReady(false);
                        setLoading(false);
                        return;
                    }
                } catch (err) {
                    console.error('Backend service not available:', err);
                    setError('Backend service is not available. Please try again later.');
                    setLoading(false);
                    return;
                }

                try {
                    // Fetch word count by agency
                    const wordCountResponse = await apiService.getWordCountsByAgency();

                    // Check if data is available
                    if (wordCountResponse.data.length === 0) {
                        setDataReady(false);
                        setLoading(false);
                        return;
                    }

                    setDataReady(true);

                    // Process word count data for chart
                    const topAgencies = wordCountResponse.data.slice(0, 10);
                    const wordCountChartData = {
                        labels: topAgencies.map(agency => agency.entityName),
                        datasets: [
                            {
                                label: 'Word Count',
                                data: topAgencies.map(agency => agency.wordCount),
                                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                            },
                        ],
                    };

                    setWordCountData(wordCountChartData);

                    // Fetch change frequency by agency
                    const changeFrequencyResponse = await apiService.getChangeFrequencyByAgency();

                    // Process change frequency data for chart
                    const topChangedAgencies = changeFrequencyResponse.data.slice(0, 10);
                    const changeFrequencyChartData = {
                        labels: topChangedAgencies.map(agency => agency.entityName),
                        datasets: [
                            {
                                label: 'Total Changes',
                                data: topChangedAgencies.map(agency => agency.totalChanges),
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.6)',
                                    'rgba(54, 162, 235, 0.6)',
                                    'rgba(255, 206, 86, 0.6)',
                                    'rgba(75, 192, 192, 0.6)',
                                    'rgba(153, 102, 255, 0.6)',
                                    'rgba(255, 159, 64, 0.6)',
                                    'rgba(199, 199, 199, 0.6)',
                                    'rgba(83, 102, 255, 0.6)',
                                    'rgba(40, 159, 64, 0.6)',
                                    'rgba(210, 199, 199, 0.6)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(199, 199, 199, 1)',
                                    'rgba(83, 102, 255, 1)',
                                    'rgba(40, 159, 64, 1)',
                                    'rgba(210, 199, 199, 1)',
                                ],
                                borderWidth: 1,
                            },
                        ],
                    };

                    setChangeFrequencyData(changeFrequencyChartData);

                    // Fetch AI summary
                    const summaryResponse = await apiService.getSummary();
                    setSummary(summaryResponse.data);
                } catch (err) {
                    console.error('Error fetching analytics data:', err);
                    setError('Failed to fetch analytics data. The backend may still be processing data.');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to fetch dashboard data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();

        // Poll for data readiness if not ready
        const interval = !dataReady ? setInterval(() => {
            fetchData();
        }, 5000) : null;

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [dataReady]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress size={60} sx={{ mb: 3 }} />
                    <Typography variant="h6">Loading eCFR data...</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This may take a few minutes as we analyze the Federal Regulations
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (!dataReady && !error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="info" sx={{ mb: 4 }}>
                    <AlertTitle>Data Processing</AlertTitle>
                    The system is currently processing eCFR data. This may take several minutes. The dashboard will automatically update when ready.
                </Alert>

                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        eCFR Analyzer
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We're currently fetching and analyzing data from the Electronic Code of Federal Regulations.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This process involves downloading and processing all federal agencies, titles, and their content to provide analytics on word count and historical changes.
                    </Typography>
                    <CircularProgress sx={{ mt: 3, mb: 3 }} />
                    <Typography variant="body2" color="text.secondary">
                        Refreshing automatically...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                        Error Loading Dashboard
                    </Typography>
                    <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                        Retry
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Chart options
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top 10 Agencies by Word Count',
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: function(value) {
                        const label = this.getLabelForValue(value);
                        // Truncate long agency names
                        return label.length > 25 ? label.substr(0, 22) + '...' : label;
                    }
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 15,
                    font: {
                        size: 11
                    }
                }
            },
            title: {
                display: true,
                text: 'Top 10 Agencies by Change Frequency',
            },
        },
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                eCFR Analytics Dashboard
            </Typography>

            {/* AI Summary Section */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    backgroundColor: '#f9f9ff',
                    border: '1px solid #e0e0ff'
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Dashboard Summary
                </Typography>
                <ReactMarkdown>{summary}</ReactMarkdown>
            </Paper>

            <Grid container spacing={3}>
                {/* Word Count Chart */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 400,
                        }}
                    >
                        {wordCountData ? (
                            <Bar data={wordCountData} options={barOptions} />
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Typography>No word count data available</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Change Frequency Chart */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 400,
                        }}
                    >
                        {changeFrequencyData ? (
                            <Pie data={changeFrequencyData} options={pieOptions} />
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Typography>No change frequency data available</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Quick Links */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Navigation
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    component={RouterLink}
                                    to="/agencies"
                                    fullWidth
                                    sx={{ p: 1 }}
                                >
                                    View All Agencies
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    component={RouterLink}
                                    to="/titles"
                                    fullWidth
                                    sx={{ p: 1 }}
                                >
                                    Browse Titles
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    component={RouterLink}
                                    to="/agencies"
                                    fullWidth
                                    sx={{ p: 1 }}
                                >
                                    Word Count Analysis
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    component={RouterLink}
                                    to="/titles"
                                    fullWidth
                                    sx={{ p: 1 }}
                                >
                                    Historical Changes
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;