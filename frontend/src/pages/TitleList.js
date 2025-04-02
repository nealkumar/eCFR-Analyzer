import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Box,
    CircularProgress,
    TablePagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid
} from '@mui/material';
import axios from 'axios';
import apiService from '../services/apiService';

const TitleList = () => {
    const [titles, setTitles] = useState([]);
    const [filteredTitles, setFilteredTitles] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAgency, setSelectedAgency] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState('number');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch titles
                const titlesResponse = await apiService.getAllTitles();
                setTitles(titlesResponse.data);
                setFilteredTitles(titlesResponse.data);

                // Fetch agencies for filter
                const agenciesResponse = await apiService.getAllAgencies();
                setAgencies(agenciesResponse.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching titles:', err);
                setError('Failed to load titles. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Filter titles based on search term and selected agency
        let results = titles;

        if (searchTerm) {
            results = results.filter(title =>
                title.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                title.titleNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedAgency) {
            results = results.filter(title =>
                title.agency && title.agency.id === selectedAgency
            );
        }

        // Sort results
        results = [...results].sort((a, b) => {
            if (sortOrder === 'number') {
                // Sort by title number (numeric)
                return parseInt(a.titleNumber) - parseInt(b.titleNumber);
            } else if (sortOrder === 'name') {
                // Sort by name (alphabetical)
                return a.name.localeCompare(b.name);
            } else if (sortOrder === 'wordCount') {
                // Sort by word count (descending)
                const countA = a.wordCount || 0;
                const countB = b.wordCount || 0;
                return countB - countA;
            }
            return 0;
        });

        setFilteredTitles(results);
        setPage(0);
    }, [searchTerm, selectedAgency, titles, sortOrder]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAgencyChange = (event) => {
        setSelectedAgency(event.target.value);
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                        {error}
                    </Typography>
                    <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                        Retry
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Code of Federal Regulations Titles
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Search titles"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="agency-filter-label">Filter by Agency</InputLabel>
                            <Select
                                labelId="agency-filter-label"
                                id="agency-filter"
                                value={selectedAgency}
                                label="Filter by Agency"
                                onChange={handleAgencyChange}
                            >
                                <MenuItem value="">
                                    <em>All Agencies</em>
                                </MenuItem>
                                {agencies.map((agency) => (
                                    <MenuItem key={agency.id} value={agency.id}>
                                        {agency.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="sort-order-label">Sort By</InputLabel>
                            <Select
                                labelId="sort-order-label"
                                id="sort-order"
                                value={sortOrder}
                                label="Sort By"
                                onChange={handleSortOrderChange}
                            >
                                <MenuItem value="number">Title Number</MenuItem>
                                <MenuItem value="name">Title Name (A-Z)</MenuItem>
                                <MenuItem value="wordCount">Word Count (High to Low)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="titles table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title Number</TableCell>
                            <TableCell>Title Name</TableCell>
                            <TableCell>Issuing Agency</TableCell>
                            <TableCell align="right">Word Count</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTitles
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((title) => (
                                <TableRow key={title.id}>
                                    <TableCell>{title.titleNumber}</TableCell>
                                    <TableCell>{title.name}</TableCell>
                                    <TableCell>
                                        {title.agency ? (
                                            <RouterLink to={`/agencies/${title.agency.id}`}>
                                                {title.agency.name}
                                            </RouterLink>
                                        ) : (
                                            'N/A'
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {title.wordCount ? title.wordCount.toLocaleString() : 'N/A'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            component={RouterLink}
                                            to={`/titles/${title.id}`}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        {filteredTitles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No titles found matching your search criteria
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredTitles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
};

export default TitleList;