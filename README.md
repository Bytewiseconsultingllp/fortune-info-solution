# Fortune Info Solutions - Corporate Website..

A comprehensive corporate website built with Next.js, MongoDB, and TypeScript featuring a full admin dashboard, product management, contact forms, and email notifications.

## 🚀 Features

### Public Website
- **Homepage** - Professional corporate landing page
- **About Us** - Company profile, history, mission & vision
- **Products/Brands** - Dynamic product catalog with filtering and search
- **Services** - Comprehensive service listings with categories
- **Contact Us** - Contact form with email notifications
- **Partner Enquiry** - Partnership application form
- **Quote Requests** - Product quote request system
- **Legal Pages** - Privacy Policy, Terms & Conditions, Cookie Policy
- **Awards & Certificates** - Company achievements showcase
- **Channel Partner** - Partnership information

### Admin Dashboard
- **Secure Authentication** - JWT-based admin login
- **Dashboard Overview** - Real-time statistics and recent activity
- **Product Management** - Full CRUD operations for products
- **Service Management** - Complete service content management
- **Contact Management** - View and manage contact submissions
- **Partner Management** - Handle partnership applications
- **Quote Management** - Track and manage quote requests
- **Data Export** - CSV export functionality for all data

### Technical Features
- **MongoDB Integration** - Complete database with validation schemas
- **Email Notifications** - Automated admin notifications for form submissions
- **Responsive Design** - Mobile-first responsive layout
- **Real-time Data** - Live database connections throughout
- **Audit Logging** - Complete activity tracking system
- **Error Handling** - Comprehensive error management
- **Loading States** - Professional loading indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with validation schemas
- **Authentication**: JWT with HTTP-only cookies
- **Email**: Nodemailer with SMTP
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- **MongoDB** database (local or cloud)
- **SMTP Email Service** (Gmail, SendGrid, etc.)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd fortune-info-solutions
\`\`\`

### 2. Install Dependencies

\`\`\`bash
# Using npm
npm install

# Using bun (recommended)
bun install
\`\`\`

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory:

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/fortune_info_solutions
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fortune_info_solutions

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Addresses
ADMIN_EMAIL=admin@fortuneinfosolutions.com
FROM_EMAIL=noreply@fortuneinfosolutions.com
\`\`\`

### 4. Database Setup

Run the database setup scripts to create collections and seed data:

\`\`\`bash
# Create all MongoDB collections with validation schemas
npm run setup-db
# or
bun run scripts/create-all-collections.js

# Seed the database with sample data
npm run seed-db
# or
bun run scripts/seed-all-data.js
\`\`\`

### 5. Run the Development Server

\`\`\`bash
# Using npm
npm run dev

# Using bun
bun dev
\`\`\`

The application will be available at `http://localhost:3000`

## 📊 Database Management

### Setup New Database
\`\`\`bash
# Create all collections with validation
bun run scripts/create-all-collections.js

# Add sample data
bun run scripts/seed-all-data.js
\`\`\`

### Update Database Schema
\`\`\`bash
# Update existing collections with new schema
bun run scripts/update-database-schema.js
\`\`\`

### Reset Database
\`\`\`bash
# Clear all data and recreate collections
bun run scripts/reset-database.js
\`\`\`

### Backup Database
\`\`\`bash
# Export all data
mongodump --uri="your_mongodb_uri" --out=./backup

# Import data
mongorestore --uri="your_mongodb_uri" ./backup
\`\`\`

## 🔐 Admin Access

### Default Admin Credentials
- **URL**: `http://localhost:3000/admin/login`
- **Username**: `admin` (or your ADMIN_USERNAME)
- **Password**: Your ADMIN_PASSWORD from .env.local

### Admin Features
- Dashboard with real-time statistics
- Product management (Add/Edit/Delete)
- Service management
- Contact submissions tracking
- Partner enquiry management
- Quote request handling
- Data export (CSV)

## 📡 API Endpoints

### Public APIs
\`\`\`
GET  /api/products          - Get all products
GET  /api/services          - Get all services
POST /api/contact           - Submit contact form
POST /api/partner-enquiry   - Submit partner enquiry
POST /api/quote             - Submit quote request
\`\`\`

### Admin APIs (Requires Authentication)
\`\`\`
POST /api/admin/login       - Admin login
POST /api/admin/logout      - Admin logout
GET  /api/admin/verify      - Verify admin token

# Products
GET    /api/admin/products     - Get all products
POST   /api/admin/products     - Create product
PUT    /api/admin/products/[id] - Update product
DELETE /api/admin/products/[id] - Delete product

# Services
GET    /api/admin/services     - Get all services
POST   /api/admin/services     - Create service
PUT    /api/admin/services/[id] - Update service
DELETE /api/admin/services/[id] - Delete service

# Submissions
GET /api/admin/contacts        - Get contact submissions
GET /api/admin/partners        - Get partner enquiries
GET /api/admin/quotes          - Get quote requests
GET /api/admin/dashboard/stats - Get dashboard statistics
\`\`\`

## 🎨 Design System

### Colors (Strictly Followed)
- **Primary**: Red (#B8001F)
- **Secondary**: Black (#000000)
- **Background**: White (#FDFAF6)

### Typography
- **Headings**: Geist font family
- **Body**: Manrope font family

## 📁 Project Structure

\`\`\`
fortune-info-solutions/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── (public pages)/    # Public website pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── (custom)/         # Custom components
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts           # Authentication utilities
│   ├── email.ts          # Email service
│   ├── logger.ts         # Logging system
│   └── database-schema.ts # Database schemas
├── scripts/              # Database scripts
│   ├── create-all-collections.js
│   ├── seed-all-data.js
│   └── (other scripts)/
└── public/               # Static assets
\`\`\`

## 🔧 Development Commands

\`\`\`bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Database
npm run setup-db           # Setup database collections
npm run seed-db            # Seed sample data
npm run reset-db           # Reset database

# Deployment
npm run deploy             # Deploy to Vercel
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add Environment Variables** in Vercel dashboard
4. **Deploy**

### Environment Variables for Production
Make sure to add all environment variables in your deployment platform:
- `MONGODB_URI`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `ADMIN_EMAIL`, `FROM_EMAIL`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
\`\`\`bash
# Check MongoDB is running
mongosh "your_mongodb_uri"

# Verify environment variables
echo $MONGODB_URI
\`\`\`

**Email Not Sending**
- Verify SMTP credentials
- Check firewall settings
- Enable "Less secure app access" for Gmail
- Use App Passwords for Gmail

**Admin Login Issues**
- Verify ADMIN_USERNAME and ADMIN_PASSWORD
- Check JWT_SECRET is set
- Clear browser cookies

**Build Errors**
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

### Logs and Debugging

Check application logs:
\`\`\`bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log
\`\`\`

## 📞 Support

For technical support or questions:
- **Email**: admin@fortuneinfosolutions.com
- **Documentation**: Check this README
- **Issues**: Create GitHub issues for bugs

## 📄 License

This project is proprietary software for Fortune Info Solutions.

---

**Fortune Info Solutions** - Professional Corporate Website Solution
