import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface NavbarProps {
  currentPage: 'products' | 'cart';
  onNavigate: (page: 'products' | 'cart') => void;
}

// ============================================================================
// NAVBAR COMPONENT
// ============================================================================

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNavigation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onNavigate(currentPage === 'products' ? 'cart' : 'products');
      setIsAnimating(false);
    }, 300);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        {/* Left - Brand Name */}
        <div style={styles.brandContainer}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: '10px' }}
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span style={styles.brandName}>Learline E-commerce</span>
        </div>

        {/* Right - Navigation Button */}
        <button
          onClick={handleNavigation}
          style={{
            ...styles.navButton,
            ...(isAnimating ? styles.navButtonAnimating : {})
          }}
          className="nav-button"
        >
          {currentPage === 'products' ? (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '8px' }}
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="nav-text">Cart</span>
            </>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '8px' }}
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="nav-text">Products</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    width: '100%',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    maxWidth: '100%',
    margin: '0 auto'
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: 'scale(1)'
  },
  navButtonAnimating: {
    transform: 'scale(0.95)',
    opacity: 0.7
  }
};

export default Navbar;