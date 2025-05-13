// backend/src/db/migrations/001_create_flipbooks.ts

/**
 * Migration 001: Create flipbooks table and associated status enum.
 *
 * This migration sets up the core flipbooks table, which tracks
 * uploaded documents and their processing status.
 *
 * - Creates ENUM type "flipbook_status" with values:
 *   'uploading', 'processing', 'ready', 'error'
 * - Creates "flipbooks" table with UUID primary key, title,
 *   original/optimized sizes, status, and timestamps.
 *
 * Rollback will drop the table and the enum type.
 */

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create enum type for status
  await knex.raw(`
    CREATE TYPE "flipbook_status" AS ENUM (
      'uploading',
      'processing',
      'ready',
      'error'
    );
  `);

  // Create flipbooks table
  await knex.schema.createTable('flipbooks', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .comment('Primary key - unique flipbook identifier');
    table
      .string('title', 255)
      .notNullable()
      .comment('Title of the flipbook');
    table
      .integer('originalSize')
      .notNullable()
      .comment('Original file size in bytes');
    table
      .integer('optimizedSize')
      .nullable()
      .comment('Optimized file size in bytes (after compression)');
    table
      .specificType('status', 'flipbook_status')
      .notNullable()
      .defaultTo('uploading')
      .comment('Processing status of the flipbook');
    table
      .timestamp('createdAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Creation timestamp');
    table
      .timestamp('updatedAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Last update timestamp');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop flipbooks table first (depends on enum)
  await knex.schema.dropTableIfExists('flipbooks');

  // Drop the enum type
  await knex.raw(`DROP TYPE IF EXISTS "flipbook_status";`);
}
