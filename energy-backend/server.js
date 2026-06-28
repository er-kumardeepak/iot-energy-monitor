import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data storage (last 100 readings)
let powerReadings = [];
const MAX_READINGS = 100;

// Load control state for each device
let loadControlState = {
  // Format: { "deviceID": { mode: "manual" | "automatic", status: true | false } }
};

// Simple health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Receive data from firmware (ESP32)
app.post("/api/v1/power-data", (req, res) => {
  try {
    const {
      deviceID,
      reactivePower,
      apparentPower,
      totalPower,
      powerFactor
    } = req.body;

    // Validate required fields
    if (!deviceID || reactivePower === undefined || apparentPower === undefined || 
        totalPower === undefined || powerFactor === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newReading = {
      id: Date.now(),
      deviceID,
      reactivePower: parseFloat(reactivePower),
      apparentPower: parseFloat(apparentPower),
      totalPower: parseFloat(totalPower),
      powerFactor: parseFloat(powerFactor),
      timestamp: new Date().toISOString()
    };

    // Add to storage (keep only latest MAX_READINGS)
    powerReadings.unshift(newReading);
    if (powerReadings.length > MAX_READINGS) {
      powerReadings.pop();
    }

    console.log(`✓ Received data from ${deviceID}:`, newReading);

    res.status(201).json({
      success: true,
      data: newReading,
      message: "Data received successfully"
    });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Failed to process data" });
  }
});

// Get all unique devices
app.get("/api/v1/devices", (req, res) => {
  try {
    const uniqueDevices = [...new Set(powerReadings.map(r => r.deviceID))];
    const deviceData = uniqueDevices.map(deviceID => {
      const latestReading = powerReadings.find(r => r.deviceID === deviceID);
      return {
        deviceID,
        lastReading: latestReading || null,
        status: latestReading ? "online" : "offline"
      };
    }).sort((a, b) => {
      const timeA = new Date(a.lastReading?.timestamp || 0);
      const timeB = new Date(b.lastReading?.timestamp || 0);
      return timeB - timeA;
    });

    res.json({
      success: true,
      count: deviceData.length,
      data: deviceData
    });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});

// Get latest readings (optionally filtered by device)
app.get("/api/v1/power-data", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const deviceID = req.query.deviceID;
    
    let filtered = powerReadings;
    if (deviceID) {
      filtered = powerReadings.filter(r => r.deviceID === deviceID);
    }
    const latest = filtered.slice(0, limit);
    
    res.json({
      success: true,
      count: latest.length,
      data: latest
    });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get single latest reading (optionally filtered by device)
app.get("/api/v1/power-data/latest", (req, res) => {
  try {
    const deviceID = req.query.deviceID;
    
    let latest;
    if (deviceID) {
      latest = powerReadings.find(r => r.deviceID === deviceID) || null;
    } else {
      latest = powerReadings[0] || null;
    }
    
    res.json({
      success: true,
      data: latest
    });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Clear all data (optional - for testing)
app.delete("/api/v1/power-data", (req, res) => {
  powerReadings = [];
  res.json({ success: true, message: "Data cleared" });
});

// Get load control state for a device
app.get("/api/v1/load-control/:deviceID", (req, res) => {
  try {
    const { deviceID } = req.params;
    const state = loadControlState[deviceID] || { mode: "automatic", status: false };
    
    res.json({
      success: true,
      data: {
        deviceID,
        ...state
      }
    });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch load control state" });
  }
});

// Set load control mode (automatic or manual)
app.post("/api/v1/load-control/:deviceID/mode", (req, res) => {
  try {
    const { deviceID } = req.params;
    const { mode } = req.body;

    if (!mode || !["automatic", "manual"].includes(mode)) {
      return res.status(400).json({ error: "Invalid mode. Must be 'automatic' or 'manual'" });
    }

    if (!loadControlState[deviceID]) {
      loadControlState[deviceID] = { mode: "automatic", status: false };
    }

    loadControlState[deviceID].mode = mode;
    
    console.log(`✓ Set ${deviceID} mode to ${mode}`);

    res.json({
      success: true,
      data: loadControlState[deviceID],
      message: `Mode changed to ${mode}`
    });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Failed to set mode" });
  }
});

// Toggle load power on/off (manual mode only)
app.post("/api/v1/load-control/:deviceID/toggle", (req, res) => {
  try {
    const { deviceID } = req.params;
    const { status } = req.body;

    if (status === undefined || typeof status !== "boolean") {
      return res.status(400).json({ error: "Invalid status. Must be true or false" });
    }

    if (!loadControlState[deviceID]) {
      loadControlState[deviceID] = { mode: "automatic", status: false };
    }

    if (loadControlState[deviceID].mode !== "manual") {
      return res.status(400).json({ 
        error: "Cannot toggle load in automatic mode. Switch to manual mode first.",
        currentMode: loadControlState[deviceID].mode
      });
    }

    loadControlState[deviceID].status = status;
    
    console.log(`✓ ${deviceID} load turned ${status ? "ON" : "OFF"}`);

    res.json({
      success: true,
      data: loadControlState[deviceID],
      message: `Load turned ${status ? "ON" : "OFF"}`
    });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Failed to toggle load" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Energy Backend Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Firmware sends data to: http://YOUR_PI_IP:${PORT}/api/v1/power-data`);
  console.log(`📊 Frontend fetches from: http://YOUR_PI_IP:${PORT}/api/v1/power-data\n`);
});