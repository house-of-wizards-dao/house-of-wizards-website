import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Basic input sanitization utilities
 */

// HTML entities to escape
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape HTML characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize string input by trimming and escaping HTML
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return escapeHtml(input.trim()).slice(0, maxLength);
}

/**
 * Sanitize email format
 */
export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeString(email, 254); // RFC 5321 limit
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized.toLowerCase();
}

/**
 * Sanitize URL format
 */
export function sanitizeUrl(url: string): string {
  const sanitized = sanitizeString(url, 2048);
  
  if (!sanitized) return '';
  
  // Allow relative URLs or URLs with http/https protocol
  const urlRegex = /^(https?:\/\/|\/)[^\s<>'"]*$/i;
  
  if (!urlRegex.test(sanitized)) {
    throw new Error('Invalid URL format');
  }
  
  return sanitized;
}

/**
 * Sanitize social media username
 */
export function sanitizeUsername(username: string): string {
  const sanitized = sanitizeString(username, 50);
  
  if (!sanitized) return '';
  
  // Allow alphanumeric, underscore, dash, and period
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  
  if (!usernameRegex.test(sanitized)) {
    throw new Error('Invalid username format');
  }
  
  return sanitized;
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  const sanitized = sanitizeString(fileName, 255);
  
  if (!sanitized) {
    throw new Error('File name cannot be empty');
  }
  
  // Remove potentially dangerous characters
  const safeName = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Prevent directory traversal
  if (safeName.includes('..') || safeName.startsWith('.')) {
    throw new Error('Invalid file name');
  }
  
  return safeName;
}

/**
 * Validate and sanitize file upload
 */
export function validateFileUpload(file: File, allowedTypes: string[], maxSize: number): void {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize} bytes`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }
  
  sanitizeFileName(file.name);
}

/**
 * Rate limiting store (in-memory for demo - use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiting
 */
export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): void {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return;
  }
  
  if (userLimit.count >= maxRequests) {
    throw new Error('Rate limit exceeded');
  }
  
  userLimit.count++;
}

/**
 * Middleware to sanitize request body
 */
export function sanitizeRequestBody(allowedFields: string[]) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
      }
      
      const sanitizedBody: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          const value = req.body[field];
          
          if (typeof value === 'string') {
            sanitizedBody[field] = sanitizeString(value);
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            sanitizedBody[field] = value;
          } else {
            return res.status(400).json({ 
              error: `Invalid data type for field: ${field}` 
            });
          }
        }
      }
      
      req.body = sanitizedBody;
      next();
    } catch (error) {
      return res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Validation failed' 
      });
    }
  };
}

/**
 * Comprehensive input validation for common use cases
 */
export const validators = {
  profileUpdate: {
    name: (value: string) => sanitizeString(value, 100),
    description: (value: string) => sanitizeString(value, 500),
    twitter: (value: string) => value ? sanitizeUsername(value) : '',
    discord: (value: string) => value ? sanitizeUsername(value) : '',
    website: (value: string) => value ? sanitizeUrl(value) : '',
  },
  
  fileDescription: {
    description: (value: string) => sanitizeString(value, 300),
    file_type: (value: string) => sanitizeString(value, 50),
  },
  
  auth: {
    email: (value: string) => sanitizeEmail(value),
    name: (value: string) => sanitizeString(value, 100),
    password: (value: string) => {
      if (typeof value !== 'string' || value.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      return value; // Don't sanitize passwords, just validate
    },
  },
};