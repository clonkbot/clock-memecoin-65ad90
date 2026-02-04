import { useState, useEffect, useCallback } from 'react';
import './styles.css';

function AnimatedClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  return (
    <div className="clock-container">
      <div className="clock-glow"></div>
      <svg viewBox="0 0 200 200" className="clock-svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88"/>
            <stop offset="100%" stopColor="#00ffcc"/>
          </linearGradient>
        </defs>

        {/* Clock face */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="url(#clockGrad)" strokeWidth="2" filter="url(#glow)" opacity="0.8"/>
        <circle cx="100" cy="100" r="90" fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.3"/>

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 100 + 75 * Math.cos(angle);
          const y1 = 100 + 75 * Math.sin(angle);
          const x2 = 100 + 85 * Math.cos(angle);
          const y2 = 100 + 85 * Math.sin(angle);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00ff88" strokeWidth="3" filter="url(#glow)"/>
          );
        })}

        {/* Minute markers */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const x1 = 100 + 82 * Math.cos(angle);
          const y1 = 100 + 82 * Math.sin(angle);
          const x2 = 100 + 85 * Math.cos(angle);
          const y2 = 100 + 85 * Math.sin(angle);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00ff88" strokeWidth="1" opacity="0.5"/>
          );
        })}

        {/* Hour hand */}
        <line
          x1="100" y1="100"
          x2={100 + 45 * Math.cos((hourDeg - 90) * Math.PI / 180)}
          y2={100 + 45 * Math.sin((hourDeg - 90) * Math.PI / 180)}
          stroke="#00ffcc" strokeWidth="4" strokeLinecap="round" filter="url(#glow)"
        />

        {/* Minute hand */}
        <line
          x1="100" y1="100"
          x2={100 + 60 * Math.cos((minuteDeg - 90) * Math.PI / 180)}
          y2={100 + 60 * Math.sin((minuteDeg - 90) * Math.PI / 180)}
          stroke="#00ff88" strokeWidth="3" strokeLinecap="round" filter="url(#glow)"
        />

        {/* Second hand */}
        <line
          x1="100" y1="100"
          x2={100 + 70 * Math.cos((secondDeg - 90) * Math.PI / 180)}
          y2={100 + 70 * Math.sin((secondDeg - 90) * Math.PI / 180)}
          stroke="#ff0066" strokeWidth="2" strokeLinecap="round" filter="url(#glow)"
          className="second-hand"
        />

        {/* Center dot */}
        <circle cx="100" cy="100" r="5" fill="#00ff88" filter="url(#glow)"/>
        <circle cx="100" cy="100" r="2" fill="#0a0a0a"/>
      </svg>

      <div className="digital-time">
        <span className="digit">{String(hours).padStart(2, '0')}</span>
        <span className="colon">:</span>
        <span className="digit">{String(minutes).padStart(2, '0')}</span>
        <span className="colon">:</span>
        <span className="digit">{String(seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`glitch ${className}`} data-text={text}>
      {text}
    </span>
  );
}

function TypewriterText({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="typewriter">
      {displayed}
      <span className={`cursor ${cursorVisible ? 'visible' : ''}`}>_</span>
    </span>
  );
}

function MatrixRain() {
  const [columns, setColumns] = useState<{ chars: string[]; speed: number; x: number }[]>([]);

  useEffect(() => {
    const chars = '01⏰🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛$CLOCK';
    const newColumns = Array.from({ length: 25 }, (_, i) => ({
      chars: Array.from({ length: Math.floor(Math.random() * 20) + 10 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ),
      speed: Math.random() * 10 + 5,
      x: (i / 25) * 100
    }));
    setColumns(newColumns);
  }, []);

  return (
    <div className="matrix-rain">
      {columns.map((col, i) => (
        <div
          key={i}
          className="matrix-column"
          style={{
            left: `${col.x}%`,
            animationDuration: `${col.speed}s`
          }}
        >
          {col.chars.map((char, j) => (
            <span key={j} style={{ opacity: 1 - (j / col.chars.length) * 0.8 }}>
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Tokenomics() {
  const data = [
    { label: 'Community', value: 40, color: '#00ff88' },
    { label: 'Liquidity', value: 30, color: '#00ffcc' },
    { label: 'Marketing', value: 20, color: '#ff0066' },
    { label: 'Team', value: 10, color: '#ffcc00' },
  ];

  return (
    <div className="tokenomics">
      <h2><GlitchText text="TOKENOMICS" /></h2>
      <div className="token-grid">
        {data.map((item, i) => (
          <div key={i} className="token-item" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="token-bar-container">
              <div
                className="token-bar"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 0 20px ${item.color}`,
                  animationDelay: `${i * 0.2 + 0.5}s`
                }}
              />
            </div>
            <div className="token-label">
              <span className="token-name">{item.label}</span>
              <span className="token-value" style={{ color: item.color }}>{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="total-supply">
        <span className="label">TOTAL SUPPLY:</span>
        <span className="value">1,000,000,000 $CLOCK</span>
      </div>
    </div>
  );
}

function HowToBuy() {
  const steps = [
    { num: '01', title: 'Create Wallet', desc: 'Download Phantom or your preferred wallet' },
    { num: '02', title: 'Get SOL', desc: 'Buy SOL from an exchange and transfer to wallet' },
    { num: '03', title: 'Connect', desc: 'Go to Raydium/Jupiter and connect your wallet' },
    { num: '04', title: 'Swap', desc: 'Paste $CLOCK contract address and swap' },
  ];

  return (
    <div className="how-to-buy">
      <h2><GlitchText text="HOW TO BUY" /></h2>
      <div className="steps-container">
        {steps.map((step, i) => (
          <div key={i} className="step" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="step-num">{step.num}</div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
            {i < steps.length - 1 && <div className="step-connector" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button className="copy-btn" onClick={handleCopy}>
      {copied ? '✓ COPIED' : 'COPY'}
    </button>
  );
}

export default function App() {
  const contractAddress = 'CLOCKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  return (
    <div className="app">
      <div className="scanlines" />
      <div className="noise" />
      <MatrixRain />

      <nav className="navbar">
        <div className="nav-logo">
          <span className="clock-emoji">⏰</span>
          <GlitchText text="$CLOCK" className="logo-text" />
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#tokenomics">Tokenomics</a>
          <a href="#buy">Buy</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">𝕏</a>
          <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-link">TG</a>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <div className="tagline">
                <TypewriterText text="> INITIALIZING $CLOCK PROTOCOL..." delay={40} />
              </div>
              <h1>
                <GlitchText text="$CLOCK" className="main-title" />
              </h1>
              <p className="subtitle">
                TIME IS MONEY. <span className="highlight">LITERALLY.</span>
              </p>
              <p className="description">
                The first memecoin synchronized with the blockchain of time itself.
                Every second counts. Every block ticks. Are you early or are you late?
              </p>

              <div className="contract-box">
                <span className="contract-label">CONTRACT:</span>
                <code className="contract-address">{contractAddress}</code>
                <CopyButton text={contractAddress} />
              </div>

              <div className="cta-buttons">
                <button className="btn btn-primary">
                  <span>BUY $CLOCK</span>
                  <span className="btn-glow" />
                </button>
                <button className="btn btn-secondary">
                  <span>VIEW CHART</span>
                </button>
              </div>
            </div>

            <div className="hero-clock">
              <AnimatedClock />
            </div>
          </div>

          <div className="scroll-indicator">
            <span>SCROLL</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="terminal-title">about.exe</span>
            </div>
            <div className="terminal-body">
              <p><span className="prompt">$</span> cat about.txt</p>
              <p className="output">
                ═══════════════════════════════════════════════<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WELCOME TO THE $CLOCK DIMENSION<br/>
                ═══════════════════════════════════════════════<br/><br/>
                In a world where every second is a new opportunity,<br/>
                $CLOCK emerges as the ultimate time-based memecoin.<br/><br/>
                🕐 NO PRESALE - Fair launch for everyone<br/>
                🕑 NO TEAM TOKENS - 100% community owned<br/>
                🕒 LOCKED LIQUIDITY - Your funds are SAFU<br/>
                🕓 RENOUNCED CONTRACT - Truly decentralized<br/><br/>
                The clock is ticking. The choice is yours.<br/>
                Will you be early, or will you be late?<br/><br/>
                ═══════════════════════════════════════════════
              </p>
              <p><span className="prompt">$</span> <span className="blink">_</span></p>
            </div>
          </div>
        </section>

        <section id="tokenomics" className="tokenomics-section">
          <Tokenomics />
        </section>

        <section id="buy" className="buy-section">
          <HowToBuy />
        </section>

        <section className="community-section">
          <h2><GlitchText text="JOIN THE CLOCKERS" /></h2>
          <p className="community-desc">Tick tock, don't miss the block</p>
          <div className="social-buttons">
            <a href="https://twitter.com" className="social-btn twitter" target="_blank" rel="noopener noreferrer">
              <span className="icon">𝕏</span>
              <span>Twitter</span>
            </a>
            <a href="https://t.me" className="social-btn telegram" target="_blank" rel="noopener noreferrer">
              <span className="icon">✈</span>
              <span>Telegram</span>
            </a>
            <a href="https://dexscreener.com" className="social-btn dex" target="_blank" rel="noopener noreferrer">
              <span className="icon">📊</span>
              <span>DexScreener</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="clock-emoji">⏰</span>
            <span>$CLOCK</span>
          </div>
          <p className="disclaimer">
            $CLOCK is a memecoin with no intrinsic value or financial return expectation.
            Always DYOR. This is not financial advice.
          </p>
          <p className="credits">
            Requested by @Yonarachell · Built by @clonkbot
          </p>
        </div>
      </footer>
    </div>
  );
}
