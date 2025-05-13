// backend/src/db/migrations/005_create_analytics_events.ts

/**
 * Migration 005: Create analytics_events table.
 *
 * This table logs individual viewer events (view_start, page_turn, etc.)
 * for later aggregation into metrics.
 *
 * Columns:
 * - id: UUID primary key
 * - flipbookId: FK to flipbooks
 * - sessionId: identifies the user/session
 * - eventType: event name (e.g., view_start, page_turn)
 * - pageNumber: optional page context
 * - timestamp: event occurrence time
 *
 * Index on (flipbookId, sessionId) for efficient lookups.
 *
 * Rollback drops the table.
 */

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('analytics_events', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .comment('Primary key - unique event identifier');
    table
      .uuid('flipbookId')
      .notNullable()
      .comment('Associated flipbook ID')
      .references('id')
      .inTable('flipbooks')
      .onDelete('CASCADE');
    table
      .string('sessionId', 255)
      .notNullable()
      .comment('Session or user identifier');
    table
      .string('eventType', 50)
      .notNullable()
      .comment('Type of event (view_start, page_turn, etc.)');
    table
      .integer('pageNumber')
      .nullable()
      .comment('Optional page context for the event');
    table
      .timestamp('timestamp', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Time when the event occurred');

    // Composite index for analytics queries
    table.index(['flipbookId', 'sessionId'], 'idx_events_flipbook_session');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('analytics_events');
}
