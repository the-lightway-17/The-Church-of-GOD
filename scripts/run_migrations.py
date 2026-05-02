#!/usr/bin/env python3
import os
import sys
import subprocess
from pathlib import Path

# Get the directory where this script is located
script_dir = Path(__file__).parent.absolute()
sql_file = script_dir / '01-init-schema.sql'

# Read the SQL file
try:
    with open(sql_file, 'r') as f:
        sql_content = f.read()
except FileNotFoundError:
    print(f"Error: {sql_file} not found")
    sys.exit(1)

# Get Supabase credentials from environment
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not supabase_key:
    print("Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set")
    sys.exit(1)

# Extract the project ID from the URL
# URL format: https://xxxxxxxxxxxxxx.supabase.co
project_id = supabase_url.split('.')[0].replace('https://', '')

print(f"Running migration: {sql_file}")
print(f"Project ID: {project_id}")

# Use psql to connect and execute the SQL
# First, we need to extract the database URL
db_url = f"postgres://postgres:{supabase_key}@db.{project_id}.supabase.co:5432/postgres"

try:
    # Execute SQL via psql
    result = subprocess.run(
        ['psql', db_url, '-f', str(sql_file)],
        capture_output=True,
        text=True,
        timeout=30
    )
    
    if result.returncode != 0:
        print(f"Migration error output:\n{result.stderr}")
        sys.exit(1)
    
    print(f"✓ Migration completed successfully!")
    print(result.stdout)
    
except FileNotFoundError:
    print("Error: psql not found. Installing postgresql-client...")
    subprocess.run(['apt-get', 'update'], check=False)
    subprocess.run(['apt-get', 'install', '-y', 'postgresql-client'], check=False)
    print("Please run this script again.")
    sys.exit(1)
except subprocess.TimeoutExpired:
    print("Error: Migration timed out")
    sys.exit(1)
except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1)
