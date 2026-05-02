import { useState, useEffect } from 'react'

const TESTIMONIALS = [
  { quote: `Everything was fantastic and went down so well. The cocktail bartender Josh was an absolute star and very engaging.`, author: 'DAC Beachcroft', when: 'June 2025' },
  { quote: `Tipsy Cocktails were highly professional and our guests were raving about their cocktails.`, author: 'Maguires, Glasgow', when: 'March 2025' },
  { quote: `We had the best Christmas Party ever — the cocktails and the bartender made the night.`, author: 'Toni & Guy, Edinburgh', when: 'January 2025' },
  { quote: `Our cocktail masterclass was the highlight of the night. The bartender was engaging, knowledgeable, and made everyone feel involved. The drinks were incredible and we learned loads too.` },
  { quote: `Absolutely brilliant service from start to finish. The setup looked amazing and the bartender brought such a great energy to the party. Highly recommend for any special occasion.` },
  { quote: `They will try their best to accommodate all of your needs. My daughter wanted to have two cocktails and two mocktails instead of four of the same, and they made it happen no issue.` },
  { quote: `Everything I wanted as an extra which isn't usually included in the bar hire, they've been able to do — even asked for a cocktail that wasn't in their menu and they delivered it perfectly.` },
  { quote: `We asked for a cocktail that wasn't included in their menu as it was the bride's favourite, and with no issues they agreed to it.` },
  { quote: `Very flexible company — met all my requirements and standards.` },
  { quote: `Our bartender was 10 minutes late, but it wasn't an issue as they always make up the minutes missed.` },
  { quote: `I've hired loads of bars before for different events and so far Tipsy Cocktails has been the best one. Highly recommend.` },
  { quote: `We booked a bartender for a house party and it completely transformed the evening. Professional, friendly, and the cocktails were better than most bars!` },
  { quote: `The cocktail class was so much fun. Perfect mix of entertainment and learning. Everyone got involved and the atmosphere was fantastic.` },
  { quote: `Couldn't have asked for a better experience. The bartender was punctual, well-prepared, and made the whole event feel really special.` },
  { quote: `From booking to the actual event, everything was smooth and professional. The bartender was excellent and the drinks were outstanding.` },
  { quote: `We've done a few cocktail classes before but this was by far the best. Super engaging and very well organised.` },
  { quote: `Hired a bartender for a house party and it was the best decision we made. The setup looked incredible and the cocktails were top quality all night.` },
  { quote: `We had a bartender for a birthday party at home and it felt like having a private cocktail bar. Guests couldn't stop talking about it.` },
  { quote: `Everything was taken care of, from setup to clean down. The bartender was friendly, skilled, and kept the drinks flowing all evening.` },
  { quote: `Such a smooth experience. Booking was easy and on the day the bar looked amazing. Really elevated the whole night.` },
  { quote: `Turned our garden party into something really special. Great drinks, great service, and zero stress for us as hosts.` },
  { quote: `Guests were genuinely impressed. It felt like a high-end bar experience but in our own home.` },
  { quote: `Fantastic experience from start to finish. The booking process was simple, communication was clear, and everything ran exactly as promised on the day.` },
  { quote: `Really impressed with how easy everything was to organise. Quick responses, flexible options, and a very professional service throughout.` },
  { quote: `Great communication and attention to detail. The team made the whole process stress-free and delivered exactly what we were looking for.` },
  { quote: `A really well organised service. The booking process was straightforward and the whole experience felt reliable and high quality.` },
] as { quote: string; author?: string; when?: string }[]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, text: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then(d => setReviews(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) { setStatus('success'); setFormData({ name: '', email: '', rating: 5, text: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <section id="reviews" className="block testimonials-bg" style={{ paddingTop: '180px' }}>
      <div className="container">
        <div className="testimonials-head"><h2>Our Testimonials</h2></div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testimonial" key={`static-${i}`}>
              <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
              <div className="testimonial-quote">{t.quote}</div>
              {(t.author || t.when) && (
                <cite>
                  {t.author && <span className="author">{t.author}</span>}
                  {t.when && <span className="when">{t.when}</span>}
                </cite>
              )}
            </div>
          ))}
          {reviews.map((r) => (
            <div className="testimonial" key={`api-${r.id}`}>
              <div className="testimonial-stars" aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <div className="testimonial-quote">{r.text}</div>
              <cite><span className="author">{r.name}</span></cite>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={() => setShowForm(!showForm)} className="btn">
            {showForm ? 'Cancel' : 'Leave a Review'}
          </button>
        </div>

        {showForm && (
          <div style={{ maxWidth: '600px', margin: '30px auto', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px', color: '#241124' }}>Write a Review</h3>
            {status === 'success' && <div style={{ padding: '12px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', marginBottom: '16px' }}>Thank you! Your review has been submitted for approval.</div>}
            {status === 'error' && <div style={{ padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '16px' }}>Something went wrong. Please try again.</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              <input placeholder="Email (optional)" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              <select value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
              </select>
              <textarea placeholder="Your review..." value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} required rows={4} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              <button type="submit" disabled={status === 'submitting'} className="btn" style={{ alignSelf: 'flex-start' }}>
                {status === 'submitting' ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
