import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = ''

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')
  const [tab, setTab] = useState<'visitors' | 'content' | 'reviews' | 'password'>('visitors')

  useEffect(() => { if (!token) navigate('/admin') }, [token, navigate])
  const logout = () => { localStorage.removeItem('adminToken'); navigate('/admin') }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#241124' }}>Admin Dashboard</h1>
          <button onClick={logout} style={{ padding: '8px 16px', background: '#ff4f3a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {(['visitors','content','reviews','password'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 20px', background: tab === t ? '#6053cc' : 'white', color: tab === t ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px' }}>
          {tab === 'visitors' && <Visitors token={token!} />}
          {tab === 'content' && <ContentEditor token={token!} />}
          {tab === 'reviews' && <ReviewsManager token={token!} />}
          {tab === 'password' && <PasswordReset token={token!} />}
        </div>
      </div>
    </div>
  )
}

function Visitors({ token }: { token: string }) {
  const [visits, setVisits] = useState<any[]>([])
  useEffect(() => {
    fetch(`${API}/api/visits`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setVisits(Array.isArray(d) ? d : []))
  }, [token])

  return (
    <div>
      <h2>Visitor Reports ({visits.length})</h2>
      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#f5f5f5' }}>
          <th style={{ padding: '10px', textAlign: 'left' }}>IP</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Location</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Device</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Browser</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Time</th>
        </tr></thead>
        <tbody>
          {visits.map(v => (
            <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{v.ip_address}</td>
              <td style={{ padding: '10px' }}>{v.city}, {v.country}</td>
              <td style={{ padding: '10px' }}>{v.device_type} ({v.os})</td>
              <td style={{ padding: '10px' }}>{v.browser}</td>
              <td style={{ padding: '10px' }}>{v.time_spent_seconds ? v.time_spent_seconds + 's' : 'Active'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ContentEditor({ token }: { token: string }) {
  const [page, setPage] = useState('home')
  const [content, setContent] = useState<Record<string, Record<string, string>>>({})
  useEffect(() => {
    fetch(`${API}/api/content/${page}`).then(r => r.json()).then(setContent)
  }, [page])

  const save = (section: string, key: string, value: string) => {
    fetch(`${API}/api/content/${page}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ section, key, value }),
    })
  }

  return (
    <div>
      <h2>Edit Content</h2>
      <div style={{ marginBottom: '16px' }}>
        {['home','menu','classes','reviews','faq','contact'].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{ marginRight: '8px', padding: '6px 14px', background: page === p ? '#6053cc' : '#eee', color: page === p ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{p}</button>
        ))}
      </div>
      {Object.entries(content).map(([section, keys]) => (
        <div key={section} style={{ marginBottom: '20px', padding: '14px', background: '#f9f9f9', borderRadius: '8px' }}>
          <h3 style={{ color: '#6053cc', textTransform: 'capitalize', marginBottom: '10px' }}>{section}</h3>
          {Object.entries(keys).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', display: 'block', marginBottom: '4px' }}>{key}</label>
              {value.length > 80 ? (
                <textarea defaultValue={value} rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} onBlur={e => save(section, key, e.target.value)} />
              ) : (
                <input defaultValue={value} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} onBlur={e => save(section, key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function ReviewsManager({ token }: { token: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const load = () => {
    fetch(`${API}/api/admin/reviews`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setReviews(Array.isArray(d) ? d : []))
  }
  useEffect(() => { load() }, [token])

  return (
    <div>
      <h2>Review Management</h2>
      {reviews.map(r => (
        <div key={r.id} style={{ padding: '14px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '12px', borderLeft: r.status === 'approved' ? '4px solid #4caf50' : '4px solid #ff9800' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{r.name}</strong>
            <span style={{ color: '#e4b363' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
          </div>
          <p style={{ fontSize: '14px', margin: '8px 0' }}>{r.text}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {r.status === 'pending' && (
              <button onClick={() => fetch(`${API}/api/admin/reviews`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: r.id, status: 'approved' }) }).then(load)} style={{ padding: '4px 12px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Approve</button>
            )}
            <button onClick={() => fetch(`${API}/api/admin/reviews?id=${r.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(load)} style={{ padding: '4px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#999' }}>{r.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function PasswordReset({ token }: { token: string }) {
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(''); setErr('')
    const res = await fetch(`${API}/api/admin/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
    })
    const data = await res.json()
    if (res.ok) { setMsg('Password updated!'); setCurrent(''); setNewPass('') }
    else setErr(data.error || 'Failed')
  }

  return (
    <div>
      <h2>Reset Password</h2>
      {msg && <div style={{ padding: '12px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', marginBottom: '16px' }}>{msg}</div>}
      {err && <div style={{ padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '16px' }}>{err}</div>}
      <form onSubmit={submit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Current Password</label>
          <input type="password" value={current} onChange={e => setCurrent(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>New Password</label>
          <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#6053cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Update Password</button>
      </form>
    </div>
  )
}
