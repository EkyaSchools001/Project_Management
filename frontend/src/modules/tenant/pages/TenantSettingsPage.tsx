import TenantSettings from '../components/TenantSettings';
import { TenantProvider } from '../components/TenantProvider';

export const TenantSettingsPage = () => {
    return (
        <TenantProvider>
            <TenantSettings />
        </TenantProvider>
    );
};

export default TenantSettingsPage;