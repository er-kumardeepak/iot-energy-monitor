# 📖 Complete Setup Guide

**Detailed step-by-step instructions for all components**

## 📋 Prerequisites

### Hardware
- ESP32 Development Board
- USB cable (for ESP32)
- WiFi network (2.4GHz recommended)
- Computer (Linux/Mac/Windows)

### Software
- Node.js 16+ ([download](https://nodejs.org/))
- Arduino IDE ([download](https://www.arduino.cc/en/software))
- Git (optional)

### Accounts
- None required! This is completely local

---

## 🔧 Backend Setup

### 1. Install Node.js
Check if installed:
```bash
node --version
npm --version
```

If not installed, download from https://nodejs.org/

### 2. Navigate to Backend
```bash
cd energy_project/energy-backend
```

### 3. Install Dependencies
```bash
npm install
```

This installs:
- `express` - Web server
- `cors` - Cross-origin support
- `nodemon` (dev) - Auto-restart

### 4. Start Server
```bash
npm start
```

Expected output:
```
Server running on port 5000
Listening on 0.0.0.0:5000
```

✅ **Backend is ready!** Leave this running.

### Test Backend
```bash
# In another terminal
curl http://localhost:5000/health
```

Should return:
```json
{"status":"ok","timestamp":"2024-06-21T..."}
```

---

## 🎨 Frontend Setup

### 1. Navigate to Dashboard
```bash
cd energy_project/dashboard
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- `react` - UI framework
- `vite` - Build tool
- Development tools

### 3. Start Development Server
```bash
npm run dev
```

Expected output:
```
VITE v4.X.X ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 4. Open in Browser
Click the link or open http://localhost:5173

✅ **Frontend is ready!**

### Initial State
You should see:
- Dashboard header
- "Waiting for data..." message
- Connection status: "Not connected"

This is normal - backend needs to receive data from ESP32.

---

## 🔌 ESP32 Firmware Setup

### 1. Install Arduino IDE
Download from https://www.arduino.cc/en/software

### 2. Install ESP32 Board Support
1. Arduino IDE → File → Preferences
2. Add this URL to "Additional Board Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Tools → Board → Board Manager
4. Search "esp32"
5. Install "esp32 by Espressif Systems"

### 3. Install ArduinoJson Library
1. Tools → Manage Libraries
2. Search "ArduinoJson"
3. Install version 6.20.0 or higher

### 4. Edit Firmware Configuration
Open `energy_monitor.ino` in Arduino IDE

Update these lines:

**Line 6 - WiFi SSID:**
```cpp
#define WIFI_SSID "your_wifi_network_name"
```

**Line 7 - WiFi Password:**
```cpp
#define WIFI_PASSWORD "your_wifi_password"
```

**Line 11 - Backend URL:**
```cpp
#define SERVER_URL "http://192.168.X.X:5000"
```

⚠️ **Find your backend IP:**
```bash
# On Linux/Mac
hostname -I

# On Windows
ipconfig
# Look for "IPv4 Address"
```

### 5. Select Board & Port
1. Tools → Board → ESP32 Dev Module
2. Tools → Port → select your ESP32 port
   - Linux: `/dev/ttyUSB0` or similar
   - Mac: `/dev/cu.SLAB_USBtoUART` or similar
   - Windows: `COM3` or similar

### 6. Upload Firmware
1. Sketch → Upload (or press Ctrl+U)
2. Wait for "Done uploading" message

### 7. View Serial Output
1. Tools → Serial Monitor
2. Set baud to **115200** (bottom right)
3. Press ESP32 reset button

Expected output:
```
Connecting to WiFi...
.....
WiFi connected!
IP Address: 192.168.1.105
Connecting to: http://192.168.X.X:5000/api/v1/power-data
HTTP Response code: 201
```

✅ **ESP32 is sending data!**

---

## ✅ Verification Checklist

### Backend ✓
- [ ] Terminal shows `Server running on port 5000`
- [ ] `curl http://localhost:5000/health` returns JSON
- [ ] Terminal shows POST requests coming in

### Frontend ✓
- [ ] Browser opens at http://localhost:5173
- [ ] Page doesn't show errors
- [ ] Dashboard layout is visible

### ESP32 ✓
- [ ] Serial Monitor shows connection attempts
- [ ] Shows `HTTP Response code: 201` messages
- [ ] Serial output repeats every 10 seconds

### End-to-End ✓
- [ ] Dashboard status shows "Connected"
- [ ] Dashboard displays power values
- [ ] Values update every 2 seconds
- [ ] Serial Monitor keeps sending successfully

---

## 🚀 What's Happening

```
1. ESP32 connects to WiFi
   ↓
2. Every 10 seconds, ESP32 sends:
   POST /api/v1/power-data
   Content: {deviceID, totalPower, apparentPower, etc}
   ↓
3. Backend receives & stores in memory
   ↓
4. Frontend polls every 2 seconds:
   GET /api/v1/power-data/latest
   ↓
5. Browser updates display with new values
```

---

## 🔧 Configuration Options

### Change ESP32 Interval
Edit `energy_monitor.ino` line 14:
```cpp
#define POST_INTERVAL 10000  // milliseconds
```
- `5000` = 5 seconds
- `10000` = 10 seconds (default)
- `30000` = 30 seconds

### Change Backend Port
Edit `energy-backend/server.js` line 2:
```javascript
const PORT = 5000;  // Change to 8000, 3000, etc.
```
Then restart backend.

### Change Frontend Polling
Edit `dashboard/src/App.jsx` search for `2000`:
```javascript
setInterval(() => fetchLatest(), 2000);  // milliseconds
```

---

## 🆘 Troubleshooting

### "Cannot find module 'express'"
```bash
cd energy-backend
npm install
```

### "Port 5000 already in use"
Find and kill process:
```bash
lsof -i :5000
kill -9 <PID>
```

### "Cannot open serial port"
- Check USB cable is connected
- Check device manager for ESP32 port
- May need USB driver: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers

### "HTTP Response code: 0 or connection error"
- Verify backend IP address is correct (line 11 in firmware)
- Ensure both devices on same WiFi network
- Firewall may be blocking - try disabling temporarily

### Dashboard shows "Connection Error"
- Verify backend is running (see `Server running on port 5000`)
- Check browser console (F12) for error messages
- Verify backend IP in frontend network request

### No data appearing on dashboard
- Check Serial Monitor shows successful POST (201)
- Verify backend is receiving requests (check terminal)
- Hard refresh browser (Ctrl+Shift+R)

---

## 📊 API Reference

### POST /api/v1/power-data
**From**: ESP32 firmware  
**Interval**: 10 seconds  
**Payload**:
```json
{
  "deviceID": "ESP32_Meter_01",
  "reactivePower": 45.2,
  "apparentPower": 120.5,
  "totalPower": 115.0,
  "powerFactor": 0.95
}
```

**Response**:
```json
{
  "success": true,
  "message": "Power data received",
  "id": "reading_123"
}
```

### GET /api/v1/power-data/latest
**From**: React Dashboard  
**Interval**: 2 seconds  
**Response**:
```json
{
  "id": "reading_123",
  "deviceID": "ESP32_Meter_01",
  "reactivePower": 45.2,
  "apparentPower": 120.5,
  "totalPower": 115.0,
  "powerFactor": 0.95,
  "timestamp": "2024-06-21T10:30:45.123Z"
}
```

### GET /api/v1/power-data
**From**: Dashboard or testing  
**Query**: `?limit=10` (optional)  
**Response**: Array of readings

### GET /health
**From**: Testing/monitoring  
**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-06-21T10:30:45.123Z"
}
```

---

## 🎯 Next Steps

After successful setup:

1. **Explore the Code**
   - Read `energy-backend/server.js`
   - Read `dashboard/src/App.jsx`
   - Read `energy_monitor.ino`

2. **Customize Dashboard**
   - Edit colors in `dashboard/src/App.css`
   - Add new metrics in React component
   - Change polling interval

3. **Deploy to Raspberry Pi**
   - SSH into Raspberry Pi
   - Clone this repo
   - Run same setup steps
   - Use PM2 for auto-restart

4. **Integrate Real Sensor**
   - Replace `readPowerMeter()` in firmware
   - Connect actual power meter
   - Adjust JSON fields as needed

---

## ❓ FAQ

**Q: Do I need a real energy meter?**  
A: No! Firmware includes simulated data. Start with that, upgrade later.

**Q: Can I run everything on one machine?**  
A: Yes! Perfect for learning and testing.

**Q: Can I access dashboard from other computers?**  
A: Yes! Use your machine's IP instead of localhost:
```
http://192.168.X.X:5173
```

**Q: Can I run multiple ESP32s?**  
A: Yes! Just give each a unique deviceID and backend stores all readings.

**Q: How long does data persist?**  
A: Backend stores last 100 readings in memory. Data lost when backend restarts.

**Q: Can I add a database later?**  
A: Yes! The API design makes it easy to swap in PostgreSQL or MongoDB.

---

## 📞 Still Stuck?

1. Check Serial Monitor output - it shows exact errors
2. Check browser console (F12) - JavaScript errors appear there
3. Check backend terminal - shows incoming requests
4. Verify all IPs and ports match what you configured

---

**Now you should have a working system! 🎉**
