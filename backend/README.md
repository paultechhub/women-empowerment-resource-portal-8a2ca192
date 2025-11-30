# Women Empowerment Resource Portal - Backend

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env` file and update the values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `PORT`: Server port (default: 5000)

4. Start MongoDB service (if using local installation)

5. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile/:id` - Get user profile

### Resources
- `GET /api/resources` - Get all resources (with pagination and filtering)
- `POST /api/resources` - Create new resource
- `POST /api/resources/bookmark` - Bookmark a resource
- `GET /api/resources/bookmarks/:userId` - Get user bookmarks

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `POST /api/courses/enroll` - Enroll in course
- `GET /api/courses/:courseId/modules` - Get course modules
- `PUT /api/courses/enrollment/:enrollmentId/progress` - Update progress

### Forum
- `GET /api/forum/posts` - Get forum posts
- `POST /api/forum/posts` - Create new post
- `GET /api/forum/posts/:postId/comments` - Get post comments
- `POST /api/forum/posts/:postId/comments` - Add comment
- `POST /api/forum/posts/:postId/like` - Like/unlike post

### Mentorship
- `GET /api/mentorship/mentors` - Get all mentors
- `POST /api/mentorship/mentors` - Create mentor profile
- `POST /api/mentorship/requests` - Create mentorship request
- `GET /api/mentorship/requests/mentor/:mentorId` - Get mentor requests
- `PUT /api/mentorship/requests/:requestId` - Update request status

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `POST /api/events/register` - Register for event
- `GET /api/events/:eventId/registrations` - Get event registrations

### Chat
- `GET /api/chat/rooms` - Get chat rooms
- `POST /api/chat/rooms` - Create chat room
- `GET /api/chat/rooms/:roomId/messages` - Get room messages
- `POST /api/chat/rooms/:roomId/messages` - Send message

## Database Schema

The application uses MongoDB with the following collections:
- users
- resources, resourcebookmarks
- courses, coursemodules, courseenrollments
- forumposts, forumcomments, forumlikes
- mentors, mentorshiprequests
- events, eventregistrations
- chatrooms, chatmessages
- activitylogs

## Real-time Features

The backend includes Socket.IO for real-time chat functionality:
- Users can join chat rooms
- Real-time message broadcasting
- Connection management

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS configuration
- Protected routes with middleware