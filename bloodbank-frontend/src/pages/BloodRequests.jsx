import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'

function BloodRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    bloodGroup: 'A+', units: '', note: ''
  })
  const role = localStorage.getItem('role')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/'); return }
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await api.get('/api/request/all')
      setRequests(res.data)
    } catch (err) { console.log(err) }
  }

  const handleCreate = async () => {
    try {
      await api.post(`/api/request/create/${userId}`, form)
      setMessage('Request created successfully!')
      setShowForm(false)
      fetchRequests()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) { setMessage('Error creating request!') }
  }

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/request/approve/${id}`)
      setMessage('Request approved!')
      fetchRequests()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) { setMessage('Error approving!') }
  }

  const handleReject = async (id) => {
    try {
      await api.post(`/api/request/reject/${id}`)
      setMessage('Request rejected!')
      fetchRequests()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) { setMessage('Error rejecting!') }
  }

  const getBadge = (status) => {
    if (status === 'APPROVED') return styles.badgeApproved
    if (status === 'REJECTED') return styles.badgeRejected
    return styles.badgePending
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.topbarTitle}>Blood Requests</div>
          <div style={styles.topbarRight}>
            {role === 'HOSPITAL' && (
              <button style={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>
                + New Request
              </button>
            )}
          </div>
        </div>
        <div style={styles.content}>

          {message && (
            <div style={message.includes('Error') ? styles.errorBox : styles.successBox}>
              {message}
            </div>
          )}

          {showForm && role === 'HOSPITAL' && (
            <div style={styles.formCard}>
              <div style={styles.formTitle}>New Blood Request</div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Blood Group</label>
                  <select
                    style={styles.input}
                    value={form.bloodGroup}
                    onChange={e => setForm({...form, bloodGroup: e.target.value})}
                  >
                    {bloodGroups.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Units Required</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Enter units"
                    value={form.units}
                    onChange={e => setForm({...form, units: e.target.value})}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Note</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Reason for request"
                    value={form.note}
                    onChange={e => setForm({...form, note: e.target.value})}
                  />
                </div>
              </div>
              <div style={{display:'flex', gap:'10px'}}>
                <button style={styles.primaryBtn} onClick={handleCreate}>Submit</button>
                <button style={styles.outlineBtn} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Total</div>
              <div style={{...styles.statVal, color:'#1d4ed8'}}>{requests.length}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Pending</div>
              <div style={{...styles.statVal, color:'#d97706'}}>
                {requests.filter(r => r.status === 'PENDING').length}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Approved</div>
              <div style={{...styles.statVal, color:'#16a34a'}}>
                {requests.filter(r => r.status === 'APPROVED').length}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Rejected</div>
              <div style={{...styles.statVal, color:'#dc2626'}}>
                {requests.filter(r => r.status === 'REJECTED').length}
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>📋 All Blood Requests</div>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Blood Group</th>
                  <th style={styles.th}>Units</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Note</th>
                  <th style={styles.th}>Status</th>
                  {role === 'ADMIN' && <th style={styles.th}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan="6" style={styles.emptyMsg}>No requests found</td></tr>
                ) : (
                  requests.map(r => (
                    <tr key={r.id}>
                      <td style={styles.td}>
                        <span style={styles.bloodTag}>{r.bloodGroup}</span>
                      </td>
                      <td style={styles.td}>{r.units}</td>
                      <td style={styles.td}>{r.requestDate}</td>
                      <td style={styles.td}>{r.note || '—'}</td>
                      <td style={styles.td}>
                        <span style={getBadge(r.status)}>{r.status}</span>
                      </td>
                      {role === 'ADMIN' && (
                        <td style={styles.td}>
                          {r.status === 'PENDING' && (
                            <div style={{display:'flex', gap:'6px'}}>
                              <button style={styles.approveBtn} onClick={() => handleApprove(r.id)}>
                                Approve
                              </button>
                              <button style={styles.rejectBtn} onClick={() => handleReject(r.id)}>
                                Reject
                              </button>
                            </div>
                          )}
                          {r.status !== 'PENDING' && '—'}
                        </td>
                      )}
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
  primaryBtn:{padding:'7px 14px',background:'#1d4ed8',color:'#fff',border:'none',borderRadius:'7px',fontSize:'12px',fontWeight:'600',cursor:'pointer'},
  outlineBtn:{padding:'7px 14px',background:'#fff',color:'#64748b',border:'1px solid #e2e8f0',borderRadius:'7px',fontSize:'12px',cursor:'pointer'},
  approveBtn:{padding:'4px 10px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'5px',fontSize:'10px',fontWeight:'600',cursor:'pointer'},
  rejectBtn:{padding:'4px 10px',background:'#dc2626',color:'#fff',border:'none',borderRadius:'5px',fontSize:'10px',fontWeight:'600',cursor:'pointer'},
  content:{padding:'20px 24px',flex:1},
  successBox:{background:'#dcfce7',color:'#16a34a',padding:'10px 14px',borderRadius:'8px',fontSize:'12px',marginBottom:'16px'},
  errorBox:{background:'#fee2e2',color:'#dc2626',padding:'10px 14px',borderRadius:'8px',fontSize:'12px',marginBottom:'16px'},
  formCard:{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'20px',marginBottom:'16px'},
  formTitle:{fontSize:'14px',fontWeight:'600',color:'#1e293b',marginBottom:'16px'},
  formRow:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'16px'},
  formGroup:{display:'flex',flexDirection:'column',gap:'5px'},
  label:{fontSize:'11px',fontWeight:'500',color:'#475569'},
  input:{padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:'8px',fontSize:'12.5px',color:'#1e293b',fontFamily:'Inter,sans-serif',outline:'none',background:'#f8fafc'},
  statsRow:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px',marginBottom:'20px'},
  statBox:{background:'#fff',borderRadius:'12px',padding:'16px',border:'1px solid #e2e8f0'},
  statLabel:{fontSize:'11px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'},
  statVal:{fontSize:'26px',fontWeight:'700',marginBottom:'4px'},
  card:{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden',marginBottom:'16px'},
  cardHeader:{padding:'14px 16px',borderBottom:'1px solid #f1f5f9'},
  cardTitle:{fontSize:'13px',fontWeight:'600',color:'#1e293b'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{textAlign:'left',padding:'9px 14px',fontSize:'10px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',borderBottom:'1px solid #f1f5f9',fontWeight:'500'},
  td:{padding:'11px 14px',fontSize:'12px',borderBottom:'1px solid #f8fafc',color:'#475569'},
  emptyMsg:{textAlign:'center',color:'#94a3b8',padding:'20px',fontSize:'13px'},
  bloodTag:{display:'inline-block',background:'#eff6ff',color:'#1d4ed8',padding:'2px 8px',borderRadius:'5px',fontSize:'11px',fontWeight:'700',border:'1px solid #bfdbfe'},
  badgePending:{display:'inline-flex',padding:'3px 9px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',background:'#fef3c7',color:'#d97706'},
  badgeApproved:{display:'inline-flex',padding:'3px 9px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',background:'#dcfce7',color:'#16a34a'},
  badgeRejected:{display:'inline-flex',padding:'3px 9px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',background:'#fee2e2',color:'#dc2626'},
}

export default BloodRequests