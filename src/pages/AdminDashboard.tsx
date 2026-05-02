import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = ''
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
const EDITABLE_PAGES = ['site','home','menu','classes','reviews','faq','contact']
const ADMIN_TABS = ['quotes','visitors','content','store','reviews','password'] as const

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')
  const [tab, setTab] = useState<typeof ADMIN_TABS[number]>('visitors')

  useEffect(() => { if (!token) navigate('/admin') }, [token, navigate])
  const logout = () => { localStorage.removeItem('adminToken'); navigate('/admin') }

  return (
    <div className="admin-shell" style={{ minHeight: '100vh', background: '#f3f1ec', display: 'grid', gridTemplateColumns: '248px minmax(0, 1fr)' }}>
      <aside className="admin-sidebar" style={{ background: '#241124', color: 'white', minHeight: '100vh', padding: '24px 18px', position: 'sticky', top: 0, alignSelf: 'start' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '20px', lineHeight: 1.15, margin: '0 0 6px' }}>Admin Dashboard</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.62)', fontSize: '13px' }}>Tipsy Cocktails</p>
        </div>
        <nav style={{ display: 'grid', gap: '8px' }} aria-label="Admin sections">
          {ADMIN_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ width: '100%', textAlign: 'left', padding: '12px 14px', background: tab === t ? '#6053cc' : 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, textTransform: 'capitalize' }}>{t}</button>
          ))}
        </nav>
        <button onClick={logout} style={{ width: '100%', marginTop: '28px', padding: '11px 14px', background: '#ff4f3a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Logout</button>
      </aside>

      <main className="admin-main" style={{ padding: '24px', minWidth: 0 }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', minHeight: 'calc(100vh - 48px)', boxShadow: '0 1px 12px rgba(36,17,36,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '18px' }}>
            <div>
              <h1 style={{ color: '#241124', margin: '0 0 4px', textTransform: 'capitalize', fontSize: '26px' }}>{tab}</h1>
              <p style={{ margin: 0, color: '#777', fontSize: '14px' }}>Manage website content, images, enquiries, and admin settings.</p>
            </div>
          </div>
          <div>
            {tab === 'quotes' && <QuotesCollector token={token!} />}
            {tab === 'visitors' && <Visitors token={token!} />}
            {tab === 'content' && <ContentEditor token={token!} />}
            {tab === 'store' && <StoreEditor token={token!} />}
            {tab === 'reviews' && <ReviewsManager token={token!} />}
            {tab === 'password' && <PasswordReset token={token!} />}
          </div>
        </div>
      </main>
    </div>
  )
}

function QuotesCollector({ token }: { token: string }) {
  const [contacts, setContacts] = useState<any[]>([])

  const load = () => {
    fetch(`${API}/api/admin/contacts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setContacts(Array.isArray(d) ? d : []))
      .catch(() => setContacts([]))
  }

  useEffect(() => {
    load()
  }, [token])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px' }}>Quote Requests ({contacts.length})</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Every contact form submission is saved here so you can reply quickly.</p>
        </div>
        <button onClick={load} style={{ padding: '8px 12px', background: '#eee', color: '#333', borderRadius: '6px', fontWeight: 700 }}>Refresh</button>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {contacts.length === 0 && (
          <div style={{ padding: '18px', background: '#f9f9f9', borderRadius: '8px', color: '#666' }}>No quote requests yet.</div>
        )}
        {contacts.map(contact => (
          <div key={contact.id} style={{ padding: '16px', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '10px' }}>
              <div>
                <strong style={{ color: '#241124', fontSize: '16px' }}>{contact.name}</strong>
                <div style={{ color: '#777', fontSize: '13px', marginTop: '2px' }}>{new Date(contact.created_at).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <a href={`mailto:${contact.email}?subject=Your Tipsy Cocktails quote request`} style={{ padding: '7px 10px', background: '#6053cc', color: 'white', borderRadius: '6px', fontWeight: 700, fontSize: '13px' }}>Email</a>
                {contact.phone && (
                  <a href={`https://wa.me/${String(contact.phone).replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" style={{ padding: '7px 10px', background: '#1f9d55', color: 'white', borderRadius: '6px', fontWeight: 700, fontSize: '13px' }}>WhatsApp</a>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '10px', fontSize: '14px' }}>
              <div><strong>Email:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a></div>
              <div><strong>Phone:</strong> {contact.phone || 'Not provided'}</div>
            </div>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#333', lineHeight: 1.5 }}>{contact.message}</p>
          </div>
        ))}
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
    fetch(`${API}/api/content?page=${encodeURIComponent(page)}`).then(r => r.json()).then(setContent)
  }, [page])

  const save = (section: string, key: string, value: string) => {
    fetch(`${API}/api/content?page=${encodeURIComponent(page)}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ section, key, value }),
    })
  }

  return (
    <div>
      <h2>Edit Content</h2>
      <div style={{ marginBottom: '16px' }}>
        {EDITABLE_PAGES.map(p => (
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

function StoreEditor({ token }: { token: string }) {
  const [page, setPage] = useState('home')
  const [content, setContent] = useState<Record<string, Record<string, string>>>({})
  const [uploading, setUploading] = useState('')
  const [message, setMessage] = useState('')
  const [previewVersion, setPreviewVersion] = useState(0)

  const previewPath = page === 'home' || page === 'site' ? '/' : `/${page}`

  const load = () => {
    fetch(`${API}/api/content?page=${encodeURIComponent(page)}`)
      .then(r => r.json())
      .then(d => setContent(d && typeof d === 'object' ? d : {}))
      .catch(() => setContent({}))
  }

  useEffect(() => {
    load()
  }, [page])

  const save = async (section: string, key: string, value: string) => {
    const response = await fetch(`${API}/api/content?page=${encodeURIComponent(page)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ section, key, value }),
    })

    if (!response.ok) {
      setMessage('Could not save image')
      return
    }

    setContent(current => ({
      ...current,
      [section]: {
        ...(current[section] || {}),
        [key]: value,
      },
    }))
    setMessage('Image saved')
    setPreviewVersion(version => version + 1)
  }

  const upload = async (section: string, key: string, file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setMessage('Cloudinary env vars are missing')
      return
    }

    setUploading(`${section}.${key}`)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok || !data.secure_url) {
        throw new Error(data.error?.message || 'Upload failed')
      }

      await save(section, key, data.secure_url)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading('')
    }
  }

  const sectionOrder: Record<string, number> = {
    branding: 0,
    hero: 1,
    events: 2,
    'bring-bar': 3,
    'menu-images': 4,
    locations: 5,
    'mobile-bar': 6,
    pages: 7,
    gallery: 8,
  }
  const imageFields = Object.entries(content)
    .flatMap(([section, keys]) =>
      Object.entries(keys)
        .filter(([key, value]) => key.includes('image') || /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(value))
        .map(([key, value]) => ({ section, key, value }))
    )
    .sort((a, b) => (sectionOrder[a.section] ?? 99) - (sectionOrder[b.section] ?? 99) || a.key.localeCompare(b.key))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ marginBottom: '4px' }}>Store Editor</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Upload images to Cloudinary and preview the selected page live.</p>
        </div>
        {message && <span style={{ padding: '8px 12px', borderRadius: '999px', background: message.includes('failed') || message.includes('Could') ? '#ffebee' : '#e8f5e9', color: message.includes('failed') || message.includes('Could') ? '#c62828' : '#2e7d32', fontSize: '13px', fontWeight: 700 }}>{message}</span>}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {EDITABLE_PAGES.map(p => (
          <button key={p} onClick={() => setPage(p)} style={{ padding: '7px 14px', background: page === p ? '#6053cc' : '#eee', color: page === p ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', textTransform: 'capitalize' }}>{p}</button>
        ))}
      </div>

      <div className="store-editor-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 500px) minmax(420px, 1fr)', gap: '20px', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '14px', paddingRight: '4px' }}>
          {imageFields.length === 0 && (
            <div style={{ padding: '18px', background: '#f9f9f9', borderRadius: '8px', color: '#666' }}>No editable images have been seeded for this page yet.</div>
          )}
          {imageFields.map(({ section, key, value }) => {
            const id = `${section}.${key}`
            const busy = uploading === id

            return (
              <div key={id} style={{ padding: '14px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                  <strong style={{ color: '#241124', textTransform: 'capitalize' }}>{key === 'image' ? `${section.replace(/-/g, ' ')} image` : key.replace(/-/g, ' ')}</strong>
                  <span style={{ color: '#6053cc', fontSize: '12px', fontWeight: 700 }}>{section}</span>
                </div>
                <div style={{ width: '100%', aspectRatio: '16 / 9', background: '#eee', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                  <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <input
                  value={value}
                  onChange={e => setContent(current => ({ ...current, [section]: { ...(current[section] || {}), [key]: e.target.value } }))}
                  onBlur={e => save(section, key, e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px', fontSize: '12px' }}
                />
                <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px', background: busy ? '#aaa' : '#6053cc', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: busy ? 'wait' : 'pointer' }}>
                  {busy ? 'Uploading...' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={busy}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) upload(section, key, file)
                      e.currentTarget.value = ''
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )
          })}
        </div>

        <div style={{ position: 'sticky', top: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ color: '#241124' }}>Live preview</strong>
            <button onClick={() => setPreviewVersion(version => version + 1)} style={{ padding: '6px 10px', background: '#eee', color: '#333', borderRadius: '4px', fontWeight: 700 }}>Refresh</button>
          </div>
          <iframe
            key={`${page}-${previewVersion}`}
            src={`${previewPath}?storePreview=${previewVersion}`}
            title={`${page} preview`}
            style={{ width: '100%', height: '720px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
          />
        </div>
      </div>
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
