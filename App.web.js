import React, { useState } from 'react';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentBattle, setCurrentBattle] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMethod, setScanMethod] = useState('wifi');

  // Bank pertanyaan battle
  const questions = [
    {
      question: "Apa ibukota Indonesia?",
      options: ["Jakarta", "Bandung", "Surabaya", "Medan"],
      correct: 0
    },
    {
      question: "Planet terdekat dengan Matahari adalah?",
      options: ["Venus", "Mars", "Merkurius", "Bumi"],
      correct: 2
    },
    {
      question: "Siapa penemu bola lampu?",
      options: ["Edison", "Einstein", "Newton", "Tesla"],
      correct: 0
    },
    {
      question: "Berapa hasil dari 15 x 8?",
      options: ["120", "125", "115", "130"],
      correct: 0
    },
    {
      question: "Bahasa pemrograman apa yang digunakan untuk web?",
      options: ["Python", "JavaScript", "C++", "Java"],
      correct: 1
    },
    {
      question: "Siapa presiden pertama Indonesia?",
      options: ["Suharto", "Habibie", "Soekarno", "Megawati"],
      correct: 2
    },
    {
      question: "Apa warna yang dihasilkan dari merah + biru?",
      options: ["Hijau", "Ungu", "Orange", "Kuning"],
      correct: 1
    },
    {
      question: "Berapa jumlah hari dalam setahun?",
      options: ["364", "365", "366", "367"],
      correct: 1
    }
  ];

  // Simulasi scan WiFi dan Bluetooth yang realistis
  const scanForDevices = async () => {
    const detectedDevices = [];
    
    // Simulasi scan WiFi hotspots
    if (scanMethod === 'wifi') {
      const wifiDevices = await simulateWiFiScan();
      detectedDevices.push(...wifiDevices);
    }
    
    // Simulasi scan Bluetooth devices
    if (scanMethod === 'bluetooth') {
      const bluetoothDevices = await simulateBluetoothScan();
      detectedDevices.push(...bluetoothDevices);
    }
    
    // Simulasi scan gabungan
    if (scanMethod === 'combined') {
      const wifiDevices = await simulateWiFiScan();
      const bluetoothDevices = await simulateBluetoothScan();
      detectedDevices.push(...wifiDevices, ...bluetoothDevices);
    }
    
    return detectedDevices;
  };

  const simulateWiFiScan = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulasi deteksi hotspot WiFi dengan signal strength untuk kalkulasi jarak
        const randomDevices = Math.random() < 0.3 ? [ // 30% chance ada device
          {
            id: 'wifi_' + Date.now(),
            name: 'WiFi Player ' + Math.floor(Math.random() * 100),
            distance: parseFloat((Math.random() * 2.5).toFixed(1)), // 0-2.5m
            signalStrength: -30 - Math.random() * 50, // -30 to -80 dBm
            method: 'WiFi Hotspot'
          }
        ] : [];
        resolve(randomDevices);
      }, 1000);
    });
  };

  const simulateBluetoothScan = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulasi deteksi Bluetooth devices dengan RSSI untuk kalkulasi jarak
        const randomDevices = Math.random() < 0.4 ? [ // 40% chance ada device
          {
            id: 'bt_' + Date.now(),
            name: 'BT Player ' + Math.floor(Math.random() * 100),
            distance: parseFloat((Math.random() * 2.0).toFixed(1)), // 0-2.0m
            signalStrength: -40 - Math.random() * 40, // -40 to -80 dBm
            method: 'Bluetooth LE'
          }
        ] : [];
        resolve(randomDevices);
      }, 1500);
    });
  };

  const startScanning = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setDevices([]);
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    
    try {
      // Scan untuk devices
      const detectedDevices = await scanForDevices();
      
      setDevices(detectedDevices);
      
      // Auto-start battle HANYA jika ada device dalam radius 1 meter
      const closeDevice = detectedDevices.find(device => device.distance <= 1.0);
      if (closeDevice && detectedDevices.length > 0) {
        setTimeout(() => {
          startBattle(closeDevice);
        }, 1000);
      }
    } catch (error) {
      console.error('Scan error:', error);
    }
    
    clearInterval(progressInterval);
    setScanProgress(100);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setDevices([]);
  };

  const startBattle = (device) => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentBattle({
      opponent: device,
      question: randomQuestion,
      playerScore: 0,
      opponentScore: 0,
      round: 1
    });
  };

  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === currentBattle.question.correct;
    const opponentAnswer = Math.random() < 0.7; // 70% chance opponent jawab benar
    
    const newPlayerScore = currentBattle.playerScore + (isCorrect ? 1 : 0);
    const newOpponentScore = currentBattle.opponentScore + (opponentAnswer ? 1 : 0);

    if (currentBattle.round >= 3) {
      // Battle selesai setelah 3 round
      const winner = newPlayerScore > newOpponentScore ? 'Kamu' : 
                    newPlayerScore < newOpponentScore ? currentBattle.opponent.name : 'Seri';
      
      setBattleResult({
        winner,
        playerScore: newPlayerScore,
        opponentScore: newOpponentScore
      });
      setCurrentBattle(null);
    } else {
      // Lanjut ke round berikutnya
      const nextQuestion = questions[Math.floor(Math.random() * questions.length)];
      setCurrentBattle({
        ...currentBattle,
        question: nextQuestion,
        playerScore: newPlayerScore,
        opponentScore: newOpponentScore,
        round: currentBattle.round + 1
      });
    }
  };

  const closeBattleResult = () => {
    setBattleResult(null);
    setDevices([]);
    setIsScanning(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🧠 Battle Quiz Proximity</h1>
        <p style={styles.subtitle}>
          Scan players dalam radius 1 meter dan battle dengan quiz! 🎯
        </p>
      </div>

      {/* Battle Quiz Modal */}
      {currentBattle && (
        <div style={styles.battleModal}>
          <div style={styles.battleContainer}>
            <div style={styles.battleHeader}>
              <h2 style={styles.battleTitle}>⚔️ Quiz Battle!</h2>
              <p style={styles.battleOpponent}>VS {currentBattle.opponent.name}</p>
              <div style={styles.scoreBoard}>
                <span style={styles.score}>Kamu: {currentBattle.playerScore}</span>
                <span style={styles.round}>Round {currentBattle.round}/3</span>
                <span style={styles.score}>{currentBattle.opponent.name}: {currentBattle.opponentScore}</span>
              </div>
            </div>
            
            <div style={styles.questionContainer}>
              <h3 style={styles.question}>{currentBattle.question.question}</h3>
              <div style={styles.optionsContainer}>
                {currentBattle.question.options.map((option, index) => (
                  <button
                    key={index}
                    style={styles.optionButton}
                    onClick={() => handleAnswer(index)}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Battle Result Modal */}
      {battleResult && (
        <div style={styles.battleModal}>
          <div style={styles.resultContainer}>
            <h2 style={styles.resultTitle}>
              {battleResult.winner === 'Kamu' ? '🏆 Kamu Menang!' : 
               battleResult.winner === 'Seri' ? '🤝 Seri!' : '😅 Kamu Kalah!'}
            </h2>
            <div style={styles.finalScore}>
              <p>Score Akhir:</p>
              <p>Kamu: {battleResult.playerScore}</p>
              <p>Opponent: {battleResult.opponentScore}</p>
            </div>
            <button style={styles.button} onClick={closeBattleResult}>
              🔄 Main Lagi
            </button>
          </div>
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.controls}>
          {!isScanning && (
            <div style={styles.scanMethodSelector}>
              <p style={styles.methodLabel}>Pilih Metode Scan:</p>
              <div style={styles.methodButtons}>
                <button 
                  style={scanMethod === 'wifi' ? styles.methodButtonActive : styles.methodButton}
                  onClick={() => setScanMethod('wifi')}
                >
                  📶 WiFi Hotspot
                </button>
                <button 
                  style={scanMethod === 'bluetooth' ? styles.methodButtonActive : styles.methodButton}
                  onClick={() => setScanMethod('bluetooth')}
                >
                  🔵 Bluetooth LE
                </button>
                <button 
                  style={scanMethod === 'combined' ? styles.methodButtonActive : styles.methodButton}
                  onClick={() => setScanMethod('combined')}
                >
                  🌐 WiFi + BT
                </button>
              </div>
            </div>
          )}
          
          {!isScanning ? (
            <button style={styles.button} onClick={startScanning}>
              🔍 Scan Players ({scanMethod === 'wifi' ? 'WiFi' : scanMethod === 'bluetooth' ? 'Bluetooth' : 'Combined'})
            </button>
          ) : (
            <button style={styles.buttonStop} onClick={stopScanning}>
              ⏹️ Stop Scan
            </button>
          )}
        </div>

        {isScanning && (
          <div style={styles.scanning}>
            <p style={styles.scanText}>
              🔄 Scanning {scanMethod === 'wifi' ? 'WiFi Hotspots' : scanMethod === 'bluetooth' ? 'Bluetooth Devices' : 'WiFi + Bluetooth'}...
            </p>
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${scanProgress}%`}}></div>
              </div>
              <span style={styles.progressText}>{scanProgress}%</span>
            </div>
            <p style={styles.autoText}>⚡ Auto-battle saat player dalam radius 1m terdeteksi!</p>
            <p style={styles.methodInfo}>
              {scanMethod === 'wifi' && '📶 Menggunakan signal strength WiFi untuk kalkulasi jarak'}
              {scanMethod === 'bluetooth' && '🔵 Menggunakan RSSI Bluetooth untuk deteksi proximity'}
              {scanMethod === 'combined' && '🌐 Scanning WiFi + Bluetooth untuk akurasi maksimal'}
            </p>
          </div>
        )}

        {devices.length > 0 && !currentBattle && (
          <div style={styles.deviceList}>
            <h3 style={styles.listTitle}>👥 Players Terdeteksi:</h3>
            {devices.map(device => (
              <div key={device.id} style={styles.deviceCard}>
                <div style={styles.deviceInfo}>
                  <h4 style={styles.deviceName}>{device.name}</h4>
                  <p style={styles.deviceDistance}>
                    📍 Jarak: {device.distance}m {device.distance <= 1.0 ? '🎯' : '❌'}
                  </p>
                  <p style={styles.deviceMethod}>
                    {device.method} | Signal: {device.signalStrength}dBm
                  </p>
                </div>
                {device.distance <= 1.0 && (
                  <span style={styles.readyBadge}>
                    ⚔️ Battle Ready!
                  </span>
                )}
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
  // Battle Quiz Styles
  battleModal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  battleContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80%',
    overflow: 'auto',
  },
  battleHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  battleTitle: {
    color: '#1e293b',
    margin: '0 0 10px 0',
    fontSize: '28px',
  },
  battleOpponent: {
    color: '#64748b',
    margin: '0 0 20px 0',
    fontSize: '18px',
  },
  scoreBoard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: '15px',
    borderRadius: '8px',
  },
  score: {
    fontWeight: 'bold',
    color: '#6366f1',
  },
  round: {
    fontWeight: 'bold',
    color: '#ef4444',
    fontSize: '18px',
  },
  questionContainer: {
    textAlign: 'center',
  },
  question: {
    color: '#1e293b',
    margin: '0 0 30px 0',
    fontSize: '24px',
    lineHeight: '1.4',
  },
  optionsContainer: {
    display: 'grid',
    gap: '15px',
  },
  optionButton: {
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    padding: '15px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    textAlign: 'left',
    transition: 'all 0.3s ease',
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
  },
  resultTitle: {
    color: '#1e293b',
    margin: '0 0 20px 0',
    fontSize: '32px',
  },
  finalScore: {
    backgroundColor: '#f1f5f9',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
    fontSize: '18px',
  },
  autoText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '10px 0 0 0',
  },
  readyBadge: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  // Scan Method Styles
  scanMethodSelector: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  methodLabel: {
    margin: '0 0 10px 0',
    color: '#64748b',
    fontSize: '14px',
  },
  methodButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  methodButton: {
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  methodButtonActive: {
    backgroundColor: '#6366f1',
    border: '2px solid #6366f1',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  // Progress Bar Styles
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '15px 0',
  },
  progressBar: {
    flex: '1',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#6366f1',
    minWidth: '40px',
  },
  methodInfo: {
    fontSize: '12px',
    color: '#6366f1',
    fontStyle: 'italic',
    margin: '10px 0 0 0',
  },
  deviceMethod: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
  },
}; 