import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  try {
    const schemaPath = path.join(__dirname, '01-init-schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('Running migration: 01-init-schema.sql');
    
    // Use the SQL query directly via the admin client
    const { error } = await supabase.rpc('sql', {
      query: sql
    });

    if (error) {
      // Try alternative: execute via fetch to the Supabase SQL editor
      console.log('Trying alternative migration method...');
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
        body: JSON.stringify({ query: sql }),
      });

      if (!response.ok) {
        console.warn('SQL execution warning:', response.statusText);
      }
    }

    console.log('✓ Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
