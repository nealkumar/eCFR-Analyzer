import axios from 'axios';

// Set default base URL for the API
const API_URL = process.env.REACT_APP_API_BASE_URL || '/ecfr-analyzer';

// Create an axios instance with a base URL
const api = axios.create({
    baseURL: API_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// API service functions
const apiService = {
    // Status
    getStatus: () => {
        return api.get('/api/status');
    },

    // Agencies
    getAllAgencies: () => {
        return api.get('/api/agencies');
    },

    getAgencyById: (id) => {
        return api.get(`/api/agencies/${id}`);
    },

    searchAgencies: (name) => {
        return api.get(`/api/agencies/search?name=${encodeURIComponent(name)}`);
    },

    getTitlesByAgency: (agencyId) => {
        return api.get(`/api/agencies/${agencyId}/titles`);
    },

    getAgenciesByTitleCount: () => {
        return api.get('/api/agencies/by-title-count');
    },

    // Titles
    getAllTitles: () => {
        return api.get('/api/titles');
    },

    getTitleById: (id) => {
        return api.get(`/api/titles/${id}`);
    },

    getTitleByNumber: (number) => {
        return api.get(`/api/titles/number/${number}`);
    },

    searchTitles: (name) => {
        return api.get(`/api/titles/search?name=${encodeURIComponent(name)}`);
    },

    getSectionsByTitle: (titleId) => {
        return api.get(`/api/titles/${titleId}/sections`);
    },

    getTitlesByWordCount: () => {
        return api.get('/api/titles/by-word-count');
    },

    // Analytics
    getWordCountsByAgency: () => {
        return api.get('/api/analytics/word-count/by-agency');
    },

    getWordCountsByTitle: () => {
        return api.get('/api/analytics/word-count/by-title');
    },

    getWordCountsBySectionForTitle: (titleId) => {
        return api.get(`/api/analytics/word-count/by-section/title/${titleId}`);
    },

    getChangeFrequencyByAgency: () => {
        return api.get('/api/analytics/change-frequency/by-agency');
    },

    getChangeFrequencyByTitle: () => {
        return api.get('/api/analytics/change-frequency/by-title');
    },

    getSummary: () => {
        return api.get('/api/analytics/summary');
    }
};

export default apiService;