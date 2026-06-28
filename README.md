# Energy Monitoring System

**Real-time power meter monitoring dashboard for ESP32 + Node.js + React**

## 🎯 What It Does

Monitors power consumption data from an ESP32 microcontroller and displays it beautifully on a web dashboard.

```
ESP32 (Power Meter)
    ↓ HTTP POST (10s interval)
Node.js Backend (Port 5000)
    ↓ REST API
React Dashboard (Port 5173)
    ↓
Web Browser (Real-time display)
```

## ⚡ Features

- ✅ **Real-time Data** - Updates every 10 seconds
- ✅ **Beautiful UI** - Dark theme, responsive design
- ✅ **Simple Architecture** - No database, just REST API
- ✅ **Easy Deployment** - Works on Raspberry Pi
- ✅ **Well Documented** - Quick start + complete guides

## 📦 What You Get

### 1. ESP32 Firmware (`energy_monitor.ino`)
- WiFi connectivity
- HTTP POST to backend
- Configurable interval (10s default)
- Serial debugging

### 2. Node.js Backend (`energy-backend/`)
- Express.js REST API
- In-memory data storage
- CORS enabled
- 5 API endpoints

### 3. React Dashboard (`dashboard/`)
- Real-time power metrics display
- Responsive design (mobile/tablet/desktop)
- Dark theme
- Live data polling

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Arduino IDE (for ESP32)
- ESP32 Development Board
- WiFi network

### Setup

**1. Backend (Terminal 1)**
```bash
cd energy-backend
npm install
npm start
```

**2. Frontend (Terminal 2)**
```bash
cd dashboard
npm install
npm run dev
```

**3. ESP32 Firmware (Arduino IDE)**
1. Open `energy_monitor.ino`
2. Update line 7: `#define SERVER_URL "http://192.168.X.X:5000"`
3. Update WiFi credentials (lines 6-7)
4. Upload to ESP32

**4. View Dashboard**
Open http://localhost:5173 in browser

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|----------|
| POST | `/api/v1/power-data` | Receive data from ESP32 |
| GET | `/api/v1/power-data` | Get all stored readings |
| GET | `/api/v1/power-data/latest` | Get latest reading |
| DELETE | `/api/v1/power-data` | Clear all data |
| GET | `/health` | Backend health check |

## 🔧 Configuration

**ESP32 Firmware**
- Line 6: WiFi SSID
- Line 7: WiFi Password
- Line 11: Backend URL (change IP)
- Line 14: Transmission interval (10000ms = 10s)

**Backend**
- Default port: 5000
- Max stored readings: 100
- Auto-listening on 0.0.0.0 (all interfaces)

**Frontend**
- Auto-detects backend IP
- Polling interval: 2 seconds
- Port: 5173 (dev)

## 📁 Project Structure

```
energy_project/
├── energy_monitor.ino          # ESP32 firmware
├── energy-backend/             # Node.js API
│   ├── server.js              # Main server
│   └── package.json           # Dependencies
├── dashboard/                 # React frontend
│   ├── src/
│   │   ├── App.jsx           # Main component
│   │   └── App.css           # Styling
│   └── package.json          # Dependencies
└── README.md                 # This file
```

## ✅ Verification

1. **Backend Running?**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Frontend Accessible?**
   - Open http://localhost:5173
   - Should show dashboard

3. **ESP32 Connected?**
   - Check Serial Monitor (115200 baud)
   - Should show "HTTP Response code: 201"

4. **Data Flowing?**
   - Dashboard updates every 2 seconds
   - Shows power readings

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to WiFi | Check SSID/password (case-sensitive) |
| Port 5000 already in use | `lsof -i :5000` to find process |
| Dashboard won't load | Verify backend is running |
| No data on dashboard | Check ESP32 is sending (Serial Monitor) |
| ESP32 can't find server | Verify IP address is correct |

## 📚 Documentation

For detailed setup instructions, see:
- [QUICK_START.md](./QUICK_START.md) - 5-minute setup
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design

## 🎓 Learning Resources

- ESP32 WiFi: https://docs.espressif.com/
- Express.js: https://expressjs.com/
- React: https://react.dev/
- ArduinoJson: https://arduinojson.org/

## 📝 License

MIT

## 🤝 Contributing

Feel free to modify and extend!

---

**Status**: ✅ Production Ready  
**Last Updated**: June 21, 2024  
**Version**: 1.0
