import { createBrowserRouter } from 'react-router';
import { Dashboard } from './pages/Dashboard';
import { InspectionPage } from './pages/InspectionPage';
import { FieldAppPage } from './pages/FieldAppPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/inspection/:assetId',
    Component: InspectionPage,
  },
  {
    path: '/field',
    Component: FieldAppPage,
  },
]);