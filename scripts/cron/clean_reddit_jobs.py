import os
from datetime import datetime, timedelta, timezone 
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client, Client

script_dir = Path(__file__).resolve().parent
env_path = script_dir.parent / '.env'
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") 

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def cleanup_old_jobs():

    utc_now = datetime.now(timezone.utc).replace(tzinfo=None)
    cutoff_date = (utc_now - timedelta(days=7)).isoformat()
    
    print(f"Starting cleanup. Deleting jobs older than: {cutoff_date}")

    try:
        response = supabase.table("redditjobs") \
            .delete() \
            .lt("timestamp", cutoff_date) \
            .execute()

        deleted_count = len(response.data) if response.data else 0
        print(f"✅ Cleanup complete. Deleted {deleted_count} old jobs.")

    except Exception as e:
        print(f"❌ Error deleting old jobs: {e}")

if __name__ == "__main__":
    cleanup_old_jobs()