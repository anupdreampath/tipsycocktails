import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_8N3HYUQKBzka@ep-divine-salad-am6cscmb-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

export const sql = neon(DATABASE_URL)

export async function setupDatabase() {
  // Contacts table
  await sql`CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  // Admin users table
  await sql`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  // Visits table
  await sql`CREATE TABLE IF NOT EXISTS visits (
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
  await sql`CREATE TABLE IF NOT EXISTS page_content (
    id SERIAL PRIMARY KEY,
    page VARCHAR(100) NOT NULL,
    section VARCHAR(100) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page, section, key)
  )`

  // Reviews table
  await sql`CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  // Seed default admin
  const existing = await sql`SELECT * FROM admin_users WHERE email = 'admin@tipsycocktails.com'`
  if (existing.length === 0) {
    const bcrypt = await import('bcryptjs')
    const hash = await bcrypt.hash('demo@123', 10)
    await sql`INSERT INTO admin_users (email, password_hash) VALUES ('admin@tipsycocktails.com', ${hash})`
  }

  // Seed default content
  const defaultContent = [
    ['home', 'hero', 'title', 'Mobile Bartending & Cocktail Experiences'],
    ['home', 'hero', 'subtitle', 'We bring THE PARTY to your event.'],
    ['home', 'hero', 'cta', 'Get the Party Started'],
    ['home', 'bring-bar', 'title', 'Your event, our bar, unforgettable moments'],
    ['home', 'bring-bar', 'desc1', "We're a passionate crew of expert mixologists who bring a premium bar experience straight to your door."],
    ['home', 'bring-bar', 'desc2', 'Every event is unique — which is why we tailor our cocktail menu, bar setup, and service style entirely to you.'],
    ['home', 'locations', 'title', 'Our Partner Venues'],
    ['home', 'locations', 'subtitle', "Beyond private hire, we're proud to be the resident bar team at some of the region's most celebrated event spaces."],
    ['home', 'mobile-bar', 'title', 'We Come To You. Wherever You Are.'],
    ['home', 'mobile-bar', 'desc', "From compact home setups to full outdoor festival bars, our fully equipped mobile units adapt to any space or occasion."],
    ['menu', 'header', 'title', 'Our Cocktail Menu'],
    ['menu', 'header', 'subtitle', 'Explore our signature cocktails crafted with premium spirits and fresh ingredients.'],
    ['classes', 'header', 'title', 'Cocktail Making Classes'],
    ['classes', 'header', 'subtitle', 'Discover the craft of cocktail making with our hands-on mixology experiences.'],
    ['reviews', 'header', 'title', 'What Our Clients Say'],
    ['reviews', 'header', 'subtitle', 'Real reviews from real events.'],
    ['faq', 'header', 'title', 'Frequently Asked Questions'],
    ['faq', 'header', 'subtitle', 'Everything you need to know about booking with us.'],
    ['contact', 'header', 'title', 'Contact the Team'],
    ['contact', 'header', 'subtitle', 'Get in touch with our team to discuss your event.'],
  ]

  for (const [page, section, key, value] of defaultContent) {
    await sql`
      INSERT INTO page_content (page, section, key, value)
      VALUES (${page}, ${section}, ${key}, ${value})
      ON CONFLICT (page, section, key) DO NOTHING
    `
  }
}
