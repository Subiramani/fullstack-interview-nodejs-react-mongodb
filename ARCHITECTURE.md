# Architecture Overview

This document provides a deeper dive into the architectural decisions and design patterns used in this MERN boilerplate.

## Table of Contents
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Scalability Considerations](#scalability-considerations)

## Backend Architecture

### Layered Architecture Pattern

```
┌─────────────────────────────────────────┐
│            HTTP Request                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Routes (taskRoutes.js)                 │
│  • Define endpoints                      │
│  • Map to controllers                    │
│  • Apply middleware                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Controllers (taskController.js)        │
│  • Handle HTTP req/res                   │
│  • Extract data from request             │
│  • Call service methods                  │
│  • Format responses                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Services (taskService.js)              │
│  • Business logic                        │
│  • Data validation                       │
│  • Interact with models                  │
│  • Transaction management                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Models (Task.js)                       │
│  • Data schema                           │
│  • Database interaction                  │
│  • Schema validation                     │
│  • Indexes                               │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         MongoDB Database                 │
└─────────────────────────────────────────┘
```

### Why This Structure?

#### **1. Single Responsibility Principle**
Each layer has one clear job:
- **Routes**: Routing only
- **Controllers**: HTTP handling only
- **Services**: Business logic only
- **Models**: Data structure only

#### **2. Testability**
- Services can be tested without HTTP layer
- Controllers can be tested with mocked services
- Models can be tested with test database

#### **3. Reusability**
- Services can be called from multiple controllers
- Services can be used in background jobs, CLI tools, etc.
- Business logic isn't tied to Express

#### **4. Maintainability**
- Easy to find where logic lives
- Changes to one layer don't affect others
- New developers can navigate easily

### Middleware Pattern

```javascript
// Request flows through middleware pipeline
Request → CORS → JSON Parser → Routes → Controller → Service → Response
                                    ↓
                              Error Handler (if error thrown)
```

**Centralized Error Handling:**
- All errors flow to one place
- Consistent error responses
- Easy to add logging, monitoring

## Frontend Architecture

### Component Hierarchy

```
App
 └─ TasksPage (Smart Component)
     ├─ TaskForm (Presentational)
     └─ TaskList (Presentational)
         └─ TaskItem (Presentational)
              └─ (multiple instances)
```

### Smart vs Presentational Components

#### **Smart Components (Container)**
- **TasksPage**
- Manages state
- Handles side effects (API calls)
- Passes data down to children
- Minimal UI logic

#### **Presentational Components**
- **TaskForm, TaskList, TaskItem**
- Receive data via props
- Emit events via callbacks
- No side effects
- Highly reusable

### State Management Strategy

**Current: Component State (useState)**
```javascript
// State lives in TasksPage
const [tasks, setTasks] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
```

**When to upgrade to Context API:**
- Multiple pages need task data
- Deeply nested components need task data
- Prop drilling becomes painful

**When to upgrade to Redux:**
- Complex state interactions
- Need for time-travel debugging
- Multiple slices of state affecting each other
- Team prefers Redux patterns

### Data Flow

```
User Action (e.g., click "Add Task")
        ↓
Event Handler (in TaskForm)
        ↓
Callback to Parent (onSubmit prop)
        ↓
Parent Handler (handleCreateTask in TasksPage)
        ↓
API Call (taskAPI.createTask)
        ↓
Update State (setTasks)
        ↓
React Re-renders (with new data)
```

## Design Patterns

### 1. **Repository Pattern** (Service Layer)
```javascript
// Service acts as repository for Task data
class TaskService {
  async getAllTasks() { /* ... */ }
  async getTaskById(id) { /* ... */ }
  async createTask(data) { /* ... */ }
  // etc.
}
```

**Benefits:**
- Abstracts data access
- Easy to swap implementations
- Can add caching layer transparently

### 2. **Singleton Pattern** (Service Instance)
```javascript
// Export single instance
module.exports = new TaskService();
```

**Benefits:**
- Shared state (if needed)
- Consistent instance across app
- Memory efficient

### 3. **Controlled Components** (React Forms)
```javascript
// Form state is controlled by React
<input value={title} onChange={(e) => setTitle(e.target.value)} />
```

**Benefits:**
- Single source of truth
- Easy validation
- Can manipulate programmatically

### 4. **Dependency Injection** (Controllers using Services)
```javascript
const taskService = require('../services/taskService');

exports.getTasks = async (req, res, next) => {
  const tasks = await taskService.getAllTasks();
  // ...
};
```

**Benefits:**
- Loose coupling
- Easy to mock for testing
- Can swap implementations

## Data Flow: Complete Example

Let's trace a "Create Task" operation:

### Frontend to Backend

**1. User fills form and clicks "Add Task"**
```javascript
// TaskForm.js
handleSubmit(e) → calls → onSubmit({ title, description })
```

**2. TasksPage handles submission**
```javascript
// TasksPage.js
handleCreateTask(taskData) {
  await taskAPI.createTask(taskData);
}
```

**3. API service makes HTTP request**
```javascript
// services/api.js
createTask(taskData) {
  return fetchAPI('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  });
}
```

**4. Backend route receives request**
```javascript
// routes/taskRoutes.js
router.post('/', taskController.createTask);
```

**5. Controller extracts data and calls service**
```javascript
// controllers/taskController.js
exports.createTask = async (req, res, next) => {
  const task = await taskService.createTask(req.body);
  res.status(201).json({ success: true, data: task });
};
```

**6. Service handles business logic**
```javascript
// services/taskService.js
async createTask(taskData) {
  const task = await Task.create(taskData);
  return task;
}
```

**7. Model validates and saves to database**
```javascript
// models/Task.js
const task = await Task.create({ title, description });
// Mongoose validates against schema
// Saves to MongoDB
// Returns saved document
```

### Backend to Frontend (Response Flow)

**8. Service returns task to controller**
**9. Controller sends JSON response**
**10. API service receives response**
**11. TasksPage updates state**
```javascript
setTasks([response.data, ...tasks]);
```

**12. React re-renders with new task**
```javascript
TaskList → maps tasks → renders TaskItem for each
```

## Scalability Considerations

### Current Limitations

1. **No Pagination**: Loads all tasks at once
2. **No Caching**: Every request hits the database
3. **Single Server**: No load balancing
4. **No Rate Limiting**: Vulnerable to abuse
5. **No Database Indexing Strategy**: Beyond basic indexes

### Scaling Strategy: 0 → 1,000 Users

**No changes needed!** Current architecture handles this fine.

### Scaling Strategy: 1,000 → 10,000 Users

**Changes needed:**

1. **Add Pagination**
   ```javascript
   // GET /tasks?page=1&limit=20
   const tasks = await Task.find()
     .limit(limit)
     .skip((page - 1) * limit);
   ```

2. **Add Database Indexes**
   ```javascript
   taskSchema.index({ userId: 1, createdAt: -1 });
   taskSchema.index({ completed: 1 });
   ```

3. **Add Caching** (Redis)
   ```javascript
   // Check cache first
   const cached = await redis.get(`tasks:${userId}`);
   if (cached) return JSON.parse(cached);
   
   // Else fetch from DB and cache
   const tasks = await Task.find({ userId });
   await redis.setex(`tasks:${userId}`, 3600, JSON.stringify(tasks));
   ```

4. **Add CDN** for frontend assets

### Scaling Strategy: 10,000 → 100,000 Users

**Changes needed:**

1. **Horizontal Scaling**: Multiple server instances + load balancer
2. **Database Replication**: Read replicas for read-heavy operations
3. **Message Queue**: For background jobs (email notifications, etc.)
4. **Monitoring**: APM tools (DataDog, New Relic)
5. **Rate Limiting**: Protect against abuse

### Scaling Strategy: 100,000+ Users

**Consider:**

1. **Microservices**: Split into auth service, task service, notification service
2. **Database Sharding**: Partition data across multiple databases
3. **Event-Driven Architecture**: Use message brokers (RabbitMQ, Kafka)
4. **GraphQL**: If frontend needs flexible querying
5. **Serverless**: For specific workloads

## Security Considerations

### Current State
- ✅ CORS configured
- ✅ Input validation (Mongoose schemas)
- ❌ No authentication
- ❌ No rate limiting
- ❌ No input sanitization
- ❌ No HTTPS enforcement

### Production Checklist

**Must-haves:**
1. Authentication & Authorization
2. HTTPS only (redirect HTTP)
3. Rate limiting (express-rate-limit)
4. Input sanitization (prevent XSS, NoSQL injection)
5. Helmet.js (security headers)
6. CSRF protection (if using cookies)
7. Environment variable validation
8. Proper error messages (don't leak internals)

**Nice-to-haves:**
1. API versioning
2. Request logging
3. Intrusion detection
4. DDoS protection (Cloudflare)
5. Regular dependency updates
6. Security audits (npm audit)

## Testing Strategy

### Backend Testing Pyramid

```
       E2E Tests (few)
         ↗  ↖
   Integration Tests (some)
     ↗        ↖
Unit Tests (many)
```

**Unit Tests:** Test services in isolation
```javascript
describe('TaskService', () => {
  it('should create a task', async () => {
    const task = await taskService.createTask({ title: 'Test' });
    expect(task.title).toBe('Test');
  });
});
```

**Integration Tests:** Test API endpoints
```javascript
describe('POST /api/tasks', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test' });
    expect(res.status).toBe(201);
  });
});
```

### Frontend Testing Strategy

**Component Tests:** Test in isolation
```javascript
test('TaskForm submits data', () => {
  const handleSubmit = jest.fn();
  render(<TaskForm onSubmit={handleSubmit} />);
  
  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: 'Test' }
  });
  fireEvent.click(screen.getByText('Add Task'));
  
  expect(handleSubmit).toHaveBeenCalledWith({
    title: 'Test',
    description: ''
  });
});
```

**Integration Tests:** Test user flows
```javascript
test('user can create and complete a task', async () => {
  render(<TasksPage />);
  
  // Wait for tasks to load
  await waitFor(() => screen.getByText('Your Tasks'));
  
  // Create task
  const titleInput = screen.getByLabelText('Title');
  fireEvent.change(titleInput, { target: { value: 'New Task' } });
  fireEvent.click(screen.getByText('Add Task'));
  
  // Verify task appears
  await waitFor(() => screen.getByText('New Task'));
  
  // Mark complete
  fireEvent.click(screen.getByText('Mark Complete'));
  
  // Verify status changed
  await waitFor(() => screen.getByText('✓ Completed'));
});
```

## Conclusion

This architecture prioritizes:
- **Simplicity**: Easy to understand and explain
- **Maintainability**: Clear structure, easy to modify
- **Scalability**: Can grow from 0 to 100k+ users with incremental changes
- **Interview-friendliness**: Demonstrates knowledge of best practices

The patterns and structure chosen here represent industry standards and provide plenty of talking points for technical interviews.
