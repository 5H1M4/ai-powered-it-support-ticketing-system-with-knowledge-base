/**
 * Component: TicketList
 * Purpose: Display list of all support tickets with filtering and status in dark theme
 * Integration:
 *   - API calls: `/utils/api.ts` fetchTickets function
 *   - RAG data displayed via AI responses
 *   - Email notification status indicators
 * Styling: Tailwind CSS with dark theme; responsive breakpoints with grid layouts
 * Accessibility: aria-labels and keyboard navigation
 */

import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PlayCircle, 
  Mail, 
  MailX, 
  Loader2,
  Filter,
  Search,
  Calendar,
  Flag,
  MessageSquare,
  Star,
  Bot,
  ChevronRight
} from 'lucide-react';
import { Ticket, TicketFilters } from '../types';

interface TicketListProps {
  tickets: Ticket[];
  onTicketSelect?: (ticket: Ticket) => void;
  loading?: boolean;
}

export default function TicketList({ tickets, onTicketSelect, loading = false }: TicketListProps) {
  // Filter state
  const [filters, setFilters] = useState<TicketFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tickets based on current filters and search term
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.subject.toLowerCase().includes(search) ||
        ticket.description.toLowerCase().includes(search) ||
        ticket.id.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tickets, filters, searchTerm]);

  // Get status icon and styling
  const getStatusConfig = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return {
          icon: Clock,
          className: 'text-blue-400 bg-blue-900/50',
          label: 'Open'
        };
      case 'in_progress':
        return {
          icon: PlayCircle,
          className: 'text-amber-400 bg-amber-900/50',
          label: 'In Progress'
        };
      case 'awaiting_info':
        return {
          icon: AlertCircle,
          className: 'text-orange-400 bg-orange-900/50',
          label: 'Awaiting Info'
        };
      case 'closed':
        return {
          icon: CheckCircle,
          className: 'text-green-400 bg-green-900/50',
          label: 'Closed'
        };
      default:
        return {
          icon: Clock,
          className: 'text-gray-400 bg-gray-700',
          label: 'Unknown'
        };
    }
  };

  // Get priority styling
  const getPriorityConfig = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent':
        return { className: 'text-red-300 bg-red-900/50 border-red-700', label: 'Urgent' };
      case 'high':
        return { className: 'text-orange-300 bg-orange-900/50 border-orange-700', label: 'High' };
      case 'medium':
        return { className: 'text-blue-300 bg-blue-900/50 border-blue-700', label: 'Medium' };
      case 'low':
        return { className: 'text-gray-300 bg-gray-700 border-gray-600', label: 'Low' };
      default:
        return { className: 'text-gray-300 bg-gray-700 border-gray-600', label: 'Unknown' };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof TicketFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-300">Loading tickets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
      {/* Header with filters and search */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Support Tickets</h2>
            <p className="text-gray-400">
              {filteredTickets.length} of {tickets.length} tickets
            </p>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 text-white placeholder-gray-400"
              />
            </div>

            {/* Status filter */}
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="awaiting_info">Awaiting Info</option>
              <option value="closed">Closed</option>
            </select>

            {/* Priority filter */}
            <select
              value={filters.priority || 'all'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ticket list */}
      <div className="divide-y divide-gray-700">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No tickets found</h3>
            <p className="text-gray-400">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : 'No support tickets have been created yet'
              }
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.status);
            const priorityConfig = getPriorityConfig(ticket.priority);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={ticket.id}
                className="p-6 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                onClick={() => onTicketSelect?.(ticket)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onTicketSelect?.(ticket);
                  }
                }}
                aria-label={`View ticket: ${ticket.subject}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Ticket main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      {/* Status indicator */}
                      <div className={`p-2 rounded-full ${statusConfig.className} flex-shrink-0`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Ticket subject */}
                        <h3 className="text-lg font-semibold text-white truncate mb-1 group-hover:text-blue-400 transition-colors">
                          {ticket.subject}
                        </h3>
                        
                        {/* Ticket ID and creation date */}
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          <span className="font-mono text-blue-400">{ticket.id}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                        </div>

                        {/* Ticket description preview */}
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                          {ticket.description}
                        </p>

                        {/* Tags and indicators */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Priority badge */}
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${priorityConfig.className}`}>
                            <Flag className="w-3 h-3" />
                            {priorityConfig.label}
                          </span>

                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                            {statusConfig.label}
                          </span>

                          {/* AI response indicator */}
                          {ticket.aiResponse && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-purple-300 bg-purple-900/50">
                              <Bot className="w-3 h-3" />
                              AI Response
                            </span>
                          )}

                          {/* Feedback indicator */}
                          {ticket.feedback && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-green-300 bg-green-900/50">
                              <Star className="w-3 h-3" />
                              Rated {ticket.feedback.rating}/5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Email status and arrow */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Email notification status */}
                    <div className="flex items-center gap-2 text-sm">
                      {ticket.emailNotificationStatus === 'sent' ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <Mail className="w-4 h-4" />
                          <span className="hidden sm:inline">Email sent</span>
                        </div>
                      ) : ticket.emailNotificationStatus === 'failed' ? (
                        <div className="flex items-center gap-1 text-red-400">
                          <MailX className="w-4 h-4" />
                          <span className="hidden sm:inline">Email failed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="hidden sm:inline">Sending...</span>
                        </div>
                      )}
                    </div>

                    {/* Arrow indicator */}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}