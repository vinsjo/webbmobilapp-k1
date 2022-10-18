import React from 'react';
import ReactDOM from 'react-dom/client';
import TimeTrackerProvider from './context/TimeTracker';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <TimeTrackerProvider>
            <App />
        </TimeTrackerProvider>
    </React.StrictMode>
);
