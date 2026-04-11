import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'

function BloodInventory() {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    bloodGroup: 'A+', units: '', expiryDate: '', addedBy: 'Admin'
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/'); return }
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const res = await api.get('/api/inventory/all')
      setInventory(res.data)
    } catch (err) { console.log(err) }
  }

  const handleAdd = async () => {
    try {
      // units ko string se number mein convert karo
      // Backend integer expect karta hai
      await api.post('/api/inventory/add', {
        ...form,
        units: parseInt(form.units)
      })
      setMessage('Blood units added successfully!')
      setShowForm(false)
      // Form reset karo
      setForm({ bloodGroup: 'A+', units: '', expiryDate: '', addedBy: 'Admin' })
      // Fresh data fetch karo
      fetchInventory()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error adding blood units!')
    }
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.topbarTitle}>Blood Inventory</div>
          <div style={styles.topbarRight}>
            <button style={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>
              + Add Blood Units
            </button>
          </div>
        </div>
        <div style={styles.content}>

          {message && (
            <div style={message.includes('Error') ? styles.errorBox : styles.successBox}>
              {message}
            </div>
          )}

          {showForm && (
            <div style={styles.formCard}>
              <div style={styles.formTitle}>Add Blood Units</div>
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
                  <label style={styles.label}>Units</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Enter units"
                    value={form.units}
                    onChange={e => setForm({...form, units: e.target.value})}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Expiry Date</label>
                  <input
                    style={styles.input}
                    type="date"
                    value={form.expiryDate}
                    onChange={e => setForm({...form, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              <div style={{display:'flex', gap:'10px'}}>
                <button style={styles.primaryBtn} onClick={handleAdd}>Save</button>
                <button style={styles.outlineBtn} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Total Units</div>
              <div style={{...styles.statVal, color:'#1d4ed8'}}>
                {inventory.reduce((s, i) => s + i.units, 0)}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Critical Stock</div>
              <div style={{...styles.statVal, color:'#dc2626'}}>
                {inventory.filter(i => i.units < 50).length}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Blood Groups</div>
              <div style={{...styles.statVal, color:'#16a34a'}}>
                {new Set(inventory.map(i => i.bloodGroup)).size}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Total Entries</div>
              <div style={{...styles.statVal, color:'#d97706'}}>
                {inventory.length}
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>🩸 Stock by Blood Group</div>
            </div>
            <div style={styles.bloodGrid}>
              {bloodGroups.map(group => {
                const total = inventory
                  .filter(i => i.bloodGroup === group)
                  .reduce((s, i) => s + i.units, 0)
                return (
                  <div
                    key={group}
                    style={total < 50 ? styles.bloodCritical : total < 100 ? styles.bloodLow : styles.bloodGood}
                  >
                    <div style={styles.bloodType}>{group}</div>
                    <div style={styles.bloodUnits}>{total} units</div>
                    <div style={styles.bloodBar}>
                      <div style={{
                        ...styles.bloodFill,
                        width: `${Math.min((total / 500) * 100, 100)}%`,
                        background: total < 50 ? '#dc2626' : total < 100 ? '#d97706' : '#16a34a'
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>📦 All Inventory Entries</div>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Blood Group</th>
                  <th style={styles.th}>Units</th>
                  <th style={styles.th}>Added By</th>
                  <th style={styles.th}>Date Added</th>
                  <th style={styles.th}>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr><td colSpan="5" style={styles.emptyMsg}>No inventory found</td></tr>
                ) : (
                  inventory.map(item => (
                    <tr key={item.id}>
                      <td style={styles.td}><span style={styles.bloodTag}>{item.bloodGroup}</span></td>
                      <td style={styles.td}>{item.units}</td>
                      <td style={styles.td}>{item.addedBy}</td>
                      <td style={styles.td}>{item.addedDate}</td>
                      <td style={styles.td}>{item.expiryDate}</td>
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
  bloodGrid:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',padding:'14px'},
  bloodGood:{background:'#f0fdf4',borderRadius:'9px',padding:'12px 8px',textAlign:'center',border:'1px solid #dcfce7'},
  bloodLow:{background:'#fffbeb',borderRadius:'9px',padding:'12px 8px',textAlign:'center',border:'1px solid #fef3c7'},
  bloodCritical:{background:'#fff1f2',borderRadius:'9px',padding:'12px 8px',textAlign:'center',border:'1px solid #fee2e2'},
  bloodType:{fontSize:'16px',fontWeight:'700',marginBottom:'3px',color:'#1e293b'},
  bloodUnits:{fontSize:'10px',color:'#94a3b8',marginBottom:'7px'},
  bloodBar:{height:'4px',background:'#f1f5f9',borderRadius:'2px',overflow:'hidden'},
  bloodFill:{height:'100%',borderRadius:'2px'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{textAlign:'left',padding:'9px 14px',fontSize:'10px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',borderBottom:'1px solid #f1f5f9',fontWeight:'500'},
  td:{padding:'11px 14px',fontSize:'12px',borderBottom:'1px solid #f8fafc',color:'#475569'},
  emptyMsg:{textAlign:'center',color:'#94a3b8',padding:'20px',fontSize:'13px'},
  bloodTag:{display:'inline-block',background:'#eff6ff',color:'#1d4ed8',padding:'2px 8px',borderRadius:'5px',fontSize:'11px',fontWeight:'700',border:'1px solid #bfdbfe'},
}

export default BloodInventory