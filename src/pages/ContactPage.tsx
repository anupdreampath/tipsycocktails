import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="block bg-cream" style={{ paddingTop: '180px' }}>
      <div className="container">
        <div className="footer-row">
          <div className="footer-left">
            <h2>Contact the Team</h2>
            <p>Get in touch with our team to discuss your event. We'll get back to you as soon as possible with a tailored quote.</p>
            {status === 'success' && (
              <div style={{ padding: '16px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '16px' }}>
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {status === 'error' && (
              <div style={{ padding: '16px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '16px' }}>
                Sorry, there was an error sending your message. Please try again.
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <input 
                name="name"
                placeholder="Name" 
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input 
                name="email"
                placeholder="Email" 
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input 
                name="phone"
                placeholder="Phone" 
                value={formData.phone}
                onChange={handleChange}
              />
              <textarea 
                name="message"
                placeholder="Tell us about your event" 
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn btn-light" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          </div>
          <div className="footer-info">
            <h2>Find Us</h2>
            <p>
              <strong>Mobile Bar Hire</strong><br/>
              Your Address Line 1<br/>
              City, Postcode<br/>
              <a href="tel:0000000000">000 000 0000</a><br/>
              <a href="mailto:hello@yourbrand.com">hello@yourbrand.com</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
