# API-Football Integration Guide

## Overview

This application uses [API-Football](https://www.api-football.com/documentation-v3) to fetch real-time Al-Hilal match data, fixtures, and statistics.

## API Key Configuration

Your API key is configured in `src/config/api.config.js`:

```javascript
apiFootball: {
  key: '8a88afa3f76f883f7773902dfed522c3',
  baseURL: 'https://v3.football.api-sports.io',
  provider: 'apisports'
}
```

## Al-Hilal Team Information

- **Team ID**: 2939
- **League ID**: 307 (Saudi Pro League)
- **Current Season**: Auto-detected based on date (August-May cycle)

## Available API Methods

### 1. Get Team Information
```javascript
const teamInfo = await apiFootballService.getTeamInfo();
```
Returns Al-Hilal team details including logo, name, venue, etc.

### 2. Get Fixtures
```javascript
const fixtures = await apiFootballService.getFixtures(last = 5, next = 10);
```
Returns:
```javascript
{
  upcoming: [...], // Next 10 upcoming matches
  recent: [...]    // Last 5 completed matches
}
```

### 3. Get Squad/Players
```javascript
const squad = await apiFootballService.getSquad(season);
```
Returns current Al-Hilal squad for the season.

### 4. Get Team Statistics
```javascript
const stats = await apiFootballService.getTeamStats(season);
```
Returns comprehensive team statistics.

### 5. Get League Standings
```javascript
const standings = await apiFootballService.getStandings(leagueId, season);
```
Returns Saudi Pro League standings.

### 6. Get Head-to-Head
```javascript
const h2h = await apiFootballService.getHeadToHead(team1Id, team2Id);
```
Returns historical matches between two teams.

## API Response Structure

### Fixture Object
```javascript
{
  id: 12345,
  date: "2025-01-15T17:00:00+00:00",
  time: "20:00",
  opponent: "Al-Nassr",
  opponentLogo: "https://...",
  venue: "King Fahd International Stadium",
  competition: "Saudi Pro League",
  competitionLogo: "https://...",
  isHome: true,
  status: "NS", // NS = Not Started, FT = Full Time
  score: { home: 0, away: 0 } // Only for completed matches
}
```

## Caching

- API responses are cached for 5 minutes
- Reduces API calls and improves performance
- Clear cache: `apiFootballService.clearCache()`

## Error Handling

The service includes comprehensive error handling:

```javascript
try {
  const fixtures = await apiFootballService.getFixtures();
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error (show fallback data, error message, etc.)
}
```

## Testing

1. Open the Schedule page
2. Click "Test API Connection" button in the bottom-right corner
3. Check console for detailed logs
4. Verify team info and fixtures are loaded

## API Limits

With your subscription, you have access to:
- Current season data (2024/2025)
- Real-time match updates
- Comprehensive statistics
- All leagues and teams

Check your API usage at: https://dashboard.api-football.com/

## Common Issues

### 1. CORS Errors
- In development, the app uses a proxy (configured in `setupProxy.js`)
- In production, requests go directly to API-Football

### 2. No Data Returned
- Check if the season is correct
- Verify team ID (2939 for Al-Hilal)
- Check API key is valid

### 3. Rate Limiting
- Respect API rate limits
- Use caching to reduce calls
- Implement retry logic for failed requests

## Next Steps

1. Test the API connection
2. Verify fixtures are displaying correctly
3. Implement additional features (player stats, live scores, etc.)
4. Add Firestore integration to save user predictions

