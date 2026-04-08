import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'

function AdminDashboard() {

  const navigate = useNavigate()

  // Stats store karne ke liye
  const [stats, setStats] = useState({
    totalDonors: 0,
    bloodUnits: 0,
    pendingRequests: 0,
    organRegistrations: 0
  })

  // Blood inventory store karne ke liye
  const [inventory, setInventory] = useState([])

  // useEffect → component load hone pe API call karo
  useEffect(() => {

    // Token check karo → nahi hai toh login pe bhejo
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'ADMIN') {
      navigate('/')
      return
    }

    // Data fetch karo
    fetchData()

  }, [])

  const fetchData = async () => {
    try {
      // Blood inventory fetch karo
      const inventoryRes = await api.get('/api/inventory/all')
      setInventory(inventoryRes.data)

      // Donors count fetch karo
      const donorsRes = await api.get('/api/users/all')

      // Pending requests fetch karo
      const requestsRes = await api.get('/api/request/pending')

      // Organ donations fetch karo
      const organsRes = await api.get('/api/organ/all')

      // Stats update karo
      setStats({
        totalDonors: donorsRes.data.length,
        bloodUnits: inventoryRes.data.reduce((sum, item) => sum + item.units, 0),
        pendingRequests: requestsRes.data.length,
        organRegistrations: organsRes.data.length
      })

    } catch (err) {
      console.log('Error fetching data:', err)
    }
  }

  return (
    <div style={styles.layout}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div style={styles.main}>

        {/* TOPBAR */}
        <div style={styles.topbar}>
          <div style={styles.topbarTitle}>Admin Dashboard</div>
          <div style={styles.topbarRight}>
            <button
              style={styles.dangerBtn}
              onClick={() => navigate('/blood-requests')}
            >
              🚨 View Emergencies
            </button>
            <button
              style={styles.outlineBtn}
              onClick={() => navigate('/blood-inventory')}
            >
              + Add Blood Units
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>

          {/* STATS ROW */}
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Total Donors</div>
              <div style={{...styles.statVal, color: '#1d4ed8'}}>{stats.totalDonors}</div>
              <div style={styles.statChange}>All registered donors</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Blood Units</div>
              <div style={{...styles.statVal, color: '#16a34a'}}>{stats.bloodUnits}</div>
              <div style={styles.statChange}>Total available units</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Pending Requests</div>
              <div style={{...styles.statVal, color: '#d97706'}}>{stats.pendingRequests}</div>
              <div style={styles.statChange}>Awaiting approval</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Organ Registrations</div>
              <div style={{...styles.statVal, color: '#1d4ed8'}}>{stats.organRegistrations}</div>
              <div style={styles.statChange}>Total registrations</div>
            </div>
          </div>

          {/* BLOOD INVENTORY */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>🩸 Blood Inventory</div>
              <div
                style={styles.cardLink}
                onClick={() => navigate('/blood-inventory')}
              >
                Manage →
              </div>
            </div>
            <div style={styles.bloodGrid}>
              {inventory.length === 0 ? (
                <div style={styles.emptyMsg}>No inventory data found</div>
              ) : (
                inventory.map((item) => (
                  <div
                    key={item.id}
                    style={
                      item.units < 50
                        ? styles.bloodItemCritical
                        : item.units < 100
                        ? styles.bloodItemLow
                        : styles.bloodItemGood
                    }
                  >
                    <div style={styles.bloodType}>{item.bloodGroup}</div>
                    <div style={styles.bloodUnits}>{item.units} units</div>
                    <div style={styles.bloodBar}>
                      <div
                        style={{
                          ...styles.bloodFill,
                          width: `${Math.min((item.units / 500) * 100, 100)}%`,
                          background: item.units < 50 ? '#dc2626' : item.units < 100 ? '#d97706' : '#16a34a'
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>⚡ Quick Actions</div>
            </div>
            <div style={styles.quickGrid}>
              <div style={styles.quickItem} onClick={() => navigate('/donors-list')}>
                <div style={styles.quickIcon}>👥</div>
                <div style={styles.quickLabel}>View All Donors</div>
              </div>
              <div style={styles.quickItem} onClick={() => navigate('/blood-inventory')}>
                <div style={styles.quickIcon}>🩸</div>
                <div style={styles.quickLabel}>Blood Inventory</div>
              </div>
              <div style={styles.quickItem} onClick={() => navigate('/blood-requests')}>
                <div style={styles.quickIcon}>📋</div>
                <div style={styles.quickLabel}>Blood Requests</div>
              </div>
              <div style={styles.quickItem} onClick={() => navigate('/organ-donation')}>
                <div style={styles.quickIcon}>🫀</div>
                <div style={styles.quickLabel}>Organ Registry</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh'
  },
  main: {
    flex: 1,
    background: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  topbar: {
    background: '#fff',
    padding: '14px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topbarTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1e293b'
  },
  topbarRight: {
    display: 'flex',
    gap: '10px'
  },
  dangerBtn: {
    padding: '7px 14px',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  outlineBtn: {
    padding: '7px 14px',
    background: '#fff',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '7px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  content: {
    padding: '20px 24px',
    flex: 1
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
    marginBottom: '20px'
  },
  statBox: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e2e8f0'
  },
  statLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px'
  },
  statVal: {
    fontSize: '26px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  statChange: {
    fontSize: '11px',
    color: '#94a3b8'
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  cardHeader: {
    padding: '14px 16px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b'
  },
  cardLink: {
    fontSize: '11px',
    color: '#1d4ed8',
    cursor: 'pointer'
  },
  bloodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '14px'
  },
  bloodItemGood: {
    background: '#f0fdf4',
    borderRadius: '9px',
    padding: '12px 8px',
    textAlign: 'center',
    border: '1px solid #dcfce7'
  },
  bloodItemLow: {
    background: '#fffbeb',
    borderRadius: '9px',
    padding: '12px 8px',
    textAlign: 'center',
    border: '1px solid #fef3c7'
  },
  bloodItemCritical: {
    background: '#fff1f2',
    borderRadius: '9px',
    padding: '12px 8px',
    textAlign: 'center',
    border: '1px solid #fee2e2'
  },
  bloodType: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '3px',
    color: '#1e293b'
  },
  bloodUnits: {
    fontSize: '10px',
    color: '#94a3b8',
    marginBottom: '7px'
  },
  bloodBar: {
    height: '4px',
    background: '#f1f5f9',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  bloodFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s'
  },
  emptyMsg: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#94a3b8',
    padding: '20px',
    fontSize: '13px'
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '14px'
  },
  quickItem: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '9px',
    padding: '16px',
    textAlign: 'center',
    cursor: 'pointer'
  },
  quickIcon: {
    fontSize: '22px',
    marginBottom: '6px'
  },
  quickLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '500'
  }
}

export default AdminDashboard