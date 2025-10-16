# Team Logo API Setup

This application uses API-Football to fetch real team logos dynamically, providing better UI/UX for the match schedule.

## Setup Instructions

### 1. Get Your Free API Key

1. Visit [API-Football](https://www.api-football.com/)
2. Create a free account
3. Get your API key from the dashboard
4. Free plan includes 100 requests per day (sufficient for development)

### 2. Configure Environment Variables

Create a `.env` file in the project root with:

```env
REACT_APP_FOOTBALL_API_KEY=your-api-key-here
```

### 3. Features

#### ✅ **Smart Logo Fetching**
- Primary: API-Football for real team logos
- Fallback: Curated logo URLs for Saudi Pro League teams
- Final fallback: Generated colored logos with team initials

#### ✅ **Performance Optimizations**
- Intelligent caching system
- Batch logo preloading
- Loading states with skeleton UI
- Lazy loading for images

#### ✅ **Saudi Pro League Support**
- Pre-configured for Al-Hilal and major Saudi teams
- Automatic team name matching (Arabic & English)
- Team-specific color schemes

### 4. Usage

The `TeamLogo` component automatically handles:
- Loading states
- Error handling
- Multiple fallback strategies
- Responsive sizing
- Accessibility

```jsx
<TeamLogo 
  teamName="Al-Hilal" 
  size={32} 
  className="custom-class" 
/>
```

### 5. Fallback Strategy

1. **API-Football**: Real team logos from official API
2. **Curated URLs**: Pre-selected high-quality logos
3. **Generated SVG**: Colored circles with team initials
4. **Emoji**: Final fallback (⚽)

### 6. Troubleshooting

#### No logos showing?
- Check your API key in `.env`
- Verify internet connection
- Check browser console for errors

#### Slow loading?
- Logos are cached after first load
- Consider preloading for better UX

#### Wrong logos?
- API uses fuzzy matching for team names
- Check team name spelling
- Add custom mappings if needed

### 7. API Limits

- **Free Plan**: 100 requests/day
- **Caching**: Reduces API calls significantly
- **Batch Loading**: Optimizes request usage

### 8. Development

For development without API key:
- Fallback system works without API
- Use generated logos for testing
- Enable debug mode: `REACT_APP_API_DEBUG=true`
