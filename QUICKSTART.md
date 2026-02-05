# Quick Start Guide

Get the MERN boilerplate running in under 5 minutes.

## Prerequisites Check

```bash
# Check Node.js (should be v14+)
node --version

# Check npm
npm --version

# Check MongoDB (if running locally)
mongod --version
```

## Option 1: Local MongoDB (Recommended for Development)

### Step 1: Start MongoDB

**MacOS:**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 2: Start Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
Database: mern_interview
```

### Step 3: Start Frontend

In a new terminal:
```bash
cd frontend
npm install
npm start
```

Browser opens automatically at `http://localhost:3000`

### Step 4: Test It

1. Create a task using the form
2. Mark it complete
3. Delete it
4. Open browser DevTools → Network tab to see API calls

## Option 2: MongoDB Atlas (Cloud Database)

### Step 1: Set Up MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Create free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy connection string

### Step 2: Configure Backend

```bash
cd backend
npm install

# Edit .env file
# Replace MONGODB_URI with your Atlas connection string
# Example: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern_interview
```

### Step 3: Start Backend & Frontend

Same as Option 1, steps 2-4

## Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### Test API Directly

**Create a task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing API"}'
```

**Get all tasks:**
```bash
curl http://localhost:5000/api/tasks
```

## Common Issues

### "MongoDB connection error"

**Problem:** MongoDB not running or wrong connection string

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Or restart it
brew services restart mongodb-community  # MacOS
sudo systemctl restart mongod            # Linux
```

### "Port 5000 already in use"

**Problem:** Another app using port 5000

**Solution:** Change PORT in `backend/.env`:
```
PORT=5001
```

Also update frontend API URL if needed.

### "Port 3000 already in use"

**Problem:** Another React app running

**Solution:** React will offer to run on different port (3001)
Type `y` when prompted

### Frontend can't connect to backend

**Problem:** CORS or wrong API URL

**Solution:** Check `backend/.env`:
```
CLIENT_URL=http://localhost:3000
```

And frontend is using correct API URL (check browser console for errors)

## Development Tips

### Auto-reload on changes

Both frontend and backend have hot-reload enabled:
- **Backend**: Using nodemon (watches for file changes)
- **Frontend**: Using webpack dev server (watches for file changes)

### Recommended VS Code Extensions

1. **ES7+ React/Redux/React-Native snippets**
2. **ESLint**
3. **Prettier**
4. **MongoDB for VS Code** (to browse database)

### View Database

**Option 1: MongoDB Compass** (GUI)
```bash
# Download from: https://www.mongodb.com/products/compass
# Connect to: mongodb://localhost:27017
```

**Option 2: MongoDB Shell**
```bash
mongosh
use mern_interview
db.tasks.find()
```

**Option 3: VS Code Extension**
- Install "MongoDB for VS Code"
- Connect to `mongodb://localhost:27017`
- Browse collections

## Next Steps

### 1. Explore the Code

**Start with:**
- `backend/server.js` - Entry point
- `backend/routes/taskRoutes.js` - API routes
- `frontend/src/pages/TasksPage.js` - Main page
- `frontend/src/services/api.js` - API calls

### 2. Try Making Changes

**Easy modifications:**
1. Add a "priority" field to tasks (High/Medium/Low)
2. Add filtering by completion status
3. Change the color scheme
4. Add task search functionality

**Medium modifications:**
1. Add task categories/tags
2. Add due dates
3. Add task sorting
4. Add user feedback (toast notifications)

**Advanced modifications:**
1. Add authentication
2. Add multiple users
3. Add file attachments to tasks
4. Add real-time updates (Socket.io)

### 3. Read the Documentation

- `README.md` - Full documentation
- `ARCHITECTURE.md` - Deep dive into design decisions

## Running in Production

### Build Frontend

```bash
cd frontend
npm run build
# Creates optimized build in /build folder
```

### Serve Frontend from Backend (Option 1)

```javascript
// In backend/server.js, after other routes:
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}
```

### Deploy Separately (Option 2)

**Backend:** Deploy to Heroku, AWS, DigitalOcean
**Frontend:** Deploy to Vercel, Netlify
**Database:** MongoDB Atlas

## Troubleshooting Commands

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check MongoDB status
brew services list | grep mongo  # MacOS
sudo systemctl status mongod     # Linux

# View MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log  # MacOS
```

## Getting Help

1. Check error messages in:
   - Browser console (F12)
   - Backend terminal
   - Frontend terminal

2. Common error patterns:
   - 404 errors → Check API routes
   - CORS errors → Check backend CORS config
   - 500 errors → Check backend logs
   - Connection errors → Check MongoDB

3. Review the code comments - they explain common gotchas

## You're Ready! 🚀

The boilerplate is running. Time to:
- Explore the code
- Make modifications
- Practice explaining the architecture
- Prepare for interview questions

Happy coding!
