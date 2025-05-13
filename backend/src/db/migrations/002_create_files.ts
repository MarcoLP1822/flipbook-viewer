// backend/src/db/migrations/002_create_files.ts

/**
 * Migration 002: Create files table and associated file_type enum.
 *
 * This migration tracks both the original and optimized files
 * stored for each flipbook.
 *
 * - Creates ENUM type "file_type" with values: 'original', 'optimized'
 * - Creates "files" table linking to flipbooks.
 * - Adds index on flipbookId for faster lookups.
 *
 * Rollback will drop the table and enum.
 */

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create enum type for file types
  await knex.raw(`
    CREATE TYPE "file_type" AS ENUM (
      'original',
      'optimized'
    );
  `);

  // Create files table
  await knex.schema.createTable('files', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .comment('Primary key - unique file identifier');
    table
      .uuid('flipbookId')
      .notNullable()
      .comment('Associated flipbook ID')
      .references('id')
      .inTable('flipbooks')
      .onDelete('CASCADE');
    table
      .text('url')
      .notNullable()
      .comment('S3 URL of the file');
    table
      .specificType('type', 'file_type')
      .notNullable()
      .comment('Denotes original or optimized file');
    table
      .integer('size')
      .notNullable()
      .comment('File size in bytes');
    table
      .timestamp('createdAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Timestamp when file record was created');
    
    // Index for quick lookups by flipbook
    table.index(['flipbookId'], 'idx_files_flipbookId');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop files table then enum
  await knex.schema.dropTableIfExists('files');
  await knex.raw(`DROP TYPE IF EXISTS "file_type";`);
}
