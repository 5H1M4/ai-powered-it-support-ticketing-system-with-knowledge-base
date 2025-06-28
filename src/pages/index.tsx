/**
 * Component: Home Page
 * Purpose: Main landing page with ticket creation form
 * Integration:
 *   - API calls: Uses TicketForm component which calls `/utils/api.ts`
 *   - Email notifications sent automatically after ticket creation
 * Styling: Tailwind CSS; responsive design with proper spacing
 * Accessibility: Semantic HTML structure with proper heading hierarchy
 */

import React, { useState } from 'react';
import { Bot, Headphones, Zap, Shield, ArrowRight } from 'lucide-react';
import TicketForm from '../components/TicketForm';

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);

  // Feature highlights for the landing section
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Responses',
      description: 'Get instant, intelligent answers using advanced RAG technology and our knowledge base'
    },
    {
      icon: Zap,
      title: 'Fast Resolution',
      description: 'Most common issues are resolved immediately with AI-generated solutions'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'AI assistant is always available, with human escalation when needed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI IT Support</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Knowledge Base
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showForm ? (
          // Landing section
          <div className="text-center mb-12">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Get Instant IT Support with
                <span className="text-blue-600 block mt-2">AI-Powered Assistance</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Submit your IT support request and receive intelligent, personalized responses 
                powered by advanced AI and our comprehensive knowledge base.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-lg"
                >
                  Create Support Ticket
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  View Dashboard
                </a>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Stats section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                    <div className="text-gray-600">Issues Resolved by AI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">&lt;30s</div>
                    <div className="text-gray-600">Average Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-gray-600">Always Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Ticket form section
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to home
              </button>
            </div>
            
            <TicketForm />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">AI IT Support</span>
            </div>
            
            <div className="text-sm text-gray-600">
              © 2024 AI IT Support. Powered by advanced AI and machine learning.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}