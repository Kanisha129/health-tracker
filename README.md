# Personal Health Tracker App

A modern web application built with React and TypeScript for tracking daily health activities including water intake, steps walked, and sleep hours.

## Features

### 1. Welcome/Onboarding Screen
- Clean, welcoming introduction to the app
- Simple navigation to get started

### 2. Dashboard Screen
- Displays current date
- Three summary cards showing today's totals:
  - Water intake (glasses)
  - Steps walked
  - Sleep hours (hours)
- Quick action buttons to log activities or view history
- Refresh functionality to reload latest data

### 3. Activity Logging Screen
- Form to log health activities with three types:
  - Water intake
  - Steps
  - Sleep
- Input validation:
  - Required fields
  - Numeric validation
  - Reasonable limits (e.g., max 24 hours for sleep)
- Optional notes field
- Success confirmation with automatic redirect

### 4. History Screen
- Displays activities from the last 7 days
- Activities grouped by date
- Pull-to-refresh functionality
- Shows activity type, value, time logged, and optional notes
- Empty state with call-to-action when no activities exist

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Supabase** - Database and backend
- **Lucide React** - Icons

## Project Structure

```
src/
├── contexts/
│   └── NavigationContext.tsx    # Navigation state management
├── lib/
│   └── supabase.ts              # Supabase client and types
├── screens/
│   ├── WelcomeScreen.tsx        # Onboarding screen
│   ├── DashboardScreen.tsx      # Main dashboard
│   ├── LogActivityScreen.tsx    # Activity logging form
│   └── HistoryScreen.tsx        # Activity history view
├── services/
│   └── healthService.ts         # API calls to Supabase
├── App.tsx                      # Main app component with routing
├── main.tsx                     # App entry point
└── index.css                    # Global styles
```

## Database Schema

The app uses a single table `health_activities` with the following structure:

- `id` - UUID primary key
- `activity_type` - Type of activity (water, steps, sleep)
- `value` - Numeric value for the activity
- `logged_at` - Timestamp when activity occurred
- `notes` - Optional text notes
- `created_at` - Record creation timestamp

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. The Supabase configuration is already set up in the `.env` file

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Design Highlights

- Clean, modern interface with attention to detail
- Responsive design that works on all screen sizes
- Color-coded activity types for easy recognition
- Smooth transitions and hover effects
- Form validation with helpful error messages
- Loading states and success feedback
- Empty states with guidance

## Health Tracking Recommendations

- **Water**: 8 glasses per day
- **Steps**: 10,000 steps per day
- **Sleep**: 7-9 hours per night

## Future Enhancements

Potential features for future versions:
- User authentication and profiles
- Weekly/monthly statistics and trends
- Goal setting and achievement tracking
- Data visualization with charts
- Reminders and notifications
- Export data functionality
- Multi-user support with privacy controls
