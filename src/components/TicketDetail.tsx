/**
 * Component: TicketDetail
 * Purpose: Display detailed view of a single ticket with AI response and feedback in dark theme
 * Integration:
 *   - API calls: `/utils/api.ts` submitFeedback function
 *   - RAG data displayed via AI responses
 *   - Feedback triggers `submitFeedback()`
 *   - Email notifications status display
 * Styling: Tailwind CSS with dark theme; responsive breakpoints
 * Accessibility: aria-labels and keyboard navigation for feedback
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Flag, 
  Mail, 
  MailX, 
  Loader2, 
  Bot, 
  User, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  Send,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Download,
  MessageSquare
} from 'lucide-react';
import { Ticket } from '../types';
import { submitFeedback, getTicketById, updateTicketStatus } from '../utils/api';
import Spinner from './Spinner';
import { useEffect } from 'react';

interface TicketDetailProps {
  ticket: Ticket;
  onBack?: () => void;
  onTicketUpdate?: (updatedTicket: Ticket) => void;
}

export default function TicketDetail({ ticket, onBack, onTicketUpdate }: TicketDetailProps) {
  // Feedback state
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Local state for live ticket data
  const [liveTicket, setLiveTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getTicketById(ticket.id).then(data => {
      if (mounted) setLiveTicket(data);
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [ticket.id]);

  // Get status configuration
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
      case 'resolved':
        return {
          icon: CheckCircle,
          className: 'text-green-400 bg-green-900/50',
          label: 'Resolved'
        };
      default:
        return {
          icon: Clock,
          className: 'text-blue-400 bg-blue-900/50',
          label: 'Open'
        };
    }
  };

  // Get priority configuration
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ticket.feedback) {
      return; // Already has feedback
    }

    setIsSubmittingFeedback(true);

    try {
      const response = await submitFeedback(ticket.id, {
        rating: feedbackRating,
        comment: feedbackComment.trim() || undefined
      });

      if (response.success) {
        setFeedbackSubmitted(true);
        setShowFeedbackForm(false);
        
        // Update ticket with new feedback (optimistic update)
        const updatedTicket: Ticket = {
          ...ticket,
          feedback: {
            id: `feedback_${Date.now()}`,
            ticketId: ticket.id,
            rating: feedbackRating,
            comment: feedbackComment.trim() || undefined,
            createdAt: new Date().toISOString()
          }
        };
        
        onTicketUpdate?.(updatedTicket);
      } else {
        alert(response.error || 'Failed to submit feedback');
      }
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Handler for resolve
  const handleResolve = async () => {
    if (!liveTicket) return;
    setResolving(true);
    await updateTicketStatus(liveTicket.id, 'resolved');
    const updated = await getTicketById(liveTicket.id);
    setLiveTicket(updated);
    setResolving(false);
    if (updated && onTicketUpdate) onTicketUpdate(updated);
  };

  if (loading || !liveTicket) {
    return <div className="flex items-center justify-center p-8"><Spinner /></div>;
  }

  const statusConfig = getStatusConfig(liveTicket.status);
  const priorityConfig = getPriorityConfig(liveTicket.priority);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to tickets</span>
            </button>
          )}

          {/* Email notification status (no spinner, only badges) */}
          <div className="flex items-center gap-2 text-sm">
            {ticket.emailNotificationStatus === 'sent' ? (
              <div className="flex items-center gap-1 text-green-400">
                <Mail className="w-4 h-4" />
                <span>Email sent</span>
              </div>
            ) : ticket.emailNotificationStatus === 'failed' ? (
              <div className="flex items-center gap-1 text-red-400">
                <MailX className="w-4 h-4" />
                <span>Email failed</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Ticket header info */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${statusConfig.className}`}>
            <StatusIcon className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white mb-2">{liveTicket.subject}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <span className="font-mono text-blue-400">#{liveTicket.id}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created <time dateTime={liveTicket.createdAt}>{new Date(liveTicket.createdAt).toLocaleString()}</time></span>
              </div>
              
              {liveTicket.updatedAt !== liveTicket.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated <time dateTime={liveTicket.updatedAt}>{new Date(liveTicket.updatedAt).toLocaleString()}</time></span>
                </div>
              )}
            </div>

            {/* Status and priority badges */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.className}`}>
                {statusConfig.label}
              </span>
              
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${priorityConfig.className}`}>
                <Flag className="w-4 h-4" />
                {priorityConfig.label} Priority
              </span>
              {(liveTicket.status === 'in_progress') && (
                <button onClick={handleResolve} disabled={resolving} className="ml-4 px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800 transition-colors disabled:opacity-50">{resolving ? 'Resolving...' : 'Resolve'}</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket content */}
      <div className="p-6 space-y-8">
        {/* Original request */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Original Request</h2>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{liveTicket.description}</p>
          </div>

          {/* File attachment */}
          {liveTicket.fileUrl && liveTicket.fileName && (
            <div className="flex items-center gap-2 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">{liveTicket.fileName}</span>
              <a
                href={liveTicket.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          )}
        </div>

        {/* AI Response section */}
        {liveTicket.aiResponse ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">AI Assistant Response</h2>
              {liveTicket.aiResponseGeneratedAt && (
                <span className="text-sm text-gray-500">
                  • <time dateTime={liveTicket.aiResponseGeneratedAt}>{new Date(liveTicket.aiResponseGeneratedAt).toLocaleString()}</time>
                </span>
              )}
            </div>
            
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-700">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {liveTicket.aiResponse}
                </p>
              </div>
            </div>

            {/* Feedback section */}
            <div className="space-y-4">
              {/* Replace the duplicated feedback/resolve section with a single flex row: */}
              <div className="flex items-center justify-between gap-4 mt-6">
                <div className="flex-1">
                  {liveTicket.feedback ? (
                    // Display existing feedback
                    <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 font-medium">Feedback Submitted</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= liveTicket.feedback!.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-400">{liveTicket.feedback.rating}/5 stars</span>
                      </div>
                      {liveTicket.feedback.comment && (
                        <p className="text-green-300 text-sm">"{liveTicket.feedback.comment}"</p>
                      )}
                      <p className="text-xs text-green-400 mt-2">
                        Submitted <time dateTime={liveTicket.feedback.createdAt}>{new Date(liveTicket.feedback.createdAt).toLocaleString()}</time>
                      </p>
                    </div>
                  ) : feedbackSubmitted ? (
                    // Show success message after feedback submission
                    <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">Thank you for your feedback!</span>
                      </div>
                    </div>
                  ) : showFeedbackForm ? (
                    // Feedback form
                    <form onSubmit={handleFeedbackSubmit} className="bg-gray-700 rounded-lg p-4 space-y-4 border border-gray-600">
                      <h3 className="font-medium text-white">Rate this AI response</h3>
                      {/* Star rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackRating(star as 1 | 2 | 3 | 4 | 5)}
                              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${star <= feedbackRating ? 'text-yellow-400 fill-current hover:text-yellow-300' : 'text-gray-500 hover:text-gray-400'}`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-400">{feedbackRating}/5 stars</span>
                        </div>
                      </div>
                      {/* Comment */}
                      <div>
                        <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-300 mb-2">Additional comments (optional)</label>
                        <textarea
                          id="feedback-comment"
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          rows={3}
                          placeholder="How could this response be improved?"
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                          disabled={isSubmittingFeedback}
                        />
                      </div>
                      {/* Submit buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={isSubmittingFeedback}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSubmittingFeedback ? (
                            <>
                              <Spinner size="sm" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Feedback
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowFeedbackForm(false)}
                          disabled={isSubmittingFeedback}
                          className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Feedback: thumbs up/down buttons
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Was this response helpful?</span>
                      <button
                        onClick={() => setShowFeedbackForm(true)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-green-900/50 text-green-300 rounded-lg hover:bg-green-900/70 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                        aria-label="Provide feedback on this response"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Give Feedback
                      </button>
                    </div>
                  )}
                </div>
                {liveTicket.status === 'in_progress' && (
                  <button
                    className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={async () => {
                      await updateTicketStatus(liveTicket.id, 'resolved');
                      const updated = await getTicketById(liveTicket.id);
                      if (updated) setLiveTicket(updated);
                      if (updated && onTicketUpdate) onTicketUpdate(updated);
                    }}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // RAG integration: display loading spinner until AI response arrives
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">AI Assistant Response</h2>
            </div>
            
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-700">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                <span className="text-purple-300">AI is analyzing your request and generating a response...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}