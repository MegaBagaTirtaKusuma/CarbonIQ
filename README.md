# CarbonIQ — AI-Powered GHG Calculator

## Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Jalankan development server
```bash
npm run dev
```

### 3. Buka browser
```
http://localhost:3000
```

## Struktur Proyek

```
src/
├── app/
│   ├── layout.tsx          # Root layout + font setup
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles + Tailwind
│
└── components/
    ├── sections/
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   ├── ScopeSection.tsx
    │   ├── TemplateSection.tsx
    │   ├── UploadSection.tsx
    │   ├── AnalyticsSection.tsx
    │   ├── TechSection.tsx
    │   ├── CTASection.tsx
    │   └── Footer.tsx
    │
    └── dashboard/
        └── DashboardPreview.tsx

public/
└── CarbonIQ_Template_GHG.xlsx   # Template download
```

## Tech Stack
- **Next.js 15** + TypeScript
- **TailwindCSS** untuk styling
- **Recharts** untuk grafik (Pie, Line)
- **Lucide React** untuk ikon

## Build untuk Production
```bash
npm run build
npm start
```
