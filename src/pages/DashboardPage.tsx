import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, Plus, Home, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ticket, TicketStats } from '../types';
import { fetchTickets, getTicketStats, updateTicketStatus } from '../utils/api';
import TicketListComponent from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import DashboardStatsComponent from '../components/DashboardStats';
import Spinner from '../components/Spinner';

// Explicitly type TicketList and DashboardStats to avoid IntrinsicAttributes errors
const TicketList = TicketListComponent as React.FC<{
  tickets: Ticket[];
  onTicketSelect: (t: Ticket) => void;
  loading: boolean;
}>;
const DashboardStats = DashboardStatsComponent as React.FC<{
  stats: TicketStats;
  loading: boolean;
}>;

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData(showRefreshingIndicator = false) {
    showRefreshingIndicator ? setRefreshing(true) : (setLoading(true), setStatsLoading(true));
    setError(null);

    try {
      const [fetchedTickets, fetchedStats] = await Promise.all([
        fetchTickets(),
        getTicketStats(),
      ]);
      setTickets(fetchedTickets);
      setStats(fetchedStats);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred loading dashboard data');
    } finally {
      setLoading(false);
      setStatsLoading(false);
      setRefreshing(false);
    }
  }

  const handleTicketSelect = (ticket: Ticket) => {
    if (ticket.status === 'open') {
      updateTicketStatus(ticket.id, 'in_progress').then(() => {
        setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: 'in_progress' } : t));
        setSelectedTicket({ ...ticket, status: 'in_progress' });
      });
    } else {
      setSelectedTicket(ticket);
    }
  };
  const handleBackToList = () => {
    setSelectedTicket(null);
  };
  const handleTicketUpdate = (upd: Ticket) => {
    setTickets(prev => prev.map(t => (t.id === upd.id ? upd : t)));
    setSelectedTicket(upd);
  };
  const handleRefresh = () => loadDashboardData(true);

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
              <Link to="/" className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500" aria-label="Home">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500" aria-label="Refresh">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Ticket</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-300">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8 text-center">
            <Bot className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button onClick={() => loadDashboardData()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : selectedTicket ? (
          <TicketDetail ticket={selectedTicket} onBack={handleBackToList} onTicketUpdate={handleTicketUpdate} />
        ) : (
          <>
            {/* Stats */}
            {stats && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                </div>
                <DashboardStats stats={stats} loading={statsLoading} />
              </section>
            )}

            {/* Tickets */}
            {tickets.length === 0 ? (
              <section className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-12 text-center">
                <Bot className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No Support Tickets</h2>
                <p className="text-gray-400 mb-6">Create your first ticket to get started.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg">
                  <Plus className="w-5 h-5" />
                  Create Ticket
                </Link>
              </section>
            ) : (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Recent Tickets</h2>
                  <span className="text-sm text-gray-400">{tickets.length} total tickets</span>
                </div>
                <TicketList
                  tickets={tickets}
                  onTicketSelect={handleTicketSelect}
                  loading={refreshing}
                  // onMarkInProgress={handleMarkInProgress} // not needed, handled in handleBackToList
                />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
