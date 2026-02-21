import { createBrowserRouter } from 'react-router';
import { Dashboard } from './pages/Dashboard';
import { InspectionPage } from './pages/InspectionPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/inspection/:assetId',
    Component: InspectionPage,
  },
]);
