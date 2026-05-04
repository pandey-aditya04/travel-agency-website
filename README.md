# Travel Agency - Premium Travel Agency Platform

Travel Agency is a high-performance, full-stack travel agency platform built with Next.js, Supabase, and Cloudinary. It features a premium design, robust lead management, and a seamless booking experience.

## 🚀 Key Features

### 🌍 For Travelers
- **Modern Exploration**: Filter and search through diverse travel categories (Indian Escapes, Overseas Adventures, Divine Destinations).
- **Interactive Booking**: Seamless 1-minute booking flow with real-time availability and traveler details.
- **Personal Dashboard**: Track all upcoming and past trips, manage profile details, and download digital itineraries.
- **PDF Itineraries**: Generate and download professional PDF booking confirmations instantly.
- **Premium UI**: Responsive design with sleek animations, glassmorphism elements, and optimized WebP media.

### 🔐 For Admins
- **Master Admin Panel**: Secure, JWT-protected dashboard to manage the entire platform.
- **Trip Wizard**: A 4-step interactive upload wizard with live preview and Cloudinary image integration.
- **Lead Management (CRM)**: Track customer interests, manage booking statuses, and access full traveler contact details.
- **Security**: Built-in rate limiting on the admin login to prevent unauthorized access.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), Lucide Icons, CSS Modules.
- **Backend**: Supabase (PostgreSQL, Auth, RLS).
- **Storage**: Cloudinary (Image optimization & CDN).
- **PDF Core**: jsPDF with AutoTable.
- **Deployment**: Optimized for Vercel/Netlify.

## 🏁 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pandey-aditya04/travel-agency-website.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file with the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
   ADMIN_MASTER_KEY=your_secure_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📄 License
This project is proprietary and built for Travel Agency.

---
Built with ❤️ by Antigravity
