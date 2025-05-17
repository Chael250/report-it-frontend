# Report-It Frontend (MVP)

This is an MVP version of the frontend repository for the Report-It citizen complaint management system. It demonstrates core functionality for submitting and tracking complaints. The system is functional but lacks many features that would be required for production use.

## Current Status
This is an MVP version demonstrating core functionality. The system includes basic features but lacks many features that would be required for production use. It serves as a foundation that can be built upon to create a full-fledged complaint management system.

## Deployment URLs
- Backend: https://report-it-backend.onrender.com/
- Frontend: https://report-it-frontend.vercel.app/

## Features

- Complaint submission form
- Complaint status tracking
- Agency selection
- Responsive design
- Error handling and validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```

3. Copy and configure environment variables
   ```bash
   cp .env.example .env
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Deployment

### Vercel Deployment

1. **Prerequisites**
   - Vercel account
   - Git repository

2. **Deploy to Vercel**
   ```bash
   # 1. Install Vercel CLI
   npm i -g vercel

   # 2. Login to Vercel
   vercel login

   # 3. Deploy
   vercel
   ```

3. **Vercel Configuration**
   - Set environment variables in Vercel dashboard:
     - `NEXT_PUBLIC_API_URL` (your Render backend URL)
     - Any other frontend-specific variables

4. **Frontend Build Settings**
   - Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build"
       }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "/$1" }
     ]
   }
   ```

### Environment Variables

Create a `.env` file with the following variables:

```
NEXT_PUBLIC_APP_NAME=Report-It
NEXT_PUBLIC_VERSION=1.0.0
```

Note: The API URL is now hardcoded to https://report-it-backend.onrender.com/api in the codebase, so no environment variable is needed for the backend URL.

### Integration with Backend

The frontend is configured to connect to the backend API at https://report-it-backend.onrender.com/. The application uses the following endpoints:

- `GET /api/complaints` - List all complaints
- `GET /api/complaints/:id` - Get a specific complaint
- `POST /api/complaints` - Create a new complaint
- `PUT /api/complaints/:id` - Update a complaint
- `DELETE /api/complaints/:id` - Delete a complaint

- `GET /api/agencies` - List all agencies
- `GET /api/agencies/:id` - Get a specific agency
- `POST /api/agencies` - Create a new agency
- `PUT /api/agencies/:id` - Update an agency
- `DELETE /api/agencies/:id` - Delete an agency

Note: This MVP version includes basic API integration. In a full production version, additional endpoints and features would be implemented.

## Development

### Available Scripts

In the project directory, you can run:

```bash
# Start development server
npm run dev

### Development Best Practices

1. **Code Style**
   - Follow ESLint rules
   - Use TypeScript for type safety
   - Maintain consistent component structure

2. **State Management**
   - Use React Query for API calls
   - Implement proper error boundaries
   - Handle loading states appropriately

3. **Testing**
   - Write component tests
   - Implement API mocks
   - Test error scenarios

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── services/       # API services
├── utils/          # Utility functions
├── styles/         # Global styles
└── types/          # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- React
- Vercel
- Material-UI
- React Query
- TypeScript
