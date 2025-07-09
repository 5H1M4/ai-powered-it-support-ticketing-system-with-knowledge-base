/**
 * API utility functions for the ticketing system
 * Purpose: Handle all API communications with the backend
 * Integration:
 *   - Used by components to interact with the backend
 *   - Handles ticket creation, fetching, and feedback submission
 *   - Mock implementation for demo purposes with realistic data
 */

import { supabase } from './supabaseClient';
import { Ticket, TicketStats } from '../types';

function mapTicket(raw: any): Ticket {
  return {
    id: raw.id,
    subject: raw.subject,
    description: raw.description,
    status: raw.status,
    priority: raw.priority,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    fileUrl: raw.file_url,
    fileName: raw.file_name,
    aiResponse: raw.ai_response,
    aiResponseGeneratedAt: raw.ai_response_generated_at,
    feedback: raw.feedback,
    emailNotificationSent: raw.email_notification_sent,
    emailNotificationStatus: raw.email_notification_status,
  };
}

export async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapTicket);
}

export async function deleteTicket(ticketId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', ticketId);
  if (error) {
    return { success: false, error: 'Failed to delete ticket' };
  }
  return { success: true, message: 'Ticket deleted successfully' };
}

export async function getTicketStats(): Promise<TicketStats> {
  const tickets = await fetchTickets();
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const closed = tickets.filter(t => t.status === 'closed').length;
  const aiResponses = tickets.filter(t => t.aiResponse && t.aiResponse.length > 0).length;
  // Average response time (in minutes)
  const responseTimes = tickets
    .filter(t => t.aiResponseGeneratedAt && t.createdAt)
    .map(t => (new Date(t.aiResponseGeneratedAt!).getTime() - new Date(t.createdAt).getTime()) / 60000)
    .filter(ms => ms > 0);
  const avgResponseTime = responseTimes.length
    ? `${Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)} min`
    : 'N/A';
  // Satisfaction rate (average feedback.rating)
  const feedbacks = tickets.map(t => t.feedback?.rating).filter(r => typeof r === 'number') as number[];
  const satisfactionRate = feedbacks.length
    ? Math.round((feedbacks.reduce((a, b) => a + b, 0) / feedbacks.length) * 10) / 10
    : 0;
  // Resolution rate
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;
  return {
    total,
    open,
    inProgress,
    closed,
    aiResponses,
    avgResponseTime,
    satisfactionRate,
    resolutionRate
  };
}

/**
 * Submit feedback for an AI-generated response
 * Integration: Called from TicketDetail component when user provides feedback
 */
export async function submitFeedback(
  ticketId: string, 
  feedback: { rating: 1 | 2 | 3 | 4 | 5; comment?: string }
): Promise<{ success: boolean; message?: string; error?: string }> {
  const { error } = await supabase
    .from('feedback')
    .insert({ ticket_id: ticketId, rating: feedback.rating, comment: feedback.comment })
    .select()
    .single();

  if (error) {
    return { success: false, error: 'Failed to submit feedback. Please try again.' };
  }

  return { success: true, message: 'Thank you for your feedback! This helps us improve our AI responses.' };
}


/**
 * Get ticket by ID
 * Integration: Used by TicketDetail component
 */
export async function getTicketById(ticketId: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', ticketId)
    .single();

  if (error) {
    return null;
  }
  return mapTicket(data);
}

/**
 * Update ticket status
 * Integration: Used by admin/technician interfaces
 */
export async function updateTicketStatus(
  ticketId: string, 
  status: Ticket['status']
): Promise<{ success: boolean; message?: string; error?: string }> {
  const { error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('id', ticketId);

  if (error) {
    return { success: false, error: 'Failed to update ticket status' };
  }

  return { success: true, message: 'Ticket status updated successfully' };
}