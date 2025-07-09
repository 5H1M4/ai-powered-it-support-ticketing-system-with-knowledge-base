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

export async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getTicketStats(): Promise<TicketStats> {
  const tickets = await fetchTickets();
  return {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    aiResponses: tickets.filter(t => t.aiResponse).length,
    avgResponseTime: '< 2 min', // Placeholder, real calculation can be added
    satisfactionRate: 4.2 // Placeholder, real calculation can be added
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
  return data;
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