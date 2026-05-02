import pg from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_8N3HYUQKBzka@ep-divine-salad-am6cscmb-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const SHOULD_AUTO_SETUP = process.env.AUTO_SETUP_DATABASE === 'true' || process.env.NODE_ENV !== 'production'

const { Pool } = pg
const pgConnectionString = new URL(DATABASE_URL)
pgConnectionString.searchParams.delete('sslmode')
pgConnectionString.searchParams.delete('channel_binding')

const pool = new Pool({
  connectionString: pgConnectionString.toString(),
  ssl: { rejectUnauthorized: false },
})

let setupPromise

export async function sql(strings, ...values) {
  if (SHOULD_AUTO_SETUP) {
    await ensureDatabase()
  }
  return query(strings, ...values)
}

async function query(strings, ...values) {
  const text = strings.reduce((statement, string, index) => {
    return `${statement}${string}${index < values.length ? `$${index + 1}` : ''}`
  }, '')
  const result = await pool.query(text, values)
  return result.rows
}

export function ensureDatabase() {
  if (!setupPromise) {
    setupPromise = setupDatabase().catch((error) => {
      setupPromise = undefined
      throw error
    })
  }
  return setupPromise
}

export async function setupDatabase() {
  // Contacts table
  await query`CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  // Admin users table
  await query`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  // Visits table
  await query`CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    city VARCHAR(100),
    country VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    page_path VARCHAR(255),
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
  )`

  // Page content table
  await query`CREATE TABLE IF NOT EXISTS page_content (
    id SERIAL PRIMARY KEY,
    page VARCHAR(100) NOT NULL,
    section VARCHAR(100) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page, section, key)
  )`

  // Reviews table
  await query`CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  // Seed default admin
  const existing = await query`SELECT * FROM admin_users WHERE email = 'admin@tipsycocktails.com'`
  if (existing.length === 0) {
    const bcrypt = await import('bcryptjs')
    const hash = await bcrypt.hash('demo@123', 10)
    await query`INSERT INTO admin_users (email, password_hash) VALUES ('admin@tipsycocktails.com', ${hash})`
  }

  // Seed default content
  const defaultContent = [
    ['site', 'branding', 'logo-image', '/logo.png'],
    ['home', 'hero', 'title', 'Mobile Bartending & Cocktail Experiences'],
    ['home', 'hero', 'subtitle', 'We bring THE PARTY to your event.'],
    ['home', 'hero', 'cta', 'Get the Party Started'],
    ['home', 'hero', 'image', 'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg?auto=compress&cs=tinysrgb&w=1400'],
    ['home', 'bring-bar', 'title', 'Your event, our bar, unforgettable moments'],
    ['home', 'bring-bar', 'desc1', "We're a passionate crew of expert mixologists who bring a premium bar experience straight to your door."],
    ['home', 'bring-bar', 'desc2', 'Every event is unique — which is why we tailor our cocktail menu, bar setup, and service style entirely to you.'],
    ['home', 'bring-bar', 'image', 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/d895a804-4c53-4616-9ddc-68896c47f1a0-2-1024x887.jpeg?strip=all'],
    ['home', 'events', '21st-birthdays-image', 'https://images.pexels.com/photos/30512892/pexels-photo-30512892/free-photo-of-festive-party-table-with-drinks-and-snacks.jpeg'],
    ['home', 'events', 'hen-parties-image', 'https://images.pexels.com/photos/30399305/pexels-photo-30399305/free-photo-of-celebratory-toast-at-bridal-party-gathering.jpeg'],
    ['home', 'events', '40th-birthdays-image', 'https://images.pexels.com/photos/30844787/pexels-photo-30844787/free-photo-of-elegant-30th-birthday-celebration-with-balloons-and-cake.jpeg'],
    ['home', 'events', '50th-birthdays-image', 'https://images.pexels.com/photos/10477106/pexels-photo-10477106.jpeg'],
    ['home', 'events', '30th-birthdays-image', 'https://images.pexels.com/photos/30464376/pexels-photo-30464376/free-photo-of-festive-celebration-with-sparkling-drinks-in-brazil.jpeg'],
    ['home', 'events', '60th-birthdays-image', 'https://images.pexels.com/photos/16148201/pexels-photo-16148201.jpeg'],
    ['home', 'events', 'garden-parties-image', 'https://images.pexels.com/photos/36521864/pexels-photo-36521864/free-photo-of-elegant-garden-party-with-refreshments-and-florals.jpeg'],
    ['home', 'events', 'corporate-events-image', 'https://images.pexels.com/photos/6405661/pexels-photo-6405661.jpeg'],
    ['home', 'events', 'christmas-parties-image', 'https://images.pexels.com/photos/30009118/pexels-photo-30009118/free-photo-of-festive-cheers-with-espresso-martinis-by-a-christmas-tree.jpeg'],
    ['home', 'menu-images', 'amaretto-sour-image', '/home page menu /Amaretto Sour.png'],
    ['home', 'menu-images', 'cosmopolitan-image', '/home page menu /Cosmopolitan.png'],
    ['home', 'menu-images', 'hugo-spritz-image', '/home page menu /Hugo Spritz.png'],
    ['home', 'menu-images', 'kingston-image', '/home page menu /Kingston.png'],
    ['home', 'menu-images', 'kir-royale-image', '/home page menu /Kir Royale.png'],
    ['home', 'menu-images', 'margarita-image', '/home page menu /Margarita.png'],
    ['home', 'menu-images', 'mojito-image', '/home page menu /Mojito.png'],
    ['home', 'menu-images', 'negroni-image', '/home page menu /Negroni.png'],
    ['home', 'menu-images', 'pornstar-martini-image', '/home page menu /Pornstar Martini.png'],
    ['home', 'menu-images', 'sex-on-the-beach-image', '/home page menu /Sex On The Beach.png'],
    ['home', 'locations', 'title', 'Our Partner Venues'],
    ['home', 'locations', 'subtitle', "Beyond private hire, we're proud to be the resident bar team at some of the region's most celebrated event spaces."],
    ['home', 'locations', 'grand-ballroom-image', 'https://images.pexels.com/photos/30311728/pexels-photo-30311728/free-photo-of-elegant-ballroom-set-for-a-lavish-event.jpeg'],
    ['home', 'locations', 'riverside-sports-club-image', 'https://images.pexels.com/photos/30651230/pexels-photo-30651230/free-photo-of-illuminated-soccer-stadium-at-night-with-crowd.jpeg'],
    ['home', 'locations', 'meadowbrook-farm-image', 'https://images.pexels.com/photos/29781787/pexels-photo-29781787/free-photo-of-rustic-barn-wedding-venue-with-outdoor-setup.jpeg'],
    ['home', 'mobile-bar', 'title', 'We Come To You. Wherever You Are.'],
    ['home', 'mobile-bar', 'desc', "From compact home setups to full outdoor festival bars, our fully equipped mobile units adapt to any space or occasion."],
    ['home', 'mobile-bar', 'image', 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Mobile-Bar.jpg?strip=all'],
    ['menu', 'header', 'title', 'Our Cocktail Menu'],
    ['menu', 'header', 'subtitle', 'Explore our signature cocktails crafted with premium spirits and fresh ingredients.'],
    ['menu', 'pages', 'page-1-image', '/1 (1).png'],
    ['menu', 'pages', 'page-2-image', '/2 (1).png'],
    ['menu', 'pages', 'page-3-image', '/3 (1).png'],
    ['menu', 'pages', 'page-4-image', '/4.png'],
    ['menu', 'pages', 'page-5-image', '/5.png'],
    ['menu', 'pages', 'page-6-image', '/6.png'],
    ['menu', 'pages', 'page-7-image', '/7.png'],
    ['menu', 'pages', 'page-8-image', '/8.png'],
    ['menu', 'pages', 'page-9-image', '/9.png'],
    ['classes', 'header', 'title', 'Cocktail Making Classes'],
    ['classes', 'header', 'subtitle', 'Discover the craft of cocktail making with our hands-on mixology experiences.'],
    ['classes', 'gallery', 'cocktail-making-classes-image', 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Cocktail-Making-Classes-Scotland.png?strip=all'],
    ['classes', 'gallery', 'cocktail-making-classes-title', 'Cocktail Making Classes'],
    ['classes', 'gallery', '21st-birthdays-image', 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/FD48F650-3EDF-4A0E-8EDB-2F0EC3150454-1.jpeg?strip=all'],
    ['classes', 'gallery', '21st-birthdays-title', '21st Birthdays'],
    ['classes', 'gallery', 'mobile-bar-hire-image', 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Mobile-Bar.jpg?strip=all'],
    ['classes', 'gallery', 'mobile-bar-hire-title', 'Mobile Bar Hire'],
    ['classes', 'gallery', 'corporate-events-image', 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Corporate-4.jpg?strip=all'],
    ['classes', 'gallery', 'corporate-events-title', 'Corporate Events'],
    ['reviews', 'header', 'title', 'What Our Clients Say'],
    ['reviews', 'header', 'subtitle', 'Real reviews from real events.'],
    ['faq', 'header', 'title', 'Frequently Asked Questions'],
    ['faq', 'header', 'subtitle', 'Everything you need to know about booking with us.'],
    ['contact', 'header', 'title', 'Contact the Team'],
    ['contact', 'header', 'subtitle', 'Get in touch with our team to discuss your event.'],
  ]

  for (const [page, section, key, value] of defaultContent) {
    await query`
      INSERT INTO page_content (page, section, key, value)
      VALUES (${page}, ${section}, ${key}, ${value})
      ON CONFLICT (page, section, key) DO NOTHING
    `
  }
}
