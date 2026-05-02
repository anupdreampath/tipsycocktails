import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const U = (kw: string, lock: number, w = 800, h = 600) =>
  `https://loremflickr.com/${w}/${h}/${kw}?lock=${lock}`

const EVENTS = [
  { title: '21st Birthdays',    img: U('birthday,party', 21) },
  { title: 'Hen Parties',       img: U('bachelorette,women,party', 42) },
  { title: '40th Birthdays',    img: U('birthday,celebration', 40) },
  { title: '50th Birthdays',    img: U('birthday,party', 50) },
  { title: '30th Birthdays',    img: U('birthday,friends', 30) },
  { title: '60th Birthdays',    img: U('birthday,elegant', 60) },
  { title: 'Garden Parties',    img: U('garden,party,outdoor', 11) },
  { title: 'Corporate Events',  img: U('corporate,event,conference', 73) },
  { title: 'Christmas Parties', img: U('christmas,party,celebration', 99) },
]

const CITIES = [
  { title: 'We Serve Glasgow',   img: U('glasgow,scotland,city', 1) },
  { title: 'We Serve Edinburgh', img: U('edinburgh,scotland,castle', 2) },
  { title: 'We Serve Aberdeen',  img: U('aberdeen,scotland,harbour', 3) },
  { title: 'We Serve Dundee',    img: U('dundee,scotland,waterfront', 4) },
]

const COCKTAIL_LOCKS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

const COCKTAILS = [
  'Pornstar Martini','Espresso Martini','Strawberry Daiquiri','Bramble',
  'WooWoo','Cosmopolitan','Pina Colada','Mojito','Mai-Tai','Blueberry Mule',
  'Martini','Daiquiri','Old Fashioned','Caipirinha','White Russian','Negroni',
  'Margarita','Dark \'N\' Stormy','Cuba Libre','Sazerac','Bloody Mary','Manhattan',
  'Long Island Iced Tea','Amaretto Sour','Singapore Sling','Moscow Mule',
  'Clover Club','Mint Julep','John Collins','Gin Sour','Appletini','White Lady',
  'Black Russian','French 75','Rusty Nail','Pisco Sour','Bucks Fizz','Rum Runner',
  'El Presidente','Kir Royale','Bellini','Pink Gin','B-52','French Connection',
  'Paloma','Royal Hawaiian',"Tommy\'s Margarita",'Ramos Gin Fizz','El Diablo',
  'Breakfast Martini','Tequila Sunrise','Caribbean Sunrise','Bay Breeze',
  'Raspberry Mojito','SideCar','Champagne Cocktail','Godfather',
  'Hemingway Daiquiri','Raspberry Daiquiri','Blueberry Collins','Gimlet',
  'Passion Fruit Daiquiri','Cantarito','Brandy Collins','Americano',
  'Mojito Royal','Tom Collins','Blackberry Mule','Toasted Almond','Boston Sour',
  'Alaska Cocktail','Amaretto Sunrise','Beachcomber','Southside','Bronx',
  'Gibson','Lady Marmalade','Peach Bellini','Lemon Drop','French Martini',
  'Porn Star Fizz','Aperol Spritz','Hugo Spritz','Limoncello Spritz',
  'Watermelon Margarita','Passionfruit Mojito','Mango Daiquiri','Coconut Mojito',
  'Cherry Sour','Lavender Gin Fizz','Cucumber Collins','Rose Spritz',
  'Chilli Margarita','Smoky Negroni','Espresso Negroni','Rum Sour',
  'Elderflower Collins','Honey Bourbon Sour','Ginger Mule','Tropical Punch',
].map((title, i) => ({ title, img: U('cocktail,drink,glass', COCKTAIL_LOCKS[i % COCKTAIL_LOCKS.length], 400, 400) }))

const LOCATIONS = [
  { title: 'The Grand Ballroom',    img: U('ballroom,venue,elegant,hall', 51),
    desc: 'A breathtaking historic venue perfect for elegant weddings, milestone birthdays, and upscale corporate celebrations.' },
  { title: 'Riverside Sports Club', img: U('sports,club,venue,event', 52),
    desc: 'A vibrant sporting venue where we deliver premium bar service for matches, functions, and private events.' },
  { title: 'Meadowbrook Farm',      img: U('farm,countryside,rural,wedding', 53),
    desc: 'A stunning rural retreat surrounded by rolling countryside — ideal for outdoor weddings and unforgettable celebrations.' },
]

const FAQS = [
  {
    q: `Can I choose which cocktails are made?`,
    a: `Yes, you are welcome to select the cocktails for your masterclass and for bar hire from our menu. Please provide your choices to us at least 10 days prior to the event.`,
  },
  {
    q: "Can I still make a booking if I don't know the full address of my venue?",
    a: `Yes, you can still make a booking. We initially require the general area of the event to provide an accurate quote. The full address can be confirmed a few days before the event.`,
  },
  {
    q: `What do I need to provide?`,
    a: "All we require is a suitable table space — we'll take care of everything else. Access to a nearby sink is ideal, but we can make alternative arrangements if informed in advance.",
  },
  {
    q: `Do you provide any other drinks other than cocktails for my bar hire?`,
    a: `We specialise in cocktails and do not supply other beverages. However, if you provide additional drinks and appropriate glassware (e.g. gin & tonic, bottled beers, wine), we are happy to serve them to your guests.`,
  },
  {
    q: "What if some of my guests don't drink?",
    a: `We offer a selection of mocktails, and we can also prepare cocktails using alcohol-free spirits to accommodate non-drinking guests.`,
  },
  {
    q: `When will the bartender arrive?`,
    a: `Our bartender will typically arrive approximately 30 minutes before the start time to set up. This setup time does not reduce your booked service time. We also require around 30 minutes after the event to clear away.`,
  },
  {
    q: "I would like to make a booking but what if my numbers aren't finalised?",
    a: `You can secure your booking with a £20 deposit based on an estimated number of guests. Final guest numbers must be confirmed at least 10 days before the event, when the remaining balance is due. You may also adjust guests between cocktail and mocktail options at that time.`,
  },
  {
    q: `Can I have my booking outside?`,
    a: `Yes, outdoor bookings are possible, weather permitting. Ideally, access to a sink and cold water tap is preferred, but we can adapt if informed in advance.`,
  },
  {
    q: `Can I book at short notice?`,
    a: "Absolutely. For bookings made within 14 days of the event, we recommend contacting us via email to confirm availability before booking. Cocktail selections will also need to be confirmed at the time of booking if less than 10 days' notice is given, and full payment will need to be made to confirm your booking.",
  },
  {
    q: `What is your cancellation policy?`,
    a: `Cancellations made less than 10 days before the event are non-refundable. Cancellations made more than 10 days in advance will receive a full refund, excluding the £20 deposit.`,
  },
]

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

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <a href="/" className="logo" aria-label="Tipsy Cocktails">
            <img className="logo-img" src="/logo.png" alt="Tipsy Cocktails" />
          </a>
          <nav>
            <ul className="nav-list">
              <li><a href="#top">Home</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </nav>
          <div className="header-right">
            <a href="#contact" className="btn">Instant Quote</a>
            <button
              className={`burger${menuOpen ? ' burger--open' : ''}`}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(o => !o)}
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </header>

      <div className={`nav-overlay${menuOpen ? ' nav-overlay--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="nav-overlay__top">
          <a href="/" className="nav-overlay__logo" onClick={close} aria-label="Home">
            <img src="/logo.png" alt="Tipsy Cocktails" />
          </a>
          <button className="nav-overlay__close" onClick={close} aria-label="Close menu">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <line x1="4" y1="4" x2="24" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="24" y1="4" x2="4" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <nav className="nav-overlay__nav">
          <ul>
            <li><a href="#top" onClick={close}>Home</a></li>
            <li><a href="#featured" onClick={close}>What We Offer</a></li>
            <li><a href="#contact" onClick={close}>Get a Quote</a></li>
            <li><a href="#reviews" onClick={close}>Reviews</a></li>
            <li><a href="#cocktails" onClick={close}>Cocktails</a></li>
            <li><Link to="/menu" onClick={close}>Menu</Link></li>
            <li><a href="#faq" onClick={close}>FAQ</a></li>
            <li><a href="#contact" onClick={close}>Contact Us</a></li>
          </ul>
        </nav>
      </div>
    </>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-rings" />
      <div className="hero-content">
        <h1>Mobile Bartending<br/>& Cocktail Experiences</h1>
        <p className="subtitle">We bring <span className="strong">THE PARTY</span> to your event.</p>
        <a href="#contact" className="btn">Get the Party Started</a>
      </div>
    </section>
  )
}

function Featured() {
  return (
    <div id="parties" className="featured">
      <div className="featured-scroll">
        {EVENTS.map(e => (
          <a className="featured-card" key={e.title} href="#">
            <h2>{e.title}</h2>
            <div className="img-wrap"><img src={e.img} alt={e.title} loading="lazy" /></div>
          </a>
        ))}
      </div>
      <div className="featured-arrow">›</div>
    </div>
  )
}

function BringBar() {
  return (
    <section className="block bg-iris">
      <div className="container">
        <div className="row-2">
          <div className="col-image">
            <img className="col-image-main" src={U('bartender,cocktail,making', 77, 900, 700)} alt="Bartender crafting cocktails" loading="lazy" />
          </div>
          <div className="col-text">
            <h2>Your event,<br/>our bar,<br/>unforgettable<br/>moments</h2>
            <p>We're a passionate crew of expert mixologists who bring a premium bar experience straight to your door. From intimate house parties to grand venue celebrations, we transform any space into a cocktail destination.</p>
            <p>Every event is unique — which is why we tailor our cocktail menu, bar setup, and service style entirely to you. Premium spirits, personalised garnishes, and skilled bartenders who know how to read the room.</p>
            <a href="#contact" className="btn">Get a Quote</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Classes() {
  return (
    <section id="classes" className="block bg-cream">
      <div className="container">
        <div className="classes-row">
          <div className="classes-text">
            <h2>Cocktail<br/>Making<br/>Classes</h2>
            <p>Discover the craft of cocktail making with our hands-on mixology experiences delivered straight to your venue — no travel, no hassle, just great drinks.</p>
            <p>Whether you're planning the ultimate hen night, a milestone birthday, or a standout team event, our masterclasses bring the bar to you. Your guests will shake, muddle, and pour their way through expertly chosen recipes — guided every step of the way by our enthusiastic bartenders.</p>
          </div>
          <div className="classes-scroll">
            {CITIES.map(c => (
              <a className="polaroid" key={c.title} href="#">
                <div className="img-wrap"><img src={c.img} alt={c.title} loading="lazy" /></div>
                <h3>{c.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section id="reviews" className="block testimonials-bg">
      <div className="container">
        <div className="testimonials-head"><h2>Our Testimonials</h2></div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testimonial" key={i}>
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
        </div>
      </div>
    </section>
  )
}

function Cocktails() {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const scrollBy = (dir: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }
  return (
    <section id="cocktails" className="block bg-cream cocktails-section">
      <div className="container">
        <div className="cocktails-head">
          <h2>Our Signature Cocktail Menu</h2>
          <p>From timeless classics to dazzling originals, our menu has something for every taste. Bold spirits, light fruity blends, or alcohol-free creations — our mixologists bring them all to life at your event.</p>
          <Link to="/menu" className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>View Full Menu</Link>
        </div>
        <div className="cocktail-carousel">
          <button type="button" className="carousel-arrow prev" aria-label="Previous" onClick={() => scrollBy(-1)}>‹</button>
          <div className="cocktail-scroll" ref={scrollerRef}>
            {COCKTAILS.map(c => (
              <a className="cocktail-card" key={c.title} href="#">
                <div className="img-wrap"><img src={c.img} alt={c.title} loading="lazy" /></div>
                <h3>{c.title}</h3>
              </a>
            ))}
          </div>
          <button type="button" className="carousel-arrow next" aria-label="Next" onClick={() => scrollBy(1)}>›</button>
        </div>
      </div>
    </section>
  )
}

function Locations() {
  return (
    <section className="block bg-yellow">
      <div className="container">
        <div className="locations-head">
          <h2>Our Partner Venues</h2>
          <p>Beyond private hire, we're proud to be the resident bar team at some of the region's most celebrated event spaces.</p>
        </div>
        <div className="locations-grid">
          {LOCATIONS.map(l => (
            <div className="location-card" key={l.title}>
              <div className="img-wrap"><img src={l.img} alt={l.title} loading="lazy" /></div>
              <h3>{l.title}</h3>
              <div className="body"><p>{l.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MobileBar() {
  return (
    <section id="mobile-bar" className="block bg-iris">
      <div className="container">
        <div className="row-2">
          <div className="col-text">
            <h2>We Come<br/>To You.<br/>Wherever<br/>You Are.</h2>
            <p>From compact home setups to full outdoor festival bars, our fully equipped mobile units adapt to any space or occasion. Tell us your vision — we'll handle everything from setup to last call.</p>
            <a href="#contact" className="btn">Learn More</a>
          </div>
          <div className="col-image">
            <img className="col-image-main" src={U('cocktail,class,workshop,drinks', 88, 900, 700)} alt="Cocktail making experience" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="block bg-cream faq-section">
      <div className="container">
        <div className="faq-head">
          <h2>FAQ</h2>
          <p><strong>Please note:</strong> Our packages can be tailored to suit most requirements. If you have any additional questions, please feel free to contact us via WhatsApp or email.</p>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div className={`faq-item ${isOpen ? 'open' : ''}`} key={i}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="faq-answer"><p>{f.a}</p></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Footer() {
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
              <a href="#classes">Classes</a>
              <a href="#corporate">Corporate Events</a>
              <a href="#cocktails">Recipes</a>
              <a href="#parties">Parties</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div style={{textAlign:'right',alignSelf:'end'}}>© {new Date().getFullYear()} Your Brand</div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <span id="top" />
      <Header />
      <Hero />
      <Featured />
      <BringBar />
      <Classes />
      <Testimonials />
      <Cocktails />
      <Locations />
      <MobileBar />
      <FAQ />
      <Footer />
    </>
  )
}
