import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cmsValue, usePageContent } from '../lib/cms'

const WHATSAPP_MESSAGE = encodeURIComponent('Hello, I would like some information about your service.')
const WHATSAPP_URL = `https://wa.me/447822033406?text=${WHATSAPP_MESSAGE}`

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export function Header({ navColor = 'black' }: { navColor?: 'white' | 'black' }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef = useRef<HTMLButtonElement | null>(null)
  const content = usePageContent('site')
  const logoSrc = cmsValue(content, 'branding', 'logo-image', '/logo.png')

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60)
          ticking = false
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => {
    setMenuOpen(false)
    burgerRef.current?.focus()
  }

  const navInk = scrolled ? '#fff' : navColor === 'black' ? '#000' : '#fff'
  const navStyle = { color: navInk } as React.CSSProperties
  const burgerStyle = { background: navInk } as React.CSSProperties

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="logo" aria-label="Tipsy Cocktails">
            <img className="logo-img" src={logoSrc} alt="Tipsy Cocktails" />
          </Link>
          <nav>
            <ul className="nav-list">
              <li><Link to="/" style={navStyle}>Home</Link></li>
              <li><Link to="/classes" style={navStyle}>Classes</Link></li>
              <li><Link to="/reviews" style={navStyle}>Reviews</Link></li>
              <li><Link to="/faq" style={navStyle}>FAQ</Link></li>
              <li><Link to="/menu" style={navStyle}>Menu</Link></li>
              <li><Link to="/contact" style={navStyle}>Contact Us</Link></li>
            </ul>
          </nav>
          <div className="header-right">
            <Link to="/contact" className="btn">Instant Quote</Link>
            <button
              ref={burgerRef}
              className={`burger${menuOpen ? ' burger--open' : ''}`}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(o => !o)}
            >
              <span style={burgerStyle}/><span style={burgerStyle}/><span style={burgerStyle}/>
            </button>
          </div>
        </div>
      </header>

      <div className={`nav-overlay${menuOpen ? ' nav-overlay--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="nav-overlay__top">
          <Link to="/" className="nav-overlay__logo" onClick={close} aria-label="Home">
            <img src={logoSrc} alt="Tipsy Cocktails" />
          </Link>
          <button className="nav-overlay__close" onClick={close} aria-label="Close menu">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <line x1="4" y1="4" x2="24" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="24" y1="4" x2="4" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <nav className="nav-overlay__nav">
          <ul>
            <li><Link to="/" onClick={close}>Home</Link></li>
            <li><Link to="/classes" onClick={close}>Classes</Link></li>
            <li><Link to="/reviews" onClick={close}>Reviews</Link></li>
            <li><Link to="/menu" onClick={close}>Menu</Link></li>
            <li><Link to="/faq" onClick={close}>FAQ</Link></li>
            <li><Link to="/contact" onClick={close}>Contact Us</Link></li>
          </ul>
        </nav>
      </div>
    </>
  )
}

export function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-content container">
        <div className="footer-row">
          <div className="footer-left">
            <h2>Contact the Team</h2>
            <p>Get in touch with our team to discuss your event. We'll get back to you as soon as possible with a tailored quote.</p>
            <form className="contact-form" onSubmit={e => e.preventDefault()}>
              <input placeholder="Name" />
              <input placeholder="Email" type="email" />
              <input placeholder="Phone" />
              <textarea placeholder="Tell us about your event" />
              <button type="submit" className="btn btn-light">Send Enquiry</button>
            </form>
          </div>
          <div className="footer-info">
            <h2>Find Us</h2>
            <p>
              <strong>Mobile Bar Hire</strong><br/>
              <a href="tel:+447822033406">+44 7822 033406</a><br/>
              <a href="mailto:tipsycocktails1@hotmail.com">tipsycocktails1@hotmail.com</a><br/>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp us</a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <div>
            <h2>Connect</h2>
            <div className="quick-links">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">TikTok</a>
            </div>
          </div>
          <div>
            <h2>Quick Links</h2>
            <div className="quick-links">
              <Link to="/classes">Classes</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/reviews">Reviews</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div style={{textAlign:'right',alignSelf:'end'}}>© {new Date().getFullYear()} Your Brand</div>
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ children, navColor = 'black' }: { children: React.ReactNode; navColor?: 'white' | 'black' }) {
  return (
    <>
      <Header navColor={navColor} />
      <main>{children}</main>
      <Footer />
      <a className="whatsapp-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Chat with Tipsy Cocktails on WhatsApp">
        <svg aria-hidden="true" className="whatsapp-cta__icon" viewBox="0 0 32 32" width="34" height="34">
          <path fill="currentColor" d="M16.01 3.2c-7.04 0-12.76 5.62-12.76 12.55 0 2.2.59 4.36 1.71 6.25L3.2 28.8l6.99-1.68a13.02 13.02 0 0 0 5.82 1.39c7.04 0 12.76-5.62 12.76-12.55S23.05 3.2 16.01 3.2Zm0 22.92c-1.86 0-3.68-.49-5.28-1.41l-.38-.22-4.14.99 1.05-4.02-.25-.41a10.06 10.06 0 0 1-1.52-5.3c0-5.6 4.72-10.16 10.52-10.16s10.52 4.56 10.52 10.16-4.72 10.37-10.52 10.37Zm5.78-7.6c-.32-.16-1.88-.91-2.17-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.55-.94-.83-1.58-1.85-1.76-2.16-.18-.31-.02-.48.14-.64.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.68-.97-2.3-.26-.6-.52-.52-.71-.53h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.06-1.11 2.59s1.14 3.01 1.3 3.22c.16.21 2.24 3.36 5.42 4.71.76.32 1.35.51 1.81.65.76.24 1.45.2 2 .12.61-.09 1.88-.75 2.14-1.48.26-.72.26-1.34.18-1.48-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </a>
    </>
  )
}
