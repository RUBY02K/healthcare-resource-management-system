import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'

function DonorsList() {
  const navigate = useNavigate()
  const [donors, setDonors] = useState([])
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/'); return }
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    try {
      const res = await api.get('/api/donor/all')
      setDonors(res.data)
    } catch (err) { console.log(err) }
  }

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

  const filteredDonors = filter === 'ALL'
    ? donors
    : donors.filter(d => d.bloodGroup === filter)

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.topbarTitle}>All Donors</div>
        </div>
        <div style={styles.content}>

          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Total Donors</div>
              <div style={{...styles.statVal, color:'#1d4ed8'}}>{donors.length}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>O+ Donors</div>
              <div style={{...styles.statVal, color:'#16a34a'}}>
                {donors.filter(d => d.bloodGroup === 'O+').length}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>O- Donors</div>
              <div style={{...styles.statVal, color:'#dc2626'}}>
                {donors.filter(d => d.bloodGroup === 'O-').length}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Showing</div>
              <div style={{...styles.statVal, color:'#d97706'}}>
                {filteredDonors.length}
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={styles.filterRow}>
            {bloodGroups.map(g => (
              <button
                key={g}
                style={filter === g ? styles.filterActive : styles.filterBtn}
                onClick={() => setFilter(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>👥 Donors List</div>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Blood Group</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>Last Donation</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.length === 0 ? (
                  <tr><td colSpan="5" style={styles.emptyMsg}>No donors found</td></tr>
                ) : (
                  filteredDonors.map(d => (
                    <tr key={d.id}>
                      <td style={styles.td}>
                        <div style={styles.donorName}>
                          <div style={styles.avatar}>
                            {d.user?.name?.charAt(0) || 'D'}
                          </div>
                          {d.user?.name || 'Donor'}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.bloodTag}>{d.bloodGroup}</span>
                      </td>
                      <td style={styles.td}>{d.phone || '—'}</td>
                      <td style={styles.td}>{d.city || '—'}</td>
                      <td style={styles.td}>{d.lastDonationDate || 'Never'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  layout:{display:'flex',minHeight:'100vh'},
  main:{flex:1,background:'#f8fafc',display:'flex',flexDirection:'column',minWidth:0},
  topbar:{background:'#fff',padding:'14px 24px',borderBottom:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'space-between'},
  topbarTitle:{fontSize:'17px',fontWeight:'700',color:'#1e293b'},
  content:{padding:'20px 24px',flex:1},
  statsRow:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px',marginBottom:'20px'},
  statBox:{background:'#fff',borderRadius:'12px',padding:'16px',border:'1px solid #e2e8f0'},
  statLabel:{fontSize:'11px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'},
  statVal:{fontSize:'26px',fontWeight:'700',marginBottom:'4px'},
  filterRow:{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'},
  filterBtn:{padding:'6px 14px',background:'#fff',border:'1px solid #e2e8f0',borderRadius:'20px',fontSize:'12px',color:'#64748b',cursor:'pointer'},
  filterActive:{padding:'6px 14px',background:'#1d4ed8',border:'1px solid #1d4ed8',borderRadius:'20px',fontSize:'12px',color:'#fff',cursor:'pointer',fontWeight:'600'},
  card:{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden'},
  cardHeader:{padding:'14px 16px',borderBottom:'1px solid #f1f5f9'},
  cardTitle:{fontSize:'13px',fontWeight:'600',color:'#1e293b'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{textAlign:'left',padding:'9px 14px',fontSize:'10px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',borderBottom:'1px solid #f1f5f9',fontWeight:'500'},
  td:{padding:'11px 14px',fontSize:'12px',borderBottom:'1px solid #f8fafc',color:'#475569'},
  emptyMsg:{textAlign:'center',color:'#94a3b8',padding:'20px',fontSize:'13px'},
  bloodTag:{display:'inline-block',background:'#eff6ff',color:'#1d4ed8',padding:'2px 8px',borderRadius:'5px',fontSize:'11px',fontWeight:'700',border:'1px solid #bfdbfe'},
  donorName:{display:'flex',alignItems:'center',gap:'8px'},
  avatar:{width:'28px',height:'28px',borderRadius:'50%',background:'#dbeafe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'700',color:'#1d4ed8'},
}

export default DonorsList