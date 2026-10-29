/**
 * SafeClaim WhatsApp Baileys Bridge & Morning Broadcast Engine
 * 
 * 1. Connects to WhatsApp via QR code scan (Multi-Device protocol).
 * 2. Auto-replies to incoming rumour checks and voice-note forwards via SafeClaim API.
 * 3. Registers users who verify or opt-in into data/subscribers.json.
 * 4. Scheduled Morning Broadcast: Sends daily verification brief to all registered
 *    citizens every morning between 4:00 AM and 6:00 AM (default 5:00 AM).
 * 5. Exposes HTTP trigger for instant demo broadcasting.
 */

import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import cron from 'node-cron';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const AUTH_DIR = path.join(__dirname, 'auth_info_baileys');
const SUBSCRIBERS_PATH = path.join(__dirname, '..', '..', 'data', 'subscribers.json');
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api/v1';
const BRIDGE_PORT = process.env.BRIDGE_PORT || 3001;

// Global socket reference
let sock = null;
let connectionState = 'disconnected';

// -------------------------------------------------------------
// Subscriber Management
// -------------------------------------------------------------

function getSubscribers() {
  try {
    if (!fs.existsSync(SUBSCRIBERS_PATH)) {
      fs.writeFileSync(SUBSCRIBERS_PATH, '[]', 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(SUBSCRIBERS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading subscribers:', err);
    return [];
  }
}

function saveSubscribers(list) {
  try {
    fs.writeFileSync(SUBSCRIBERS_PATH, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving subscribers:', err);
  }
}

function registerSubscriber(phoneJid, pushName = 'Citizen') {
  // Extract digits from JID (e.g., "2348012345678@s.whatsapp.net" -> "2348012345678")
  const cleanPhone = phoneJid.replace(/[^0-9]/g, '');
  const subscribers = getSubscribers();
  const existing = subscribers.find((s) => s.phone === cleanPhone || s.phone === phoneJid);

  if (!existing) {
    subscribers.push({
      phone: cleanPhone,
      jid: phoneJid,
      name: pushName || 'Citizen',
      registered_at: new Date().toISOString(),
      status: 'active',
    });
    saveSubscribers(subscribers);
    console.log(`[SUBSCRIBER] Registered new citizen: ${cleanPhone} (${pushName})`);
    return true;
  } else if (existing.status !== 'active') {
    existing.status = 'active';
    existing.jid = phoneJid;
    saveSubscribers(subscribers);
    console.log(`[SUBSCRIBER] Reactivated citizen: ${cleanPhone}`);
    return true;
  }
  return false;
}

function deactivateSubscriber(phoneJid) {
  const cleanPhone = phoneJid.replace(/[^0-9]/g, '');
  const subscribers = getSubscribers();
  const existing = subscribers.find((s) => s.phone === cleanPhone || s.phone === phoneJid);
  if (existing) {
    existing.status = 'inactive';
    saveSubscribers(subscribers);
    console.log(`[SUBSCRIBER] Unsubscribed: ${cleanPhone}`);
  }
}

// -------------------------------------------------------------
// Daily Morning Intelligence Briefing
// -------------------------------------------------------------

async function sendMorningBroadcast() {
  if (!sock || connectionState !== 'connected') {
    console.warn('[BROADCAST] Cannot send morning broadcast: WhatsApp not connected.');
    return { success: false, reason: 'not_connected' };
  }

  console.log('[BROADCAST] Preparing Morning SafeClaim Briefing...');

  let briefText = '';
  try {
    const res = await fetch(`${BACKEND_URL}/rumours/brief`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const topContradicted = data.top_clusters
      ? data.top_clusters.filter((c) => c.verdict === 'CONTRADICTED_BY_OFFICIAL_SOURCE')
      : [];

    briefText =
      `🌅 *Good Morning! SafeClaim Daily Verification Digest* 🏛️\n` +
      `📅 *Date:* ${data.date}\n\n` +
      `*Today's Public Health & Scam Briefing:*\n${data.summary}\n\n` +
      `🚨 *Top Debunked Rumours to Avoid Today:*\n` +
      (topContradicted.length > 0
        ? topContradicted.map((c) => `• *[${c.domain.toUpperCase()}]* ${c.claim}`).join('\n')
        : '• Zero new outbreak hoaxes confirmed today.') +
      `\n\n` +
      `☎️ *Emergency Helplines:*\n` +
      `• NCDC Outbreak Toll-Free: 6232\n` +
      `• FCCPC Predatory Loan Desk: 0800 033 2272\n` +
      `• INEC Citizens Center: 0700-CALL-INEC\n\n` +
      `_SafeClaim AI — Forward any suspicious text or voice note to this chat to verify with official receipts._`;
  } catch (err) {
    console.error('[BROADCAST] Error fetching brief from backend:', err);
    briefText =
      `🌅 *Good Morning from SafeClaim AI* 🏛️\n\n` +
      `Your daily health and consumer verification service is active.\n` +
      `Remember: The Federal Government never charges fees for social grants, and NCDC confirms zero Ebola in Lagos.\n\n` +
      `☎️ NCDC Toll-Free: 6232 | FCCPC: 0800 033 2272\n` +
      `_Reply with any rumour anytime to check the receipts!_`;
  }

  const subscribers = getSubscribers().filter((s) => s.status === 'active' && s.phone !== 'demo_subscriber');
  console.log(`[BROADCAST] Disseminating to ${subscribers.length} active registered citizens...`);

  let sentCount = 0;
  for (const sub of subscribers) {
    try {
      const targetJid = sub.jid || `${sub.phone}@s.whatsapp.net`;
      await sock.sendMessage(targetJid, { text: briefText });
      sentCount++;
      // Human-like pause of 1.5 seconds between dispatches to preserve carrier health
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err) {
      console.error(`[BROADCAST] Failed to send to ${sub.phone}:`, err.message);
    }
  }

  console.log(`[BROADCAST] Complete. Successfully sent to ${sentCount}/${subscribers.length} citizens.`);
  return { success: true, sentCount, totalSubscribers: subscribers.length };
}

// Schedule Morning Broadcast: Runs every morning at 5:00 AM (within the 4:00 AM - 6:00 AM window)
// Cron syntax: "0 5 * * *" = At minute 0 of hour 5 every day
cron.schedule('0 5 * * *', () => {
  console.log('[CRON] 5:00 AM Morning broadcast triggered.');
  sendMorningBroadcast();
});

// -------------------------------------------------------------
// Baileys WhatsApp Connection
// -------------------------------------------------------------

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`[BAILEYS] Using WhatsApp Web version: v${version.join('.')} (Latest: ${isLatest})`);

  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    syncFullHistory: false, // CRITICAL: Do NOT sync gigabytes of past chat history to avoid Bad MAC
    markOnlineOnConnect: true,
    getMessage: async (key) => undefined,
    browser: ['SafeClaim AI', 'Desktop', '1.0.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      connectionState = 'qr_ready';
      console.log('\n======================================================');
      console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP TO CONNECT:');
      console.log('   (WhatsApp -> Settings -> Linked Devices -> Link a Device)');
      console.log('======================================================\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      connectionState = 'disconnected';
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`[BAILEYS] Connection closed (code ${statusCode}). Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 3000);
      } else {
        console.log('[BAILEYS] Logged out. Delete auth_info_baileys/ and restart to scan new QR.');
      }
    } else if (connection === 'open') {
      connectionState = 'connected';
      console.log('\n======================================================');
      console.log('✅ SafeClaim WhatsApp Bot is LIVE & CONNECTED!');
      console.log('   Auto-replies and morning 4-6 AM broadcast active.');
      console.log('======================================================\n');
    }
  });

  // Handle incoming messages
  sock.ev.on('messages.upsert', async (m) => {
    try {
      // Only process real-time live incoming messages (ignore background history append)
      if (m.type !== 'notify') return;

      const msg = m.messages[0];
      if (!msg || !msg.message || msg.key.fromMe) return;

      const senderJid = msg.key.remoteJid;
      // Skip status updates / broadcast channels
      if (!senderJid || senderJid.endsWith('@broadcast') || senderJid === 'status@broadcast') return;

      const pushName = msg.pushName || 'Citizen';
      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        '';

      const trimmed = text.trim();
      if (!trimmed) return;

      console.log(`[INCOMING] Message from ${pushName} (${senderJid}): "${trimmed}"`);

      // Automatically register the citizen's number
      registerSubscriber(senderJid, pushName);

      // Check opt-out commands
      if (trimmed.toUpperCase() === 'STOP' || trimmed.toUpperCase() === 'UNSUBSCRIBE') {
        deactivateSubscriber(senderJid);
        await sock.sendMessage(
          senderJid,
          {
            text: 'You have been unsubscribed from SafeClaim daily morning briefings. Send "START" anytime to resubscribe.',
          },
          { quoted: msg }
        );
        return;
      }

      // Query SafeClaim API
      const webhookRes = await fetch(`${BACKEND_URL}/whatsapp/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Body: trimmed,
          From: senderJid,
          sender: pushName,
        }),
      });

      if (!webhookRes.ok) {
        throw new Error(`Backend returned HTTP ${webhookRes.status}`);
      }

      const webhookData = await webhookRes.json();
      const replyText = webhookData.reply || 'SafeClaim could not evaluate this request at this time.';

      // Natural pause before replying
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await sock.sendMessage(senderJid, { text: replyText }, { quoted: msg });
      console.log(`[REPLIED] Sent official receipt to ${senderJid}`);
    } catch (err) {
      console.error('[ERROR] Failed processing incoming message:', err);
    }
  });
}

// -------------------------------------------------------------
// Local Control & Webhook API (Port 3001)
// -------------------------------------------------------------

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: connectionState,
    subscribers_count: getSubscribers().filter((s) => s.status === 'active').length,
    scheduled_broadcast: 'Every morning between 04:00 - 06:00 (05:00 UTC)',
  });
});

app.get('/subscribers', (req, res) => {
  res.json(getSubscribers());
});

app.post('/register', (req, res) => {
  const { phone, name } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'phone is required' });
  }
  const clean = phone.replace(/[^0-9]/g, '');
  const jid = `${clean}@s.whatsapp.net`;
  registerSubscriber(jid, name || 'Citizen');
  res.json({ success: true, phone: clean, jid });
});

// Trigger an immediate broadcast for demo testing
app.post('/broadcast', async (req, res) => {
  console.log('[API] Manual broadcast trigger received.');
  const result = await sendMorningBroadcast();
  res.json(result);
});

// Send a single message to a specific number
app.post('/send', async (req, res) => {
  const { to, text } = req.body;
  if (!sock || connectionState !== 'connected') {
    return res.status(503).json({ error: 'WhatsApp is not connected' });
  }
  if (!to || !text) {
    return res.status(400).json({ error: 'to and text are required' });
  }
  try {
    const clean = to.replace(/[^0-9]/g, '');
    const jid = `${clean}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text });
    res.json({ success: true, to: jid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(BRIDGE_PORT, () => {
  console.log(`[SERVER] WhatsApp Bridge Controller running on port ${BRIDGE_PORT}`);
});

// Boot Baileys
connectToWhatsApp();
