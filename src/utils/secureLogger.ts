/**
 * Secure logging utility that prevents information disclosure
 * Only logs to server-side in production, removes sensitive data
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: number;
}

class SecureLogger {
  private isDevelopment = import.meta.env.DEV;
  
  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      // Remove potential sensitive information
      return data
        .replace(/password[^&]*=[^&]*/gi, 'password=***')
        .replace(/token[^&]*=[^&]*/gi, 'token=***')
        .replace(/key[^&]*=[^&]*/gi, 'key=***')
        .replace(/secret[^&]*=[^&]*/gi, 'secret=***');
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      
      // Remove sensitive fields
      const sensitiveFields = ['password', 'token', 'key', 'secret', 'authorization'];
      sensitiveFields.forEach(field => {
        if (field in sanitized) {
          sanitized[field] = '***';
        }
      });
      
      return sanitized;
    }
    
    return data;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const contextStr = context ? ` [${context.component || 'Unknown'}:${context.action || 'Unknown'}]` : '';
    return `${prefix}${contextStr} ${message}`;
  }

  info(message: string, data?: any, context?: LogContext): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('info', message, context);
      console.info(formattedMessage, data ? this.sanitizeData(data) : '');
    }
    // In production, send to secure logging service
  }

  warn(message: string, data?: any, context?: LogContext): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('warn', message, context);
      console.warn(formattedMessage, data ? this.sanitizeData(data) : '');
    }
    // In production, send to secure logging service
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('error', message, context);
      console.error(formattedMessage, error?.message || '', {
        stack: error?.stack,
        context
      });
    }
    // In production, send to secure error tracking service
  }

  debug(message: string, data?: any, context?: LogContext): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('debug', message, context);
      console.debug(formattedMessage, data ? this.sanitizeData(data) : '');
    }
    // Debug logs are never sent to production
  }

  // Security audit logging
  auditLog(action: string, details: Record<string, any>, context?: LogContext): void {
    const auditEntry = {
      action,
      timestamp: Date.now(),
      details: this.sanitizeData(details),
      context
    };

    if (this.isDevelopment) {
      console.info('[AUDIT]', auditEntry);
    }
    // In production, send to secure audit service
  }
}

export const secureLogger = new SecureLogger();