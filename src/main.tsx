import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoadingOverlay from './components/LoadingOverlay';

import { Root, Overview, TimeTracker, Calendar, RouteError } from './routes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <RouteError />,
        children: [
            {
                index: true,
                element: <TimeTracker />,
            },
            {
                path: '/overview/:activeTab',
                element: <Overview />,
            },
            {
                path: '/overview',
                element: <Overview />,
            },
            { path: '/calendar', element: <Calendar /> },
        ],
    },
]);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} fallbackElement={<LoadingOverlay />} />
    </React.StrictMode>
);
