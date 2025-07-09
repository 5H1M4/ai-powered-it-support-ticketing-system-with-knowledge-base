/**
 * Component: TicketForm
 * Purpose: Form component for creating new IT support tickets with dark theme
 * Integration:
 *   - API calls: `/utils/api.ts` createTicket function
 *   - RAG data processed after ticket creation
 *   - Email notifications sent automatically backend-side
 * Styling: Tailwind CSS with dark theme; responsive breakpoints
 * Accessibility: aria-labels and proper form semantics
 */

import React, { useState } from 'react';
import { Send, Upload, CheckCircle, AlertCircle, FileText, X } from 'lucide-react';
import { CreateTicketData } from '../types';
import Spinner from './Spinner';

interface TicketFormProps {
  onSuccess?: (ticketId: string) => void;
}

// Add the webhook helper function
const N8N_WEBHOOK_URL = 'https://shima123.app.n8n.cloud/webhook-test/new-ticket';

async function createTicket(data: CreateTicketData) {
  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Webhook failed: ${res.statusText}`);
  }
  return res.json();
}

export default function TicketForm({ onSuccess }: TicketFormProps) {
  // Form state management
  const [formData, setFormData] = useState<CreateTicketData & { email: string }>({
    subject: '',
    description: '',
    priority: 'medium',
    email: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Add email validation state
  const [emailError, setEmailError] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'email') {
      setEmailError(null); // Reset error on change
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      // In a real app, you would upload the file to cloud storage here
      setFormData(prev => ({
        ...prev,
        fileUrl: `https://example.com/uploads/${file.name}`,
        fileName: file.name
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.subject.trim() || !formData.description.trim() || !formData.email.trim()) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields.');
      return;
    }
    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setEmailError('Please enter a valid email address.');
      setSubmitStatus('error');
      setSubmitMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // API call: Create new ticket (include email)
      const { email, ...rest } = formData;
      const response = await createTicket({ ...rest, email });
      
      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage(response.message || 'Ticket created successfully!');
        
        // Reset form after successful submission
        setFormData({
          subject: '',
          description: '',
          priority: 'medium',
          email: ''
        });
        setSelectedFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Call success callback
        if (onSuccess && response.data) {
          onSuccess(response.data.ticketId);
        }
        
      } else {
        setSubmitStatus('error');
        setSubmitMessage(response.error || 'Failed to create ticket.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({
      ...prev,
      fileUrl: undefined,
      fileName: undefined
    }));
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 md:p-8">
      {/* Form header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create Support Ticket</h2>
        <p className="text-gray-400">Describe your IT issue and get AI-powered assistance within minutes</p>
      </div>

      {/* Success/Error message display */}
      {submitStatus !== 'idle' && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          submitStatus === 'success' 
            ? 'bg-green-900/50 border border-green-700' 
            : 'bg-red-900/50 border border-red-700'
        }`}>
          {submitStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className={`font-medium ${
              submitStatus === 'success' ? 'text-green-300' : 'text-red-300'
            }`}>
              {submitStatus === 'success' ? 'Success!' : 'Error'}
            </p>
            <p className={`text-sm ${
              submitStatus === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {submitMessage}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form field: Email input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            disabled={isSubmitting}
            className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-800 disabled:text-gray-500 text-white placeholder-gray-400${emailError ? ' border-red-500' : ''}`}
            aria-describedby="email-help"
            required
          />
          <p id="email-help" className="mt-1 text-sm text-gray-500">
            We'll send ticket updates to this address
          </p>
          {emailError && <p className="text-sm text-red-400 mt-1">{emailError}</p>}
        </div>

        {/* Form field: Subject input */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
            Subject <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Brief description of your issue"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-800 disabled:text-gray-500 text-white placeholder-gray-400"
            aria-describedby="subject-help"
          />
          <p id="subject-help" className="mt-1 text-sm text-gray-500">
            Keep it concise and descriptive
          </p>
        </div>

        {/* Form field: Priority selection */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
            Priority Level
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-800 disabled:text-gray-500 text-white"
          >
            <option value="low">Low - General inquiry</option>
            <option value="medium">Medium - Standard issue</option>
            <option value="high">High - Impacts productivity</option>
            <option value="urgent">Urgent - Critical system down</option>
          </select>
        </div>

        {/* Form field: Description textarea */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            placeholder="Provide detailed information about your issue, including any error messages, steps you've already tried, and when the problem started..."
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-800 disabled:text-gray-500 text-white placeholder-gray-400 resize-y"
            aria-describedby="description-help"
          />
          <p id="description-help" className="mt-1 text-sm text-gray-500">
            The more details you provide, the better our AI can assist you
          </p>
        </div>

        {/* Form field: File upload (optional) */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
            Attach File (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-gray-500 transition-colors bg-gray-700/50">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF, DOC up to 10MB
              </p>
            </div>
          </div>

          {/* Display selected file */}
          {selectedFile && (
            <div className="mt-3 flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                Creating Ticket...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Create Ticket
              </>
            )}
          </button>
        </div>
      </form>

      {/* Email notification info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          You'll receive email notifications when your ticket is updated with AI responses
        </p>
      </div>
    </div>
  );
}