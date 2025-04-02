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
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
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
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const TitleDetails = () => {
    const { id } = useParams();
    const [title, setTitle] = useState(null);
    const [sections, setSections] = useState([]);
    const [wordCountData, setWordCountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTitleDetails = async () => {
            try {
                setLoading(true);

                // Fetch title details
                const titleResponse = await apiService.getTitleById(id);
                setTitle(titleResponse.data);

                // Fetch sections for this title
                const sectionsResponse = await apiService.getSectionsByTitle(id);
                setSections(sectionsResponse.data);

                // Fetch section word count data
                const wordCountResponse = await apiService.getWordCountsBySectionForTitle(id);

                // Sort by word count descending and take top 15
                const topSections = wordCountResponse.data
                    .sort((a, b) => b.wordCount - a.wordCount)
                    .slice(0, 15);

                // Create chart data
                const wordCountChartData = {
                    labels: topSections.map(section => {
                        // Truncate long section names
                        const sectionName = section.entityName;
                        return sectionName.length > 25 ? sectionName.substring(0, 22) + '...' : sectionName;
                    }),
                    datasets: [
                        {
                            label: 'Word Count',
                            data: topSections.map(section => section.wordCount),
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
                                'rgba(255, 99, 132, 0.4)',
                                'rgba(54, 162, 235, 0.4)',
                                'rgba(255, 206, 86, 0.4)',
                                'rgba(75, 192, 192, 0.4)',
                                'rgba(153, 102, 255, 0.4)',
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
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                };

                setWordCountData(wordCountChartData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching title details:', err);
                setError('Failed to load title details. Please try again later.');
                setLoading(false);
            }
        };

        fetchTitleDetails();
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

    if (error || !title) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                        {error || 'Title not found'}
                    </Typography>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to="/titles"
                        sx={{ mt: 2 }}
                    >
                        Back to Titles
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Chart options
    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 15,
                    font: {
                        size: 10
                    }
                }
            },
            title: {
                display: true,
                text: 'Top 15 Sections by Word Count',
            },
        },
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                variant="outlined"
                component={RouterLink}
                to="/titles"
                sx={{ mb: 3 }}
            >
                ← Back to Titles
            </Button>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Title {title.titleNumber}: {title.name}
                </Typography>

                {title.agency && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" component="div">
                            Issuing Agency:
                            <Chip
                                label={title.agency.name}
                                color="primary"
                                component={RouterLink}
                                to={`/agencies/${title.agency.id}`}
                                clickable
                                sx={{ ml: 1 }}
                            />
                        </Typography>
                    </Box>
                )}

                <Typography variant="body1">
                    {title.wordCount ? (
                        `This title contains approximately ${title.wordCount.toLocaleString()} words across ${sections.length} sections.`
                    ) : (
                        `This title contains ${sections.length} sections.`
                    )}
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {/* Word Count Chart */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 500,
                        }}
                    >
                        {wordCountData ? (
                            <Pie data={wordCountData} options={pieOptions} />
                        ) : (
                            <Typography>No word count data available</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Sections List */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Sections in Title {title.titleNumber}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {sections.length === 0 ? (
                                <Typography>No sections found for this title</Typography>
                            ) : (
                                <List>
                                    {sections.slice(0, 20).map((section) => (
                                        <ListItem
                                            key={section.id}
                                            divider
                                        >
                                            <ListItemText
                                                primary={`§ ${section.number}: ${section.heading}`}
                                                secondary={section.wordCount ? `${section.wordCount.toLocaleString()} words` : ''}
                                            />
                                        </ListItem>
                                    ))}
                                    {sections.length > 20 && (
                                        <ListItem>
                                            <ListItemText
                                                primary={`... and ${sections.length - 20} more sections`}
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TitleDetails;