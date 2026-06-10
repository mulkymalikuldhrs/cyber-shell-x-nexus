// ── Notification System ────────────────────────────────────────────────────────
// Webhook integrations (Discord, Slack, Telegram), email, in-app notifications

import type { NotificationConfig } from '@shared/schema';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface NotificationPayload {
  title: string;
  message: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  scanId?: string;
  findingCount?: number;
  url?: string;
}

// ── Notification Channels ──────────────────────────────────────────────────────

class DiscordNotifier {
  async send(webhookUrl: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const colorMap: Record<string, number> = {
        info: 0x3498db, low: 0x2ecc71, medium: 0xf1c40f,
        high: 0xe67e22, critical: 0xe74c3c,
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: `🔒 ${payload.title}`,
            description: payload.message,
            color: colorMap[payload.severity] || 0x3498db,
            fields: [
              { name: 'Severity', value: payload.severity.toUpperCase(), inline: true },
              ...(payload.findingCount ? [{ name: 'Findings', value: String(payload.findingCount), inline: true }] : []),
            ],
            footer: { text: 'CyberShellX Nexus | Educational Testing Only' },
            timestamp: new Date().toISOString(),
          }],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('[Notifications] Discord send failed:', error);
      return false;
    }
  }
}

class SlackNotifier {
  async send(webhookUrl: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const emojiMap: Record<string, string> = {
        info: 'ℹ️', low: '✅', medium: '⚠️', high: '🟠', critical: '🔴',
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${emojiMap[payload.severity] || 'ℹ️'} *${payload.title}*\n${payload.message}\n_Severity: ${payload.severity.toUpperCase()}_`,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('[Notifications] Slack send failed:', error);
      return false;
    }
  }
}

class TelegramNotifier {
  async send(botToken: string, chatId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const emojiMap: Record<string, string> = {
        info: 'ℹ️', low: '✅', medium: '⚠️', high: '🟠', critical: '🔴',
      };

      const text = `${emojiMap[payload.severity] || 'ℹ️'} *${payload.title}*\n\n${payload.message}\n\n_Severity: ${payload.severity.toUpperCase()}_\n_CyberShellX Nexus_`;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('[Notifications] Telegram send failed:', error);
      return false;
    }
  }
}

class EmailNotifier {
  async send(email: string, payload: NotificationPayload): Promise<boolean> {
    // Email would require a proper email service (SendGrid, SES, etc.)
    // For now, we log the notification
    console.log(`[Notifications] Email to ${email}: [${payload.severity}] ${payload.title} - ${payload.message}`);
    return true;
  }
}

// ── Notification Manager ───────────────────────────────────────────────────────

export class NotificationManager {
  private discord = new DiscordNotifier();
  private slack = new SlackNotifier();
  private telegram = new TelegramNotifier();
  private email = new EmailNotifier();
  private inAppNotifications: Notification[] = [];
  private wsClients: Set<any> = new Set();
  private maxInApp = 100;

  /**
   * Register a WebSocket client for real-time notifications
   */
  registerWSClient(ws: any): void {
    this.wsClients.add(ws);
    ws.on('close', () => this.wsClients.delete(ws));
  }

  /**
   * Send notification through all configured channels
   */
  async notify(payload: NotificationPayload, configs: NotificationConfig[] = []): Promise<void> {
    // Store in-app notification
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: this.mapSeverity(payload.severity),
      title: payload.title,
      message: payload.message,
      timestamp: new Date(),
      metadata: { scanId: payload.scanId, findingCount: payload.findingCount },
    };

    this.inAppNotifications.unshift(notification);
    if (this.inAppNotifications.length > this.maxInApp) {
      this.inAppNotifications = this.inAppNotifications.slice(0, this.maxInApp);
    }

    // Send via WebSocket to all connected clients
    this.broadcastWS({
      type: 'notification',
      notification,
    });

    // Send through configured channels
    for (const config of configs) {
      if (!config.enabled) continue;

      try {
        switch (config.type) {
          case 'discord':
            if (config.webhookUrl) {
              await this.discord.send(config.webhookUrl, payload);
            }
            break;
          case 'slack':
            if (config.webhookUrl) {
              await this.slack.send(config.webhookUrl, payload);
            }
            break;
          case 'telegram':
            if (config.botToken && config.chatId) {
              await this.telegram.send(config.botToken, config.chatId, payload);
            }
            break;
          case 'email':
            if (config.email) {
              await this.email.send(config.email, payload);
            }
            break;
        }
      } catch (error) {
        console.error(`[Notifications] ${config.type} send failed:`, error);
      }
    }
  }

  /**
   * Get recent in-app notifications
   */
  getNotifications(limit = 20): Notification[] {
    return this.inAppNotifications.slice(0, limit);
  }

  /**
   * Broadcast message to all WebSocket clients
   */
  private broadcastWS(data: any): void {
    const message = JSON.stringify(data);
    for (const ws of this.wsClients) {
      try {
        if (ws.readyState === 1) { // WebSocket.OPEN
          ws.send(message);
        }
      } catch {
        this.wsClients.delete(ws);
      }
    }
  }

  private mapSeverity(severity: string): Notification['type'] {
    const map: Record<string, Notification['type']> = {
      info: 'info', low: 'info', medium: 'warning',
      high: 'error', critical: 'critical',
    };
    return map[severity] || 'info';
  }
}

export const notificationManager = new NotificationManager();
