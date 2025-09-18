// utils.js
const os = require("os");
const dns = require("dns");
const { networkInterfaces } = require("os");
const https = require("https");

// Get OS information
function getOSInfo() {
  return {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().map(cpu => cpu.model),
    totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(2),
    freeMemMB: (os.freemem() / 1024 / 1024).toFixed(2),
    uptimeMinutes: Math.round(os.uptime() / 60),
  };
}

// Get hostname
function getHostName() {
  return os.hostname();
}

// Get local IP addresses
function getLocalIPs() {
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (net.family === "IPv4" && !net.internal) {
        results.push({ iface: name, address: net.address });
      }
    }
  }

  return results;
}

// Get public IP using external service
function getPublicIP(callback) {
  https.get("https://api.ipify.org?format=json", res => {
    let data = "";
    res.on("data", chunk => (data += chunk));
    res.on("end", () => {
      try {
        const ip = JSON.parse(data).ip;
        callback(null, ip);
      } catch (err) {
        callback(err);
      }
    });
  }).on("error", err => {
    callback(err);
  });
}

// Example usage
console.log("OS Info:", getOSInfo());
console.log("Hostname:", getHostName());
console.log("Local IPs:", getLocalIPs());

getPublicIP((err, ip) => {
  if (err) {
    console.error("Error fetching public IP:", err.message);
  } else {
    console.log("Public IP:", ip);
  }
});
