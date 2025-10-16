# API-Football Integration Setup

## 🔑 Getting Your API Key

1. **Sign up at RapidAPI**: Go to [API-Football on RapidAPI](https://rapidapi.com/api-sports/api/api-football/)
2. **Subscribe to a plan**: Choose a plan that fits your needs (they have a free tier)
3. **Get your API key**: Copy the `X-RapidAPI-Key` from the API documentation

## 🛠️ Environment Configuration

Create a `.env` file in your project root (`tawuniya-alhilal-squads/.env`) with:

```bash
# API-Football Configuration
REACT_APP_API_FOOTBALL_KEY=your_actual_api_key_here

# Optional settings
REACT_APP_ENVIRONMENT=development
REACT_APP_API_CACHE_TIMEOUT=300000
```

**⚠️ Important**: 
- Never commit your `.env` file to Git
- The `.env` file is already in `.gitignore`
- Use `REACT_APP_` prefix for React environment variables

## 📊 API Endpoints We Use

Our service integrates with these API-Football endpoints:

### 🏟️ **Team Data**
- **Team Info**: `/teams?id=2939` (Al-Hilal team details)
- **Squad**: `/players/squads?team=2939` (Current Al-Hilal squad)
- **Statistics**: `/teams/statistics?team=2939&league=307&season=2024`

### ⚽ **Fixtures & Matches**
- **Fixtures**: `/fixtures?team=2939&season=2024` (Al-Hilal matches)
- **Live Scores**: `/fixtures?live=all` (Live match data)
- **Head-to-Head**: `/fixtures/headtohead?h2h=2939-{opponent_id}`

### 🔧 **Important Notes**
- **Al-Hilal Team ID**: `2939` (verified in API-Football database)
- **Saudi Pro League ID**: `307`
- **Current Season**: Use `2024` for most recent complete data
- **Fixture Parameters**: The API doesn't support `last` and `next` parameters directly - instead, fetch all fixtures and filter by date/status

### 🏆 **League Data**
- **Standings**: `/standings?league=307&season=2024` (Saudi Pro League)
- **Leagues**: `/leagues?country=Saudi-Arabia`

### 👤 **Player Data**
- **Player Stats**: `/players?id={player_id}&season=2024`
- **Player Search**: `/players?team=2939&season=2024`

## 🎯 Key Features Implemented

### ✅ **Smart Caching System**
- 5-minute cache timeout to reduce API calls
- Automatic cache invalidation
- Cost optimization for API usage

### ✅ **Error Handling**
- Comprehensive error catching
- Graceful fallbacks to cached/mock data
- User-friendly error messages

### ✅ **Data Formatting**
- Automatic conversion to Arabic date/time format
- Consistent data structure for components
- Optimized for Al-Hilal specific needs

### ✅ **Real-time Updates**
- Live match scores and status
- Current squad information
- Updated fixture lists

## 🔧 Usage Examples

```javascript
import apiFootballService from '../services/apiFootballService';

// Get Al-Hilal fixtures
const fixtures = await apiFootballService.getFixtures(5, 10);
console.log('Upcoming matches:', fixtures.upcoming);
console.log('Recent matches:', fixtures.recent);

// Get current squad
const squad = await apiFootballService.getSquad();
console.log('Current players:', squad);

// Get team statistics
const stats = await apiFootballService.getTeamStats();
console.log('Team performance:', stats);
```

## 📈 API Limits & Costs

### **Free Tier**
- 100 requests/day
- Perfect for development and testing

### **Basic Plan** (~$10/month)
- 1,000 requests/day
- Suitable for small applications

### **Pro Plan** (~$25/month)
- 10,000 requests/day
- Recommended for production use

## 🚀 Next Steps

1. **Get your API key** from RapidAPI
2. **Create the `.env` file** with your key
3. **Test the integration** by running the app
4. **Monitor API usage** through RapidAPI dashboard

## 🛡️ Security Best Practices

- ✅ API key stored in environment variables
- ✅ Never expose API key in client-side code
- ✅ Use HTTPS for all API requests
- ✅ Implement rate limiting if needed
- ✅ Monitor API usage regularly

## 🐛 Troubleshooting

### Common Issues:

**"API key not found"**
- Check if `.env` file exists
- Verify `REACT_APP_API_FOOTBALL_KEY` is set
- Restart development server after adding `.env`

**"HTTP 429 - Too Many Requests"**
- You've exceeded your API limit
- Wait for limit reset or upgrade plan
- Check caching is working properly

**"Invalid API response"**
- Check if your API key is valid
- Verify team/league IDs are correct
- Check API documentation for changes

---

🎯 **Ready to get live Al-Hilal data!** Follow the setup steps above and enjoy real-time football data in your squad management system! ⚽✨
