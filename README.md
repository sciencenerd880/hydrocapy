# 🦫 HydroCapy - Cozy Hydration & Bento Wellness Web App / PWA

An interactive, fluid-motion hydration tracker and Bento wellness dashboard built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**.

Featuring a real-time 60 FPS physics pool with a floating capybara driven by hardware **accelerometer/gyroscope device tilt** (with drag/touch fallback), paired with an SVG-masked liquid silhouette and circadian pacing metrics.

---

## ✨ Features

- **🌊 60 FPS Fluid Physics Pool:**
  - Real-time numerical damped motion simulation.
  - Driven by the HTML5 `DeviceOrientationEvent` (with iOS Safari permission handshake).
  - Boat-like banking rotation (up to $\pm 28^\circ$) as the float gains momentum.
  - Dynamic wake ripple particles generated behind the floaty during movement.
  - Desktop & touch fallback: click and drag or move pointer across the water to attract the floaty.

- **🍱 Bento Habit Dashboard:**
  - **SVG Liquid Silhouette Mask:** Capybara vector contour filled with animated sine-wave liquid crests and multi-beverage layers (water, tea, coffee, juice, electrolyte).
  - **Circadian Hydration Pacing:** Calculates real-time delta ($\pm\text{ml}$) against a healthy daytime curve ($8\text{ AM} \to 10\text{ PM}$).
  - **Caffeine & Electrolyte Monitor:** Tracks cumulative caffeine against the 400 mg daily guideline.
  - **Milestone Rewards:** Reaching 100% unlocks the golden celebration banner and the Japanese **Yuzu Citrus Crown** on the capybara's head!

- **⚡ 1-Tap Quick Log Dock:**
  - Thumb-friendly bottom dock with tactile feedback (`navigator.vibrate`).
  - Custom volume slider modal (`50 ml` to `1,000 ml`).
  - LocalStorage persistence for all logs, daily targets, and streaks.

- **📱 Installable Progressive Web App (PWA):**
  - Standalone mobile display support without browser address bars.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production
```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel

1. Push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import this repository.
4. Framework Preset will automatically detect **Next.js**.
5. Click **"Deploy"**!

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Motion:** Canvas 2D + SVG Path Animation + CSS Transforms
