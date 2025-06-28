/**
 * Component: Home Page
 * Purpose: Main landing page with ticket creation form and feature showcase
 * Integration:
 *   - API calls: Uses TicketForm component which calls `/utils/api.ts`
 *   - Email notifications sent automatically after ticket creation
 * Styling: Tailwind CSS with dark theme; responsive design with proper spacing
 * Accessibility: Semantic HTML structure with proper heading hierarchy
 */

import React, { useState } from 'react';
import { Bot, Headphones, Zap, Shield, ArrowRight, Plus, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TicketForm from '../components/TicketForm';

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);

  // Feature highlights for the landing section
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Responses',
      description: 'Get instant, intelligent answers using advanced RAG technology and our comprehensive knowledge base'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Most common issues are resolved immediately with AI-generated solutions in under 2 minutes'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Your data is protected with enterprise-grade security, encryption, and privacy controls'
    },
    {
      icon: Headphones,
      title: '24/7 Availability',
      description: 'AI assistant is always available, with seamless human escalation when complex issues arise'
    }
  ];

  const handleTicketSuccess = (ticketId: string) => {
    // Show success message and optionally redirect
    setTimeout(() => {
      setShowForm(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI IT Support</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#stats" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showForm ? (
          // Landing section
          <div className="text-center mb-12">
            <div className="max-w-4xl mx-auto">
              {/* Hero section */}
              <div className="mb-16">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Get Instant IT Support with
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 block mt-2">
                    AI-Powered Intelligence
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  Submit your IT support request and receive intelligent, personalized responses 
                  powered by advanced AI and our comprehensive knowledge base. Experience the future of IT support.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all shadow-lg transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Create Support Ticket
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-gray-500 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
                  >
                    <BarChart3 className="w-5 h-5" />
                    View Dashboard
                  </Link>
                </div>
              </div>

              {/* Features grid */}
              <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Stats section */}
              <div id="stats" className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-8 mb-16">
                <h2 className="text-2xl font-bold text-white mb-8">Trusted by IT Teams Worldwide</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
                    <div className="text-gray-400">Issues Resolved by AI</div>
                    <div className="text-sm text-green-400 mt-1">↑ 12% this month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">&lt;2min</div>
                    <div className="text-gray-400">Average Response Time</div>
                    <div className="text-sm text-green-400 mt-1">↓ 30% faster</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                    <div className="text-gray-400">Always Available</div>
                    <div className="text-sm text-blue-400 mt-1">100% uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">4.8/5</div>
                    <div className="text-gray-400">User Satisfaction</div>
                    <div className="text-sm text-green-400 mt-1">↑ 0.3 this quarter</div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 border border-blue-700/50">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Transform Your IT Support?</h2>
                <p className="text-gray-300 mb-6">Join thousands of organizations already using AI-powered IT support</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Ticket form section
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to home
              </button>
            </div>
            
            <TicketForm onSuccess={handleTicketSuccess} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white">AI IT Support</span>
            </div>
            
            <div className="text-sm text-gray-400">
              © 2024 AI IT Support. Powered by advanced AI and machine learning.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}