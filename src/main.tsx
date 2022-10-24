import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root, Home, Overview, Timer, Calendar, RouteError } from './routes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <RouteError />,
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
                path: '/overview',
                element: <Overview />,
            },
            {
                path: '/timer',
                element: <Timer />,
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
