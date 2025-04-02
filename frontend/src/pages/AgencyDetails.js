import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    Button,
    CircularProgress,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
} from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
import apiService from "../services/apiService";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AgencyDetails = () => {
    const { id } = useParams();
    const [agency, setAgency] = useState(null);
    const [titles, setTitles] = useState([]);
    const [wordCountData, setWordCountData] = useState(null);
    const [changeFrequencyData, setChangeFrequencyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgencyDetails = async () => {
            try {
                setLoading(true);

                // Fetch agency details
                const agencyResponse = await apiService.getAgencyById(id);
                setAgency(agencyResponse.data);

                // Fetch titles for this agency
                const titlesResponse = await apiService.getTitlesByAgency(id);
                setTitles(titlesResponse.data);

                // Fetch word count analytics
                const wordCountResponse = await apiService.getWordCountsByTitle();

                // Filter titles for this agency
                const filteredTitles = wordCountResponse.data.filter(
                    item => titlesResponse.data.some(title => title.id === item.entityId)
                );

                // Sort by word count descending
                const sortedTitles = filteredTitles.sort((a, b) => b.wordCount - a.wordCount);

                // Take top 10
                const topTitles = sortedTitles.slice(0, 10);

                // Create chart data
                const wordCountChartData = {
                    labels: topTitles.map(title => title.entityName.replace(/^Title \d+: /, '')),
                    datasets: [
                        {
                            label: 'Word Count',
                            data: topTitles.map(title => title.wordCount),
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                };

                setWordCountData(wordCountChartData);

                // Fetch historical change data
                const changeFrequencyResponse = await apiService.getChangeFrequencyByTitle();

                // Filter for this agency's titles
                const filteredChanges = changeFrequencyResponse.data.filter(
                    item => titlesResponse.data.some(title => title.id === item.entityId)
                );

                // Sort by total changes descending
                const sortedChanges = filteredChanges.sort((a, b) => b.totalChanges - a.totalChanges);

                // Take top 10
                const topChanges = sortedChanges.slice(0, 10);

                // Get years for all changes
                const allYears = new Set();
                topChanges.forEach(item => {
                    if (item.changesByDate) {
                        Object.keys(item.changesByDate).forEach(date => {
                            const year = new Date(date).getFullYear();
                            allYears.add(year);
                        });
                    }
                });

                // Sort years
                const sortedYears = Array.from(allYears).sort();

                // Create datasets for each title
                const datasets = topChanges.map((item, index) => {
                    // Generate a color based on index
                    const hue = (index * 30) % 360;
                    return {
                        label: item.entityName.replace(/^Title \d+: /, ''),
                        data: sortedYears.map(year => {
                            const yearDate = `${year}-01-01`;
                            return item.changesByDate && item.changesByDate[yearDate]
                                ? item.changesByDate[yearDate]
                                : 0;
                        }),
                        borderColor: `hsl(${hue}, 70%, 50%)`,
                        backgroundColor: `hsla(${hue}, 70%, 50%, 0.5)`,
                    };
                });

                const changeFrequencyChartData = {
                    labels: sortedYears,
                    datasets: datasets,
                };

                setChangeFrequencyData(changeFrequencyChartData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching agency details:', err);
                setError('Failed to load agency details. Please try again later.');
                setLoading(false);
            }
        };

        fetchAgencyDetails();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !agency) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                        {error || 'Agency not found'}
                    </Typography>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to="/agencies"
                        sx={{ mt: 2 }}
                    >
                        Back to Agencies
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Chart options
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top Titles by Word Count',
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: function(value) {
                        const label = this.getLabelForValue(value);
                        // Truncate long title names
                        return label.length > 20 ? label.substr(0, 17) + '...' : label;
                    }
                }
            }
        }
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Historical Changes by Year',
            },
        },
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                variant="outlined"
                component={RouterLink}
                to="/agencies"
                sx={{ mb: 3 }}
            >
                ← Back to Agencies
            </Button>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {agency.name}
                </Typography>
                {agency.acronym && (
                    <Chip label={agency.acronym} color="primary" sx={{ mb: 2 }} />
                )}

                <Typography variant="body1" paragraph>
                    This agency is responsible for {titles.length} title{titles.length !== 1 ? 's' : ''} in the Code of Federal Regulations.
                </Typography>
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
                        {wordCountData && <Bar data={wordCountData} options={barOptions} />}
                        {!wordCountData && <Typography>No word count data available</Typography>}
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
                        {changeFrequencyData && <Line data={changeFrequencyData} options={lineOptions} />}
                        {!changeFrequencyData && <Typography>No change frequency data available</Typography>}
                    </Paper>
                </Grid>

                {/* Titles List */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Titles Published by {agency.name}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {titles.length === 0 ? (
                                <Typography>No titles found for this agency</Typography>
                            ) : (
                                <List>
                                    {titles.map((title) => (
                                        <ListItem
                                            key={title.id}
                                            divider
                                            secondaryAction={
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    component={RouterLink}
                                                    to={`/titles/${title.id}`}
                                                >
                                                    View
                                                </Button>
                                            }
                                        >
                                            <ListItemText
                                                primary={`Title ${title.titleNumber}: ${title.name}`}
                                                secondary={title.wordCount ? `${title.wordCount.toLocaleString()} words` : ''}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AgencyDetails;