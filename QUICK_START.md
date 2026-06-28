# ⚡ Quick Start (5 minutes)

**Get everything running NOW!**

## 🚀 The 4-Step Setup

### Step 1: Start Backend
```bash
cd energy-backend
npm install
npm start
```
✅ Should see: `Server running on port 5000`

### Step 2: Start Frontend
```bash
cd dashboard
npm install
npm run dev
```
✅ Open http://localhost:5173 in browser

### Step 3: Configure Firmware
Edit `energy_monitor.ino`:
- **Line 6**: Your WiFi SSID
- **Line 7**: Your WiFi password  
- **Line 11**: Your backend IP (change `192.168.X.X` to your IP)

**Find your IP:**
```bash
hostname -I
```

### Step 4: Upload to ESP32
1. Arduino IDE → Tools → Board → ESP32 Dev Module
2. Tools → Port → select your port
3. Sketch → Upload
4. Tools → Serial Monitor (115200 baud)

## ✅ Success Signs

- ✅ Backend shows `Server running on port 5000`
- ✅ Frontend loads at http://localhost:5173
- ✅ Serial Monitor shows `HTTP Response code: 201`
- ✅ Dashboard displays live power values

## 🆘 Common Fixes

| Issue | Fix |
|-------|-----|
| Port 5000 in use | `lsof -i :5000` to find, then kill process |
| Can't upload to ESP32 | Check USB cable & COM port selection |
| Dashboard shows error | Verify backend IP in firmware (line 11) |
| No data on dashboard | Check Serial Monitor output in Arduino IDE |

## 📚 For Complete Setup

See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
