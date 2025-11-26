# Paywise - Community-Verified Price Tracking PWA

A production-ready Progressive Web App for tracking fair prices in Nigeria, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📱 **Mobile-First PWA** - Works offline with service worker
- 🔐 **Secure Authentication** - JWT token-based auth with refresh
- 📸 **Receipt Scanner** - Capture and OCR receipts
- 💰 **Price Tracking** - Community-verified price data
- 🏆 **Gamification** - Points, badges, and leaderboards
- ⚡ **Real-Time Updates** - Socket.io integration
- 🔌 **Offline-First** - Queue uploads for when online
- 🎨 **Paywise Design System** - Branded UI components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Data Fetching**: Axios + React Query
- **Real-Time**: Socket.io
- **Offline**: localforage + IndexedDB
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running at `http://localhost:3001/api/v1`

### Installation

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your values
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK=false

# Start development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api/v1` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `http://localhost:3001` |
| `NEXT_PUBLIC_USE_MOCK` | Use mock data | `false` |

## Project Structure

\`\`\`
src/
├── app/                          # Next.js pages & routes
│   ├── page.tsx                 # Home dashboard
│   ├── scan-receipt/            # Receipt scanner
│   ├── add-price/               # Manual price entry
│   ├── compare/                 # Price comparison
│   ├── community/               # Community feed
│   ├── rewards/                 # Rewards & leaderboard
│   └── profile/                 # User profile
├── components/
│   ├── layout/                  # AppShell, navigation
│   ├── common/                  # Button, Input, Card, etc.
│   ├── price/                   # PriceCard, comparison
│   ├── community/               # VerificationCard, feed
│   └── gamification/            # RewardsDisplay, leaderboard
├── lib/
│   ├── api.ts                   # Axios client
│   ├── socket.ts                # Socket.io setup
│   ├── types.ts                 # TypeScript interfaces
│   ├── utils.ts                 # Utility functions
│   └── store/
│       └── authStore.ts         # Zustand auth state
└── services/
    ├── storage.ts               # localforage wrapper
    └── offlineQueue.ts          # Offline queue (WIP)
\`\`\`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login user |
| `POST` | `/auth/refresh` | Refresh token |
| `GET` | `/prices` | Get prices (paginated) |
| `POST` | `/prices` | Submit new price |
| `POST` | `/prices/:id/verify` | Verify price |
| `GET` | `/products` | Search products |
| `GET` | `/products/:id/trends` | Get price trends |
| `POST` | `/receipts/upload` | Upload receipt |
| `POST` | `/receipts/process` | Process receipt OCR |

## Design System

### Colors

- **Primary**: #00875A (Deep Green)
- **Secondary**: #0A4FDC (Stable Blue)
- **Success**: #1E8E3E
- **Warning**: #FFB800
- **Danger**: #D93025

### Typography

- **Display**: Manrope (headings)
- **Body**: Inter (content)
- **Base Size**: 16px

### Components

- **Button**: Primary, Secondary, Ghost, Danger variants
- **Input**: Text with optional icon and error state
- **Card**: Rounded container with shadow
- **Badge**: Inline verification badges

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

For PWA:
- Builds service worker automatically
- Generate 192x192 and 512x512 icons in `/public`
- Manifest auto-generated at `/manifest.json`

## Testing Checklist

- [ ] Auth flow (register/login/logout)
- [ ] Scan receipt & OCR processing
- [ ] Add price form with autocomplete
- [ ] Offline mode (disable network in DevTools)
- [ ] Real-time feed updates
- [ ] Leaderboard display
- [ ] Mobile responsiveness
- [ ] PWA install prompt

## Offline Capabilities

- Queues POST requests while offline
- Caches GET requests in IndexedDB
- Shows "Offline Mode" banner
- Auto-syncs on reconnect

## Performance

- **Target Lighthouse**: > 80 (aim for 90)
- **Initial Load**: < 3s on 3G
- **Code Splitting**: Route-level lazy loading
- **Image Optimization**: Client-side compression

## Known Limitations

- Chart view: Placeholder (ready for Recharts)
- Map view: Placeholder (ready for Leaflet/Google Maps)
- Receipt OCR: Mock implementation
- Push notifications: Setup required with backend

## Future Enhancements

- [ ] Google Maps integration
- [ ] Advanced OCR with ML
- [ ] Payment integration for premium features
- [ ] Notifications & alerts
- [ ] Multi-language support
- [ ] Data export (CSV/JSON)
- [ ] User reputation scoring
- [ ] Trending alerts

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

## License

MIT
