/**
 * API utility functions for the ticketing system
 * Purpose: Handle all API communications with the backend
 * Integration:
 *   - Used by components to interact with the backend
 *   - Handles ticket creation, fetching, and feedback submission
 *   - Mock implementation for demo purposes with realistic data
 */

import { Ticket, CreateTicketData, Feedback, ApiResponse, TicketStats } from '../types';

// Enhanced mock data for demonstration
const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'VPN Connection Issues - Unable to Access Company Network',
    description: 'I\'ve been experiencing persistent VPN connection timeouts when trying to connect to the company network. The connection drops every 10-15 minutes, and I get error code 809. I\'ve tried restarting the VPN client and my computer, but the issue persists. This is affecting my ability to access internal resources and work remotely.',
    status: 'open',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    aiResponse: 'I\'ve analyzed your VPN connectivity issue and identified several potential solutions based on error code 809 and the symptoms you\'ve described.\n\n**Immediate Steps to Try:**\n\n1. **Check Firewall Settings**: Error 809 often indicates firewall blocking. Temporarily disable Windows Firewall and any third-party antivirus firewalls to test.\n\n2. **Registry Fix for Windows**: Open Registry Editor and navigate to:\n   `HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\PolicyAgent`\n   Create a new DWORD value named "AssumeUDPEncapsulationContextOnSendRule" and set it to 2.\n\n3. **Router Configuration**: If you\'re behind a NAT router, enable IPSec passthrough and PPTP passthrough in your router settings.\n\n4. **Alternative Connection Method**: Try connecting using IKEv2 instead of L2TP/IPSec if available in your VPN client.\n\n**Network Diagnostics:**\n- Run `ipconfig /flushdns` to clear DNS cache\n- Test with different DNS servers (8.8.8.8, 1.1.1.1)\n- Check if the issue occurs on different networks (mobile hotspot test)\n\n**If Issue Persists:**\nI\'ve escalated this to our network team for server-side investigation. They\'ll check VPN server logs and capacity. You should receive an update within 2 hours.\n\nWould you like me to schedule a remote session to help implement these fixes?',
    aiResponseGeneratedAt: '2024-01-15T10:32:00Z',
    emailNotificationSent: true,
    emailNotificationStatus: 'sent'
  },
  {
    id: 'TKT-002',
    subject: 'Conference Room A Printer Offline - HP LaserJet Pro',
    description: 'The HP LaserJet Pro printer in Conference Room A shows as offline on all computers. Print jobs are queuing but not processing. The printer display shows "Ready" but network connectivity seems to be the issue. Multiple users have reported this problem since this morning.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
    aiResponse: 'I\'ve diagnosed this as a network connectivity issue with the HP LaserJet Pro. Here\'s my comprehensive troubleshooting plan:\n\n**Current Status**: The printer shows "Ready" locally but isn\'t communicating with the network properly.\n\n**Immediate Actions Taken:**\n✅ Verified printer power and local status\n✅ Checked network cable connections\n✅ Pinged printer IP address (192.168.1.45) - No response\n\n**Resolution Steps:**\n\n1. **Network Reset**: I\'ve remotely reset the printer\'s network settings and reconfigured the IP address.\n\n2. **Driver Update**: Pushed updated HP Universal Print Driver to all affected workstations.\n\n3. **Print Spooler Service**: Restarted print spooler service on the print server.\n\n**Current Progress**: \n- Network connectivity restored ✅\n- Test print successful ✅\n- Monitoring for stability\n\n**Next Steps**: \nOur hardware technician will perform a physical inspection at 2:00 PM today to ensure all connections are secure and check for any hardware issues.\n\n**Temporary Workaround**: Users can print to Conference Room B printer (same model) if needed urgently.',
    aiResponseGeneratedAt: '2024-01-15T09:18:00Z',
    feedback: {
      id: 'f1',
      ticketId: 'TKT-002',
      rating: 4,
      comment: 'Great detailed response! The temporary workaround was especially helpful. Could have included more specific IP configuration details.',
      createdAt: '2024-01-15T12:00:00Z'
    },
    emailNotificationSent: true,
    emailNotificationStatus: 'sent'
  },
  {
    id: 'TKT-003',
    subject: 'Adobe Creative Suite Installation Request - Design Team',
    description: 'I need Adobe Creative Suite (Photoshop, Illustrator, InDesign) installed on my workstation for upcoming marketing campaigns. My current license expired and I need the latest version with team collaboration features.',
    status: 'closed',
    priority: 'low',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    aiResponse: 'Your Adobe Creative Suite installation request has been processed successfully! Here\'s the complete breakdown:\n\n**License Information:**\n- Adobe Creative Cloud for Teams license allocated\n- Includes: Photoshop, Illustrator, InDesign, Acrobat Pro\n- 100GB cloud storage included\n- Team collaboration features enabled\n\n**Installation Details:**\n✅ Software downloaded and installed remotely\n✅ License activated and verified\n✅ Team library access configured\n✅ Cloud sync enabled\n\n**What\'s Included:**\n- Latest 2024 versions of all applications\n- Premium fonts and stock assets\n- Adobe Express and mobile apps\n- Team collaboration workspace\n\n**Getting Started:**\n1. Launch any Adobe app and sign in with your company email\n2. Access team assets via Creative Cloud Libraries\n3. Training materials sent to your email\n4. Quick start guide available on company intranet\n\n**Support Resources:**\n- Adobe certification courses available\n- Internal design team Slack channel: #creative-suite\n- Video tutorials: company.sharepoint.com/adobe-training\n\n**License Management:**\nYour license is set to auto-renew annually. Contact IT if you need additional seats for temporary projects.\n\nEverything is ready to go! Let me know if you need any assistance with the initial setup.',
    aiResponseGeneratedAt: '2024-01-14T14:25:00Z',
    feedback: {
      id: 'f2',
      ticketId: 'TKT-003',
      rating: 5,
      comment: 'Perfect! Exactly what I needed. The training resources were a nice touch.',
      createdAt: '2024-01-15T08:35:00Z'
    },
    emailNotificationSent: true,
    emailNotificationStatus: 'sent'
  },
  {
    id: 'TKT-004',
    subject: 'Email Sync Issues - Outlook Not Receiving New Messages',
    description: 'My Outlook isn\'t syncing properly. I\'m not receiving new emails, and sent items aren\'t showing up. The last sync was 3 hours ago. I can access email through webmail fine, so it seems to be an Outlook-specific issue.',
    status: 'awaiting_info',
    priority: 'medium',
    createdAt: '2024-01-15T13:45:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    aiResponse: 'I\'ve identified this as an Outlook synchronization issue. Since webmail works fine, this is likely a client-side configuration problem.\n\n**Diagnostic Results:**\n- Exchange server connectivity: ✅ Normal\n- Account authentication: ✅ Valid\n- Mailbox quota: ✅ 2.3GB used of 50GB\n- Last successful sync: 3 hours 23 minutes ago\n\n**Troubleshooting Steps Completed:**\n1. ✅ Forced manual sync - No errors reported\n2. ✅ Checked Outlook connectivity status\n3. ✅ Verified account settings\n4. ✅ Cleared Outlook cache\n\n**Current Status**: Sync appears to be working now, but I need additional information to prevent recurrence.\n\n**Information Needed:**\n- Are you using any VPN software that might be interfering?\n- Have you installed any new security software recently?\n- What\'s your current Outlook version? (File > Office Account)\n- Are you experiencing this on multiple devices or just this computer?\n\n**Temporary Monitoring:**\nI\'ve enabled enhanced logging for your account to track sync patterns over the next 24 hours.\n\n**Immediate Workaround:**\nIf sync stops again, try:\n1. File > Account Settings > Account Settings\n2. Select your email account > Change\n3. Click "More Settings" > Advanced tab\n4. Uncheck "Use Cached Exchange Mode" temporarily\n\nPlease provide the requested information so I can implement a permanent fix.',
    aiResponseGeneratedAt: '2024-01-15T14:22:00Z',
    emailNotificationSent: true,
    emailNotificationStatus: 'sent'
  },
  {
    id: 'TKT-005',
    subject: 'Slow Computer Performance - Development Workstation',
    description: 'My development workstation has become extremely slow over the past week. Applications take forever to load, and compiling code that used to take 2 minutes now takes 15+ minutes. I\'ve noticed high CPU usage even when idle.',
    status: 'open',
    priority: 'high',
    createdAt: '2024-01-15T16:10:00Z',
    updatedAt: '2024-01-15T16:10:00Z',
    emailNotificationSent: false,
    emailNotificationStatus: 'pending'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a new IT support ticket
 * Integration: Called from TicketForm component on form submission
 */
export async function createTicket(data: CreateTicketData): Promise<ApiResponse<{ ticketId: string }>> {
  await delay(1500); // Simulate API call

  try {
    const newTicket: Ticket = {
      id: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      emailNotificationSent: false,
      emailNotificationStatus: 'pending'
    };

    mockTickets.unshift(newTicket);

    // Simulate AI response generation after a short delay
    setTimeout(async () => {
      const aiResponse = generateMockAIResponse(data.subject, data.description);
      newTicket.aiResponse = aiResponse;
      newTicket.aiResponseGeneratedAt = new Date().toISOString();
      newTicket.emailNotificationSent = true;
      newTicket.emailNotificationStatus = 'sent';
    }, 3000);

    return {
      success: true,
      data: { ticketId: newTicket.id },
      message: 'Ticket created successfully! AI is analyzing your request and will provide a response shortly.'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create ticket. Please try again.'
    };
  }
}

/**
 * Fetch all tickets from the system
 * Integration: Used by dashboard and ticket list components
 */
export async function fetchTickets(): Promise<ApiResponse<Ticket[]>> {
  await delay(800); // Simulate API call

  try {
    // Sort by creation date (newest first)
    const sortedTickets = [...mockTickets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      success: true,
      data: sortedTickets
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch tickets. Please try again.'
    };
  }
}

/**
 * Get ticket statistics for dashboard
 */
export async function getTicketStats(): Promise<ApiResponse<TicketStats>> {
  await delay(500);

  try {
    const stats: TicketStats = {
      total: mockTickets.length,
      open: mockTickets.filter(t => t.status === 'open').length,
      inProgress: mockTickets.filter(t => t.status === 'in_progress').length,
      closed: mockTickets.filter(t => t.status === 'closed').length,
      aiResponses: mockTickets.filter(t => t.aiResponse).length,
      avgResponseTime: '< 2 min',
      satisfactionRate: 4.2
    };

    return {
      success: true,
      data: stats
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch statistics'
    };
  }
}

/**
 * Submit feedback for an AI-generated response
 * Integration: Called from TicketDetail component when user provides feedback
 */
export async function submitFeedback(
  ticketId: string, 
  feedback: { rating: 1 | 2 | 3 | 4 | 5; comment?: string }
): Promise<ApiResponse<void>> {
  await delay(500); // Simulate API call

  try {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) {
      return {
        success: false,
        error: 'Ticket not found'
      };
    }

    ticket.feedback = {
      id: `feedback_${Date.now()}`,
      ticketId,
      rating: feedback.rating,
      comment: feedback.comment,
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      message: 'Thank you for your feedback! This helps us improve our AI responses.'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to submit feedback. Please try again.'
    };
  }
}

/**
 * Generate mock AI response based on ticket content
 * This simulates the RAG (Retrieval Augmented Generation) process
 */
function generateMockAIResponse(subject: string, description: string): string {
  const responses = [
    `I've analyzed your request regarding "${subject}" and cross-referenced it with our knowledge base and best practices.\n\n**Initial Assessment:**\nBased on the symptoms you've described, this appears to be a common issue with several potential solutions.\n\n**Recommended Actions:**\n1. **Immediate Steps**: Let's start with the most likely fixes based on similar cases\n2. **Diagnostic Phase**: I'll run some automated checks on our systems\n3. **Resolution Path**: Apply the appropriate solution based on findings\n4. **Follow-up**: Monitor the situation to ensure stability\n\n**Knowledge Base Match**: Found 3 similar cases with 95% resolution rate using these methods.\n\n**Next Steps:**\nI'm escalating this to the appropriate technical team for hands-on assistance. You'll receive updates via email as we progress.\n\n**Estimated Resolution Time**: Based on similar tickets, this should be resolved within 4-6 hours.\n\nIs there any additional information you can provide that might help with the diagnosis?`,

    `Thank you for submitting this support request. I've processed your issue through our AI diagnostic system and found several relevant solutions.\n\n**Problem Analysis:**\n- Issue category identified from description patterns\n- Cross-referenced with internal documentation\n- Matched against recent similar cases\n- Applied machine learning insights from previous resolutions\n\n**Recommended Solution Path:**\n\n**Phase 1 - Quick Fixes:**\n• Standard troubleshooting procedures\n• Configuration verification\n• System status checks\n\n**Phase 2 - Advanced Diagnostics:**\n• Deep system analysis if Phase 1 doesn't resolve\n• Log file examination\n• Network connectivity tests\n\n**Phase 3 - Escalation (if needed):**\n• Specialist team involvement\n• Hardware inspection\n• Custom solution development\n\n**Confidence Level**: 87% that this will be resolved in Phase 1 or 2.\n\n**Monitoring**: I'll track this ticket and provide proactive updates. Our system will automatically notify you of any changes or required actions.\n\nA technician will be in touch within the next 2 hours to begin implementation.`,

    `I've completed the initial analysis of your support request and have good news - this issue has a high probability of quick resolution.\n\n**AI Diagnostic Summary:**\n✅ Issue pattern recognized (98% confidence)\n✅ Solution pathway identified\n✅ Required resources confirmed available\n✅ Estimated impact: Low to Medium\n\n**Root Cause Analysis:**\nBased on the description and our knowledge base, this appears to be related to:\n- Configuration drift from recent updates\n- User permission changes\n- Network policy modifications\n- Software compatibility issues\n\n**Automated Actions Initiated:**\n1. System health check completed\n2. Configuration backup created\n3. Diagnostic logs collected\n4. Preliminary fixes applied where safe\n\n**Human Intervention Required:**\nWhile I've handled the initial diagnostics, a technician will need to:\n- Verify the automated fixes\n- Apply any manual configurations\n- Test the solution thoroughly\n- Document the resolution for future reference\n\n**Timeline Expectation:**\n- Technician assignment: Within 1 hour\n- Initial contact: Within 2 hours  \n- Resolution target: Same business day\n\n**Your Reference Number**: Use ticket ID ${subject.includes('TKT-') ? subject.match(/TKT-\d+/)?.[0] : 'TKT-NEW'} for all communications.\n\nI'll continue monitoring this ticket and will notify you immediately when there are updates.`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Get ticket by ID
 * Integration: Used by TicketDetail component
 */
export async function getTicketById(ticketId: string): Promise<ApiResponse<Ticket>> {
  await delay(300);

  try {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) {
      return {
        success: false,
        error: 'Ticket not found'
      };
    }

    return {
      success: true,
      data: ticket
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch ticket details'
    };
  }
}

/**
 * Update ticket status
 * Integration: Used by admin/technician interfaces
 */
export async function updateTicketStatus(
  ticketId: string, 
  status: Ticket['status']
): Promise<ApiResponse<void>> {
  await delay(400);

  try {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) {
      return {
        success: false,
        error: 'Ticket not found'
      };
    }

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: 'Ticket status updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update ticket status'
    };
  }
}