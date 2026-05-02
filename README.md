# Tipsy Cocktails - Admin & Features README

## Tasks Completed

### 1. Home Page Images Fix
- Removed duplicate loremflickr placeholder images
- Added unique, relevant Unsplash images for each section
- Each event/location now has a distinct, contextually relevant image

### 2. Admin Panel (/admin)
- **Login**: admin@tipsycocktails.com / demo@123
- **Password Reset**: Available from admin dashboard
- JWT-based authentication with httpOnly cookies

### 3. Visitor Tracking
Tables: `visits`
- Tracks every visitor with IP address
- Estimates location (city/country) via IP geolocation API
- Records device type (desktop/mobile/tablet) and browser
- Calculates time spent on website per session
- Admin dashboard shows all visitor reports

### 4. Content Management System (CMS)
Table: `page_content`
- Edit all text on all pages from admin panel
- Pages: home (hero, bring-bar, locations, mobile-bar), menu, classes, reviews, faq, contact
- Each section has editable title, subtitle, description fields
- Changes reflect immediately on frontend

### 5. Reviews & Ratings System
Table: `reviews`
- Public can submit ratings (1-5 stars) and text reviews
- Admin can approve or remove reviews from dashboard
- Approved reviews display on Reviews page

## Database Tables

```sql
contacts        -- Contact form submissions (existing)
admin_users     -- Admin accounts with bcrypt passwords
visits          -- Visitor tracking data
page_content    -- CMS content storage
reviews         -- Customer reviews (approved/pending)
```

## API Endpoints

### Auth
- POST /api/admin/login
- POST /api/admin/reset-password
- GET /api/admin/me

### Quote Requests
- POST /api/contact
- GET /api/admin/contacts

Quote requests are stored in the `contacts` table and shown in the admin dashboard under `quotes`.

Cloudinary uploads use Vite environment variables:

```bash
VITE_CLOUDINARY_CLOUD_NAME=ndimwurksz
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
```

Optional instant email notifications use your existing email account SMTP settings:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-app-password
QUOTE_NOTIFY_EMAIL=you@example.com
QUOTE_FROM_EMAIL=your-email@gmail.com
```

If these variables are not set, the quote request still saves to the database and dashboard. WhatsApp does not allow automatic server-to-personal-WhatsApp notifications without using the official WhatsApp Business API or a provider. The admin quotes panel includes a free click-to-chat WhatsApp link for every inquiry with a phone number.

### Visitor Tracking
- POST /api/visit/start
- POST /api/visit/end
- GET /api/admin/visits

### CMS
- GET /api/content/:page
- PUT /api/admin/content/:page

### Reviews
- GET /api/reviews
- POST /api/reviews
- PUT /api/admin/reviews/:id/approve
- DELETE /api/admin/reviews/:id

## Scripts

```bash
npm run dev      # Vite dev server (port 5176)
npm run server   # Express API server (port 3001)
npm run dev:all  # Both servers concurrently
```
# tipsycocktails
