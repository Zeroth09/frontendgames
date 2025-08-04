import React, { useState } from 'react';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = () => {
    setIsScanning(true);
    // Simulate device detection for web
    setTimeout(() => {
      setDevices([
        { id: '1', name: 'Device 1', distance: 1.5 },
        { id: '2', name: 'Device 2', distance: 2.3 },
        { id: '3', name: 'Device 3', distance: 0.8 }
      ]);
    }, 2000);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setDevices([]);
  };

  const handleBattle = (device) => {
    alert(`Battle dengan ${device.name}! 🎮`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎮 Battle Proximity Detector</h1>
        <p style={styles.subtitle}>
          Temukan dan battle dengan devices terdekat! 💪
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.controls}>
          {!isScanning ? (
            <button style={styles.button} onClick={startScanning}>
              🔍 Mulai Scan
            </button>
          ) : (
            <button style={styles.buttonStop} onClick={stopScanning}>
              ⏹️ Stop Scan
            </button>
          )}
        </div>

        {isScanning && (
          <div style={styles.scanning}>
            <p style={styles.scanText}>🔄 Scanning untuk devices...</p>
          </div>
        )}

        {devices.length > 0 && (
          <div style={styles.deviceList}>
            <h3 style={styles.listTitle}>📱 Devices Terdeteksi:</h3>
            {devices.map(device => (
              <div key={device.id} style={styles.deviceCard}>
                <div style={styles.deviceInfo}>
                  <h4 style={styles.deviceName}>{device.name}</h4>
                  <p style={styles.deviceDistance}>
                    📍 Jarak: {device.distance}m
                  </p>
                </div>
                <button 
                  style={styles.battleButton}
                  onClick={() => handleBattle(device)}
                >
                  ⚔️ Battle!
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          🔗 Backend: <a href="https://backend-production-9ccf.up.railway.app" target="_blank" rel="noopener noreferrer">
            backend-production-9ccf.up.railway.app
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0',
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  controls: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  button: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  buttonStop: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  scanning: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  scanText: {
    color: '#6366f1',
    fontWeight: 'bold',
    margin: '0',
  },
  deviceList: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  listTitle: {
    color: '#1e293b',
    marginTop: '0',
    marginBottom: '16px',
  },
  deviceCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  deviceInfo: {
    flex: '1',
  },
  deviceName: {
    margin: '0 0 4px 0',
    color: '#1e293b',
    fontSize: '18px',
  },
  deviceDistance: {
    margin: '0',
    color: '#64748b',
    fontSize: '14px',
  },
  battleButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#1e293b',
  },
  footerText: {
    color: '#94a3b8',
    margin: '0',
  },
}; 