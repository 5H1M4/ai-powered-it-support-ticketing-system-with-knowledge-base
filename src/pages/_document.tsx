/**
 * Custom Document component for Next.js
 * Purpose: Define the HTML document structure and add meta tags
 * Integration:
 *   - SEO optimization for the ticketing system
 *   - Proper meta tags for social sharing
 * Accessibility: Proper lang attribute and viewport settings
 */

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* SEO Meta Tags */}
        <meta name="description" content="AI-powered IT support ticketing system with intelligent response generation and knowledge base integration" />
        <meta name="keywords" content="IT support, ticketing system, AI assistant, help desk, technical support" />
        <meta name="author" content="IT Support Team" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="AI IT Support - Intelligent Ticketing System" />
        <meta property="og:description" content="Get instant AI-powered responses to your IT support requests with our intelligent ticketing system" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AI IT Support" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI IT Support - Intelligent Ticketing System" />
        <meta name="twitter:description" content="Get instant AI-powered responses to your IT support requests" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Font optimization */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-gray-50 font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}