/**
 * Component: Dashboard Page
 * Purpose: Display comprehensive ticket management dashboard with filtering and detailed views
 * Integration:
 *   - API calls: Uses `fetchTickets()` and `getTicketStats()` from `/utils/api.ts`
 *   - RAG data displayed via TicketList and TicketDetail components
 *   - Email notification status tracking
 * Styling: Tailwind CSS with dark theme; responsive design with sidebar navigation
 * Accessibility: Proper keyboard navigation and screen reader support
 */

import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, RefreshCw, Plus, Home, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ticket, TicketStats } from '../types';
import { fetchTickets, getTicketStats } from '../utils/api';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import DashboardStats from '../components/DashboardStats';
import Spinner from '../components/Spinner';

export default function DashboardPage() {
  // State management
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Function to load all dashboard data
  const loadDashboardData = async (showRefreshingIndicator = false) => {
    if (showRefreshingIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
      setStatsLoading(true);
    }
    
    setError(null);

    try {
      // Load tickets and stats in parallel
      const [ticketsResponse, statsResponse] = await Promise.all([
        fetchTickets(),
        getTicketStats()
      ]);
      
      if (ticketsResponse.success && ticketsResponse.data) {
        setTickets(ticketsResponse.data);
      } else {
        setError(ticketsResponse.error || 'Failed to load tickets');
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError('An unexpected error occurred while loading dashboard data');
    } finally {
      setLoading(false);
      setStatsLoading(false);
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
    loadDashboardData(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AI IT Support</span>
              </div>
              
              <div className="h-6 w-px bg-gray-600" />
              
              <h1 className="text-lg font-semibold text-white">
                {selectedTicket ? 'Ticket Details' : 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Home button */}
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Go to home page"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>

              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                aria-label="Refresh dashboard data"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Create ticket button */}
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Ticket</span>
              </Link>
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
              <p className="mt-4 text-gray-300">Loading your support dashboard...</p>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-900/50 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Dashboard</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => loadDashboardData()}
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
          // Dashboard overview
          <div className="space-y-8">
            {/* Dashboard stats */}
            {stats && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                </div>
                <DashboardStats stats={stats} loading={statsLoading} />
              </div>
            )}

            {tickets.length === 0 ? (
              // Empty state
              <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-900/50 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">No Support Tickets Yet</h2>
                <p className="text-gray-400 mb-6">
                  Create your first support ticket to get started with AI-powered assistance.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Ticket
                </Link>
              </div>
            ) : (
              // Ticket list
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Recent Tickets</h2>
                  <span className="text-sm text-gray-400">
                    {tickets.length} total tickets
                  </span>
                </div>

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
    </div>
  );
}