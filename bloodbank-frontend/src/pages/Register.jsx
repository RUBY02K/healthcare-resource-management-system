import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {

  // Form data store karo
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Role → DONOR, HOSPITAL, ADMIN
  const [role, setRole] = useState('DONOR')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Backend ko register request bhejo
      await api.post('/api/auth/register', {
        name: name,
        email: email,
        password: password,
        role: role
      })

      setSuccess('Account created! Redirecting to login...')

      // 2 second baad login pe jaao
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (err) {
      setError('Email already registered or something went wrong!')
    }

    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT SIDE */}
        <div style={styles.left}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>🩺</div>
            <div style={styles.brandName}>LifeLink</div>
          </div>
          <div style={styles.tagline}>
            Join the{' '}
            <span style={styles.taglineAccent}>healthcare network</span>{' '}
            that saves lives
          </div>
          <div style={styles.desc}>
            Register as a donor, hospital, or administrator.
            Together we can build a stronger healthcare system.
          </div>
          <div style={styles.statsRow}>
            <div>
              <div style={styles.statVal}>50+</div>
              <div style={styles.statLabel}>Hospitals</div>
            </div>
            <div>
              <div style={styles.statVal}>1.2k</div>
              <div style={styles.statLabel}>Donors</div>
            </div>
            <div>
              <div style={styles.statVal}>24/7</div>
              <div style={styles.statLabel}>Support</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <div style={styles.formTitle}>Create account</div>
          <div style={styles.formSub}>Choose your role to get started</div>

          {/* Role Selection */}
          <div style={styles.roleRow}>
            {['DONOR', 'HOSPITAL', 'ADMIN'].map((r) => (
              <div
                key={r}
                style={role === r ? styles.roleSelected : styles.roleOpt}
                onClick={() => setRole(r)}
              >
                <div style={styles.roleIcon}>
                  {r === 'DONOR' ? '👤' : r === 'HOSPITAL' ? '🏥' : '⚙️'}
                </div>
                {/* First letter capital, rest lowercase */}
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </div>
            ))}
          </div>

          {/* Success/Error messages */}
          {error && <div style={styles.errorBox}>{error}</div>}
          {success && <div style={styles.successBox}>{success}</div>}

          {/* Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>

          <div style={styles.linkText}>
            Already have an account?{' '}
            <span style={styles.link} onClick={() => navigate('/')}>
              Sign in
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

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
  taglineAccent: { color: '#bfdbfe' },
  desc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: '1.7'
  },
  statsRow: { display: 'flex', gap: '24px', marginTop: '32px' },
  statVal: { fontSize: '22px', fontWeight: '700', color: '#fff' },
  statLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  right: {
    flex: 1,
    padding: '40px',
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
    marginBottom: '20px'
  },
  roleRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px'
  },
  roleOpt: {
    flex: 1,
    padding: '10px 8px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '9px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#64748b'
  },
  roleSelected: {
    flex: 1,
    padding: '10px 8px',
    border: '1.5px solid #1d4ed8',
    borderRadius: '9px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#1d4ed8',
    background: '#eff6ff'
  },
  roleIcon: { fontSize: '18px', marginBottom: '4px' },
  formGroup: { marginBottom: '14px' },
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
    marginTop: '4px'
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
    marginTop: '4px'
  },
  errorBox: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    marginBottom: '14px'
  },
  successBox: {
    background: '#dcfce7',
    color: '#16a34a',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    marginBottom: '14px'
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

export default Register