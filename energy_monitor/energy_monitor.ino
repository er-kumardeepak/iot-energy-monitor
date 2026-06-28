#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- WiFi Credentials ---
#define WIFI_SSID "iot_energy"
#define WIFI_PASSWORD "12345678"

// --- Server Configuration ---
// Define your server URL and API endpoint here
#define SERVER_URL "http://10.233.178.16:5001" 
#define API_ENDPOINT "/api/v1/power-data"
#define DEVICE_ID "ESP32_Meter_01"

// Delay between data transmissions (in milliseconds)
#define POST_INTERVAL 10000 

unsigned long previousMillis = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\nConnecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long currentMillis = millis();

  // Send data at the defined interval
  if (currentMillis - previousMillis >= POST_INTERVAL) {
    previousMillis = currentMillis;

    // Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED) {
      
      // 1. Generate/Read your actual sensor data here
      // (Using dummy data for demonstration)
      float reactivePower = random(100, 500) / 10.0; // e.g., 12.5
      float apparentPower = random(1000, 2000) / 10.0; // e.g., 150.2
      float totalPower = apparentPower * 0.95; // e.g., 142.6
      float powerFactor = totalPower / apparentPower; // e.g., 0.95

      // 2. Send the data
      sendDataSecure(DEVICE_ID, reactivePower, apparentPower, totalPower, powerFactor);
      
    } else {
      Serial.println("Error: WiFi not connected.");
      // Optional: Attempt to reconnect to WiFi here
    }
  }
}

void sendDataSecure(String deviceID, float reactiveP, float apparentP, float totalP, float pf) {
  HTTPClient http;
  
  // Construct the full URL
  String fullURL = String(SERVER_URL) + String(API_ENDPOINT);
  Serial.print("Connecting to: ");
  Serial.println(fullURL);

  // Initialize the HTTP connection
  if (http.begin(fullURL)) {
      
    // Specify the content type as JSON
    http.addHeader("Content-Type", "application/json");

    // Create the JSON document
    // Capacity of 200 bytes is plenty for this specific payload
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["deviceID"] = deviceID;
    jsonDoc["reactivePower"] = reactiveP;
    jsonDoc["apparentPower"] = apparentP;
    jsonDoc["totalPower"] = totalP;
    jsonDoc["powerFactor"] = pf;

    // Serialize the JSON into a string
    String jsonString;
    serializeJson(jsonDoc, jsonString);

    Serial.println("Sending JSON payload:");
    Serial.println(jsonString);

    // Send the POST request
    int httpResponseCode = http.POST(jsonString);

    // Check the response
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      
      // Print the server's response payload (optional)
      String payload = http.getString();
      Serial.println("Server response: " + payload);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }

    // Free resources
    http.end();
  } else {
    Serial.println("Unable to connect to server.");
  }
  Serial.println("---------------------------------");
}
