# PetPass

> **One passport for every paw.**

A Progressive Web App for creating portable, digital identities for pets that consolidates vital, medical, and fun data into one QR-shareable profile.

## Features

- 🐾 **Pet Profile Management** - Create and manage multiple pet profiles with up to 3 photos per pet
- 🔐 **Demo Mode** - Works with localStorage (no Firebase setup required)
- 🏥 **Health Records** - Track vaccinations, medications, allergies, vet info, nutrition (food/treat/vitamin brands), feeding schedules, and health issues
- 📄 **Medical Documents** - Upload multiple vaccination records, prescriptions, and certifications
- ✈️ **Travel Information** - Pet passports, travel history, and legal documents
- 🎉 **Fun & Personality** - Nicknames, bios, favorites, quirks, and social media links (Instagram & TikTok)
- 📱 **QR Code Sharing** - Generate QR codes for instant profile sharing
- 🎨 **Modern Design** - Teal brutalist-inspired UI with glass effects and mobile hamburger navigation
- 🔒 **Privacy Controls** - Public, Private, or Invite-only profiles
- 🖼️ **Image Optimization** - Automatic compression to 800px width at 70% quality for efficient storage

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Storage**: Demo mode with localStorage (Firebase optional)
- **QR Codes**: react-qr-code
- **Image Processing**: HTML5 Canvas for compression
- **Hosting**: Vercel / Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account (optional - demo mode works without Firebase)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd petpass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server** (Demo mode - no Firebase required)
   ```bash
   npm run dev
   ```

4. **(Optional) Set up Firebase** for production deployment

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google, Apple)
   - Create a Firestore database
   - Enable Firebase Storage
   - Copy your Firebase config

5. **(Optional) Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

6. **Open the app**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
petpass/
├── app/
│   ├── dashboard/          # Multi-pet dashboard
│   ├── pets/
│   │   ├── new/           # Create new pet profile
│   │   ├── [id]/          # View pet profile
│   │   └── [id]/edit/     # Edit pet profile
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Landing page with auth
├── components/
│   └── ui/                # ShadCN UI components
├── contexts/
│   ├── AuthContext.tsx    # Firebase authentication context
│   └── DemoAuthContext.tsx # Demo mode authentication (localStorage)
├── lib/
│   ├── firebase.ts        # Firebase config
│   ├── localStorage.ts    # localStorage database utilities
│   └── utils.ts           # Utility functions
└── types/
    └── pet.ts             # TypeScript interfaces
```

## Data Structure

```typescript
pets/
  {petId}/
    ownerId: string
    owner: {
      name: string
      email: string
      phone?: string
      address?: string
      photoUrl?: string
    }
    profile: {
      name: string
      species: string
      breed: string
      dob: string
      color: string
      weight: string
      microchip?: string
      photoUrl?: string
      photos?: string[]  // Up to 3 photos (base64)
      qrUrl?: string
    }
    health: {
      vet: string
      clinic: string
      contact: string
      allergies: string[]
      medications: string[]
      vaccinations: Array<{
        name: string
        date: string
        expiry: string
      }>
      foodBrand?: string
      treatBrand?: string
      vitaminBrand?: string
      feedingSchedule?: string
      healthIssues?: string[]
      vaccinationImages?: string[]  // Multiple images (base64)
      prescriptions?: string[]      // Multiple images (base64)
      certifications?: string[]     // Multiple images (base64)
    }
    fun: {
      nicknames: string[]
      bio: string
      favorites: {
        food?: string
        toy?: string
      }
      quirks?: string
      instagram?: string
      tiktok?: string
    }
    travel: {
      passportNumber?: string
      countryOfOrigin: string
      travelHistory: string[]
    }
    privacy: 'public' | 'private' | 'invite-only'
    createdAt: string
    updatedAt: string
```

## Design System

### Colors
- **Primary**: Teal (#006D77)
- **Secondary**: Very light teal (#E0F2F4)
- **Accent**: Light teal (#B2DFE3)
- **Background**: White (#FFFFFF)

### Typography
- **Headers**: Libre Baskerville (serif)
- **Labels**: Space Mono (monospace)
- **Body**: Inter (sans-serif)

### UI Philosophy
Modern brutalist design with warmth - structured and grid-based but playful with strong borders, shadow effects, and color blocking.

## Roadmap

### Phase 1 (Completed ✅)
- [x] Demo mode with localStorage
- [x] Pet profile CRUD with edit functionality
- [x] Multi-photo upload (up to 3 per pet)
- [x] Owner information management
- [x] Comprehensive health tracking
  - [x] Nutrition (food/treat/vitamin brands)
  - [x] Feeding schedule
  - [x] Health issues tracking
  - [x] Multiple medical document uploads
- [x] Social media links (Instagram & TikTok)
- [x] QR code generation
- [x] Multi-pet dashboard
- [x] Image compression for storage efficiency
- [x] Mobile hamburger navigation
- [x] Glass effect UI elements
- [x] Responsive design

### Phase 2 (Next)
- [ ] Firebase integration for production
- [ ] Image uploads to Firebase Storage
- [ ] PWA configuration with service workers
- [ ] Vaccination reminders
- [ ] PDF export
- [ ] Public profile viewing (no auth required)

### Phase 3 (Future)
- [ ] Vet access mode
- [ ] Badge system
- [ ] Pet network/social features
- [ ] NFC tag support
- [ ] Apple/Google Wallet pass generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ for pet lovers everywhere
