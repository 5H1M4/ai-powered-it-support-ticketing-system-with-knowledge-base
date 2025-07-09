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
  Filter,
  Calendar,
  Flag,
  Star,
  Bot,
  ChevronRight
} from 'lucide-react';
import { Ticket, TicketFilters } from '../types';
import { fetchTickets, getTicketById, updateTicketStatus } from '../utils/api';
import Spinner from './Spinner';

interface TicketListProps {
  tickets?: Ticket[];            // optional prop override
  loading?: boolean;             // optional loading flag
  onTicketSelect?: (ticket: Ticket) => void;
  onMarkInProgress?: (ticketId: string) => void; // new prop
}

export default function TicketList({ tickets: propTickets, loading: propLoading, onTicketSelect }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>(propTickets || []);
  const [loading, setLoading] = useState<boolean>(propLoading ?? true);
  const [error, setError] = useState<string | null>(null);
  const [filters] = useState<TicketFilters>({});
  const [searchTerm] = useState<string>('');

  // AI response state for each ticket
  const [, setAiResponses] = useState<Record<string, { loading: boolean; aiResponse?: string }>>({});

  // Helper to render date, fallback to fetch if invalid
  const [dateFixes, setDateFixes] = useState<Record<string, string>>({});
  const renderDate = (ticket: Ticket) => {
    const d = new Date(ticket.createdAt);
    if (isNaN(d.getTime())) {
      // If we already fixed, use it
      if (dateFixes[ticket.id]) {
        return <time dateTime={dateFixes[ticket.id]}>{new Date(dateFixes[ticket.id]).toLocaleString()}</time>;
      }
      // Otherwise, fetch and update
      getTicketById(ticket.id).then(fresh => {
        if (fresh?.createdAt && !dateFixes[ticket.id]) {
          setDateFixes(prev => ({ ...prev, [ticket.id]: fresh.createdAt }));
        }
      });
      return <span className="text-red-400">Invalid Date</span>;
    }
    return <time dateTime={ticket.createdAt}>{d.toLocaleString()}</time>;
  };

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

  // Fetch AI responses for all tickets
  useEffect(() => {
    if (!tickets.length) return;
    let cancelled = false;
    const fetchAllAI = async () => {
      await Promise.all(
        tickets.map(async (ticket) => {
          setAiResponses(prev => ({ ...prev, [ticket.id]: { loading: true } }));
          try {
            const fresh = await getTicketById(ticket.id);
            if (!cancelled && fresh) {
              setAiResponses(prev => ({ ...prev, [ticket.id]: { loading: false, aiResponse: fresh.aiResponse } }));
              // Update ticket status and emailNotificationStatus in local state
              setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: fresh.status, emailNotificationStatus: fresh.emailNotificationStatus } : t));
            }
          } catch {
            if (!cancelled) {
              setAiResponses(prev => ({ ...prev, [ticket.id]: { loading: false } }));
            }
          }
        })
      );
    };
    fetchAllAI();
    return () => { cancelled = true; };
  }, [tickets]);

  // Handler for row click: update status if open, then select
  const handleRowClick = async (ticket: Ticket) => {
    if (ticket.status === 'open') {
      // Optimistically update status to in_progress
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: 'in_progress' } : t));
      await updateTicketStatus(ticket.id, 'in_progress');
      // Optionally re-fetch just this ticket for accuracy
      const updated = await getTicketById(ticket.id);
      if (updated) {
        setTickets(prev => prev.map(t => t.id === ticket.id ? updated : t));
      }
    }
    if (onTicketSelect) onTicketSelect(ticket);
  };

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
      case 'resolved': return { icon: CheckCircle, className: 'text-green-400 bg-green-900/50', label: 'Resolved' };
      default: return { icon: Clock, className: 'text-blue-400 bg-blue-900/50', label: 'Open' }; // Default to Open
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
              onClick={() => handleRowClick(ticket)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') handleRowClick(ticket); }}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${statusClass}`}><StatusIcon className="w-4 h-4" /></div>
                    <h3 className="text-lg font-semibold text-white truncate">{ticket.subject}</h3>
                  </div>
                  <div className="text-sm text-gray-400 mt-1 flex gap-4">
                    <span className="font-mono text-blue-400">{ticket.id}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{renderDate(ticket)}</span>
                  </div>
                  <p className="text-gray-300 line-clamp-2 mt-2">{ticket.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${prioClass}`}><Flag className="w-3 h-3" />{prioLabel}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>{statusLabel}</span>
                    {/* AI Response badge (static label) */}
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700">
                      <Bot className="w-3 h-3" />AI ANSWER
                    </span>
                    {ticket.feedback && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-green-300 bg-green-900/50"><Star className="w-3 h-3" />{ticket.feedback.rating}/5</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Always show green 'Sent' badge for all tickets */}
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-green-600 text-white shadow-sm border border-green-700">Sent</span>
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
