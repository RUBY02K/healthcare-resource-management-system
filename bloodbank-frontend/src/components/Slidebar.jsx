import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {

  const navigate = useNavigate()

  // Current URL pata karo → active item highlight karne ke liye
  const location = useLocation()

  // Role localStorage se lo
  const role = localStorage.getItem('role')

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  // Current path active hai ya nahi check karo
  const isActive = (path) => location.pathname === path

  return (
    <div style={styles.sidebar}>

      {/* LOGO */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🩺</div>
        <div style={styles.logoText}>
          Life<span style={styles.logoSpan}>Link</span>
        </div>
      </div>

      {/* NAV */}
      <nav style={styles.nav}>

        {/* Overview - sabke liye */}
        <div style={styles.section}>Overview</div>

        {role === 'ADMIN' && (
          <div
            style={isActive('/admin-dashboard') ? styles.itemActive : styles.item}
            onClick={() => navigate('/admin-dashboard')}
          >
            <span style={styles.icon}>🏠</span> Dashboard
          </div>
        )}

        {role === 'HOSPITAL' && (
          <div
            style={isActive('/hospital-dashboard') ? styles.itemActive : styles.item}
            onClick={() => navigate('/hospital-dashboard')}
          >
            <span style={styles.icon}>🏠</span> Dashboard
          </div>
        )}

        {role === 'DONOR' && (
          <div
            style={isActive('/donor-dashboard') ? styles.itemActive : styles.item}
            onClick={() => navigate('/donor-dashboard')}
          >
            <span style={styles.icon}>🏠</span> Dashboard
          </div>
        )}

        {/* Blood Bank - Admin aur Hospital ke liye */}
        {(role === 'ADMIN' || role === 'HOSPITAL') && (
          <>
            <div style={styles.section}>Blood Bank</div>

            {role === 'ADMIN' && (
              <div
                style={isActive('/blood-inventory') ? styles.itemActive : styles.item}
                onClick={() => navigate('/blood-inventory')}
              >
                <span style={styles.icon}>🩸</span> Inventory
              </div>
            )}

            <div
              style={isActive('/blood-requests') ? styles.itemActive : styles.item}
              onClick={() => navigate('/blood-requests')}
            >
              <span style={styles.icon}>📋</span> Blood Requests
            </div>
          </>
        )}

        {/* Donor ke liye Blood section */}
        {role === 'DONOR' && (
          <>
            <div style={styles.section}>Blood</div>
            <div
              style={isActive('/donor-profile') ? styles.itemActive : styles.item}
              onClick={() => navigate('/donor-profile')}
            >
              <span style={styles.icon}>🩸</span> My Profile
            </div>
          </>
        )}

        {/* Organ Donation - sabke liye alag alag */}
        <div style={styles.section}>Organ Donation</div>

        {role === 'ADMIN' && (
          <>
            <div
              style={isActive('/organ-donation') ? styles.itemActive : styles.item}
              onClick={() => navigate('/organ-donation')}
            >
              <span style={styles.icon}>🫀</span> Registry
            </div>
            <div
              style={isActive('/donors-list') ? styles.itemActive : styles.item}
              onClick={() => navigate('/donors-list')}
            >
              <span style={styles.icon}>👥</span> All Donors
            </div>
          </>
        )}

        {role === 'HOSPITAL' && (
          <div
            style={isActive('/organ-requests') ? styles.itemActive : styles.item}
            onClick={() => navigate('/organ-requests')}
          >
            <span style={styles.icon}>🫀</span> Organ Requests
          </div>
        )}

        {role === 'DONOR' && (
          <div
            style={isActive('/my-organs') ? styles.itemActive : styles.item}
            onClick={() => navigate('/my-organs')}
          >
            <span style={styles.icon}>🫀</span> My Organs
          </div>
        )}

      </nav>

      {/* USER INFO + LOGOUT */}
      <div style={styles.userBox}>
        <div style={styles.avatar}>
          {role === 'ADMIN' ? 'AD' : role === 'HOSPITAL' ? 'HP' : 'DN'}
        </div>
        <div>
          <div style={styles.userName}>{role}</div>
          <div style={styles.userRole} onClick={handleLogout}>
            Logout →
          </div>
        </div>
      </div>

    </div>
  )
}

const styles = {
  sidebar: {
    width: '230px',
    background: '#fff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    flexShrink: 0
  },
  logo: {
    padding: '20px 18px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: '#1d4ed8',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px'
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1e293b'
  },
  logoSpan: {
    color: '#1d4ed8'
  },
  nav: {
    padding: '12px 10px',
    flex: 1
  },
  section: {
    fontSize: '9px',
    color: '#94a3b8',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '0 8px',
    margin: '14px 0 5px'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '8px 10px',
    borderRadius: '8px',
    color: '#64748b',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '1px'
  },
  itemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '8px 10px',
    borderRadius: '8px',
    color: '#1d4ed8',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '1px',
    background: '#eff6ff',
    fontWeight: '500'
  },
  icon: {
    fontSize: '15px'
  },
  userBox: {
    padding: '12px 14px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#dbeafe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#1d4ed8',
    flexShrink: 0
  },
  userName: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#1e293b'
  },
  userRole: {
    fontSize: '11px',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '500'
  }
}

export default Sidebar