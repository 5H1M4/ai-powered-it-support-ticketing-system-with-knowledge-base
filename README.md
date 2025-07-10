# AI IT Support - Ticket System

A React-based support ticketing system with AI-powered responses, built with TypeScript, Vite, Tailwind CSS, and Supabase.


## Project Overview

AI IT Support is an intelligent ticketing system designed to streamline IT support with AI-powered responses. The system features:

- **AI-Powered Responses**: Automatic AI-generated responses to common IT issues
- **Real-Time Metrics**: Live dashboard with up-to-date ticket statistics
- **Status Workflow**: Open → In Progress → Resolved ticket workflow
- **Email Notifications**: Automated email notifications for ticket updates
- **Feedback System**: User feedback collection on AI responses
- **Dark Theme UI**: Modern dark-themed interface with responsive design

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Ticket-Sys/project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Creating a Ticket

1. Navigate to the home page
2. Click "Create Support Ticket"
3. Fill in the required fields (email, subject, description)
4. Select a priority level
5. Optionally attach a file
6. Submit the form

### Viewing and Managing Tickets

1. Go to the Dashboard page
2. View ticket statistics in the Dashboard Overview
3. Click on any ticket to view its details
4. Clicking on an "Open" ticket automatically changes its status to "In Progress"
5. Use the "Resolve" button to mark a ticket as resolved
6. Provide feedback on AI responses using the feedback form

## Project Structure

### Core Components

#### `src/components/`

- **TicketForm.tsx**: Form component for creating new tickets with validation
- **TicketList.tsx**: Displays a list of tickets with status indicators and filtering
- **TicketDetail.tsx**: Shows detailed information about a specific ticket and AI response
- **DashboardStats.tsx**: Renders statistics and metrics about ticket statuses
- **Spinner.tsx**: Reusable loading indicator component

#### `src/pages/`

- **HomePage.tsx**: Landing page with ticket creation form
- **DashboardPage.tsx / dashboard.tsx**: Dashboard view showing ticket statistics and lists
- **_document.tsx**: Custom document setup for meta tags and styles
- **index.tsx**: Application routing entry point

#### `src/utils/`

- **api.ts**: API utility functions for ticket creation, fetching, and status updates
- **supabaseClient.ts**: Supabase client configuration for backend integration

#### `src/types/`

- **index.ts**: TypeScript interfaces for tickets, feedback, and API responses

### Data Flow

1. User creates a ticket via `TicketForm`
2. `api.ts` sends the data to the backend (Supabase)
3. Dashboard displays tickets from `fetchTickets()` function
4. Clicking a ticket updates its status with `updateTicketStatus()`
5. Resolving a ticket updates metrics via `getTicketStats()`

## Configuration

### Environment Variables

- `VITE_SUPABASE_URL`: URL of your Supabase project
- `VITE_SUPABASE_ANON_KEY`: Anonymous key for Supabase authentication

### Tailwind Configuration

The project uses Tailwind CSS with a custom dark theme. Customize the theme in `tailwind.config.js`.

## Troubleshooting

### API Connection Issues

If you encounter connection issues with Supabase:

1. Verify your `.env` file has the correct Supabase credentials
2. Check network connectivity to Supabase
3. Ensure your Supabase project has the correct tables set up

### Missing AI Responses

If AI responses aren't showing:

1. Ensure tickets have the correct structure in the database
2. Check if `aiResponse` field is properly populated
3. Verify that the ticket fetching process is working correctly

### Ticket Status Not Updating

If ticket statuses don't update properly:

1. Check browser console for errors
2. Verify that `updateTicketStatus()` function is being called
3. Ensure Supabase has proper permissions for updating records

## License

[MIT](LICENSE)
