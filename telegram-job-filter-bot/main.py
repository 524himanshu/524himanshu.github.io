import os
import re
import urllib.request
import urllib.parse
import asyncio
from telethon import TelegramClient, events
from telethon.sessions import StringSession

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
        
        alert_msg = f"🎯 HIGH-MATCH REFERRAL ALERT!\nSource: {chat_title}\n\n{text}{form_url_str}"
        print(f"[MATCH DETECTED] From '{chat_title}' - Dispatching alert...", flush=True)
        send_telegram_alert(alert_msg)

async def main():
    print("Starting 24/7 Cloud Telegram Job Filter Bot...", flush=True)
    await client.start()
    me = await client.get_me()
    print(f"Logged in as: {me.first_name} (@{me.username})", flush=True)
    print("Listening 24/7 for matching referral posts in the cloud...", flush=True)
    await client.run_until_disconnected()

if __name__ == '__main__':
    asyncio.run(main())
