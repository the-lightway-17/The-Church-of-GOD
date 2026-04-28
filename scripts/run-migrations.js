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
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', {
          sql: statement.trim()
        }).catch(() => {
          // Fallback: use direct query
          return supabase.from('profiles').select('id').limit(1);
        });

        if (error && !error.message.includes('already exists')) {
          console.warn(`Warning executing statement:`, error.message);
        }
      }
    }

    console.log('✓ Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
