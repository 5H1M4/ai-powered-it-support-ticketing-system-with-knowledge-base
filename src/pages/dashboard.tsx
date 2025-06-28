/**
 * Component: Dashboard Page
 * Purpose: Display ticket management dashboard with filtering and detailed views
 * Integration:
 *   - API calls: Uses `fetchTickets()` from `/utils/api.ts`
 *   - RAG data displayed via TicketList and TicketDetail components
 *   - Email notification status tracking
 * Styling: Tailwind CSS; responsive design with sidebar navigation
 * Accessibility: Proper keyboard navigation and screen reader support
 */

import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, RefreshCw, Plus } from 'lucide-react';
import { Ticket } from '../types';
import { fetchTickets } from '../utils/api';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  // State management
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load tickets on component mount
  useEffect(() => {
    loadTickets();
  }, []);

  // Function to load tickets from API
  const loadTickets = async (showRefreshingIndicator = false) => {
    if (showRefreshingIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      const response = await fetchTickets();
      
      if (response.success && response.data) {
        setTickets(response.data);
      } else {
        setError(response.error || 'Failed to load tickets');
      }
    } catch (err) {
      setError('An unexpected error occurred while loading tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle ticket selection for detailed view
  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  // Handle going back to ticket list
  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  // Handle ticket updates (e.g., after feedback submission)
  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    setSelectedTicket(updatedTicket);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    loadTickets(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">AI IT Support</span>
              </div>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <h1 className="text-lg font-semibold text-gray-900">
                {selectedTicket ? 'Ticket Details' : 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                aria-label="Refresh tickets"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Create ticket button */}
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Ticket</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          // Loading state
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading your support tickets...</p>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Tickets</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => loadTickets()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : selectedTicket ? (
          // Ticket detail view
          <TicketDetail
            ticket={selectedTicket}
            onBack={handleBackToList}
            onTicketUpdate={handleTicketUpdate}
          />
        ) : (
          // Ticket list view
          <div className="space-y-6">
            {tickets.length === 0 ? (
              // Empty state
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Support Tickets Yet</h2>
                <p className="text-gray-600 mb-6">
                  Create your first support ticket to get started with AI-powered assistance.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Ticket
                </a>
              </div>
            ) : (
              // Ticket list with summary stats
              <div className="space-y-6">
                {/* Quick stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total tickets */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="text-2xl font-bold text-gray-900">{tickets.length}</div>
                    <div className="text-sm text-gray-600">Total Tickets</div>
                  </div>

                  {/* Open tickets */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {tickets.filter(t => t.status === 'open').length}
                    </div>
                    <div className="text-sm text-gray-600">Open</div>
                  </div>

                  {/* In progress tickets */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="text-2xl font-bold text-amber-600">
                      {tickets.filter(t => t.status === 'in_progress').length}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>

                  {/* AI responses */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {tickets.filter(t => t.aiResponse).length}
                    </div>
                    <div className="text-sm text-gray-600">AI Responses</div>
                  </div>
                </div>

                {/* Ticket list component */}
                <TicketList
                  tickets={tickets}
                  onTicketSelect={handleTicketSelect}
                  loading={refreshing}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* TODO: Add keyboard shortcuts help modal */}
      {/* TODO: Add ticket export functionality */}
      {/* TODO: Add real-time updates via WebSocket connection */}
    </div>
  );
}