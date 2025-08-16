# Project Management System - Frontend

A modern, responsive project management system built with React, TypeScript, Next.js, and GraphQL.

## Features

- **Dashboard**: Overview of organization statistics and recent projects
- **Project Management**: Create, edit, and manage projects with status tracking
- **Task Management**: Create, edit, and organize tasks with priority and status
- **Comment System**: Add comments to tasks for collaboration
- **Multi-tenant**: Organization-based data isolation
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Real-time Updates**: Optimistic UI updates with Apollo Client
- **Type Safety**: Full TypeScript support with proper interfaces

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **GraphQL Client**: Apollo Client
- **State Management**: React hooks with Apollo Client cache
- **UI Components**: Custom component library with proper accessibility

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend Django server running (see backend README)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VoiceAIWrapper/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql/
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── projects/     # Project management components
│   │   └── tasks/        # Task management components
│   ├── lib/
│   │   ├── apollo-client.ts  # Apollo Client configuration
│   │   ├── graphql/          # GraphQL queries and mutations
│   │   └── utils.ts          # Utility functions
│   ├── types/            # TypeScript interfaces
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Component Architecture

### UI Components
- **Button**: Versatile button component with multiple variants and sizes
- **Input**: Form input with validation and error handling
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection component
- **Modal**: Overlay modal for forms and content
- **StatusBadge**: Status and priority indicators

### Feature Components
- **Dashboard**: Organization overview with statistics
- **ProjectsList**: Project listing with search and filtering
- **TasksList**: Task management with advanced filtering
- **ProjectForm**: Create/edit project forms
- **TaskForm**: Create/edit task forms
- **CommentForm**: Add comments to tasks

## GraphQL Integration

The frontend uses Apollo Client for GraphQL operations with:

- **Queries**: Fetch projects, tasks, and organization data
- **Mutations**: Create, update, and manage data
- **Cache Management**: Optimistic updates and proper cache invalidation
- **Error Handling**: Comprehensive error handling and user feedback

## State Management

- **Local State**: React hooks for component-level state
- **Global State**: Apollo Client cache for server state
- **Form State**: Controlled components with validation
- **Navigation State**: View-based routing within the app

## Styling

- **TailwindCSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach with breakpoints
- **Component Library**: Consistent design system
- **Dark Mode Ready**: Prepared for theme switching

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Component Structure**: Organized by feature and responsibility
- **Props Interface**: Proper TypeScript interfaces for all components

## API Integration

The frontend integrates with the Django backend through GraphQL:

- **Endpoint**: Configurable via environment variables
- **Authentication**: Ready for JWT or session-based auth
- **Error Handling**: Graceful error handling and user feedback
- **Loading States**: Proper loading indicators throughout the UI

## Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Responsive grid layouts
- **Touch Friendly**: Optimized for touch interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Filtering**: More sophisticated search and filter options
- **Drag & Drop**: Kanban-style task management
- **File Attachments**: Support for file uploads
- **User Management**: User roles and permissions
- **Notifications**: Email and in-app notifications
- **Reporting**: Advanced analytics and reporting
- **Mobile App**: React Native companion app

## Troubleshooting

### Common Issues

1. **GraphQL Connection Error**
   - Ensure backend server is running
   - Check `NEXT_PUBLIC_GRAPHQL_URL` environment variable
   - Verify CORS settings on backend

2. **Build Errors**
   - Clear `node_modules` and reinstall dependencies
   - Check TypeScript compilation errors
   - Verify all imports are correct

3. **Styling Issues**
   - Ensure TailwindCSS is properly configured
   - Check for CSS conflicts
   - Verify responsive breakpoints

### Getting Help

- Check the backend README for server setup
- Review GraphQL schema in backend
- Check browser console for errors
- Verify environment variables

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Maintain component organization
4. Add proper error handling
5. Test responsive design
6. Update documentation as needed

## License

This project is part of the VoiceAIWrapper project management system.
