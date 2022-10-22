import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root, Home, Overview, Timelog, Calendar } from './routes';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: '/overview/:activeTab',
                element: <Overview />,
            },
            {
                path: '/timelog',
                element: <Timelog />,
            },
            { path: '/calendar', element: <Calendar /> },
        ],
    },
]);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
