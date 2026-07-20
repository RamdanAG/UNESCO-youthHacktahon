from supabase import create_client, Client
from app.core.config import settings

# TODO: guard against missing env vars in real deployment
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
