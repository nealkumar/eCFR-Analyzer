import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import AgencyList from './pages/AgencyList';
import AgencyDetails from './pages/AgencyDetails';
import TitleList from './pages/TitleList';
import TitleDetails from './pages/TitleDetails';
import About from './pages/About';

// Create theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1a237e',
        },
        secondary: {
            main: '#d32f2f',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.8rem',
            fontWeight: 500,
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <div className="App">
                    <Header />
                    <main style={{ padding: '2rem', minHeight: 'calc(100vh - 140px)' }}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/agencies" element={<AgencyList />} />
                            <Route path="/agencies/:id" element={<AgencyDetails />} />
                            <Route path="/titles" element={<TitleList />} />
                            <Route path="/titles/:id" element={<TitleDetails />} />
                            <Route path="/about" element={<About />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;