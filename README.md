# PS Learning Course

A personal learning management web application for Algorithm Problem Solving (PS).
Built with React, Vite, TypeScript, Tailwind CSS, and Zustand.

## Features

- **Dashboard**: Overview of current progress, active week, and recommended problems.
- **Curriculum (Weeks)**: structured weekly roadmap with goals and learning points.
- **Problem Bank**: List of all problems with status tracking and filtering.
- **Progress Tracking**:
  - Mark problems as TODO, DONE, or RETRY.
  - Visual progress bars for weekly and overall completion.
  - Data persisted in LocalStorage.

## Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + clsx + tailwind-merge
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **State Management**: Zustand (with persist middleware)

## Project Structure

```
src/
├── app/          # App configuration (routes)
├── components/   # Shared UI components (Button, Card, Layout, etc.)
├── data/         # Static data (curriculum, problems)
├── features/     # Feature-specific components (WeekCard, ProblemCard)
├── lib/          # Utilities
├── pages/        # Page components
├── stores/       # Global state stores (Zustand)
└── types.ts      # TypeScript interfaces
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
