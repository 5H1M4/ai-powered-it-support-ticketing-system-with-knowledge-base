/**
 * Component: DashboardStats
 * Purpose: Display key statistics and metrics for the ticketing system
 * Integration:
 *   - API calls: `/utils/api.ts` getTicketStats function
 *   - Real-time updates of ticket metrics
 * Styling: Tailwind CSS with dark theme; responsive grid layout
 * Accessibility: Proper semantic structure and screen reader support
 */

import { useEffect, useState } from 'react';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  PlayCircle} from 'lucide-react';
import { TicketStats } from '../types';
import { getTicketStats } from '../utils/api';


export default function DashboardStats() {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getTicketStats()
      .then(data => {
        if (mounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message || 'Failed to load stats');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats?.total,
      icon: Ticket,
      color: 'text-blue-400 bg-blue-900/50',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Open Tickets',
      value: stats?.open,
      icon: Clock,
      color: 'text-amber-400 bg-amber-900/50',
      change: '-5%',
      changeType: 'positive' as const
    },
    {
      title: 'In Progress',
      value: stats?.inProgress,
      icon: PlayCircle,
      color: 'text-orange-400 bg-orange-900/50',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Resolved',
      value: stats?.closed,
      icon: CheckCircle,
      color: 'text-green-400 bg-green-900/50',
      change: '+15%',
      changeType: 'positive' as const
    },
    // {
    //   title: 'AI Responses',
    //   value: stats?.aiResponses,
    //   icon: Bot,
    //   color: 'text-purple-400 bg-purple-900/50',
    //   change: '+22%',
    //   changeType: 'positive' as const
    // },
    // {
    //   title: 'Avg Response Time',
    //   value: stats?.avgResponseTime,
    //   icon: TrendingUp,
    //   color: 'text-cyan-400 bg-cyan-900/50',
    //   change: '-30%',
    //   changeType: 'positive' as const
    // },
    // {
    //   title: 'Satisfaction Rate',
    //   value: `${stats?.satisfactionRate}/5`,
    //   icon: Star,
    //   color: 'text-yellow-400 bg-yellow-900/50',
    //   change: '+0.3',
    //   changeType: 'positive' as const
    // },
    // {
    //   title: 'Resolution Rate',
    //   value: '94%',
    //   icon: MessageSquare,
    //   color: 'text-emerald-400 bg-emerald-900/50',
    //   change: '+2%',
    //   changeType: 'positive' as const
    // }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
              <div className="w-12 h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="w-16 h-8 bg-gray-700 rounded mb-1"></div>
            <div className="w-20 h-4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-3 bg-red-900/70 text-red-300 rounded-lg text-center font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              {/* Removed percentage label */}
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            
            <div className="text-sm text-gray-400">
              {stat.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}