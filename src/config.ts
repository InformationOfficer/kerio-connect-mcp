/**
 * Configuration management for Kerio Connect MCP Server
 * Comprehensive support for Mail, Calendar, Contacts, Tasks, and Notes
 * Reads from environment variables (set in Claude Desktop config or .env)
 */

import { z } from 'zod';
import type { KerioConfig } from './types.js';

// Zod schema for environment validation
const EnvSchema = z.object({
  KERIO_SERVER: z.string().min(1, 'KERIO_SERVER is required'),
  KERIO_USERNAME: z.string().email('KERIO_USERNAME must be a valid email'),
  KERIO_PASSWORD: z.string().min(1, 'KERIO_PASSWORD is required'),
  KERIO_VERIFY_SSL: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val.toLowerCase() === 'true'),
  KERIO_ENABLE_SEND: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val.toLowerCase() === 'true'),
});

export class Config {
  public readonly server: string;
  public readonly username: string;
  public readonly password: string;
  public readonly verifySsl: boolean;
  public readonly enableSend: boolean;

  constructor() {
    try {
      const env = EnvSchema.parse(process.env);

      this.server = env.KERIO_SERVER;
      this.username = env.KERIO_USERNAME;
      this.password = env.KERIO_PASSWORD;
      this.verifySsl = env.KERIO_VERIFY_SSL;
      this.enableSend = env.KERIO_ENABLE_SEND;

      this.logConfig();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((e) => `  - ${e.path.join('.')}: ${e.message}`);
        throw new Error(
          `Configuration validation failed:\n${messages.join('\n')}\n\n` +
          `Required environment variables:\n` +
          `  - KERIO_SERVER: Kerio Connect server URL (e.g., https://mail.example.com)\n` +
          `  - KERIO_USERNAME: Your email address\n` +
          `  - KERIO_PASSWORD: Your password\n` +
          `  - KERIO_VERIFY_SSL: (optional) Set to 'true' to verify SSL certificates (default: false)\n` +
          `  - KERIO_ENABLE_SEND: (optional) Set to 'true' to enable email sending (default: false, SECURITY RISK)`
        );
      }
      throw error;
    }
  }

  /**
   * Get configuration as KerioConfig object
   */
  public toKerioConfig(): KerioConfig {
    return {
      server: this.server,
      username: this.username,
      password: this.password,
      verifySsl: this.verifySsl,
    };
  }

  /**
   * Log configuration (without sensitive data)
   */
  private logConfig(): void {
    console.error('[Config] Loaded configuration:');
    console.error(`  Server: ${this.server}`);
    console.error(`  Username: ${this.username}`);
    console.error(`  Verify SSL: ${this.verifySsl}`);
    console.error(`  Enable Send: ${this.enableSend}`);

    if (this.enableSend) {
      console.error('');
      console.error('[Config] ⚠️  WARNING: Email sending is ENABLED');
      console.error('[Config] ⚠️  AI can send emails without manual review!');
      console.error('[Config] ⚠️  Set KERIO_ENABLE_SEND=false to disable this feature');
      console.error('');
    }
  }
}

// Singleton instance
export const config = new Config();
