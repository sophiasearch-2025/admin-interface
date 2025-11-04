import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import type { ActiveView } from '../../types/navigation';
import './Layout.css';

// Importar las funcionalidades
import DataManagement from '../../features/data-management/DataManagement';
import MediaManagement from '../../features/media-management/MediaManagement';
import ScrapingConfig from '../../features/scraping-config/ScrapingConfig';
import ErrorNotifications from '../../features/error-notifications/ErrorNotifications';
import BackupManagement from '../../features/backup-management/BackupManagement';
import UserManagement from '../../features/user-management/UserManagement';

const Layout = () => {
  const [activeView, setActiveView] = useState<ActiveView>('data-management');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const renderContent = () => {
    switch (activeView) {
      case 'data-management':
        return <DataManagement />;
      case 'media-management':
        return <MediaManagement />;
      case 'scraping-config':
        return <ScrapingConfig />;
      case 'error-notifications':
        return <ErrorNotifications />;
      case 'backup-management':
        return <BackupManagement />;
      case 'user-management':
        return <UserManagement />;
      default:
        return <DataManagement />;
    }
  };

  return (
    <div className="layout">
      <Header sidebarCollapsed={sidebarCollapsed} />
      <div className="layout-body">
        <Sidebar 
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`content ${sidebarCollapsed ? 'content-expanded' : ''}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;