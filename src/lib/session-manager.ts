import { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from './supabase';
import { logger } from './logger';
import { authenticateRequest, AuthenticatedUser } from './auth';

export interface SessionData {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  last_activity: string;
}

export interface SessionValidationResult {
  isValid: boolean;
  session?: SessionData;
  reason?: string;
}

export class SessionManager {
  private supabase = getServiceSupabase();
  private readonly SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
  private readonly ACTIVITY_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

  /**
   * Create a new session after successful authentication
   */
  async createSession(
    userId: string, 
    req: NextApiRequest
  ): Promise<SessionData> {
    const sessionData = {
      id: crypto.randomUUID(),
      user_id: userId,
      ip_address: this.getClientIP(req),
      user_agent: req.headers['user-agent'] || 'unknown',
      expires_at: new Date(Date.now() + this.SESSION_DURATION).toISOString(),
      is_active: true,
    };

    const { data, error } = await this.supabase
      .from('user_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) {
      logger.error('Failed to create session', { error, userId });
      throw new Error('Session creation failed');
    }

    logger.logAuth('session_created', userId, true, {
      sessionId: data.id,
      ip: sessionData.ip_address,
      userAgent: sessionData.user_agent,
    });

    return data;
  }

  /**
   * Validate existing session and update last activity
   */
  async validateSession(
    sessionId: string, 
    req: NextApiRequest
  ): Promise<SessionValidationResult> {
    try {
      const { data: session, error } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('is_active', true)
        .single();

      if (error || !session) {
        return { isValid: false, reason: 'Session not found' };
      }

      // Check expiration
      if (new Date(session.expires_at) < new Date()) {
        await this.invalidateSession(sessionId, 'expired');
        return { isValid: false, reason: 'Session expired' };
      }

      // Validate IP address for security
      const currentIP = this.getClientIP(req);
      if (session.ip_address !== currentIP) {
        logger.logSecurityEvent('session_ip_mismatch', 'medium', {
          sessionId,
          originalIP: session.ip_address,
          currentIP,
          userId: session.user_id,
        });
        
        // Don't immediately invalidate - could be legitimate (mobile/wifi change)
        // But log for monitoring
      }

      // Update last activity if enough time has passed
      const lastActivity = new Date(session.updated_at || session.created_at);
      const now = new Date();
      
      if (now.getTime() - lastActivity.getTime() > this.ACTIVITY_UPDATE_INTERVAL) {
        await this.supabase
          .from('user_sessions')
          .update({ 
            updated_at: now.toISOString(),
            ip_address: currentIP // Update IP if changed
          })
          .eq('id', sessionId);
      }

      return { isValid: true, session };
    } catch (error) {
      logger.error('Session validation error', { error, sessionId });
      return { isValid: false, reason: 'Validation error' };
    }
  }

  /**
   * Invalidate a specific session
   */
  async invalidateSession(
    sessionId: string, 
    reason: string = 'manual_logout'
  ): Promise<void> {
    const { error } = await this.supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) {
      logger.error('Failed to invalidate session', { error, sessionId });
    } else {
      logger.logAuth('session_invalidated', '', true, {
        sessionId,
        reason,
      });
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  async invalidateAllUserSessions(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true)
      .select('id');

    if (error) {
      logger.error('Failed to invalidate user sessions', { error, userId });
      return 0;
    }

    const count = data?.length || 0;
    logger.logAuth('all_sessions_invalidated', userId, true, { count });
    
    return count;
  }

  /**
   * Get active sessions for a user
   */
  async getUserSessions(userId: string): Promise<SessionData[]> {
    const { data, error } = await this.supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch user sessions', { error, userId });
      return [];
    }

    return data || [];
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const { data, error } = await this.supabase
      .from('user_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (error) {
      logger.error('Failed to cleanup expired sessions', { error });
      return 0;
    }

    const count = data?.length || 0;
    logger.info(`Cleaned up ${count} expired sessions`);
    
    return count;
  }

  /**
   * Enhanced authentication middleware with session validation
   */
  async authenticateWithSession(req: NextApiRequest): Promise<AuthenticatedUser | null> {
    // First try standard JWT authentication
    const user = await authenticateRequest(req);
    if (!user) return null;

    // Then validate session if session ID is provided
    const sessionId = req.headers['x-session-id'] as string;
    if (sessionId) {
      const sessionResult = await this.validateSession(sessionId, req);
      if (!sessionResult.isValid) {
        logger.logSecurityEvent('invalid_session_with_valid_jwt', 'medium', {
          userId: user.id,
          sessionId,
          reason: sessionResult.reason,
        });
        return null;
      }
    }

    return user;
  }

  private getClientIP(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded
      ? Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]
      : req.socket?.remoteAddress;
    return ip || 'unknown';
  }
}

// Singleton instance
export const sessionManager = new SessionManager();

// Cleanup task - run every hour
if (typeof window === 'undefined') {
  setInterval(() => {
    sessionManager.cleanupExpiredSessions().catch(error => {
      logger.error('Session cleanup failed', { error });
    });
  }, 60 * 60 * 1000);
}