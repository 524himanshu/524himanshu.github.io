import os
import re
import urllib.request
import urllib.parse
import asyncio
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
from telethon import TelegramClient, events
from telethon.sessions import StringSession

# Lightweight HTTP Health Check Server for Render 100% Free Web Service
class HealthCheckHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(b"OK - Telegram Job Filter Bot is Running 24/7")

def run_http_server():
    port = int(os.environ.get("PORT", 8080))
    server = HTTPServer(("0.0.0.0", port), HealthCheckHandler)
    print(f"HTTP Health Check Server running on port {port}", flush=True)
    server.serve_forever()

def run_self_ping():
    service_url = os.environ.get("RENDER_EXTERNAL_URL")
    if not service_url:
        return
    import time
    while True:
        time.sleep(600) # Ping every 10 minutes
        try:
            req = urllib.request.Request(service_url, headers={'User-Agent': 'KeepAlive/1.0'})
            with urllib.request.urlopen(req) as resp:
                print(f"[KEEP-ALIVE PING SUCCESS] Status {resp.status}", flush=True)
        except Exception as e:
            print("[KEEP-ALIVE PING ERROR]:", e, flush=True)

threading.Thread(target=run_http_server, daemon=True).start()
threading.Thread(target=run_self_ping, daemon=True).start()

API_ID = int(os.environ.get("API_ID", "39647045"))
API_HASH = os.environ.get("API_HASH", "612a51e2bbd5358b850d2abefcfeec51")
BOT_TOKEN = os.environ.get("BOT_TOKEN", "8831106711:AAEg2vTdflOzzEMqff4RX-oOAxCSxYNC0js")
USER_CHAT_ID = os.environ.get("USER_CHAT_ID", "1134023251")
STRING_SESSION = os.environ.get("STRING_SESSION", "1BVtsOIYBu0DqN21g1b-m3P_H27JITJoZ9luhduzqbK9yPeBBWS3PrfWz_Lz28RgLu87jiVp-tVH3EpI1jCLiKyXamEVi1KVAHxlpbDo1E75EJu_TS2e1rpEMa_RHmABU6lmWho6GiK762X3scP6Si-IgguNR7J5k9ueJ-fCquh3nsPhlzzGizWMipeEKL-9qCQRybkjbTZUuB0Avc_gKRGcnPmxSgYl9iVEpXd_urHgneCyyCmYIvrWcYJajpprZoH5Foe5Y8RGpWGt7bYHWOqFwkZ65fG4X0BqWTNg4BSThKYA6oQomZnf1MccvaNpZMlJstXs4-7vbmJk5imYkfIUTXj6_29Y=")

MATCH_KEYWORDS = [
    'ai', 'agent', 'full-stack', 'fullstack', 'full stack', 'python', 'fastapi',
    'react', 'next.js', 'nextjs', 'sde', 'software engineer', 'backend', 'ml',
    'machine learning', 'rag', 'llm', 'generative ai'
]

EXCLUDE_KEYWORDS = [
    'sales', 'hr', '5+ years', '6+ years', '7+ years', '10+ years', 'manager', 'marketing', 'flutter'
]

DISCORD_WEBHOOK_URL = os.environ.get("DISCORD_WEBHOOK_URL", "https://discord.com/api/webhooks/1538106133951287306/DopIlIttw3NZWxN2jY7bLjGn6AqbJnVdEsFTDhe_5XgK5E3Hz6TN5yAzDTHq0kwlAzkS")

import json

def send_telegram_alert(text):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = urllib.parse.urlencode({'chat_id': USER_CHAT_ID, 'text': text}).encode('utf-8')
    req = urllib.request.Request(url, data=payload)
    try:
        with urllib.request.urlopen(req) as resp:
            print("[ALERT SENT TO TELEGRAM BOT SUCCESS]", flush=True)
            return True
    except Exception as e:
        print("[ALERT DELIVERY ERROR]:", e, flush=True)
        return False

def send_discord_alert(text):
    if not DISCORD_WEBHOOK_URL:
        return
    payload = {'content': text}
    req = urllib.request.Request(
        DISCORD_WEBHOOK_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'User-Agent': 'DiscordBot'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print("[DISCORD WEBHOOK ALERT SENT SUCCESS]", flush=True)
    except Exception as e:
        print("[DISCORD ALERT ERROR]:", e, flush=True)

SHEET_WEBHOOK_URL = os.environ.get("SHEET_WEBHOOK_URL", "")

def log_to_google_sheet(company: str, role: str, source: str, link: str):
    """Log matching referral to Google Sheets via Apps Script Web App"""
    if not SHEET_WEBHOOK_URL:
        return
    payload = json.dumps({
        "company": company,
        "role": role,
        "source": source,
        "link": link,
        "date": __import__('datetime').datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC'),
        "status": "Pending"
    }).encode('utf-8')
    req = urllib.request.Request(
        SHEET_WEBHOOK_URL,
        data=payload,
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print("[GOOGLE SHEET LOG SUCCESS]", flush=True)
    except Exception as e:
        print(f"[GOOGLE SHEET LOG ERROR]: {e}", flush=True)

client = TelegramClient(StringSession(STRING_SESSION), API_ID, API_HASH)

@client.on(events.NewMessage)
async def handler(event):
    if not event.raw_text:
        return
    
    text = event.raw_text
    lower_text = text.lower()
    
    if any(ex in lower_text for ex in EXCLUDE_KEYWORDS):
        return
    
    if any(k in lower_text for k in MATCH_KEYWORDS):
        chat = await event.get_chat()
        chat_title = getattr(chat, 'title', 'Telegram Group')
        
        form_links = re.findall(r'https?://[^\s]+', text)
        form_url_str = f"\n\n🔗 Apply Links:\n" + "\n".join(form_links) if form_links else ""
        
        # Extract company/role from text (best effort)
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        company = lines[0][:60] if lines else 'Unknown'
        role = lines[1][:60] if len(lines) > 1 else 'SDE / AI Engineer'
        top_link = form_links[0] if form_links else ''

        alert_msg = f"🎯 **HIGH-MATCH REFERRAL ALERT!**\n**Source:** {chat_title}\n\n{text}{form_url_str}"
        print(f"[MATCH DETECTED] From '{chat_title}' - Dispatching alerts...", flush=True)
        send_telegram_alert(alert_msg)
        send_discord_alert(alert_msg)
        log_to_google_sheet(company, role, chat_title, top_link)

async def main():
    print("Starting 24/7 Cloud Telegram Job Filter Bot...", flush=True)
    await client.start()
    me = await client.get_me()
    print(f"Logged in as: {me.first_name} (@{me.username})", flush=True)
    print("Listening 24/7 for matching referral posts in the cloud...", flush=True)
    await client.run_until_disconnected()

if __name__ == '__main__':
    asyncio.run(main())
