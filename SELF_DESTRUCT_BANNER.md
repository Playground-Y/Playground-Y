# Self-Destruct Banner Feature for Temporary Playgrounds

## Overview
This feature adds a prominent countdown banner to temporary demo playgrounds that:
1. Shows a live countdown timer (default: 15 minutes)
2. Encourages users to sign up for permanent free hosting
3. Displays a modal with benefits when clicked

## Implementation Details

### Components Created

#### 1. `SelfDestructBanner` Component
**Location:** `templates/components/self-destruct-banner.tsx`

**Features:**
- **Live Countdown Timer**: Updates every second, showing time remaining in MM:SS format
- **Visual Progress Bar**: Animated bar showing percentage of time remaining
- **Responsive Design**: Adapts to mobile and desktop screens
- **Interactive Modal**: Opens when banner is clicked
- **Gradient Styling**: Eye-catching orange-to-pink gradient

**Props:**
- `destructTime?: number` - Time in minutes until self-destruct (default: 15)
- `onSignUpClick?: () => void` - Optional callback when user clicks

### Integration

#### Landing Page Updates
**Location:** `templates/app/landing-page.tsx`

**Changes:**
1. Added import for `SelfDestructBanner`
2. Added state to detect temporary playgrounds
3. Conditional rendering based on URL pattern
4. Adjusted spacing to accommodate banner

**Detection Logic:**
```typescript
// Detects if URL contains 'madrasly-' or 'vercel.app'
const isTemp = window.location.hostname.includes('madrasly-') || 
               window.location.hostname.includes('vercel.app')
```

**Spacing Adjustments:**
- Mobile header: `top-[52px]` when banner is visible
- Main content: `pt-[116px] md:pt-[52px]` when banner is visible

### File System Updates
**Location:** `src/modules/file-system.ts`

Added to template copy list:
- `components/self-destruct-banner.tsx`
- `components/ui/dialog.tsx` (dependency)

## User Experience

### Banner Display
```
⚠️ Demo Playground - Self-destructing in 14:32 • ⚡ Click to host your API for free forever
```

### Sign-Up Modal

**Title:** "Host Your API Playground Forever"

**Benefits Listed:**
- 🚀 Permanent hosting - never expires
- ⚡ Auto-sync with your GitHub repo
- 🎨 Custom domain support
- 📊 Analytics and usage insights
- 🔒 Private playgrounds (optional)
- 💎 100% free forever

**CTA Buttons:**
1. **Primary:** "Sign Up - It's Free Forever" → Links to `https://madrasly.com/dashboard`
2. **Secondary:** "Continue with Demo" → Closes modal

## Backend Integration

### Deployment Service
**Location:** `madrasly-Backend/src/services/deploymentService.js`

**Cleanup Logic:**
- Temporary playgrounds are automatically deleted after 15 minutes
- Function: `cleanupDeployments(projectName, maxAgeMinutes = 15)`
- Runs in background after each deployment

### URL Pattern
Temporary playgrounds are deployed to:
```
https://madrasly-{uuid}.vercel.app
```

## Styling

### Colors
- Background: Gradient from orange-500 → red-500 → pink-500
- Progress bar: White with 30% opacity
- Text: White

### Animations
- Hover: Clock icon pulses
- CTA hover: Zap icon bounces
- Button hover: Scale up slightly with shadow

## Testing

### To Test Locally
1. Deploy a playground using the backend API
2. Visit the generated Vercel URL
3. Banner should appear at the top
4. Click banner to see sign-up modal
5. Verify countdown updates every second

### To Test in Production
1. Generate a temporary playground via `/api/generate` endpoint
2. Visit the `previewUrl` returned
3. Verify banner appears and functions correctly

## Configuration

### Changing Countdown Time
In `landing-page.tsx`:
```typescript
<SelfDestructBanner destructTime={15} /> // Change 15 to desired minutes
```

### Changing Sign-Up URL
In `self-destruct-banner.tsx`:
```typescript
href="https://madrasly.com/dashboard" // Update to your dashboard URL
```

### Changing Detection Logic
In `landing-page.tsx`:
```typescript
const isTemp = window.location.hostname.includes('your-pattern')
```

## Future Enhancements

### Potential Improvements
1. **Server-Side Detection**: Pass `isTemp` flag from backend instead of client-side detection
2. **Customizable Messages**: Allow API to specify custom banner text
3. **Analytics**: Track how many users click the banner
4. **A/B Testing**: Test different messages and CTAs
5. **Sound Alert**: Optional sound when time is running low
6. **Email Reminder**: Capture email before playground expires

### Backend Enhancements
1. **Extend Time**: Allow users to extend demo time once
2. **Save State**: Allow users to save playground state before expiry
3. **Preview Mode**: Show what permanent hosting looks like

## Notes

- The banner only appears on temporary Vercel deployments
- Permanent playgrounds (custom domains) won't show the banner
- The countdown is client-side only (doesn't sync with server)
- Users can continue using the demo even after clicking the banner

## Related Files

### Frontend (madrasly)
- `templates/components/self-destruct-banner.tsx` - Main component
- `templates/app/landing-page.tsx` - Integration
- `src/modules/file-system.ts` - Build configuration

### Backend (madrasly-Backend)
- `src/controllers/playgroundController.js` - Generation logic
- `src/services/deploymentService.js` - Vercel deployment & cleanup
- `src/routes/index.js` - API endpoints

### Examples
- `examples/madras/components/self-destruct-banner.tsx` - Example implementation
- `examples/madras/app/landing-page.tsx` - Example integration
