# SafeClaim WhatsApp Bridge & Morning Broadcast Engine

Connects WhatsApp directly to the SafeClaim FastAPI backend without requiring Meta Developer accounts or Twilio SMS verification.

---

## 🚀 How to Start & Connect

### 1. Ensure the SafeClaim Backend is Running
In your main terminal:
```bash
uvicorn safeclaims.server:app --host 0.0.0.0 --port 8000
```

### 2. Start the WhatsApp Bridge
In a second terminal:
```bash
cd scripts/whatsapp_bridge
npm start
```

### 3. Scan the Terminal QR Code
1. Open **WhatsApp** on your phone.
2. Tap **Settings** (or the three dots in the top right).
3. Select **Linked Devices** → **Link a Device**.
4. Point your camera at the QR code displayed in the terminal.
5. Your terminal will confirm:
   ```text
   ======================================================
   ✅ SafeClaim WhatsApp Bot is LIVE & CONNECTED!
      Auto-replies and morning 4-6 AM broadcast active.
   ======================================================
   ```

*Note: Your login is saved in `auth_info_baileys/`. You will not need to scan the QR code again unless you log out.*

---

## ⚡ Features & Workflows

### 1. Automated Grounded Verification (Instant Auto-Reply)
Whenever any citizen sends a message or forwards a rumour to your connected WhatsApp number:
- **Example message:** *"Is Ebola confirmed in Lagos right now?"*
- The bot queries the SafeClaim engine and automatically replies with the official citation receipt and emergency hotlines in 1–2 seconds.

### 2. Automated Citizen Registration
* Any citizen who texts the WhatsApp bot is **automatically registered** into `data/subscribers.json`.
* Citizens can also be registered programmatically via HTTP:
  ```bash
  curl -X POST http://localhost:3001/register \
       -H "Content-Type: application/json" \
       -d '{"phone": "2348012345678", "name": "Amina"}'
  ```
* To opt-out, citizens can text `"STOP"` or `"UNSUBSCRIBE"` at any time.

### 3. Scheduled Morning Broadcast (4:00 AM – 6:00 AM)
* The built-in scheduler runs **every morning at 5:00 AM** (`0 5 * * *`).
* It pulls the latest intelligence brief and circulating scam alerts from `/api/v1/rumours/brief`.
* It unfailingly broadcasts the morning digest to all active subscribers, spaced with natural delays to protect account health.

### 4. Trigger an Immediate Test Broadcast (Demo Mode)
To demonstrate the morning briefing to judges or test it right now without waiting until 5 AM:
```bash
curl -X POST http://localhost:3001/broadcast
```
All registered subscribers will immediately receive the formatted SafeClaim Morning Digest on WhatsApp.
