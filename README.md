# MERN Interview Boilerplate

A production-quality, minimal MERN stack boilerplate designed for pair programming interviews. Built with simplicity, readability, and interview-friendliness in mind.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Decisions](#architecture-decisions)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Interview Discussion Points](#interview-discussion-points)

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment configuration
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library (functional components + hooks only)
- **Create React App** - Build tooling
- **Native Fetch API** - HTTP client

## 📁 Project Structure

```
mern-interview-boilerplate/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection logic
│   ├── controllers/
│   │   └── taskController.js     # HTTP request handlers
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized error handling
│   ├── models/
│   │   └── Task.js               # Mongoose schema & model
│   ├── routes/
│   │   └── taskRoutes.js         # API route definitions
│   ├── services/
│   │   └── taskService.js        # Business logic layer
│   ├── .env.example              # Environment variables template
│   ├── server.js                 # Application entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.js       # Form for creating tasks
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskItem.js       # Individual task display
│   │   │   ├── TaskItem.css
│   │   │   ├── TaskList.js       # List container
│   │   │   └── TaskList.css
│   │   ├── pages/
│   │   │   ├── TasksPage.js      # Main page orchestrator
│   │   │   └── TasksPage.css
│   │   ├── services/
│   │   │   └── api.js            # API client functions
│   │   ├── App.js                # Root component
│   │   ├── App.css               # Global styles
│   │   └── index.js              # React entry point
│   └── package.json
│
└── README.md
```

## 🏗 Architecture Decisions

### Backend Architecture

#### **1. Layered Architecture (Routes → Controllers → Services → Models)**

**Why?**
- **Separation of concerns**: Each layer has a single responsibility
- **Testability**: Business logic in services can be tested independently
- **Reusability**: Services can be called from different controllers or contexts
- **Maintainability**: Changes to one layer don't cascade to others

**Layers explained:**
- **Routes**: Define endpoints and HTTP methods
- **Controllers**: Handle HTTP requests/responses, delegate to services
- **Services**: Contain business logic, interact with models
- **Models**: Define data structure and database interactions

#### **2. Centralized Error Handling**

**Why?**
- Consistent error response format across all endpoints
- Single place to handle different error types
- Prevents error details from leaking in production
- Clean controller code (no try-catch needed everywhere)

#### **3. Mongoose for MongoDB**

**Why?**
- Schema validation out of the box
- Built-in type casting
- Middleware hooks (pre/post)
- Better developer experience than native MongoDB driver

### Frontend Architecture

#### **1. Component-Based Structure**

**Organization:**
- **components/**: Reusable UI components (TaskForm, TaskItem, TaskList)
- **pages/**: Page-level components that orchestrate multiple components
- **services/**: API communication layer

**Why?**
- Clear separation between presentation and logic
- Components are focused and reusable
- Easy to locate files by responsibility

#### **2. Container/Presenter Pattern**

- **TasksPage** (Container): Manages state, handles API calls, orchestrates child components
- **TaskForm, TaskList, TaskItem** (Presenters): Receive data and callbacks via props, handle UI only

**Why?**
- Separation of concerns
- Easier to test presentational components
- State is centralized at the page level

#### **3. No State Management Library**

**Why not Redux/MobX?**
- For this simple app, React's built-in state (`useState`) is sufficient
- Adding Redux would be over-engineering for a single-resource CRUD app
- Easier to explain and understand for interviews

**When would you add it?**
- Multiple resources sharing state
- Deeply nested component trees with prop drilling
- Complex state updates with many side effects
- Need for advanced debugging (time-travel, etc.)

#### **4. Native Fetch Instead of Axios**

**Why?**
- One less dependency
- Fetch is native to modern browsers
- Sufficient for this boilerplate's needs

**When would you use Axios?**
- Need for request/response interceptors (auth tokens)
- Better browser compatibility requirements
- Preference for more ergonomic API

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- npm or yarn

### Installation

#### 1. Clone or download this repository

```bash
cd mern-interview-boilerplate
```

#### 2. Set up the Backend

```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and update MongoDB URI if needed
# Default: mongodb://localhost:27017/mern_interview
```

#### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# MacOS with Homebrew
brew services start mongodb-community

# Or manually
mongod --dbpath /path/to/your/data/directory
```

**Option B: MongoDB Atlas**
- Create a free cluster at https://cloud.mongodb.com
- Get connection string and update MONGODB_URI in .env

#### 4. Start the Backend Server

```bash
# From backend directory
npm run dev
# Server will run on http://localhost:5000
```

#### 5. Set up the Frontend

```bash
# In a new terminal
cd frontend
npm install
```

#### 6. Start the Frontend

```bash
npm start
# App will open at http://localhost:3000
```

### Verify Installation

1. Backend health check: http://localhost:5000/health
2. Frontend should load at http://localhost:3000
3. Create a task to test full integration

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Get All Tasks
```http
GET /tasks
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project",
      "description": "Finish the MERN boilerplate",
      "completed": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Task
```http
GET /tasks/:id
```

#### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "New task",
  "description": "Optional description"
}
```

#### Update Task
```http
PUT /tasks/:id
Content-Type: application/json

{
  "completed": true
}
```

#### Delete Task
```http
DELETE /tasks/:id
```

### Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## 💡 Interview Discussion Points

This boilerplate is designed to facilitate technical discussions. Here are common interview questions and where to find answers:

### **"How would you add authentication?"**

**Backend:**
1. Add User model (`models/User.js`)
2. Create auth service with JWT token generation (`services/authService.js`)
3. Add auth middleware to protect routes (`middleware/auth.js`)
4. Add userId reference to Task model
5. Filter tasks by authenticated user in taskService

**Frontend:**
1. Create AuthContext to store user state
2. Add login/register pages
3. Store JWT token in localStorage
4. Add token to API requests in `services/api.js`
5. Protect routes with conditional rendering

**Files to modify:**
```
backend/models/User.js (new)
backend/middleware/auth.js (new)
backend/models/Task.js (add userId field)
backend/services/authService.js (new)
frontend/src/context/AuthContext.js (new)
frontend/src/services/api.js (add token to headers)
```

### **"How would this scale?"**

**Current limitations:**
- No pagination (loads all tasks at once)
- No caching
- Single server instance
- No rate limiting

**Scaling strategies:**
1. **Database**: Add indexes, implement pagination
2. **Caching**: Redis for frequently accessed data
3. **Load Balancing**: Multiple server instances behind load balancer
4. **CDN**: Serve static frontend assets via CDN
5. **Database Sharding**: For massive data growth
6. **Microservices**: Split into separate services (auth, tasks, notifications)

### **"Where would you add validation?"**

**Current validation:**
- Mongoose schema validation (models/Task.js)
- Basic client-side validation (TaskForm.js)

**Additional validation:**
1. Backend: Add middleware using `express-validator` or `joi`
2. Frontend: Use form libraries like `react-hook-form` or `formik`
3. Add custom validators in Mongoose schemas
4. Sanitize inputs to prevent XSS/injection attacks

**Example:**
```javascript
// routes/taskRoutes.js
const { body } = require('express-validator');

router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isLength({ max: 500 })
], taskController.createTask);
```

### **"How would you add real-time updates?"**

**Options:**
1. **WebSockets** (Socket.io):
   - Server broadcasts task changes to all connected clients
   - Clients update UI in real-time
   
2. **Polling**:
   - Frontend periodically fetches tasks (simple but inefficient)
   
3. **Server-Sent Events (SSE)**:
   - One-way communication from server to client

**Socket.io approach:**
```javascript
// backend/server.js
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Emit on task creation
io.emit('taskCreated', newTask);
```

### **"How would you test this?"**

**Backend testing:**
- **Unit tests**: Test services in isolation (Jest)
- **Integration tests**: Test API endpoints (Supertest)
- **Database**: Use in-memory MongoDB (mongodb-memory-server)

**Frontend testing:**
- **Component tests**: React Testing Library
- **Integration tests**: Test user flows
- **E2E tests**: Cypress or Playwright

**Example structure:**
```
backend/
  __tests__/
    unit/
      services/taskService.test.js
    integration/
      routes/taskRoutes.test.js

frontend/
  src/
    components/
      __tests__/
        TaskForm.test.js
        TaskList.test.js
```

### **"What about environment-specific configs?"**

**Current approach:**
- `.env` files for environment variables
- `.env.example` as template

**Production improvements:**
1. Use environment variables from hosting platform (Heroku, AWS, etc.)
2. Separate configs for dev/staging/production
3. Never commit `.env` to version control
4. Use secrets management (AWS Secrets Manager, HashiCorp Vault)

### **"How would you deploy this?"**

**Backend options:**
1. **Heroku**: Simple, good for demos
2. **AWS EC2**: More control, scalable
3. **Docker**: Containerize for consistency
4. **Serverless**: AWS Lambda (requires refactoring)

**Frontend options:**
1. **Vercel/Netlify**: Automatic deployment from Git
2. **AWS S3 + CloudFront**: Static hosting with CDN
3. **Serve from Express**: Add build folder to backend

**Database:**
1. **MongoDB Atlas**: Managed MongoDB (recommended)
2. **AWS DocumentDB**: MongoDB-compatible
3. **Self-hosted**: On VPS or cloud instance

## 🎯 What Makes This Interview-Friendly?

1. **Clear separation of concerns**: Each file has one job
2. **Extensive comments**: Explain the "why," not just the "what"
3. **No magic**: Explicit code over clever abstractions
4. **Conventional structure**: Follows industry best practices
5. **Easy to extend**: Clear places to add features
6. **Discussion prompts**: Comments suggest interview talking points
7. **Minimal dependencies**: Only essential packages
8. **Full CRUD example**: Complete reference implementation

## 📝 License

MIT

## 👨‍💻 Usage in Interviews

This boilerplate is designed for:
- **Take-home assignments**: Fork and build features
- **Pair programming**: Walk through architecture and add features together
- **System design discussions**: Discuss scaling, security, testing
- **Code review practice**: Analyze and improve existing code

Feel free to modify, extend, and adapt for your interview needs!
