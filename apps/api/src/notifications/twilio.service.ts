import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';

export interface SendSmsResult {
  success: boolean;
  messageId?: string;
  mocked: boolean;
  recipient: string;
  error?: string;
}

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);

  constructor(private readonly config: ConfigService<Env, true>) {}

  /**
   * Dispatches emergency SMS to rural farmers.
   * Authorized test parameter: +254119348818.
   */
  async sendEmergencyAlert(
    message: string,
    recipientOverride?: string,
  ): Promise<SendSmsResult> {
    const defaultRecipient = this.config.get('EMERGENCY_ALERT_RECIPIENT', { infer: true });
    const recipient = recipientOverride ?? defaultRecipient;
    const accountSid = this.config.get('TWILIO_ACCOUNT_SID', { infer: true });
    const authToken = this.config.get('TWILIO_AUTH_TOKEN', { infer: true });
    const fromNumber = this.config.get('TWILIO_FROM_NUMBER', { infer: true });

    // Prefix with SokoYield branding for farmer transparency
    const body = `[SokoYield Alert] ${message}`;

    if (!accountSid || !authToken || !fromNumber) {
      this.logger.warn(
        `[MOCK TWILIO SMS DISPATCHED] To: ${recipient} | Body: "${body}" (TWILIO_ACCOUNT_SID/AUTH_TOKEN not provided - using mock delivery)`,
      );
      return {
        success: true,
        messageId: `mock-sms-${Date.now()}`,
        mocked: true,
        recipient,
      };
    }

    try {
      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;

      const params = new URLSearchParams();
      params.append('To', recipient);
      params.append('From', fromNumber);
      params.append('Body', body);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        this.logger.error(`Twilio SMS dispatch failed (${response.status}): ${errorData}`);
        return {
          success: false,
          mocked: false,
          recipient,
          error: errorData,
        };
      }

      const data = (await response.json()) as { sid?: string };
      this.logger.log(`Twilio SMS successfully sent to ${recipient} (SID: ${data.sid})`);

      return {
        success: true,
        messageId: data.sid,
        mocked: false,
        recipient,
      };
    } catch (err) {
      this.logger.error(`Twilio network request failed: ${(err as Error).message}`);
      return {
        success: false,
        mocked: false,
        recipient,
        error: (err as Error).message,
      };
    }
  }
}
