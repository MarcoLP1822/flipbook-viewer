// backend/src/db/migrations/003_create_pages.ts

/**
 * Migration 003: Create pages table.
 *
 * This table holds one row per page image generated
 * for each flipbook.
 *
 * Columns:
 * - id: UUID primary key
 * - flipbookId: FK to flipbooks
 * - pageNumber: page index within flipbook
 * - imageUrl: S3 URL of rendered page image
 * - width, height: dimensions in pixels
 * - createdAt: timestamp
 *
 * Index on (flipbookId, pageNumber) for fast retrieval.
 */

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('pages', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .comment('Primary key - unique page identifier');
    table
      .uuid('flipbookId')
      .notNullable()
      .comment('Associated flipbook ID')
      .references('id')
      .inTable('flipbooks')
      .onDelete('CASCADE');
    table
      .integer('pageNumber')
      .notNullable()
      .comment('Zero-based page index');
    table
      .text('imageUrl')
      .notNullable()
      .comment('S3 URL of the page image');
    table
      .integer('width')
      .notNullable()
      .comment('Image width in pixels');
    table
      .integer('height')
      .notNullable()
      .comment('Image height in pixels');
    table
      .timestamp('createdAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Timestamp when page record was created');

    // Composite index for page lookup
    table.index(['flipbookId', 'pageNumber'], 'idx_pages_flipbook_page');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('pages');
}
