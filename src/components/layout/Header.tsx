
import './Header.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header = ({ sidebarCollapsed }: HeaderProps) => {
  const [fade, setFade] = useState(!sidebarCollapsed);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setFade(!sidebarCollapsed);
  }, [sidebarCollapsed]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-section')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="header">
      <div className="logo-section">
        <div className="logo" style={{ position: 'relative', width: '32px', height: '32px' }}>
          <img
            src="/LogoSophia1.png"
            alt="Sophia Logo 1"
            className="logo-image"
            style={{ position: 'absolute', left: 0, top: 0 }}
          />
          <img
            src="/LogoSophia2.png"
            alt="Sophia Logo 2"
            className={`logo-image${fade ? ' fade-in' : ' fade-out'}`}
            style={{ position: 'absolute', left: 0, top: 0 }}
          />
        </div>
      </div>
      <div className="user-section">
        <button 
          className="user-button" 
          onClick={toggleDropdown}
          aria-expanded={dropdownOpen}
        >
          <span className="user-name">{user ? user.username : 'Guest'}</span>
          <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
        </button>
        
        {dropdownOpen && (
          <div className="user-dropdown">
            <hr className="dropdown-divider" />
            <button className="dropdown-item logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;