# AI IT Support - Ticket System

A React-based support ticketing system with AI-powered responses, built with TypeScript, Vite, Tailwind CSS, and Supabase.

Project Overview

AI IT Support is an intelligent ticketing system designed to streamline IT support with AI-powered responses. The system features:

- **AI-Powered Responses**: Automatic AI-generated responses to common IT issues
- **Real-Time Metrics**: Live dashboard with up-to-date ticket statistics
- **Status Workflow**: Open → In Progress → Resolved ticket workflow
- **Email Notifications**: Automated email notifications for ticket updates
- **Feedback System**: User feedback collection on AI responses
- **Dark Theme UI**: Modern dark-themed interface with responsive design

Installation

Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- n8n instance for workflow automation
- Supabase account with vector extensions enabled

Setup

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
   VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Usage

Creating a Ticket

1. Navigate to the home page
2. Click "Create Support Ticket"
3. Fill in the required fields (email, subject, description)
4. Select a priority level
5. Optionally attach a file
6. Submit the form
   - This triggers the n8n webhook (`/webhook-test/new-ticket`)
   - The webhook processes the ticket and generates an AI response

Viewing and Managing Tickets

1. Go to the Dashboard page
2. View ticket statistics in the Dashboard Overview
3. Click on any ticket to view its details
   - This sends a `GET` request to Supabase via the API
   - Clicking an "Open" ticket automatically changes its status to "In Progress" via `updateTicketStatus()`
4. Use the "Resolve" button to mark a ticket as resolved
   - This sends a `PATCH` request to update the ticket status
5. Provide feedback on AI responses using the feedback form
   - Feedback is stored in Supabase for improving AI responses



Project Structure

Core Components

`src/components/`

- **TicketForm.tsx**: Form component for creating new tickets with validation
- **TicketList.tsx**: Displays a list of tickets with status indicators and filtering
- **TicketDetail.tsx**: Shows detailed information about a specific ticket and AI response
- **DashboardStats.tsx**: Renders statistics and metrics about ticket statuses
- **Spinner.tsx**: Reusable loading indicator component

`src/pages/`

- **HomePage.tsx**: Landing page with ticket creation form
- **DashboardPage.tsx / dashboard.tsx**: Dashboard view showing ticket statistics and lists
- **_document.tsx**: Custom document setup for meta tags and styles
- **index.tsx**: Application routing entry point

`src/utils/`

- **api.ts**: API utility functions for ticket creation, fetching, and status updates
- **supabaseClient.ts**: Supabase client configuration for backend integration

`src/types/`

- **index.ts**: TypeScript interfaces for tickets, feedback, and API responses

Data Flow

1. User creates a ticket via `TicketForm`
2. `api.ts` sends the data to the backend (n8n webhook)
3. n8n processes the ticket and generates an AI response
4. Dashboard displays tickets from `fetchTickets()` function
5. Clicking a ticket updates its status with `updateTicketStatus()`
6. Resolving a ticket updates metrics via `getTicketStats()`

n8n Workflows

The system relies on two key n8n workflows for document processing and ticket handling.

Workflow A – Document Ingestion & Embedding

This workflow automatically processes knowledge base documents and prepares them for RAG (Retrieval-Augmented Generation).

Process Flow:

1. **Schedule Trigger**: Executes every hour to check for new documents
2. **Ingest Drive Documents**:
   - Lists all Google Docs from a specified Drive folder
   - Filters for documents modified since last execution
3. **Document Processing**:
   - For each document, fetches full content via Google Docs API
   - Extracts text content and metadata (title, last modified date)
4. **Chunk Text**:
   - Splits documents into smaller chunks (500 tokens with 100 token overlap)
   - Preserves document metadata with each chunk
5. **Embed Chunks**:
   - Sends each chunk to OpenAI's embedding API
   - Generates vector embeddings (1536 dimensions) for semantic search
6. **Upsert into Supabase**:
   - Stores chunks and embeddings in Supabase `documents` table
   - Uses `on_conflict` strategy to update existing documents
   - Maintains document version history


Workflow B – Ticket Processing & AI Response

This workflow handles incoming support tickets, generates AI responses using RAG, and sends notifications.

 Process Flow:

1. **Webhook Trigger**: Listens for new ticket submissions at `/webhook-test/new-ticket`
2. **Insert Ticket**: Creates a new ticket record in Supabase with initial status "open"
3. **Vector Search**:
   - Extracts key terms from the ticket description
   - Performs semantic search against document embeddings
   - Retrieves top-5 most relevant knowledge base chunks
4. **AI Agent**:
   - Uses a dual-answer approach:
     - First generates a response based solely on the ticket description
     - Then generates a RAG response using retrieved knowledge chunks
     - Combines both for comprehensive answer
   - System prompt includes IT support expertise and response formatting guidelines
5. **Conditional Branching**:
   - Success path: Updates ticket with AI response and sends email notification
   - Failure path: Marks ticket with error status and alerts support team
6. **Email Notification**:
   - Uses SendGrid to deliver ticket confirmation and AI response
   - Updates ticket with email notification status



Environment Variables

- `VITE_SUPABASE_URL`: URL of your Supabase project
- `VITE_SUPABASE_ANON_KEY`: Anonymous key for Supabase authentication
- `VITE_N8N_WEBHOOK_URL`: URL for the n8n webhook endpoint

Supabase Configuration

1. Create the following tables:
   - `tickets`: Stores ticket information and AI responses
   - `documents`: Stores knowledge base chunks with vector embeddings
  
   ```

Tailwind Configuration

The project uses Tailwind CSS with a custom dark theme. Customize the theme in `tailwind.config.js`.

Troubleshooting

API Connection Issues

If you encounter connection issues with Supabase:

1. Verify your `.env` file has the correct Supabase credentials
2. Check network connectivity to Supabase
3. Ensure your Supabase project has the correct tables set up



License

[MIT](LICENSE)
