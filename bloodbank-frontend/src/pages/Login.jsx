// Login.jsx → Login page ka component

// useState → form ka data store karne ke liye
import { useState } from 'react'

// useNavigate → login hone ke baad page change karne ke liye
import { useNavigate } from 'react-router-dom'

// api.js → backend se baat karne ke liye
import api from '../services/api'

function Login() {

  // Form data store karo
  // email aur password ka initial value empty string
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Error message store karo
  const [error, setError] = useState('')

  // Loading state → button pe "Signing in..." dikhane ke liye
  const [loading, setLoading] = useState(false)

  // Page navigate karne ke liye
  const navigate = useNavigate()

  // Login button click hone pe yeh function chalega
  const handleLogin = async () => {

    // Loading start karo
    setLoading(true)
    setError('')

    try {// Login.jsx → Login page ka component
         // useState → form ka data store karne ke liye
         import { useState } from 'react'
         // useNavigate → login hone ke baad page change karne ke liye
         import { useNavigate } from 'react-router-dom'
         // api.js → backend se baat karne ke liye
         import api from '../services/api'

         function Login() {

           // Form fields store karo
           const [email, setEmail] = useState('')
           const [password, setPassword] = useState('')

           // Error message store karo
           const [error, setError] = useState('')

           // Loading state → button pe "Signing in..." dikhane ke liye
           const [loading, setLoading] = useState(false)

           const navigate = useNavigate()

           // Login button click hone pe yeh function chalega
           const handleLogin = async () => {

             // Validation → empty fields check karo
             if (!email || !password) {
               setError('Please fill all fields!')
               return
             }

             setLoading(true)
             setError('')

             try {
               // Backend ko login request bhejo
               const response = await api.post('/api/auth/login', { email, password })

               // Sab zaroori cheezein localStorage mein save karo
               // Token → har API request mein use hoga
               localStorage.setItem('token', response.data.token)
               // Role → sidebar aur pages mein access control ke liye
               localStorage.setItem('role', response.data.role)
               // UserId → donor profile, organ register APIs mein use hoga
               localStorage.setItem('userId', response.data.userId)
               // Name → dashboard mein "Welcome, Rahul" dikhane ke liye
               localStorage.setItem('name', response.data.name)

               // Role ke hisaab se sahi dashboard pe bhejo
               if (response.data.role === 'ADMIN') navigate('/admin-dashboard')
               else if (response.data.role === 'HOSPITAL') navigate('/hospital-dashboard')
               else if (response.data.role === 'DONOR') navigate('/donor-dashboard')

             } catch (err) {
               // Backend se error message lo
               setError(err.response?.data?.message || 'Invalid email or password!')
             }

             setLoading(false)
           }

           // Enter key dabane pe bhi login ho sake
           const handleKeyPress = (e) => {
             if (e.key === 'Enter') handleLogin()
           }

           return (
             <div style={styles.page}>
               <div style={styles.container}>

                 {/* LEFT SIDE - Blue panel */}
                 <div style={styles.left}>
                   <div style={styles.brand}>
                     <div style={styles.brandIcon}>🩺</div>
                     <div style={styles.brandName}>LifeLink</div>
                   </div>
                   <div style={styles.tagline}>
                     Saving lives through{' '}
                     <span style={styles.taglineAccent}>smart healthcare</span>{' '}
                     management
                   </div>
                   <div style={styles.desc}>
                     A unified platform for blood bank management, organ donation
                     tracking, and hospital coordination.
                   </div>
                   <div style={styles.statsRow}>
                     <div>
                       <div style={styles.statVal}>1,284</div>
                       <div style={styles.statLabel}>Active Donors</div>
                     </div>
                     <div>
                       <div style={styles.statVal}>3,491</div>
                       <div style={styles.statLabel}>Blood Units</div>
                     </div>
                     <div>
                       <div style={styles.statVal}>329</div>
                       <div style={styles.statLabel}>Organ Registrations</div>
                     </div>
                   </div>
                 </div>

                 {/* RIGHT SIDE - Login Form */}
                 <div style={styles.right}>
                   <div style={styles.formTitle}>Welcome back</div>
                   <div style={styles.formSub}>Sign in to your LifeLink account</div>

                   {/* Error message dikhao agar hai */}
                   {error && <div style={styles.errorBox}>{error}</div>}

                   {/* Email Input */}
                   <div style={styles.formGroup}>
                     <label style={styles.label}>Email Address</label>
                     <input
                       style={styles.input}
                       type="email"
                       placeholder="you@example.com"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       onKeyPress={handleKeyPress}
                     />
                   </div>

                   {/* Password Input */}
                   <div style={styles.formGroup}>
                     <label style={styles.label}>Password</label>
                     <input
                       style={styles.input}
                       type="password"
                       placeholder="Enter your password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       onKeyPress={handleKeyPress}
                     />
                   </div>

                   {/* Login Button */}
                   <button
                     style={loading ? styles.btnDisabled : styles.btn}
                     onClick={handleLogin}
                     disabled={loading}
                   >
                     {loading ? 'Signing in...' : 'Sign In →'}
                   </button>

                   {/* Register link */}
                   <div style={styles.linkText}>
                     Don't have an account?{' '}
                     <span style={styles.link} onClick={() => navigate('/register')}>
                       Register here
                     </span>
                   </div>
                 </div>

               </div>
             </div>
           )
         }

         const styles = {
           page:{minHeight:'100vh',background:'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'},
           container:{display:'flex',width:'900px',background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.08)'},
           left:{background:'linear-gradient(135deg, #1d4ed8, #1e40af)',padding:'48px 40px',flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between'},
           brand:{display:'flex',alignItems:'center',gap:'12px',marginBottom:'32px'},
           brandIcon:{width:'40px',height:'40px',background:'rgba(255,255,255,0.2)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'},
           brandName:{fontSize:'22px',fontWeight:'800',color:'#fff'},
           tagline:{fontSize:'26px',fontWeight:'700',color:'#fff',lineHeight:'1.3',marginBottom:'16px'},
           taglineAccent:{color:'#bfdbfe'},
           desc:{fontSize:'13px',color:'rgba(255,255,255,0.65)',lineHeight:'1.7'},
           statsRow:{display:'flex',gap:'24px',marginTop:'32px'},
           statVal:{fontSize:'22px',fontWeight:'700',color:'#fff'},
           statLabel:{fontSize:'10px',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'1px'},
           right:{flex:1,padding:'48px 40px',display:'flex',flexDirection:'column',justifyContent:'center'},
           formTitle:{fontSize:'24px',fontWeight:'700',color:'#1e293b',marginBottom:'6px'},
           formSub:{fontSize:'13px',color:'#94a3b8',marginBottom:'32px'},
           formGroup:{marginBottom:'16px'},
           label:{fontSize:'12px',fontWeight:'500',color:'#475569',marginBottom:'6px',display:'block'},
           input:{width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8f0',borderRadius:'9px',fontSize:'13px',color:'#1e293b',fontFamily:'Inter,sans-serif',outline:'none',background:'#f8fafc'},
           btn:{width:'100%',padding:'12px',background:'#1d4ed8',color:'#fff',border:'none',borderRadius:'9px',fontSize:'14px',fontWeight:'600',cursor:'pointer',marginTop:'8px'},
           btnDisabled:{width:'100%',padding:'12px',background:'#93c5fd',color:'#fff',border:'none',borderRadius:'9px',fontSize:'14px',fontWeight:'600',cursor:'not-allowed',marginTop:'8px'},
           errorBox:{background:'#fee2e2',color:'#dc2626',padding:'10px 14px',borderRadius:'8px',fontSize:'12px',marginBottom:'16px'},
           linkText:{textAlign:'center',fontSize:'12px',color:'#94a3b8',marginTop:'16px'},
           link:{color:'#1d4ed8',fontWeight:'500',cursor:'pointer'},
         }

         export default Login
      // Backend ko login request bhejo
      const response = await api.post('/api/auth/login', {
        email: email,
        password: password
      })

      // Token localStorage mein save karo
      // Taaki baad mein use ho sake
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', response.data.role)
      localStorage.setItem('userId', response.data.userId)

      // Role ke hisaab se dashboard pe jaao
      if (response.data.role === 'ADMIN') {
        navigate('/admin-dashboard')
      } else if (response.data.role === 'HOSPITAL') {
        navigate('/hospital-dashboard')
      } else if (response.data.role === 'DONOR') {
        navigate('/donor-dashboard')
      }

    } catch (err) {
      // Error aaya toh message dikhao
      setError('Invalid email or password!')
    }

    // Loading band karo
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT SIDE - Blue panel */}
        <div style={styles.left}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>🩺</div>
            <div style={styles.brandName}>LifeLink</div>
          </div>

          <div style={styles.tagline}>
            Saving lives through{' '}
            <span style={styles.taglineAccent}>smart healthcare</span>{' '}
            management
          </div>

          <div style={styles.desc}>
            A unified platform for blood bank management, organ donation
            tracking, and hospital coordination.
          </div>

          {/* Stats */}
          <div style={styles.statsRow}>
            <div>
              <div style={styles.statVal}>1,284</div>
              <div style={styles.statLabel}>Active Donors</div>
            </div>
            <div>
              <div style={styles.statVal}>3,491</div>
              <div style={styles.statLabel}>Blood Units</div>
            </div>
            <div>
              <div style={styles.statVal}>329</div>
              <div style={styles.statLabel}>Organ Registrations</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div style={styles.right}>
          <div style={styles.formTitle}>Welcome back</div>
          <div style={styles.formSub}>Sign in to your LifeLink account</div>

          {/* Error message */}
          {error && <div style={styles.errorBox}>{error}</div>}

          {/* Email Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              // User kuch type kare toh email update karo
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          {/* Register link */}
          <div style={styles.linkText}>
            Don't have an account?{' '}
            <span
              style={styles.link}
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

// ===== STYLES =====
// CSS in JS → React mein styles likhne ka ek tarika
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  container: {
    display: 'flex',
    width: '900px',
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
  },
  left: {
    background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
    padding: '48px 40px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px'
  },
  brandIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  brandName: {
    fontFamily: 'sans-serif',
    fontSize: '22px',
    fontWeight: '800',
    color: '#fff'
  },
  tagline: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.3',
    marginBottom: '16px'
  },
  taglineAccent: {
    color: '#bfdbfe'
  },
  desc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: '1.7'
  },
  statsRow: {
    display: 'flex',
    gap: '24px',
    marginTop: '32px'
  },
  statVal: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff'
  },
  statLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  right: {
    flex: 1,
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '6px'
  },
  formSub: {
    fontSize: '13px',
    color: '#94a3b8',
    marginBottom: '32px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '6px',
    display: 'block'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '9px',
    fontSize: '13px',
    color: '#1e293b',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    background: '#f8fafc'
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: '#1d4ed8',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  },
  btnDisabled: {
    width: '100%',
    padding: '12px',
    background: '#93c5fd',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '8px'
  },
  errorBox: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    marginBottom: '16px'
  },
  linkText: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '16px'
  },
  link: {
    color: '#1d4ed8',
    fontWeight: '500',
    cursor: 'pointer'
  }
}

export default Login