import { useNavigate } from 'react-router';
import { AssetInspection } from '../components/AssetInspection';

export function InspectionPage() {
  const navigate = useNavigate();

  return <AssetInspection onBack={() => navigate('/')} />;
}
