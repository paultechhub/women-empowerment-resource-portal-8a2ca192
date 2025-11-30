# Complete API Endpoints Documentation

## Authentication Routes (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /` - Get all users (admin)
- `GET /profile/:id` - Get user profile
- `PUT /profile/:id` - Update user profile
- `DELETE /:id` - Delete user (admin)

## Resource Routes (`/api/resources`)
- `GET /` - Get all resources (pagination, filtering)
- `POST /` - Create resource
- `GET /:id` - Get single resource
- `PUT /:id` - Update resource
- `DELETE /:id` - Delete resource
- `POST /bookmark` - Bookmark resource
- `GET /bookmarks/:userId` - Get user bookmarks
- `DELETE /bookmark/:id` - Remove bookmark

## Course Routes (`/api/courses`)
- `GET /` - Get all courses (pagination, filtering)
- `POST /` - Create course
- `GET /:id` - Get single course
- `PUT /:id` - Update course
- `DELETE /:id` - Delete course
- `POST /enroll` - Enroll in course
- `GET /:courseId/modules` - Get course modules
- `POST /:courseId/modules` - Add course module
- `PUT /modules/:moduleId` - Update course module
- `DELETE /modules/:moduleId` - Delete course module
- `PUT /enrollment/:enrollmentId/progress` - Update progress
- `GET /user/:userId/enrollments` - Get user enrollments

## Forum Routes (`/api/forum`)
- `GET /posts` - Get forum posts (pagination, filtering)
- `POST /posts` - Create post
- `GET /posts/:id` - Get single post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `GET /posts/:postId/comments` - Get post comments
- `POST /posts/:postId/comments` - Create comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment
- `POST /posts/:postId/like` - Like/unlike post
- `GET /posts/:postId/likes` - Get post likes

## Mentorship Routes (`/api/mentorship`)
- `GET /mentors` - Get all mentors
- `POST /mentors` - Create mentor profile
- `GET /mentors/:id` - Get single mentor
- `PUT /mentors/:id` - Update mentor profile
- `DELETE /mentors/:id` - Delete mentor profile
- `POST /requests` - Create mentorship request
- `GET /requests/mentor/:mentorId` - Get mentor requests
- `GET /requests/mentee/:menteeId` - Get mentee requests
- `PUT /requests/:requestId` - Update request status
- `DELETE /requests/:requestId` - Delete mentorship request

## Event Routes (`/api/events`)
- `GET /` - Get all events (upcoming filter)
- `POST /` - Create event
- `GET /:id` - Get single event
- `PUT /:id` - Update event
- `DELETE /:id` - Delete event
- `POST /register` - Register for event
- `GET /:eventId/registrations` - Get event registrations
- `DELETE /register/:registrationId` - Cancel registration
- `GET /user/:userId/registrations` - Get user registrations

## Chat Routes (`/api/chat`)
- `GET /rooms` - Get chat rooms
- `POST /rooms` - Create chat room
- `GET /rooms/:id` - Get single room
- `PUT /rooms/:id` - Update room
- `DELETE /rooms/:id` - Delete room
- `GET /rooms/:roomId/messages` - Get room messages
- `POST /rooms/:roomId/messages` - Send message
- `DELETE /messages/:id` - Delete message

## Success Stories Routes (`/api/success-stories`)
- `GET /` - Get approved success stories (featured filter)
- `POST /` - Create success story (auth required)
- `GET /pending` - Get pending stories (admin only)
- `PUT /:id/approve` - Approve story (admin only)
- `PUT /:id/feature` - Feature story (admin only)
- `DELETE /:id` - Delete story (admin only)

## Notification Routes (`/api/notifications`)
- `GET /:userId` - Get user notifications (auth required)
- `POST /` - Create notification (auth required)
- `PUT /:id/read` - Mark notification as read (auth required)
- `PUT /user/:userId/read-all` - Mark all as read (auth required)
- `DELETE /:id` - Delete notification (auth required)

## Admin Routes (`/api/admin`)
- `GET /stats` - Get dashboard stats (admin only)
- `GET /pending-approvals` - Get all pending approvals (admin only)
- `PUT /approve/:type/:id` - Approve item (admin only)
- `DELETE /reject/:type/:id` - Reject item (admin only)
- `POST /users/:userId/roles` - Add user role (admin only)
- `DELETE /users/:userId/roles/:role` - Remove user role (admin only)

## Socket.IO Events (Real-time Chat)
- `join_room` - Join chat room
- `send_message` - Send message to room
- `receive_message` - Receive message from room
- `disconnect` - Handle user disconnect

## Authentication
- JWT tokens required for protected routes
- Admin routes require admin role
- Token format: `Authorization: Bearer <token>`

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

## Error Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```