import React, { useState } from 'react';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentBattle, setCurrentBattle] = useState(null);
  const [battleResult, setBattleResult] = useState(null);

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

  const startScanning = () => {
    setIsScanning(true);
    // Simulate device detection for web dengan jarak ±1 meter
    setTimeout(() => {
      const nearbyDevices = [
        { id: '1', name: 'Player Alpha', distance: 0.7 },
        { id: '2', name: 'Player Beta', distance: 0.9 },
        { id: '3', name: 'Player Gamma', distance: 1.1 }
      ];
      
      setDevices(nearbyDevices);
      
      // Auto-start battle dengan device terdekat dalam radius 1 meter
      const closeDevice = nearbyDevices.find(device => device.distance <= 1.0);
      if (closeDevice) {
        setTimeout(() => {
          startBattle(closeDevice);
        }, 1000);
      }
    }, 2000);
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
          {!isScanning ? (
            <button style={styles.button} onClick={startScanning}>
              🔍 Scan Players (Radius 1m)
            </button>
          ) : (
            <button style={styles.buttonStop} onClick={stopScanning}>
              ⏹️ Stop Scan
            </button>
          )}
        </div>

        {isScanning && (
          <div style={styles.scanning}>
            <p style={styles.scanText}>🔄 Scanning players dalam radius 1 meter...</p>
            <p style={styles.autoText}>⚡ Auto-battle saat player terdeteksi!</p>
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
}; 