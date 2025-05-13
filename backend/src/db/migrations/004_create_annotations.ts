// backend/src/db/migrations/004_create_annotations.ts

/**
 * Migration 004: Create annotations table and associated annotation_type enum.
 *
 * This migration allows users to add highlights or notes
 * to specific pages of a flipbook.
 *
 * - Creates ENUM type "annotation_type" with 'highlight' and 'note'
 * - Creates "annotations" table storing page, user, type, range, content.
 * - Adds index on (flipbookId, pageNumber) for efficient retrieval.
 *
 * Rollback will drop both the table and the enum.
 */

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create enum for annotation types
  await knex.raw(`
    CREATE TYPE "annotation_type" AS ENUM (
      'highlight',
      'note'
    );
  `);

  // Create annotations table
  await knex.schema.createTable('annotations', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .comment('Primary key - unique annotation identifier');
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
      .comment('Page index where annotation is made');
    table
      .string('userIdentifier', 255)
      .notNullable()
      .comment('CRM user ID or session token');
    table
      .specificType('type', 'annotation_type')
      .notNullable()
      .comment('Type of annotation: highlight or note');
    table
      .jsonb('range')
      .notNullable()
      .comment('Text range offsets { start, end }');
    table
      .text('content')
      .notNullable()
      .comment('Annotation content or note text');
    table
      .timestamp('createdAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Timestamp when annotation was created');

    // Composite index for fast filtering
    table.index(['flipbookId', 'pageNumber'], 'idx_annotations_flipbook_page');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop annotations table then enum
  await knex.schema.dropTableIfExists('annotations');
  await knex.raw(`DROP TYPE IF EXISTS "annotation_type";`);
}
