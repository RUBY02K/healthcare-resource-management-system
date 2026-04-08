import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'

function HospitalDashboard() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, rejected: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'HOSPITAL') {
      navigate('/')
      return
    }
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await api.get('/api/request/all')
      setRequests(res.data)
      setStats({
        total: res.data.length,
        pending: res.data.filter(r => r.status === 'PENDING').length,
        approved: res.data.filter(r => r.status === 'APPROVED').length,
        rejected: res.data.filter(r => r.status === 'REJECTED').length
      })
    } catch (err) {
      console.log(err)
    }
  }

  const getBadgeStyle = (status) => {
    if (status === 'APPROVED') return styles.badgeApproved
    if (status === 'REJECTED') return styles.badgeRejected
    return styles.badgePending
  }

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.topbarTitle}>Hospital Dashboard</div>
          <div style={styles.topbarRight}>
            <button style={styles.dangerBtn} onClick={() => navigate('/blood-requests')}>
              🚨 Emergency Request
            </button>
            <button style={styles.primaryBtn} onClick={() => navigate('/blood-requests')}>
              + New Request
            </button>
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Total Requests</div>
              <div style={{...styles.statVal, color:'#1d4ed8'}}>{stats.total}</div>
              <div style={styles.statChange}>All time</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Pending</div>
              <div style={{...styles.statVal, color:'#d97706'}}>{stats.pending}</div>
              <div style={styles.statChange}>Awaiting approval</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Approved</div>
              <div style={{...styles.statVal, color:'#16a34a'}}>{stats.approved}</div>
              <div style={styles.statChange}>Successfully fulfilled</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Rejected</div>
              <div style={{...styles.statVal, color:'#dc2626'}}>{stats.rejected}</div>
              <div style={styles.statChange}>Insufficient stock</div>
            </div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>📋 My Blood Requests</div>
              <div style={styles.cardLink} onClick={() => navigate('/blood-requests')}>
                New Request →
              </div>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Blood Group</th>
                  <th style={styles.th}>Units</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Note</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan="5" style={styles.emptyMsg}>No requests found</td></tr>
                ) : (
                  requests.map(r => (
                    <tr key={r.id}>
                      <td style={styles.td}>
                        <span style={styles.bloodTag}>{r.bloodGroup}</span>
                      </td>
                      <td style={styles.td}>{r.units}</td>
                      <td style={styles.td}>{r.requestDate}</td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(r.status)}>{r.status}</span>
                      </td>
                      <td style={styles.td}>{r.note || '—'}</td>
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
  topbarRight:{display:'flex',gap:'10px'},
  dangerBtn:{padding:'7px 14px',background:'#dc2626',color:'#fff',border:'none',borderRadius:'7px',fontSize:'12px',fontWeight:'600',cursor:'pointer'},
  primaryBtn:{padding:'7px 14px',background:'#1d4ed8',color:'#fff',border:'none',borderRadius:'7px',fontSize:'12px',fontWeight:'600',cursor:'pointer'},
  content:{padding:'20px 24px',flex:1},
  statsRow:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px',marginBottom:'20px'},
  statBox:{background:'#fff',borderRadius:'12px',padding:'16px',border:'1px solid #e2e8f0'},
  statLabel:{fontSize:'11px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'},
  statVal:{fontSize:'26px',fontWeight:'700',marginBottom:'4px'},
  statChange:{fontSize:'11px',color:'#94a3b8'},
  card:{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden',marginBottom:'16px'},
  cardHeader:{padding:'14px 16px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',justifyContent:'space-between'},
  cardTitle:{fontSize:'13px',fontWeight:'600',color:'#1e293b'},
  cardLink:{fontSize:'11px',color:'#1d4ed8',cursor:'pointer'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{textAlign:'left',padding:'9px 14px',fontSize:'10px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',borderBottom:'1px solid #f1f5f9',fontWeight:'500'},
  td:{padding:'11px 14px',fontSize:'12px',borderBottom:'1px solid #f8fafc',color:'#475569'},
  emptyMsg:{textAlign:'center',color:'#94a3b8',padding:'20px',fontSize:'13px'},
  bloodTag:{display:'inline-block',background:'#eff6ff',color:'#1d4ed8',padding:'2px 8px',borderRadius:'5px',fontSize:'11px',fontWeight:'700',border:'1px solid #bfdbfe'},
  badgePending:{display:'inline-flex',padding:'3px 9px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',background:'#fef3c7',color:'#d97706'},
  badgeApproved:{display:'inline-flex',padding:'3px 9px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',background:'#dcfce7',color:'#16a34a'},
  badgeRejected:{display:'inline-flex',padding:'3px 9px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',background:'#fee2e2',color:'#dc2626'},
}

export default HospitalDashboard