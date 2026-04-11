// Sidebar.jsx → Saare dashboards mein common sidebar
// useNavigate → pages navigate karne ke liye
// useLocation → current page highlight karne ke liye
import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()

  // Current URL pata karo → active item highlight karne ke liye
  const location = useLocation()

  // Role aur name localStorage se lo
  const role = localStorage.getItem('role')
  const name = localStorage.getItem('name')

  // Logout → localStorage clear karo aur login pe bhejo
  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  // Current path active hai ya nahi check karo
  const isActive = (path) => location.pathname === path

  // Nav item helper function → har item ke liye same code nahi likhna
  const item = (path, icon, label) => (
    <div
      style={isActive(path) ? styles.itemActive : styles.item}
      onClick={() => navigate(path)}
    >
      <span style={styles.icon}>{icon}</span> {label}
    </div>
  )

  return (
    <div style={styles.sidebar}>

      {/* LOGO */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🩺</div>
        <div style={styles.logoText}>
          Life<span style={styles.logoSpan}>Link</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav style={styles.nav}>

        {/* Dashboard - role ke hisaab se alag alag route */}
        <div style={styles.section}>Overview</div>
        {role === 'ADMIN' && item('/admin-dashboard', '🏠', 'Dashboard')}
        {role === 'HOSPITAL' && item('/hospital-dashboard', '🏠', 'Dashboard')}
        {role === 'DONOR' && item('/donor-dashboard', '🏠', 'Dashboard')}

        {/* Admin ke liye saare sections */}
        {role === 'ADMIN' && (
          <>
            <div style={styles.section}>Blood Bank</div>
            {item('/blood-inventory', '🩸', 'Inventory')}
            {item('/blood-requests', '📋', 'Blood Requests')}
            <div style={styles.section}>Organ Donation</div>
            {item('/organ-donation', '🫀', 'Registry')}
            {item('/donors-list', '👥', 'All Donors')}
          </>
        )}

        {/* Hospital ke liye limited sections */}
        {role === 'HOSPITAL' && (
          <>
            <div style={styles.section}>Blood Bank</div>
            {item('/blood-requests', '📋', 'Blood Requests')}
            <div style={styles.section}>Organ</div>
            {item('/organ-donation', '🫀', 'Organ Requests')}
          </>
        )}

        {/* Donor ke liye sirf apna section */}
        {role === 'DONOR' && (
          <>
            <div style={styles.section}>Blood</div>
            {item('/donor-dashboard', '🩸', 'My Profile')}
            <div style={styles.section}>Organ</div>
            {item('/organ-donation', '🫀', 'My Organs')}
          </>
        )}

      </nav>

      {/* USER INFO + LOGOUT */}
      <div style={styles.userBox}>
        {/* Avatar → naam ka pehla letter */}
        <div style={styles.avatar}>
          {name ? name.charAt(0).toUpperCase() : role?.charAt(0)}
        </div>
        <div style={{flex:1}}>
          <div style={styles.userName}>{name || role}</div>
          <div style={styles.userRole}>{role}</div>
        </div>
        {/* Logout button */}
        <div style={styles.logoutBtn} onClick={handleLogout} title="Logout">↩</div>
      </div>

    </div>
  )
}

const styles = {
  sidebar:{width:'230px',background:'#fff',borderRight:'1px solid #e2e8f0',display:'flex',flexDirection:'column',minHeight:'100vh',flexShrink:0},
  logo:{padding:'20px 18px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:'10px'},
  logoIcon:{width:'32px',height:'32px',background:'#1d4ed8',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px'},
  logoText:{fontSize:'18px',fontWeight:'800',color:'#1e293b'},
  logoSpan:{color:'#1d4ed8'},
  nav:{padding:'12px 10px',flex:1},
  section:{fontSize:'9px',color:'#94a3b8',letterSpacing:'2px',textTransform:'uppercase',padding:'0 8px',margin:'14px 0 5px'},
  item:{display:'flex',alignItems:'center',gap:'9px',padding:'8px 10px',borderRadius:'8px',color:'#64748b',fontSize:'13px',cursor:'pointer',marginBottom:'1px'},
  itemActive:{display:'flex',alignItems:'center',gap:'9px',padding:'8px 10px',borderRadius:'8px',color:'#1d4ed8',fontSize:'13px',cursor:'pointer',marginBottom:'1px',background:'#eff6ff',fontWeight:'500'},
  icon:{fontSize:'15px'},
  userBox:{padding:'12px 14px',borderTop:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:'10px'},
  avatar:{width:'32px',height:'32px',borderRadius:'50%',background:'#dbeafe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'700',color:'#1d4ed8',flexShrink:0},
  userName:{fontSize:'12px',fontWeight:'500',color:'#1e293b'},
  userRole:{fontSize:'10px',color:'#94a3b8'},
  logoutBtn:{fontSize:'16px',cursor:'pointer',color:'#dc2626',padding:'4px'},
}

export default Sidebar