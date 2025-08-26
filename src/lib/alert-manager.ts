import { logger } from "./logger";
import { env } from "./env";

export interface Alert {
  id: string;
  type: "security" | "performance" | "error" | "business";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  context: Record<string, any>;
  timestamp: Date;
  acknowledged: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: (event: any) => boolean;
  severity: Alert["severity"];
  type: Alert["type"];
  cooldown: number; // milliseconds between alerts
}

export class AlertManager {
  private alerts: Map<string, Alert> = new Map();
  private lastAlertTime: Map<string, number> = new Map();
  private rules: AlertRule[] = [];

  constructor() {
    this.setupDefaultRules();
  }

  private setupDefaultRules(): void {
    this.rules = [
      {
        id: "multiple_failed_logins",
        name: "Multiple Failed Login Attempts",
        condition: (event) => event.type === "auth_failure" && event.count >= 5,
        severity: "high",
        type: "security",
        cooldown: 300000, // 5 minutes
      },
      {
        id: "sql_injection_detected",
        name: "SQL Injection Attempt Detected",
        condition: (event) =>
          event.type === "security" && event.event === "sql_injection_attempt",
        severity: "critical",
        type: "security",
        cooldown: 60000, // 1 minute
      },
      {
        id: "high_error_rate",
        name: "High API Error Rate",
        condition: (event) =>
          event.type === "api_error" && event.errorRate > 0.1, // 10% error rate
        severity: "high",
        type: "performance",
        cooldown: 600000, // 10 minutes
      },
      {
        id: "slow_database_queries",
        name: "Slow Database Queries Detected",
        condition: (event) =>
          event.type === "db_performance" && event.duration > 5000, // 5 seconds
        severity: "medium",
        type: "performance",
        cooldown: 300000, // 5 minutes
      },
      {
        id: "admin_bulk_operation",
        name: "Large Admin Bulk Operation",
        condition: (event) =>
          event.type === "admin_action" && event.itemCount > 50,
        severity: "medium",
        type: "business",
        cooldown: 0, // No cooldown for business events
      },
      {
        id: "rate_limit_exceeded",
        name: "Rate Limit Frequently Exceeded",
        condition: (event) =>
          event.type === "rate_limit" && event.violationCount >= 10,
        severity: "medium",
        type: "security",
        cooldown: 180000, // 3 minutes
      },
    ];
  }

  /**
   * Process an event and check if it should trigger an alert
   */
  processEvent(event: any): void {
    for (const rule of this.rules) {
      if (rule.condition(event)) {
        this.triggerAlert(rule, event);
      }
    }
  }

  private triggerAlert(rule: AlertRule, event: any): void {
    const now = Date.now();
    const lastAlert = this.lastAlertTime.get(rule.id);

    // Check cooldown period
    if (lastAlert && now - lastAlert < rule.cooldown) {
      return;
    }

    const alert: Alert = {
      id: `${rule.id}_${now}`,
      type: rule.type,
      severity: rule.severity,
      title: rule.name,
      description: this.generateAlertDescription(rule, event),
      context: event,
      timestamp: new Date(),
      acknowledged: false,
    };

    this.alerts.set(alert.id, alert);
    this.lastAlertTime.set(rule.id, now);

    // Log the alert
    logger.error(`ALERT: ${alert.title}`, {
      alertId: alert.id,
      severity: alert.severity,
      type: alert.type,
      context: alert.context,
    });

    // Send notifications based on severity
    this.sendNotification(alert);
  }

  private generateAlertDescription(rule: AlertRule, event: any): string {
    switch (rule.id) {
      case "multiple_failed_logins":
        return `${event.count} failed login attempts detected from IP ${event.ip}`;
      case "sql_injection_detected":
        return `SQL injection attempt detected in ${event.endpoint}`;
      case "high_error_rate":
        return `API error rate is ${(event.errorRate * 100).toFixed(1)}% over the last hour`;
      case "slow_database_queries":
        return `Database query took ${event.duration}ms on table ${event.table}`;
      case "admin_bulk_operation":
        return `Admin ${event.adminId} performed bulk ${event.operation} on ${event.itemCount} items`;
      case "rate_limit_exceeded":
        return `Rate limit exceeded ${event.violationCount} times from IP ${event.ip}`;
      default:
        return `Alert triggered for rule: ${rule.name}`;
    }
  }

  private async sendNotification(alert: Alert): Promise<void> {
    // In production, integrate with notification services
    // For now, just log critical alerts prominently
    if (alert.severity === "critical") {
      console.error("🚨 CRITICAL ALERT:", alert.title);
      console.error("📋 Description:", alert.description);
      console.error("🕐 Time:", alert.timestamp.toISOString());

      // TODO: Integrate with:
      // - Discord webhook for team notifications
      // - Email alerts for critical issues
      // - SMS for system-down scenarios
      // - PagerDuty or similar service
    }

    // For development, log all alerts to console
    if (env.NODE_ENV === "development") {
      const emoji = {
        critical: "🚨",
        high: "⚠️",
        medium: "⚡",
        low: "ℹ️",
      }[alert.severity];

      console.log(
        `${emoji} ${alert.severity.toUpperCase()} ALERT: ${alert.title}`,
      );
      console.log(`Description: ${alert.description}`);
      console.log("Context:", alert.context);
    }
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values())
      .filter((alert) => !alert.acknowledged)
      .sort((a, b) => {
        // Sort by severity (critical first) then by timestamp (newest first)
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const severityDiff =
          severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  /**
   * Get alert statistics
   */
  getAlertStats(): {
    total: number;
    byType: Record<Alert["type"], number>;
    bySeverity: Record<Alert["severity"], number>;
    acknowledged: number;
  } {
    const alerts = Array.from(this.alerts.values());

    return {
      total: alerts.length,
      byType: alerts.reduce(
        (acc, alert) => {
          acc[alert.type] = (acc[alert.type] || 0) + 1;
          return acc;
        },
        {} as Record<Alert["type"], number>,
      ),
      bySeverity: alerts.reduce(
        (acc, alert) => {
          acc[alert.severity] = (acc[alert.severity] || 0) + 1;
          return acc;
        },
        {} as Record<Alert["severity"], number>,
      ),
      acknowledged: alerts.filter((a) => a.acknowledged).length,
    };
  }

  /**
   * Clear old acknowledged alerts (older than 24 hours)
   */
  cleanup(): void {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;

    for (const [id, alert] of this.alerts.entries()) {
      if (alert.acknowledged && alert.timestamp.getTime() < dayAgo) {
        this.alerts.delete(id);
      }
    }
  }
}

// Singleton instance
export const alertManager = new AlertManager();

// Cleanup old alerts every hour
if (typeof window === "undefined") {
  setInterval(
    () => {
      alertManager.cleanup();
    },
    60 * 60 * 1000,
  );
}

// Enhanced logger integration
const originalError = logger.error;
const originalWarn = logger.warn;

logger.error = function (message: string, context?: any) {
  originalError.call(this, message, context);

  // Trigger alert processing for error events
  if (context) {
    alertManager.processEvent({
      type: "error",
      message,
      ...context,
    });
  }
};

logger.warn = function (message: string, context?: any) {
  originalWarn.call(this, message, context);

  // Process certain warnings as potential alerts
  if (context?.securityEvent) {
    alertManager.processEvent({
      type: "security",
      event: context.securityEvent,
      severity: context.severity,
      ...context,
    });
  }
};
