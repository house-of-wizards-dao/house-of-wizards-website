import { z } from 'zod';
import { NextApiRequest } from 'next';
import { logger } from './logger';

/**
 * Advanced validation with security-focused checks
 */

// Common dangerous patterns to detect
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
  /javascript:/gi,                                         // JavaScript protocol
  /vbscript:/gi,                                          // VBScript protocol
  /data:text\/html/gi,                                    // Data URL with HTML
  /on\w+\s*=/gi,                                         // Event handlers
  /<iframe\b[^>]*>/gi,                                    // Iframe tags
  /<object\b[^>]*>/gi,                                    // Object tags
  /<embed\b[^>]*>/gi,                                     // Embed tags
  /<link\b[^>]*>/gi,                                      // Link tags (potentially dangerous)
  /expression\s*\(/gi,                                    // CSS expressions
  /url\s*\(\s*["']?\s*javascript:/gi,                    // CSS with JavaScript
];

const SQL_INJECTION_PATTERNS = [
  /(\b(union|select|insert|update|delete|drop|alter|create|exec|execute)\b)|(-{2}|\/\*|\*\/)/gi,
  /'|(\\x[0-9a-f]{2})+/gi,
  /\b(or|and)\s+\d+\s*=\s*\d+/gi,
];

const XSS_PATTERNS = [
  /<[^>]*(?:javascript|vbscript|onload|onerror|onclick|onmouseover):[^>]*>/gi,
  /\b(?:eval|function|settimeout|setinterval)\s*\(/gi,
];

/**
 * Security-aware string validation
 */
export const secureString = (maxLength: number = 1000) => 
  z.string()
    .max(maxLength, `Text too long (max ${maxLength} characters)`)
    .refine((val) => {
      // Check for XSS patterns
      for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(val)) {
          logger.logSecurityEvent('xss_attempt_detected', 'high', {
            pattern: pattern.source,
            value: val.substring(0, 100) + '...',
          });
          return false;
        }
      }
      return true;
    }, { message: 'Potentially dangerous content detected' })
    .refine((val) => {
      // Check for SQL injection patterns
      for (const pattern of SQL_INJECTION_PATTERNS) {
        if (pattern.test(val)) {
          logger.logSecurityEvent('sql_injection_attempt', 'critical', {
            pattern: pattern.source,
            value: val.substring(0, 100) + '...',
          });
          return false;
        }
      }
      return true;
    }, { message: 'Potentially malicious SQL patterns detected' })
    .transform((val) => val.trim());

/**
 * Secure email validation with additional checks
 */
export const secureEmail = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email too long')
  .refine((email) => {
    // Block temporary/disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !disposableDomains.includes(domain);
  }, { message: 'Temporary email addresses are not allowed' })
  .refine((email) => {
    // Additional format validation
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    
    // Local part checks
    if (local.length > 64 || local.startsWith('.') || local.endsWith('.')) return false;
    if (local.includes('..')) return false;
    
    // Domain checks
    if (domain.length > 253 || domain.startsWith('-') || domain.endsWith('-')) return false;
    
    return true;
  }, { message: 'Invalid email format' })
  .transform((email) => email.toLowerCase());

/**
 * Secure URL validation with protocol restrictions
 */
export const secureUrl = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL too long')
  .refine((url) => {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    return allowedProtocols.includes(parsed.protocol);
  }, { message: 'Only HTTP and HTTPS URLs are allowed' })
  .refine((url) => {
    const parsed = new URL(url);
    // Block private IP ranges and localhost for security
    const hostname = parsed.hostname;
    const privatePatterns = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^localhost$/i,
      /^0\.0\.0\.0$/,
    ];
    
    return !privatePatterns.some(pattern => pattern.test(hostname));
  }, { message: 'Private and local URLs are not allowed' });

/**
 * Secure file validation
 */
export const secureFile = z.object({
  name: z.string()
    .min(1, 'File name required')
    .max(255, 'File name too long')
    .refine((name) => {
      // Check for directory traversal
      if (name.includes('..') || name.includes('/') || name.includes('\\')) {
        return false;
      }
      // Check for dangerous extensions
      const dangerousExts = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar'];
      const ext = name.toLowerCase().substring(name.lastIndexOf('.'));
      return !dangerousExts.includes(ext);
    }, { message: 'Invalid or dangerous file name' }),
  
  type: z.string().refine((type) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm',
      'audio/mp3', 'audio/wav', 'audio/ogg',
      'application/pdf', 'text/plain'
    ];
    return allowedTypes.includes(type);
  }, { message: 'File type not allowed' }),
  
  size: z.number()
    .min(1, 'File cannot be empty')
    .max(10 * 1024 * 1024, 'File too large (max 10MB)'), // 10MB limit
});

/**
 * Rate limiting aware validation
 */
export class SecurityValidator {
  private suspiciousActivity = new Map<string, number>();
  private readonly SUSPICIOUS_THRESHOLD = 5;
  private readonly RESET_INTERVAL = 60000; // 1 minute

  constructor() {
    // Clean suspicious activity map every minute
    setInterval(() => {
      this.suspiciousActivity.clear();
    }, this.RESET_INTERVAL);
  }

  /**
   * Validate request with security monitoring
   */
  validateRequest(req: NextApiRequest, schema: z.ZodSchema): any {
    const clientIP = this.getClientIP(req);
    
    try {
      const result = schema.parse(req.body);
      
      // Reset suspicious activity on successful validation
      this.suspiciousActivity.delete(clientIP);
      
      return result;
    } catch (error) {
      // Track failed validations
      const count = (this.suspiciousActivity.get(clientIP) || 0) + 1;
      this.suspiciousActivity.set(clientIP, count);
      
      if (count >= this.SUSPICIOUS_THRESHOLD) {
        logger.logSecurityEvent('suspicious_validation_failures', 'high', {
          ip: clientIP,
          failureCount: count,
          userAgent: req.headers['user-agent'],
          endpoint: req.url,
        });
      }
      
      throw error;
    }
  }

  /**
   * Check if IP has suspicious activity
   */
  isSuspicious(req: NextApiRequest): boolean {
    const clientIP = this.getClientIP(req);
    return (this.suspiciousActivity.get(clientIP) || 0) >= this.SUSPICIOUS_THRESHOLD;
  }

  private getClientIP(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded
      ? Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]
      : req.socket?.remoteAddress;
    return ip || 'unknown';
  }
}

/**
 * Enhanced validation schemas with security
 */
export const secureSchemas = {
  profileUpdate: z.object({
    name: secureString(100).optional(),
    description: secureString(500).optional(),
    twitter: secureString(50).regex(/^[a-zA-Z0-9_]{1,15}$/, 'Invalid Twitter handle').optional(),
    discord: secureString(50).optional(),
    website: secureUrl.optional(),
    avatar_url: secureUrl.optional(),
  }).refine(
    (data) => Object.keys(data).some(key => data[key as keyof typeof data] !== undefined),
    { message: 'At least one field must be provided for update' }
  ),

  userSignup: z.object({
    email: secureEmail,
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
             'Password must contain uppercase, lowercase, number, and special character'),
    name: secureString(100),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),

  fileUpload: z.object({
    file: secureFile,
    description: secureString(500).optional(),
  }),

  contentSearch: z.object({
    query: secureString(200),
    filters: z.record(secureString(100)).optional(),
    page: z.coerce.number().min(1).max(1000).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
};

// Singleton instance
export const securityValidator = new SecurityValidator();