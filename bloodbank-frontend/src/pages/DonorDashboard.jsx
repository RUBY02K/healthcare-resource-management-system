import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'

function DonorDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [eligible, setEligible] = useState(null)
  const [organs, setOrgans] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'DONOR') {
      navigate('/')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (userId) {
        const profileRes = await api.get(`/api/donor/profile/${userId}`)
        setProfile(profileRes.data)
        const eligibleRes = await api.get(`/api/donor/eligible/${userId}`)
        setEligible(eligibleRes.data.eligible)
        const organsRes = await api.get(`/api/organ/donor/${userId}`)
        setOrgans(organsRes.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.topbarTitle}>Donor Dashboard</div>
          <div style={styles.topbarRight}>
            <button style={styles.primaryBtn} onClick={() => navigate('/my-organs')}>
              + Register Organ
            </button>
            <button style={styles.outlineBtn}>
              Check Eligibility
            </button>
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Blood Group</div>
              <div style={{...styles.statVal, color:'#1d4ed8'}}>
                {profile ? profile.bloodGroup : '—'}
              </div>
              <div style={styles.statChange}>My blood type</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Eligibility</div>
              <div style={{...styles.statVal, color: eligible ? '#16a34a' : '#dc2626'}}>
                {eligible === null ? '—' : eligible ? 'Eligible' : 'Not Yet'}
              </div>
              <div style={styles.statChange}>
                {eligible ? 'Ready to donate' : '90 days not complete'}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>City</div>
              <div style={{...styles.statVal, color:'#1d4ed8', fontSize:'18px'}}>
                {profile ? profile.city : '—'}
              </div>
              <div style={styles.statChange}>Your location</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Organs Registered</div>
              <div style={{...styles.statVal, color:'#1d4ed8'}}>{organs.length}</div>
              <div style={styles.statChange}>Active registrations</div>
            </div>
          </div>

          {/* Profile Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>👤 My Donor Profile</div>
            </div>
            <div style={{padding:'16px'}}>
              {profile ? (
                <table style={styles.table}>
                  <tbody>
                    <tr>
                      <td style={styles.tdLabel}>Blood Group</td>
                      <td style={styles.td}><span style={styles.bloodTag}>{profile.bloodGroup}</span></td>
                    </tr>
                    <tr>
                      <td style={styles.tdLabel}>Phone</td>
                      <td style={styles.td}>{profile.phone}</td>
                    </tr>
                    <tr>
                      <td style={styles.tdLabel}>City</td>
                      <td style={styles.td}>{profile.city}</td>
                    </tr>
                    <tr>
                      <td style={styles.tdLabel}>Last Donated</td>
                      <td style={styles.td}>{profile.lastDonationDate || 'Never'}</td>
                    </tr>
                    <tr>
                      <td style={styles.tdLabel}>Eligibility</td>
                      <td style={styles.td}>
                        <span style={eligible ? styles.badgeApproved : styles.badgeRejected}>
                          {eligible ? 'Eligible ✓' : 'Not Eligible'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div style={styles.emptyMsg}>
                  No profile found.
                  <span style={{color:'#1d4ed8',cursor:'pointer',marginLeft:'6px'}}
                    onClick={() => navigate('/donor-profile')}>
                    Create Profile →
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Organs */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>🫀 My Organ Registrations</div>
              <div style={styles.cardLink} onClick={() => navigate('/my-organs')}>
                Add More →
              </div>
            </div>
            <div style={{padding:'14px',display:'flex',flexDirection:'column',gap:'8px'}}>
              {organs.length === 0 ? (
                <div style={styles.emptyMsg}>No organs registered yet</div>
              ) : (
                organs.map(o => (
                  <div key={o.id} style={styles.organRow}>
                    <span style={{fontSize:'20px'}}>🫘</span>
                    <div>
                      <div style={{fontSize:'12px',fontWeight:'500',color:'#1e293b'}}>{o.organType}</div>
                      <div style={{fontSize:'10px',color:'#94a3b8'}}>{o.registrationDate}</div>
                    </div>
                    <span style={o.status === 'MATCHED' ? styles.badgeApproved : styles.badgeRegistered}>
                      {o.status}
                    </span>
                  </div>
                ))
              )}
            </div>
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
  primaryBtn:{padding:'7px 14px',background:'#1d4ed8',color:'#fff',border:'none',borderRadius:'7px',fontSize:'12px',fontWeight:'600',cursor:'pointer'},
  outlineBtn:{padding:'7px 14px',background:'#fff',color:'#64748b',border:'1px solid #e2e8f0',borderRadius:'7px',fontSize:'12px',cursor:'pointer'},
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
  tdLabel:{padding:'10px 14px',fontSize:'12px',color:'#94a3b8',width:'140px',borderBottom:'1px solid #f8fafc'},
  td:{padding:'10px 14px',fontSize:'12px',color:'#475569',borderBottom:'1px solid #f8fafc'},
  emptyMsg:{textAlign:'center',color:'#94a3b8',padding:'20px',fontSize:'13px'},
  bloodTag:{display:'inline-block',background:'#eff6ff',color:'#1d4ed8',padding:'2px 8px',borderRadius:'5px',fontSize:'11px',fontWeight:'700',border:'1px solid #bfdbfe'},
  badgeApproved:{display:'inline-flex',padding:'3px 9px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',background:'#dcfce7',color:'#16a34a',marginLeft:'auto'},
  badgeRejected:{display:'inline-flex',padding:'3px 9px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',background:'#fee2e2',color:'#dc2626',marginLeft:'auto'},
  badgeRegistered:{display:'inline-flex',padding:'3px 9px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',background:'#dbeafe',color:'#1d4ed8',marginLeft:'auto'},
  organRow:{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:'#f0fdf4',borderRadius:'9px',border:'1px solid #dcfce7'},
}

export default DonorDashboard