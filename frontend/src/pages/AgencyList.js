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
} from '@mui/material';
import axios from 'axios';
import apiService from '../services/apiService';

const AgencyList = () => {
    const [agencies, setAgencies] = useState([]);
    const [filteredAgencies, setFilteredAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                setLoading(true);
                const response = await apiService.getAllAgencies();
                setAgencies(response.data);
                setFilteredAgencies(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching agencies:', err);
                setError('Failed to load agencies. Please try again later.');
                setLoading(false);
            }
        };

        fetchAgencies();
    }, []);

    useEffect(() => {
        const results = agencies.filter(agency =>
            agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (agency.acronym && agency.acronym.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredAgencies(results);
        setPage(0);
    }, [searchTerm, agencies]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                Federal Agencies
            </Typography>

            <Box sx={{ mb: 3 }}>
                <TextField
                    label="Search agencies"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="agencies table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Agency Name</TableCell>
                            <TableCell>Acronym</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAgencies
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((agency) => (
                                <TableRow key={agency.id}>
                                    <TableCell component="th" scope="row">
                                        {agency.name}
                                    </TableCell>
                                    <TableCell>{agency.acronym}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            component={RouterLink}
                                            to={`/agencies/${agency.id}`}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        {filteredAgencies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No agencies found matching your search criteria
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredAgencies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
};

export default AgencyList;