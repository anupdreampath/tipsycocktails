import { Link } from 'react-router-dom'
import { cmsValue, usePageContent, type PageContent } from '../lib/cms'

const EVENTS = [
  { title: '21st Birthdays', key: '21st-birthdays-image', img: 'https://images.pexels.com/photos/30512892/pexels-photo-30512892/free-photo-of-festive-party-table-with-drinks-and-snacks.jpeg' },
  { title: 'Hen Parties', key: 'hen-parties-image', img: 'https://images.pexels.com/photos/30399305/pexels-photo-30399305/free-photo-of-celebratory-toast-at-bridal-party-gathering.jpeg' },
  { title: '40th Birthdays', key: '40th-birthdays-image', img: 'https://images.pexels.com/photos/30844787/pexels-photo-30844787/free-photo-of-elegant-30th-birthday-celebration-with-balloons-and-cake.jpeg' },
  { title: '50th Birthdays', key: '50th-birthdays-image', img: 'https://images.pexels.com/photos/10477106/pexels-photo-10477106.jpeg' },
  { title: '30th Birthdays', key: '30th-birthdays-image', img: 'https://images.pexels.com/photos/30464376/pexels-photo-30464376/free-photo-of-festive-celebration-with-sparkling-drinks-in-brazil.jpeg' },
  { title: '60th Birthdays', key: '60th-birthdays-image', img: 'https://images.pexels.com/photos/16148201/pexels-photo-16148201.jpeg' },
  { title: 'Garden Parties', key: 'garden-parties-image', img: 'https://images.pexels.com/photos/36521864/pexels-photo-36521864/free-photo-of-elegant-garden-party-with-refreshments-and-florals.jpeg' },
  { title: 'Corporate Events', key: 'corporate-events-image', img: 'https://images.pexels.com/photos/6405661/pexels-photo-6405661.jpeg' },
  { title: 'Christmas Parties', key: 'christmas-parties-image', img: 'https://images.pexels.com/photos/30009118/pexels-photo-30009118/free-photo-of-festive-cheers-with-espresso-martinis-by-a-christmas-tree.jpeg' },
]

const LOCATIONS = [
  { title: 'The Grand Ballroom', key: 'grand-ballroom-image', img: 'https://images.pexels.com/photos/30311728/pexels-photo-30311728/free-photo-of-elegant-ballroom-set-for-a-lavish-event.jpeg',
    desc: 'A breathtaking historic venue perfect for elegant weddings, milestone birthdays, and upscale corporate celebrations.' },
  { title: 'Riverside Sports Club', key: 'riverside-sports-club-image', img: 'https://images.pexels.com/photos/30651230/pexels-photo-30651230/free-photo-of-illuminated-soccer-stadium-at-night-with-crowd.jpeg',
    desc: 'A vibrant sporting venue where we deliver premium bar service for matches, functions, and private events.' },
  { title: 'Meadowbrook Farm', key: 'meadowbrook-farm-image', img: 'https://images.pexels.com/photos/29781787/pexels-photo-29781787/free-photo-of-rustic-barn-wedding-venue-with-outdoor-setup.jpeg',
    desc: 'A stunning rural retreat surrounded by rolling countryside — ideal for outdoor weddings and unforgettable celebrations.' },
]

const HOME_MENU_ITEMS = [
  { name: 'Amaretto Sour', key: 'amaretto-sour-image', img: '/home page menu /Amaretto Sour.png' },
  { name: 'Cosmopolitan', key: 'cosmopolitan-image', img: '/home page menu /Cosmopolitan.png' },
  { name: 'Hugo Spritz', key: 'hugo-spritz-image', img: '/home page menu /Hugo Spritz.png' },
  { name: 'Kingston', key: 'kingston-image', img: '/home page menu /Kingston.png' },
  { name: 'Kir Royale', key: 'kir-royale-image', img: '/home page menu /Kir Royale.png' },
  { name: 'Margarita', key: 'margarita-image', img: '/home page menu /Margarita.png' },
  { name: 'Mojito', key: 'mojito-image', img: '/home page menu /Mojito.png' },
  { name: 'Negroni', key: 'negroni-image', img: '/home page menu /Negroni.png' },
  { name: 'Pornstar Martini', key: 'pornstar-martini-image', img: '/home page menu /Pornstar Martini.png' },
  { name: 'Sex On The Beach', key: 'sex-on-the-beach-image', img: '/home page menu /Sex On The Beach.png' },
]

function Hero({ content }: { content: PageContent }) {
  return (
    <section className="hero">
      <img
        className="hero-bg-img"
        src={cmsValue(content, 'hero', 'image', 'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg?auto=compress&cs=tinysrgb&w=1400')}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-content">
        <h1>{cmsValue(content, 'hero', 'title', 'Mobile Bartending & Cocktail Experiences')}</h1>
        <p className="subtitle">{cmsValue(content, 'hero', 'subtitle', 'We bring THE PARTY to your event.')}</p>
        <Link to="/contact" className="btn">{cmsValue(content, 'hero', 'cta', 'Get the Party Started')}</Link>
      </div>
    </section>
  )
}

function Featured({ content }: { content: PageContent }) {
  return (
    <div id="parties" className="featured">
      <div className="featured-scroll">
        {EVENTS.map(e => (
          <a className="featured-card" key={e.title} href="#">
            <h2>{e.title}</h2>
            <div className="img-wrap"><img src={cmsValue(content, 'events', e.key, e.img)} alt={e.title} decoding="async" /></div>
          </a>
        ))}
      </div>
      <div className="featured-arrow">›</div>
    </div>
  )
}

function BringBar({ content }: { content: PageContent }) {
  return (
    <section className="block bg-iris">
      <div className="container">
        <div className="row-2">
          <div className="col-image">
            <img className="col-image-main" src={cmsValue(content, 'bring-bar', 'image', 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/d895a804-4c53-4616-9ddc-68896c47f1a0-2-1024x887.jpeg?strip=all')} alt="Mobile cocktail bar party setup" decoding="async" />
          </div>
          <div className="col-text">
            <h2>Your event,<br/>our bar,<br/>unforgettable<br/>moments</h2>
            <p>We're a passionate crew of expert mixologists who bring a premium bar experience straight to your door. From intimate house parties to grand venue celebrations, we transform any space into a cocktail destination.</p>
            <p>Every event is unique — which is why we tailor our cocktail menu, bar setup, and service style entirely to you. Premium spirits, personalised garnishes, and skilled bartenders who know how to read the room.</p>
            <Link to="/contact" className="btn">Get a Quote</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeMenu({ content }: { content: PageContent }) {
  return (
    <section id="cocktails" className="block bg-cream cocktails-section">
      <div className="container">
        <div className="cocktails-head">
          <h2>Our Signature Cocktail Menu</h2>
          <p>From timeless classics to dazzling originals, our menu has something for every taste. Bold spirits, light fruity blends, or alcohol-free creations — our mixologists bring them all to life at your event.</p>
          <Link to="/menu" className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>View Full Menu</Link>
        </div>
        <div className="cocktail-carousel">
          <div className="cocktail-scroll">
            {HOME_MENU_ITEMS.map(c => (
              <div className="cocktail-card" key={c.name}>
                <div className="img-wrap"><img src={cmsValue(content, 'menu-images', c.key, c.img)} alt={c.name} decoding="async" /></div>
                <h3>{c.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Locations({ content }: { content: PageContent }) {
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
              <div className="img-wrap"><img src={cmsValue(content, 'locations', l.key, l.img)} alt={l.title} decoding="async" /></div>
              <h3>{l.title}</h3>
              <div className="body"><p>{l.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MobileBar({ content }: { content: PageContent }) {
  return (
    <section id="mobile-bar" className="block bg-iris">
      <div className="container">
        <div className="row-2">
          <div className="col-text">
            <h2>We Come<br/>To You.<br/>Wherever<br/>You Are.</h2>
            <p>From compact home setups to full outdoor festival bars, our fully equipped mobile units adapt to any space or occasion. Tell us your vision — we'll handle everything from setup to last call.</p>
            <Link to="/contact" className="btn">Learn More</Link>
          </div>
          <div className="col-image">
            <img className="col-image-main" src={cmsValue(content, 'mobile-bar', 'image', 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Mobile-Bar.jpg?strip=all')} alt="Mobile cocktail bar hire" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const content = usePageContent('home')

  return (
    <main className="home-lite">
      <span id="top" />
      <Hero content={content} />
      <Featured content={content} />
      <BringBar content={content} />
      <HomeMenu content={content} />
      <Locations content={content} />
      <MobileBar content={content} />
    </main>
  )
}
