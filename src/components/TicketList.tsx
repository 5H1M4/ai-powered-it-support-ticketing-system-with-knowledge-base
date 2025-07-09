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

import { useEffect, useState, useMemo } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PlayCircle, 
  Mail, 
  MailX, 
  Loader2,
  Filter,
  Calendar,
  Flag,
  Star,
  Bot,
  ChevronRight
} from 'lucide-react';
import { Ticket, TicketFilters } from '../types';
import { fetchTickets } from '../utils/api';
import Spinner from './Spinner';

interface TicketListProps {
  tickets?: Ticket[];            // optional prop override
  loading?: boolean;             // optional loading flag
  onTicketSelect?: (ticket: Ticket) => void;
}

export default function TicketList({ tickets: propTickets, loading: propLoading, onTicketSelect }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>(propTickets || []);
  const [loading, setLoading] = useState<boolean>(propLoading ?? true);
  const [error, setError] = useState<string | null>(null);
  const [filters] = useState<TicketFilters>({});
  const [searchTerm] = useState<string>('');

  // Fetch live tickets if no tickets passed in via props
  useEffect(() => {
    let mounted = true;
    if (propTickets === undefined) {
      setLoading(true);
      setError(null);
      fetchTickets()
        .then(data => {
          if (mounted) {
            setTickets(data);
            setLoading(false);
          }
        })
        .catch(err => {
          if (mounted) {
            setError(err.message || 'Failed to load tickets');
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }
    return () => { mounted = false; };
  }, []);

  // Derived filtered tickets
  const filteredTickets = useMemo(() => {
    let list = tickets;
    if (filters.status) {
      list = list.filter(t => t.status === filters.status);
    }
    if (filters.priority) {
      list = list.filter(t => t.priority === filters.priority);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(t => t.subject.toLowerCase().includes(term)
        || t.description.toLowerCase().includes(term)
        || t.id.toLowerCase().includes(term));
    }
    return list;
  }, [tickets, filters, searchTerm]);

  const getStatusConfig = (status: Ticket['status']) => {
  switch (status) {
    case 'open': return { icon: Clock, className: 'text-blue-400 bg-blue-900/50', label: 'Open' };
    case 'in_progress': return { icon: PlayCircle, className: 'text-amber-400 bg-amber-900/50', label: 'In Progress' };
    case 'awaiting_info': return { icon: AlertCircle, className: 'text-orange-400 bg-orange-900/50', label: 'Awaiting Info' };
    case 'closed': return { icon: CheckCircle, className: 'text-green-400 bg-green-900/50', label: 'Closed' };
    default: return { icon: Clock, className: 'text-gray-400 bg-gray-700', label: 'Unknown' };
  }
};

const getPriorityConfig = (priority: Ticket['priority']) => {
  switch (priority) {
    case 'urgent': return { className: 'text-red-300 bg-red-900/50 border-red-700', label: 'Urgent' };
    case 'high': return { className: 'text-orange-300 bg-orange-900/50 border-orange-700', label: 'High' };
    case 'medium': return { className: 'text-blue-300 bg-blue-900/50 border-blue-700', label: 'Medium' };
    case 'low': return { className: 'text-gray-300 bg-gray-700 border-gray-600', label: 'Low' };
    default: return { className: 'text-gray-300 bg-gray-700 border-gray-600', label: 'Unknown' };
  }
};

  // Format date utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Filter handler

  // Loading, error, and empty states
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-900 rounded-xl shadow-xl border border-red-700 p-8 text-center">
        <h3 className="text-lg font-medium text-white mb-2">Error loading tickets</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }
  if (filteredTickets.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8 text-center">
        <Filter className="w-8 h-8 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No tickets found</h3>
        <p className="text-gray-400">{searchTerm || Object.keys(filters).length ? 'Try adjusting filters' : 'No tickets available'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
      {/* Header with search & filters omitted for brevity... */}
      <div className="divide-y divide-gray-700">
        {filteredTickets.map(ticket => {
          const { icon: StatusIcon, className: statusClass, label: statusLabel } = getStatusConfig(ticket.status);
          const { className: prioClass, label: prioLabel } = getPriorityConfig(ticket.priority);
          return (
            <div
              key={ticket.id}
              className="p-6 hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => onTicketSelect?.(ticket)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') onTicketSelect?.(ticket); }}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${statusClass}`}><StatusIcon className="w-4 h-4" /></div>
                    <h3 className="text-lg font-semibold text-white truncate">{ticket.subject}</h3>
                  </div>
                  <div className="text-sm text-gray-400 mt-1 flex gap-4">
                    <span className="font-mono text-blue-400">{ticket.id}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(ticket.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 line-clamp-2 mt-2">{ticket.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${prioClass}`}><Flag className="w-3 h-3" />{prioLabel}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>{statusLabel}</span>
                    {ticket.aiResponse && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-purple-300 bg-purple-900/50"><Bot className="w-3 h-3" />AI</span>}
                    {ticket.feedback && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-green-300 bg-green-900/50"><Star className="w-3 h-3" />{ticket.feedback.rating}/5</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {ticket.emailNotificationStatus === 'sent' ? <div className="flex items-center gap-1 text-green-400"><Mail className="w-4 h-4" /><span className="hidden sm:inline">Sent</span></div>
                    : ticket.emailNotificationStatus === 'failed' ? <div className="flex items-center gap-1 text-red-400"><MailX className="w-4 h-4" /><span className="hidden sm:inline">Failed</span></div>
                    : <div className="flex items-center gap-1 text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /><span className="hidden sm:inline">Sending</span></div>}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
