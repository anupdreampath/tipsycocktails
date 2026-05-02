import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cmsValue, usePageContent } from '../lib/cms'

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
              Your Address Line 1<br/>
              City, Postcode<br/>
              <a href="tel:0000000000">000 000 0000</a><br/>
              <a href="mailto:hello@yourbrand.com">hello@yourbrand.com</a>
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
    </>
  )
}
