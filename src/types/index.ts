/**
 * TypeScript interfaces for the AI-powered IT support ticketing system
 * Purpose: Define data structures for tickets, feedback, and API responses
 * Integration:
 *   - Used across all components and API calls
 *   - Ensures type safety throughout the application
 */

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'closed' | 'awaiting_info' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  fileUrl?: string;
  fileName?: string;
  aiResponse?: string;
  aiResponseGeneratedAt?: string;
  feedback?: Feedback;
  emailNotificationSent: boolean;
  emailNotificationStatus: 'pending' | 'sent' | 'failed';
}

export interface Feedback {
  id: string;
  ticketId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
}

export interface CreateTicketData {
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  fileUrl?: string;
  fileName?: string;
  email?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TicketFilters {
  status?: Ticket['status'];
  priority?: Ticket['priority'];
  search?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  aiResponses: number;
  avgResponseTime: string;
  satisfactionRate: number;
  resolutionRate: number;
}