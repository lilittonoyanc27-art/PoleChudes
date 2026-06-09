import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Check, 
  X, 
  ChevronRight, 
  User, 
  Users, 
  Award, 
  BookOpen, 
  Keyboard, 
  Star, 
  Coins, 
  MessageSquare,
  Volume1,
  BookMarked,
  Layers,
  Sparkle
} from 'lucide-react';
import { GRAMMAR_QUESTIONS, ROUND_WORDS, Question, RoundWord } from './spanishData';

// --- SECTORS DEFINITION ---
interface Sector {
  id: number;
  label: string;
  type: 'points' | 'bankrupt' | 'double' | 'plus' | 'chance' | 'zero';
  value?: number;
  color: string;
}

const SECTORS: Sector[] = [
  { id: 0, label: "QUIEBRA", type: 'bankrupt', color: "#1e293b" }, // slate 800
  { id: 1, label: "100", type: 'points', value: 100, color: "#ea580c" }, // orange
  { id: 2, label: "200", type: 'points', value: 200, color: "#2563eb" }, // blue
  { id: 3, label: "+ EXTRA", type: 'plus', color: "#16a34a" }, // green
  { id: 4, label: "300", type: 'points', value: 300, color: "#9333ea" }, // purple
  { id: 5, label: "400", type: 'points', value: 400, color: "#ea580c" }, // orange
  { id: 6, label: "0", type: 'zero', color: "#e11d48" }, // red
  { id: 7, label: "500", type: 'points', value: 500, color: "#db2777" }, // pink
  { id: 8, label: "750", type: 'points', value: 750, color: "#0d9488" }, // teal
  { id: 9, label: "x2 DOBLE", type: 'double', color: "#ca8a04" }, // yellow/gold
  { id: 10, label: "1000", type: 'points', value: 1000, color: "#4f46e5" }, // indigo
  { id: 11, label: "1500", type: 'points', value: 1500, color: "#059669" }, // emerald
  { id: 12, label: "SUERTE", type: 'chance', color: "#b91c1c" }, // red 700
  { id: 13, label: "250", type: 'points', value: 250, color: "#0284c7" }, // sky
  { id: 14, label: "350", type: 'points', value: 350, color: "#84cc16" }, // lime
  { id: 15, label: "500", type: 'points', value: 500, color: "#db2777" }, // pink
];

// --- SOUND CONTEXT SYNTHESIZER ---
class GameAudio {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Ignored
    }
  }

  playSuccess() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const playTone = (freq: number, start: number, duration: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      playTone(523.25, now, 0.12); // C5
      playTone(659.25, now + 0.1, 0.12); // E5
      playTone(783.99, now + 0.2, 0.12); // G5
      playTone(1046.50, now + 0.3, 0.25); // C6
    } catch (e) {}
  }

  playFailure() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.35);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playBankrupt() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.7);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.7);
    } catch (e) {}
  }

  playVictory() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const playTone = (freq: number, start: number, duration: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.linearRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      const chord = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
      chord.forEach((freq, idx) => {
        playTone(freq, now + idx * 0.08, 0.3);
      });
      playTone(523.25, now + 0.64, 0.6);
      playTone(659.25, now + 0.64, 0.6);
      playTone(783.99, now + 0.64, 0.6);
      playTone(1046.50, now + 0.64, 0.6);
    } catch (e) {}
  }
}

const gameAudioInstance = new GameAudio();

// --- 3D CANVAS DRUM COMPONENT ---
interface CanvasDrumProps {
  onSpinComplete: (sector: Sector) => void;
  isSpinning: boolean;
  setIsSpinning: (spin: boolean) => void;
  spinPower: number;
}

const CanvasDrum: React.FC<CanvasDrumProps> = ({ 
  onSpinComplete, 
  isSpinning, 
  setIsSpinning, 
  spinPower 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef<number>(Math.random() * Math.PI * 2);
  const velocityRef = useRef<number>(0);
  const lastPegIndexRef = useRef<number>(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 - 10;
      const rx = Math.min(w, h) / 2 - 25;
      const ry = rx * 0.55; // Flat 3D projection angle

      // 1. Draw Lower Drum Outer 3D Wall (Cylinder bottom edge)
      const wallHeight = 22;
      ctx.fillStyle = "#3e2723"; // Dark rich wooden brown
      ctx.beginPath();
      ctx.ellipse(cx, cy + wallHeight, rx, ry, 0, 0, Math.PI, false);
      ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 0, true);
      ctx.closePath();
      ctx.fill();

      // Shadow overlay on the outer cylinder wall
      const wallGrad = ctx.createLinearGradient(cx - rx, cy, cx + rx, cy);
      wallGrad.addColorStop(0, "rgba(0,0,0,0.8)");
      wallGrad.addColorStop(0.2, "rgba(0,0,0,0.3)");
      wallGrad.addColorStop(0.5, "rgba(0,0,0,0)");
      wallGrad.addColorStop(0.8, "rgba(0,0,0,0.3)");
      wallGrad.addColorStop(1, "rgba(0,0,0,0.8)");
      ctx.fillStyle = wallGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + wallHeight, rx, ry, 0, 0, Math.PI, false);
      ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 0, true);
      ctx.closePath();
      ctx.fill();

      // Golden Rim around bottom cylinder
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy + wallHeight, rx, ry, 0, 0, Math.PI, false);
      ctx.stroke();

      // 2. Render Main Tilted Top Disc Surfaces 
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1.0, 0.55); // Isometric perspective skew
      ctx.rotate(angleRef.current);

      const numSectors = SECTORS.length;
      const sectorAngle = (Math.PI * 2) / numSectors;

      for (let i = 0; i < numSectors; i++) {
        const startAng = i * sectorAngle;
        const endAng = (i + 1) * sectorAngle;

        // Draw Filled Sector
        ctx.fillStyle = SECTORS[i].color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, rx, startAng, endAng, false);
        ctx.closePath();
        ctx.fill();

        // Overlay light reflection
        const highlightGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, rx);
        highlightGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
        highlightGrad.addColorStop(0.8, "rgba(0, 0, 0, 0.15)");
        ctx.fillStyle = highlightGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, rx, startAng, endAng, false);
        ctx.closePath();
        ctx.fill();

        // Draw sector boundary lines
        ctx.strokeStyle = "#172554"; // dark blue divider
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(rx * Math.cos(startAng), rx * Math.sin(startAng));
        ctx.stroke();

        // Write Sector Labels along radius
        ctx.save();
        const midAng = startAng + sectorAngle / 2;
        ctx.rotate(midAng);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "JetBrains Mono", "Montserrat", sans-serif';
        
        // Drop shadow for text
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        const label = SECTORS[i].label;
        ctx.fillText(label, rx - 35, 0);
        ctx.restore();
      }

      // Draw Sector Pegs (brass pins around circle border)
      for (let i = 0; i < numSectors; i++) {
        const pinAng = i * sectorAngle;
        const px = rx * Math.cos(pinAng);
        const py = rx * Math.sin(pinAng);

        ctx.fillStyle = "#fbbf24"; // Brass gold
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Draw Center Hub Cap (gold/wooden dome)
      const hubRadius = 35;
      ctx.fillStyle = "#8a4f00";
      ctx.beginPath();
      ctx.arc(0, 0, hubRadius, 0, Math.PI * 2);
      ctx.fill();

      const hubGrad = ctx.createRadialGradient(-10, -10, 2, 0, 0, hubRadius);
      hubGrad.addColorStop(0, "#fef08a"); // very bright gold
      hubGrad.addColorStop(0.5, "#eab308"); // golden
      hubGrad.addColorStop(1, "#1e0f00"); // dark border
      ctx.fillStyle = hubGrad;
      ctx.beginPath();
      ctx.arc(0, 0, hubRadius - 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 3. Draw pointer flasher pin (stationary at the top edge)
      // The pointer is pointing downwards at the top center of the wheel.
      // Top position screen coordinate is approx (cx, cy - ry)
      const ptrX = cx;
      const ptrY = cy - ry - 14;

      // Draw pointer container
      ctx.fillStyle = "#7f1d1d";
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ptrX - 14, ptrY - 14);
      ctx.lineTo(ptrX + 14, ptrY - 14);
      ctx.lineTo(ptrX + 8, ptrY + 8);
      ctx.lineTo(ptrX - 8, ptrY + 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw actual red flexible rubber indicator pen (bending depending on peg hits!)
      // How does pointing calculate? Top of tilted wheel is at angle -PI/2 relative to standard,
      // which corresponds to angle top = (Math.PI * 1.5 - currentRotateAngle)
      let isPinHitting = false;
      if (Math.abs(velocityRef.current) > 0.005) {
        // Calculate peg deflection
        const relativeTopAng = (-Math.PI / 2 - angleRef.current) % (Math.PI * 2);
        const normTopAng = relativeTopAng < 0 ? relativeTopAng + Math.PI * 2 : relativeTopAng;
        const currentPegFruct = normTopAng / ((Math.PI * 2) / numSectors);
        const decimal = currentPegFruct - Math.floor(currentPegFruct);
        
        // If peg is very close to top pointer, bend the rubber feather!
        if (decimal < 0.1 || decimal > 0.9) {
          isPinHitting = true;
        }
      }

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(ptrX - 4, ptrY);
      if (isPinHitting) {
        ctx.lineTo(ptrX + 12, ptrY + 22); // BENT arrow!
      } else {
        ctx.lineTo(ptrX, ptrY + 26); // Straight down pointer
      }
      ctx.lineTo(ptrX + 4, ptrY);
      ctx.closePath();
      ctx.fill();

      // Peg Click sound calculations
      const totalSectors = SECTORS.length;
      // Angle goes from 0 to 2PI.
      // Angle mapped to sector index at top pointer:
      const pointerAngle = -Math.PI / 2;
      const relativeAng = (pointerAngle - angleRef.current) % (Math.PI * 2);
      const normalizedAng = relativeAng < 0 ? relativeAng + Math.PI * 2 : relativeAng;
      const pegIndex = Math.floor(normalizedAng / (Math.PI * 2 / totalSectors));

      if (pegIndex !== lastPegIndexRef.current) {
        if (lastPegIndexRef.current !== -1) {
          gameAudioInstance.playClick();
        }
        lastPegIndexRef.current = pegIndex;
      }

      // Physics update if spinning
      if (isSpinning) {
        angleRef.current = (angleRef.current + velocityRef.current) % (Math.PI * 2);
        velocityRef.current *= 0.985; // smooth friction deceleration

        // Slow stop threshold
        if (velocityRef.current < 0.0016) {
          velocityRef.current = 0;
          setIsSpinning(false);

          // Calculate final landed sector precisely
          const finalPointerAngle = -Math.PI / 2;
          const finalRelAng = (finalPointerAngle - angleRef.current) % (Math.PI * 2);
          const finalNormAng = finalRelAng < 0 ? finalRelAng + Math.PI * 2 : finalRelAng;
          const finalSectorIdx = Math.floor(finalNormAng / (Math.PI * 2 / totalSectors)) % totalSectors;
          
          const landed = SECTORS[finalSectorIdx];
          onSpinComplete(landed);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isSpinning, onSpinComplete, setIsSpinning]);

  // Handle spin activation trigger
  useEffect(() => {
    if (isSpinning && velocityRef.current === 0) {
      // Set random speed based on spinPower slider + random jitter
      const powerMultiplier = 0.05 + (spinPower / 100) * 0.15;
      const randomSpeed = powerMultiplier + Math.random() * 0.04;
      velocityRef.current = randomSpeed;
    }
  }, [isSpinning, spinPower]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute -top-6 bg-slate-900 border border-amber-500/40 text-amber-500 px-3 py-0.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-1 shadow-lg shadow-black/80 z-10">
        <Sparkle className="w-3 h-3 animate-spin text-amber-400" />
        RULETA 3D FÍSICA
      </div>
      <canvas 
        ref={canvasRef} 
        width={340} 
        height={240} 
        className="block cursor-pointer select-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]"
      />
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  // Initialization of names and settings
  const [player1Name, setPlayer1Name] = useState('Jugador 1');
  const [player2Name, setPlayer2Name] = useState('Jugador 2');
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [activePlayer, setActivePlayer] = useState<0 | 1>(0);
  const [isMuted, setIsMuted] = useState(false);

  // Word Guesses states
  const [roundIndex, setRoundIndex] = useState(0);
  const targetWordObj = ROUND_WORDS[roundIndex] || ROUND_WORDS[0];
  const targetWord = targetWordObj.word.toUpperCase();
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [unlockedRoundsCount, setUnlockedRoundsCount] = useState<number>(0);

  // Sector state
  const [landedSector, setLandedSector] = useState<Sector | null>(null);
  const [spinPower, setSpinPower] = useState(50);
  const [isSpinning, setIsSpinning] = useState(false);

  // Game Progress/States
  const [phase, setPhase] = useState<'SETUP' | 'SPIN_WAIT' | 'LANDED' | 'QUESTION' | 'GUESS_LETTER' | 'PLUS_SECTOR' | 'WHOLE_WORD' | 'ROUND_COMPLETE' | 'GAME_OVER'>('SETUP');
  
  // Quiz variables
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<'CORRECT' | 'INCORRECT' | null>(null);
  const [streakTracker, setStreakTracker] = useState<number>(0);

  // Input for full word guess
  const [typedWord, setTypedWord] = useState('');
  const [wholeWordError, setWholeWordError] = useState('');

  // Plus sector manual choice tracker
  const [plusBannerMessage, setPlusBannerMessage] = useState('¡Elige cualquier letra oculta en el TABLERO para revelarla gratis!');

  // Spanish Grammar Section toggles on sidebar
  const [activeGrammarTab, setActiveGrammarTab] = useState<'SIMPLE' | 'PERFECTO' | 'TIPS'>('SIMPLE');

  // Sync mute state with physical class instance
  useEffect(() => {
    gameAudioInstance.muted = isMuted;
  }, [isMuted]);

  // Target word letters unpacked helper
  const wordLetters = targetWord.split('');
  const uniqueLettersInWord = Array.from(new Set(wordLetters));
  const solvedLetters = wordLetters.filter(l => guessedLetters.includes(l));
  const isWordFullySolved = wordLetters.every(l => guessedLetters.includes(l));

  // Determine game-over or round complete automatically
  useEffect(() => {
    if (phase !== 'SETUP' && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' && isWordFullySolved) {
      // Current word is solved completely!
      gameAudioInstance.playVictory();
      setPhase('ROUND_COMPLETE');
    }
  }, [guessedLetters, isWordFullySolved, phase]);

  // Generate lists of used letters
  const handleLetterSelection = (letter: string) => {
    if (guessedLetters.includes(letter)) return;
    
    const newGuesses = [...guessedLetters, letter];
    setGuessedLetters(newGuesses);

    const occurrences = wordLetters.filter(l => l === letter).length;

    if (occurrences > 0) {
      // Perfect guess!
      gameAudioInstance.playSuccess();
      const pointsScored = (landedSector?.value || 300) * occurrences;
      
      // Update score of active player
      setScores(prev => {
        const next = [...prev] as [number, number];
        next[activePlayer] += pointsScored;
        return next;
      });

      // Show alert or visual message, and let them spin again!
      setPhase('SPIN_WAIT');
    } else {
      // Oops, wrong letter!
      gameAudioInstance.playFailure();
      // Swaps turn and switches phase
      switchTurn();
      setPhase('SPIN_WAIT');
    }
  };

  const handleStartGame = () => {
    setScores([0, 0]);
    setActivePlayer(0);
    setGuessedLetters([]);
    setRoundIndex(0);
    setPhase('SPIN_WAIT');
  };

  const spinTheDrum = () => {
    if (isSpinning || phase !== 'SPIN_WAIT') return;
    setIsSpinning(true);
  };

  const handleSpinDone = (sector: Sector) => {
    setLandedSector(sector);
    
    if (sector.type === 'bankrupt') {
      gameAudioInstance.playBankrupt();
      setScores(prev => {
        const next = [...prev] as [number, number];
        next[activePlayer] = 0;
        return next;
      });
      // Bankrupt switches turn automatically 
      setTimeout(() => {
        switchTurn();
        setPhase('SPIN_WAIT');
      }, 3000);
      setPhase('LANDED');
    } else if (sector.type === 'zero') {
      gameAudioInstance.playFailure();
      setTimeout(() => {
        switchTurn();
        setPhase('SPIN_WAIT');
      }, 3000);
      setPhase('LANDED');
    } else if (sector.type === 'plus') {
      gameAudioInstance.playSuccess();
      setPhase('PLUS_SECTOR');
    } else if (sector.type === 'double') {
      gameAudioInstance.playSuccess();
      // Double the points we currently have (bonus points added)
      setScores(prev => {
        const next = [...prev] as [number, number];
        next[activePlayer] = Math.max(100, next[activePlayer] * 2);
        return next;
      });
      setTimeout(() => {
        setPhase('SPIN_WAIT');
      }, 3000);
      setPhase('LANDED');
    } else {
      // Standard points sector or chance sector!
      // Pick a random grammar question based on topic of sector
      let list = GRAMMAR_QUESTIONS;
      if (sector.type === 'chance') {
        // High difficulty random
        list = GRAMMAR_QUESTIONS.filter(q => q.difficulty === 'difícil');
      } else {
        // Randomly picker
        list = GRAMMAR_QUESTIONS;
      }
      
      const randomQ = list[Math.floor(Math.random() * list.length)];
      setCurrentQuestion(randomQ);
      setSelectedOption(null);
      setAnswerResult(null);
      setPhase('QUESTION');
    }
  };

  const handleAnswerSubmit = (optionIdx: number) => {
    if (answerResult !== null || !currentQuestion) return;
    
    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === currentQuestion.correctIndex;

    if (isCorrect) {
      gameAudioInstance.playSuccess();
      setAnswerResult('CORRECT');
      setStreakTracker(prev => prev + 1);
      // Award sector points to pending pool or just standard
    } else {
      gameAudioInstance.playFailure();
      setAnswerResult('INCORRECT');
      setStreakTracker(0);
    }
  };

  const handleQuizDone = () => {
    if (answerResult === 'CORRECT') {
      // Player proved knowledge, now they get to select a letter!
      setPhase('GUESS_LETTER');
    } else {
      // Failed answer, immediately shift turn to next player
      switchTurn();
      setPhase('SPIN_WAIT');
    }
    setCurrentQuestion(null);
    setSelectedOption(null);
    setAnswerResult(null);
  };

  const switchTurn = () => {
    setActivePlayer(prev => (prev === 0 ? 1 : 0));
  };

  // Direct letter click during "Sector Plus"
  const handleTileDirectClick = (letter: string) => {
    if (phase !== 'PLUS_SECTOR') return;
    if (guessedLetters.includes(letter)) return;

    // Secret plus opens any letter for 500 bonus points!
    const newGuesses = [...guessedLetters, letter];
    setGuessedLetters(newGuesses);
    gameAudioInstance.playSuccess();

    setScores(prev => {
      const next = [...prev] as [number, number];
      next[activePlayer] += 500;
      return next;
    });

    setPhase('SPIN_WAIT');
  };

  // Handle entire word guessing
  const handleWholeWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitisedInput = typedWord.trim().toUpperCase().replace(/\s+/g, '');
    const sanitisedTarget = targetWord.trim().toUpperCase().replace(/\s+/g, '');

    if (!sanitisedInput) {
      setWholeWordError('El campo de texto no debe estar vacío.');
      return;
    }

    if (sanitisedInput === sanitisedTarget) {
      // Perfect win! Reveal all letters
      gameAudioInstance.playVictory();
      setGuessedLetters(wordLetters);
      setScores(prev => {
        const next = [...prev] as [number, number];
        next[activePlayer] += 2500; // Grand reward for bold absolute guess
        return next;
      });
      setTypedWord('');
      setWholeWordError('');
      setPhase('ROUND_COMPLETE');
    } else {
      // Wrong guess
      gameAudioInstance.playFailure();
      setWholeWordError('¡Incorrecto! Qué mala suerte.');
      // Deduct penalty points
      setScores(prev => {
        const next = [...prev] as [number, number];
        next[activePlayer] = Math.max(0, next[activePlayer] - 400);
        return next;
      });
      setTimeout(() => {
        setTypedWord('');
        setWholeWordError('');
        switchTurn();
        setPhase('SPIN_WAIT');
      }, 2500);
    }
  };

  // Proceed to next word round
  const handleNextRound = () => {
    if (roundIndex + 1 < ROUND_WORDS.length) {
      setRoundIndex(prev => prev + 1);
      setGuessedLetters([]);
      setPhase('SPIN_WAIT');
    } else {
      // No more words, finish game
      setPhase('GAME_OVER');
    }
  };

  // Spanish vocabulary / chars layout
  const SPANISH_ALPHABET = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
    'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  return (
    <div id="app-root" className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white font-sans flex flex-col selection:bg-yellow-400 selection:text-indigo-950 overflow-x-hidden">
      
      {/* HEADER BAR */}
      <header className="border-b border-white/10 bg-indigo-950/45 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2.5 rounded-xl shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            <Trophy className="w-6 h-6 text-indigo-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-white font-display">
              LA RUEDA DEL PORVENIR <span className="text-yellow-400">3D</span>
            </h1>
            <p className="text-xs text-indigo-200/80 flex items-center gap-1.5 mt-0.5">
              <span>Verbos en Español:</span>
              <span className="text-yellow-400 font-semibold font-mono">Futuro Simple & Futuro Perfecto</span>
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* MUTE AUDIO TOGGLE */}
          <button 
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-lg border transition-all ${
              isMuted 
                ? 'bg-white/10 text-slate-300 border-white/10 hover:text-white' 
                : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/20'
            }`}
            title={isMuted ? "Activar sonido" : "Silenciar sonido"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* RESET BUTTON */}
          <button 
            type="button"
            onClick={() => {
              if (window.confirm("¿Estás seguro de que deseas reiniciar el juego?")) {
                handleStartGame();
              }
            }}
            className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 transition px-3 py-2 rounded-lg border border-white/20 text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reiniciar</span>
          </button>
        </div>
      </header>

      {/* SETUP SCREEN */}
      {phase === 'SETUP' && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-indigo-950/60 backdrop-blur-xl border-2 border-indigo-500/30 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Visual backgrounds */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -z-10" />

            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="bg-yellow-400/10 text-yellow-400 text-xs px-3 py-1 rounded-full font-mono font-bold tracking-wider uppercase border border-yellow-400/20">
                Duelo de Preguntas Gramaticales
              </span>
              <h2 className="text-3xl md:text-5xl font-black font-display text-white mt-4 tracking-tight leading-tight uppercase italic">
                ¡Gira la ruleta y domina el español!
              </h2>
              <p className="text-indigo-200 text-sm md:text-base mt-4 leading-relaxed">
                Sumérgete en la atmósfera de este juego legendario. Viaja desde el infinitivo hasta el dominio absoluto de los tiempos <span className="text-yellow-400 font-semibold font-mono">Futuro Simple</span> y <span className="text-yellow-400 font-semibold font-mono">Futuro Perfecto</span>.
              </p>
            </div>

            {/* Rules Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
              <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-yellow-400 font-semibold text-sm">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span>1. Gira la Ruleta 3D</span>
                </div>
                <p className="text-xs text-indigo-200/80 leading-relaxed">
                  Determina los puntos en juego para tu turno. ¡Evita el sector <strong className="text-rose-400">Quiebra</strong> e intenta caer en el sector <strong className="text-emerald-400">Extra (+)</strong>!
                </p>
              </div>

              <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-sky-400 font-semibold text-sm">
                  <HelpCircle className="w-4 h-4 text-sky-450" />
                  <span>2. Responde Preguntas</span>
                </div>
                <p className="text-xs text-indigo-200/80 leading-relaxed">
                  Cada giro te presenta un reto gramatical. Responde correctamente para tener la oportunidad de descubrir una letra; si fallas, el turno pasa al rival.
                </p>
              </div>

              <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-pink-400 font-semibold text-sm">
                  <Keyboard className="w-4 h-4 text-pink-400" />
                  <span>3. Adivina Letras</span>
                </div>
                <p className="text-xs text-indigo-200/80 leading-relaxed">
                  ¡Adivina las letras ocultas del tablero! Ganará la ronda el jugador que consiga reunir la mayor cantidad de puntos.
                </p>
              </div>
            </div>

            {/* PLAYER NAMES INTAKE */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 md:p-6 rounded-3xl max-w-xl mx-auto mb-8 shadow-inner">
              <h3 className="text-xs font-mono font-bold text-indigo-200 uppercase tracking-widest text-center mb-4 flex items-center justify-center gap-2">
                <Users className="w-4 h-4 text-yellow-400" /> Registro de Jugadores
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-indigo-200 mb-1.5">Nombre Jugador 1</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-indigo-300/60" />
                    <input 
                      type="text" 
                      value={player1Name} 
                      onChange={(e) => setPlayer1Name(e.target.value.substring(0, 16))}
                      className="w-full bg-indigo-950/90 border border-indigo-500/40 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder-indigo-300/40 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Jugador 1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-200 mb-1.5">Nombre Jugador 2</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-indigo-300/60" />
                    <input 
                      type="text" 
                      value={player2Name} 
                      onChange={(e) => setPlayer2Name(e.target.value.substring(0, 16))}
                      className="w-full bg-indigo-950/90 border border-indigo-500/40 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder-indigo-300/40 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Jugador 2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* LAUNCH BUTTON */}
            <div className="text-center">
              <button 
                type="button"
                onClick={handleStartGame}
                className="inline-flex items-center gap-3.5 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black text-lg md:text-xl px-10 py-4 rounded-full shadow-[0_8px_0_#b45309] hover:shadow-[0_8px_0_#92400e] active:shadow-none active:translate-y-2 transition-all transform active:scale-95 group uppercase tracking-wider cursor-pointer"
              >
                Iniciar Gran Juego
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition text-indigo-950" />
              </button>
            </div>
          </motion.div>
        </main>
      )}

      {/* MAIN GAME ENGINE PANEL */}
      {phase !== 'SETUP' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: LEADERBOARD & TURN STATISTICS (3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* PLAYER SCORES PANEL */}
            <div className="bg-indigo-950/60 backdrop-blur-md border-2 border-indigo-500/30 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xs font-mono font-bold text-indigo-200 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Jugadores</span>
                <span className="text-yellow-400">Duelo</span>
              </h3>

              <div className="space-y-3">
                {/* PLAYER 1 */}
                <div className={`p-4 rounded-2xl border transition-all relative ${
                  activePlayer === 0 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER'
                    ? 'bg-yellow-400 text-indigo-950 border-transparent shadow-[0_0_20px_rgba(250,204,21,0.4)] ring-4 ring-white/50' 
                    : 'bg-white/10 border-white/20 opacity-60'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        activePlayer === 0 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' 
                          ? 'bg-indigo-950 animate-ping' 
                          : 'bg-indigo-300'
                      }`} />
                      <span className={`font-black text-sm truncate max-w-[130px] ${
                        activePlayer === 0 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' 
                          ? 'text-indigo-950' 
                          : 'text-indigo-100'
                      }`}>{player1Name}</span>
                    </div>
                    {activePlayer === 0 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' && (
                      <span className="text-[10px] font-mono bg-indigo-950 text-yellow-400 font-bold px-1.5 py-0.2 rounded uppercase tracking-wider scale-95">
                        TURNO
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className={`text-xs ${
                      activePlayer === 0 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' 
                        ? 'text-indigo-950/80 font-bold' 
                        : 'text-indigo-300'
                    }`}>Puntos</span>
                    <span className={`text-xl font-mono font-black ${
                      activePlayer === 0 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' 
                        ? 'text-indigo-950' 
                        : 'text-yellow-300'
                    }`}>{scores[0]}</span>
                  </div>
                </div>

                {/* PLAYER 2 */}
                <div className={`p-4 rounded-2xl border transition-all relative ${
                  activePlayer === 1 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER'
                    ? 'bg-yellow-400 text-indigo-950 border-transparent shadow-[0_0_20px_rgba(250,204,21,0.4)] ring-4 ring-white/50' 
                    : 'bg-white/10 border-white/20 opacity-60'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        activePlayer === 1 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' 
                          ? 'bg-indigo-950 animate-ping' 
                          : 'bg-indigo-300'
                      }`} />
                      <span className={`font-black text-sm truncate max-w-[130px] ${
                        activePlayer === 1 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' 
                          ? 'text-indigo-950' 
                          : 'text-indigo-100'
                      }`}>{player2Name}</span>
                    </div>
                    {activePlayer === 1 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' && (
                      <span className="text-[10px] font-mono bg-indigo-950 text-yellow-400 font-bold px-1.5 py-0.2 rounded uppercase tracking-wider scale-95">
                        TURNO
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className={`text-xs ${
                      activePlayer === 1 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' 
                        ? 'text-indigo-950/80 font-bold' 
                        : 'text-indigo-300'
                    }`}>Puntos</span>
                    <span className={`text-xl font-mono font-black ${
                      activePlayer === 1 && phase !== 'ROUND_COMPLETE' && phase !== 'GAME_OVER' 
                        ? 'text-indigo-950' 
                        : 'text-yellow-300'
                    }`}>{scores[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTOR GLOSSARY */}
            <div className="bg-indigo-950/60 backdrop-blur-md border-2 border-indigo-500/30 rounded-2xl p-4 shadow-lg hidden md:block">
              <h4 className="text-xs font-mono font-bold text-indigo-200 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-yellow-400" />
                Sectores Especiales / Հատուկ Սեկտորներ
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-indigo-200">
                    <strong className="text-pink-400">Quiebra (Սնանկացում)՝</strong> Pasa el turno y reinicia tus puntos a 0.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-indigo-200">
                    <strong className="text-green-400">+ Extra (+)՝</strong> ¡Te permite abrir cualquier letra oculta gratis!
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-indigo-200">
                    <strong className="text-yellow-400">x2 (Կրկնապատկում)՝</strong> ¡Duplica de forma inmediata tus puntos actuales!
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-indigo-200">
                    <strong className="text-rose-400">Suerte (Շանս)՝</strong> Pregunta especial difícil para duplicar el valor del giro.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-indigo-200">
                    <strong className="text-red-400">Sector 0 (Զրո)՝</strong> Pérdida simple de turno.
                  </span>
                </li>
              </ul>
            </div>

            {/* STREAK/MOTIVATION WIDGET */}
            {streakTracker > 0 && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-yellow-500/20 to-pink-500/20 border border-yellow-400/30 p-3 rounded-xl text-center"
              >
                <div className="text-xs font-mono font-bold text-yellow-300 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                  ¡RACHA ACTIVA / ԱԿՏԻՎ ՍԵՐԻԱ: {streakTracker}!
                </div>
              </motion.div>
            )}
          </div>

          {/* MIDDLE: THE GAME BOARD & WHEEL (6 Columns) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. SCOREBOARD/TABLO (ТАБЛО С БУКВАМИ) */}
            <div className="bg-gradient-to-b from-indigo-950/90 to-purple-950/90 border-2 border-indigo-500 rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Backlit highlight */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-between items-center mb-5 relative z-10">
                <span className="text-[10px] md:text-xs font-bold bg-indigo-500 text-white px-3 py-1 rounded-full tracking-wider uppercase italic">
                  Ronda {roundIndex + 1}: {targetWordObj.categoryArm} ({targetWordObj.category})
                </span>
                <span className="text-xs font-mono text-yellow-400 font-bold flex items-center gap-1.5 bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-500/30">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {solvedLetters.length} / {targetWord.length} adivinados
                </span>
              </div>

              {/* ROTATING 3D TILES */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 my-4 py-2 relative z-10">
                {wordLetters.map((letter, idx) => {
                  const isRevealed = guessedLetters.includes(letter);
                  const isClosedLetterInteractable = phase === 'PLUS_SECTOR';

                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (isClosedLetterInteractable && !isRevealed) {
                          handleTileDirectClick(letter);
                        }
                      }}
                      className={`relative w-10 h-14 md:w-12 md:h-16 perspective-1000 ${
                        isClosedLetterInteractable && !isRevealed ? 'cursor-pointer group' : ''
                      }`}
                    >
                      <div className={`w-full h-full duration-700 transform-style-3d transition-transform ${
                        isRevealed ? 'rotate-y-180' : ''
                      }`}>
                        
                        {/* FRONT SIDE (Hidden Letter) */}
                        <div className={`absolute inset-0 rounded-lg border flex items-center justify-center font-bold text-lg select-none backface-hidden ${
                          isClosedLetterInteractable 
                            ? 'bg-emerald-950 border-emerald-400 text-emerald-400 animate-pulse shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform' 
                            : 'bg-indigo-900 border-indigo-400/50 text-indigo-300 shadow-inner'
                        }`}>
                          {isClosedLetterInteractable ? "?" : "？"}
                        </div>

                        {/* BACK SIDE (Revealed Letter) */}
                        <div className="absolute inset-0 rounded-lg bg-white text-indigo-950 font-black font-display text-xl md:text-3xl flex items-center justify-center rotate-y-180 backface-hidden shadow-[inset_0_-4px_0_#cbd5e1]">
                          {letter}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CLUE IN ARMENIAN & SPANISH */}
              <div className="mt-4 bg-indigo-950/80 p-4 rounded-2xl border border-indigo-500/30 text-center relative z-10 space-y-1.5">
                <p className="text-indigo-300 text-xs font-mono mb-0.5 uppercase tracking-wider">Pista de la ronda / Ակնարկ՝</p>
                <p className="text-slate-100 text-sm md:text-[14px] font-bold leading-relaxed font-sans">{targetWordObj.clue}</p>
                <p className="text-yellow-300 text-xs md:text-[13px] font-medium leading-relaxed font-sans italic border-t border-white/5 pt-1.5">{targetWordObj.clueArm}</p>
              </div>

              {/* MANUAL ACTION NOTIFICATION */}
              {phase === 'PLUS_SECTOR' && (
                <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg text-emerald-300 text-xs text-center font-medium animate-pulse">
                  🌟 {plusBannerMessage}
                </div>
              )}
            </div>

            {/* 2. THE MAIN WHEEL SPIN INTERFACE */}
            <div className="bg-gradient-to-b from-indigo-950/90 to-purple-950/90 border-2 border-indigo-500/30 rounded-3xl p-6 shadow-xl flex flex-col items-center">
              
              {/* Spinning core */}
              <CanvasDrum 
                onSpinComplete={handleSpinDone}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                spinPower={spinPower}
              />

              {/* Physics controls */}
              <div className="w-full max-w-sm mt-5 space-y-4">
                
                {/* POWER SLIDER */}
                <div>
                  <div className="flex justify-between text-xs text-indigo-300 mb-1 font-mono">
                    <span>Fuerza del giro:</span>
                    <span className="text-yellow-400 font-bold">{spinPower}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={10} 
                    max={100} 
                    value={spinPower}
                    onChange={(e) => setSpinPower(Number(e.target.value))}
                    disabled={isSpinning || phase !== 'SPIN_WAIT'}
                    className="w-full h-1.5 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-yellow-400 disabled:opacity-40"
                  />
                </div>

                {/* SPIN & RESOLVE ENGINES */}
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={spinTheDrum}
                    disabled={isSpinning || phase !== 'SPIN_WAIT'}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-indigo-950/50 disabled:text-indigo-400/50 disabled:shadow-none text-indigo-950 font-black py-3.5 px-4 rounded-full transition-all shadow-[0_5px_0_#b45309] active:shadow-none active:translate-y-1.5 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer text-sm"
                  >
                    {isSpinning ? (
                      <>
                        <span className="w-5 h-5 border-2 border-indigo-950 border-t-transparent rounded-full animate-spin" />
                        <span>Girando...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-5 h-5 text-indigo-950 animate-pulse" />
                        <span>GIRAR</span>
                      </>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      if (phase === 'SPIN_WAIT') {
                        setPhase('WHOLE_WORD');
                      }
                    }}
                    disabled={isSpinning || phase !== 'SPIN_WAIT'}
                    className="bg-pink-500 text-white hover:bg-pink-400 disabled:opacity-40 disabled:bg-indigo-950/40 disabled:text-indigo-400 px-5 py-3.5 rounded-full transition font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_0_#9d174d] active:shadow-none active:translate-y-1 cursor-pointer"
                    title="Adivinar la palabra entera"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>PALABRA</span>
                  </button>
                </div>

              </div>

              {/* WHATS NEXT EXPLAINER DISPLAY */}
              <div className="mt-5 text-center px-4 w-full">
                {phase === 'SPIN_WAIT' && (
                  <div className="text-sm text-indigo-100">
                    👤 Turno de: <strong className="text-yellow-400 font-display font-black text-base">{activePlayer === 0 ? player1Name : player2Name}</strong>. 
                    <p className="text-xs text-indigo-300 mt-1">Gira la ruleta o adivina la palabra entera.</p>
                  </div>
                )}

                {phase === 'LANDED' && landedSector && (
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="p-3.5 bg-indigo-950/90 rounded-2xl border-2 border-indigo-500 shadow-inner"
                  >
                    <span className="text-xs text-indigo-300 block uppercase font-mono mb-0.5">La ruleta se ha detenido:</span>
                    {landedSector.type === 'bankrupt' && (
                      <span className="text-rose-400 font-black tracking-widest text-lg md:text-xl">💥 ¡SECTOR QUIEBRA! 💥</span>
                    )}
                    {landedSector.type === 'zero' && (
                      <span className="text-yellow-400 font-bold text-lg">¡SECTOR CERO (0) — Paso de turno!</span>
                    )}
                    {landedSector.type === 'double' && (
                      <span className="text-yellow-300 font-extrabold text-lg">¡SECTOR x2! ¡Tus puntos se duplican!</span>
                    )}
                    {landedSector.type === 'points' && (
                      <span className="text-yellow-400 font-black text-lg md:text-xl">¡SECTOR {landedSector.value} PUNTOS!</span>
                    )}
                    {landedSector.type === 'chance' && (
                      <span className="text-rose-300 font-black text-lg md:text-xl">⭐ ¡SECTOR SUERTE! ⭐</span>
                    )}
                    <p className="text-xs text-indigo-400 mt-1">Por favor, espera...</p>
                  </motion.div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: DETAILED GRAMMAR GUIDE & CHEAT SHEET (3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="bg-indigo-950/60 backdrop-blur-md border-2 border-indigo-500/30 rounded-2xl p-4 shadow-xl flex flex-col">
              
              <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2.5">
                <BookMarked className="w-4 h-4 text-yellow-400" />
                <h3 className="font-bold text-sm tracking-tight text-white font-display">
                  Իսպաներենի Քերականություն
                </h3>
              </div>

              {/* TAB SELECTORS */}
              <div className="grid grid-cols-3 gap-1 bg-indigo-950/95 p-1 rounded-full border border-indigo-500/30 mb-4 text-[9px] font-bold text-center select-none">
                <button 
                  type="button"
                  onClick={() => setActiveGrammarTab('SIMPLE')}
                  className={`py-1.5 px-0.5 rounded-full transition ${activeGrammarTab === 'SIMPLE' ? 'bg-yellow-400 text-indigo-950 font-black shadow-sm' : 'text-indigo-200/60 hover:text-white'}`}
                >
                  Պարզ (FS)
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveGrammarTab('PERFECTO')}
                  className={`py-1.5 px-0.5 rounded-full transition ${activeGrammarTab === 'PERFECTO' ? 'bg-yellow-400 text-indigo-950 font-black shadow-sm' : 'text-indigo-200/60 hover:text-white'}`}
                >
                  Վաղ. (FP)
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveGrammarTab('TIPS')}
                  className={`py-1.5 px-0.5 rounded-full transition ${activeGrammarTab === 'TIPS' ? 'bg-yellow-400 text-indigo-950 font-black shadow-sm' : 'text-indigo-200/60 hover:text-white'}`}
                >
                  Կանոններ
                </button>
              </div>

              {/* TABS CONTENT */}
              <div className="text-xs text-indigo-100 leading-relaxed space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {activeGrammarTab === 'SIMPLE' && (
                  <>
                    <div>
                      <p className="font-bold text-yellow-400 text-xs mb-1 font-mono uppercase tracking-wider font-display">Futuro Simple</p>
                      <p className="text-[11px] text-indigo-300">Կազմվում է վերջավորություններն անմիջապես ինֆինիտիվին (անորոշ դերբային) ավելացնելով։</p>
                    </div>

                    <div className="bg-indigo-950 p-2.5 rounded-xl border border-indigo-500/30 font-mono text-[11px] space-y-1 text-indigo-100">
                      <div className="flex justify-between border-b border-indigo-900/60 pb-1">
                        <strong className="text-pink-400">Yo (Ես)</strong>
                        <span>disfrutar<strong className="text-yellow-400 font-extrabold font-sans">é</strong></span>
                      </div>
                      <div className="flex justify-between border-b border-indigo-900/60 pb-1">
                        <strong className="text-pink-400">Tú (Դու)</strong>
                        <span>disfrutar<strong className="text-yellow-400 font-extrabold font-sans">ás</strong></span>
                      </div>
                      <div className="flex justify-between border-b border-indigo-900/60 pb-1">
                        <strong className="text-pink-400">Él/Ella (Նա)</strong>
                        <span>disfrutar<strong className="text-yellow-400 font-extrabold font-sans">á</strong></span>
                      </div>
                      <div className="flex justify-between border-b border-indigo-900/60 pb-1">
                        <strong className="text-pink-400">Nosotros (Մենք)</strong>
                        <span>disfrutar<strong className="text-indigo-300 font-extrabold font-sans">emos</strong></span>
                      </div>
                      <div className="flex justify-between border-b border-indigo-900/60 pb-1">
                        <strong className="text-pink-400">Vosotros (Դուք)</strong>
                        <span>disfrutar<strong className="text-yellow-400 font-extrabold font-sans">éis</strong></span>
                      </div>
                      <div className="flex justify-between">
                        <strong className="text-pink-400">Ellos/as (Նրանք)</strong>
                        <span>disfrutar<strong className="text-yellow-400 font-extrabold font-sans">án</strong></span>
                      </div>
                    </div>

                    <p className="text-[11px] text-indigo-300">
                      💡 Ուշադրություն՝ բոլոր ձևերը գրվում են շեշտի նշանով (tilde), բացի <strong className="text-white">nosotros</strong> ձևից:
                    </p>
                  </>
                )}

                {activeGrammarTab === 'PERFECTO' && (
                  <>
                    <div>
                      <p className="font-bold text-yellow-400 text-xs mb-1 font-mono uppercase tracking-wider font-display">Futuro Perfecto</p>
                      <p className="text-[11px] text-indigo-300">Նկարագրում է ապառնի գործողություն, որը կավարտվի ապագայի որոշակի պահից առաջ։</p>
                    </div>

                    <div className="bg-indigo-950 p-2.5 rounded-xl border border-indigo-500/30 font-mono text-[11px] text-left space-y-1">
                      <div className="text-indigo-300 text-[10px] text-center border-b border-indigo-900/45 pb-1 mb-1">Haber + Participio (-ado / -ido)</div>
                      <div className="flex justify-between">
                        <strong className="text-yellow-400">Yo (Ես)</strong>
                        <span>habré disfrutado</span>
                      </div>
                      <div className="flex justify-between">
                        <strong className="text-yellow-400">Tú (Դու)</strong>
                        <span>habrás disfrutado</span>
                      </div>
                      <div className="flex justify-between">
                        <strong className="text-yellow-400">Él (Նա)</strong>
                        <span>habrá disfrutado</span>
                      </div>
                      <div className="flex justify-between">
                        <strong className="text-yellow-400">Nosotros (Մենք)</strong>
                        <span>habremos disfrutado</span>
                      </div>
                      <div className="flex justify-between">
                        <strong className="text-yellow-400">Ellos (Նրանք)</strong>
                        <span>habrán disfrutado</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-indigo-300 leading-normal">
                      💡 Հաճախ օգտագործվում է ժամանակային ցուցիչների հետ՝ <strong className="text-white">para entonces</strong> (այդ պահին) կամ <strong className="text-white">antes de...</strong> (նախքան...)։
                    </p>
                  </>
                )}

                {activeGrammarTab === 'TIPS' && (
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-bold text-yellow-400 text-[11px] uppercase font-display">Կարևոր Բացառություններ՝</h5>
                      <p className="text-[11px] text-indigo-300 mt-0.5">Ապառնի ժամանակում մի քանի հանրահայտ բայերի հիմքերը փոխվում են՝</p>
                    </div>

                    <ul className="space-y-1 font-mono text-[11px] bg-indigo-950 p-2.5 rounded-xl border border-indigo-500/30">
                      <li>• tener → <span className="text-yellow-300 font-bold">tendr-</span> (tendré)</li>
                      <li>• hacer → <span className="text-yellow-300 font-bold">har-</span> (haré)</li>
                      <li>• decir → <span className="text-yellow-300 font-bold">dir-</span> (diré)</li>
                      <li>• poder → <span className="text-yellow-300 font-bold">podr-</span> (podré)</li>
                      <li>• querer → <span className="text-yellow-300 font-bold">querr-</span> (querré)</li>
                      <li>• saber → <span className="text-yellow-300 font-bold">sabr-</span> (sabré)</li>
                    </ul>

                    <p className="text-[11px] text-indigo-300 leading-normal">
                      Անկանոն դերբայներ Perfecto-ի համար՝ <strong className="text-white">hecho</strong> (անել), <strong className="text-white">escrito</strong> (գրել), <strong className="text-white">visto</strong> (տեսնել), <strong className="text-white">roto</strong> (կոտրել):
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* QUIZ INNER QUESTION DIALOG PRE-RENDER/MODAL */}
      <AnimatePresence>
        {phase === 'QUESTION' && currentQuestion && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-600/60 rounded-2xl max-w-lg w-full p-5 md:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto scrollbar-thin flex flex-col"
            >
              <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-400 font-mono font-bold text-[10px] md:text-xs px-2.5 py-1 rounded border border-amber-500/20">
                {landedSector?.type === 'chance' ? 'ՇԱՆՍ ՍԵԿՏՈՐ' : `ՄԻԱՎՈՐ՝ ${landedSector?.value || 300}`}
              </div>

              {/* Question metadata header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded uppercase font-mono font-bold">
                  Թեմա՝ {currentQuestion.tense === 'Simple' ? 'Futuro Simple' : currentQuestion.tense === 'Perfecto' ? 'Futuro Perfecto' : 'Նրբություններ'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono ${
                  currentQuestion.difficulty === 'difícil' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}>
                  {currentQuestion.difficulty === 'fácil' ? 'Հեշտ' : currentQuestion.difficulty === 'medio' ? 'Միջին' : 'Դժվար'}
                </span>
              </div>

              {/* Main question - Bilingual side by side / stacked */}
              <div className="space-y-2 mb-5">
                <h3 className="text-base md:text-lg font-bold text-slate-100 font-display leading-snug break-words whitespace-normal">
                  {currentQuestion.questionText}
                </h3>
                <p className="text-xs md:text-sm text-yellow-300 font-medium italic opacity-95 leading-relaxed break-words whitespace-normal border-l-2 border-yellow-400/30 pl-2">
                  {currentQuestion.questionTextArm}
                </p>
              </div>

              {/* Options lists Grid */}
              <div className="space-y-2.5 mb-5 flex-1">
                {currentQuestion.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  const isCorrectAnswer = oIdx === currentQuestion.correctIndex;
                  const showSuccessBorder = answerResult !== null && isCorrectAnswer;
                  const showFailBorder = answerResult !== null && isSelected && !isCorrectAnswer;

                  let cardStyle = "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-300";
                  if (answerResult !== null) {
                    if (isCorrectAnswer) {
                      cardStyle = "bg-green-950/40 border-green-500 text-green-200";
                    } else if (isSelected) {
                      cardStyle = "bg-rose-950/40 border-rose-500 text-rose-200";
                    } else {
                      cardStyle = "bg-slate-950/20 border-slate-850/50 text-slate-500 opacity-60";
                    }
                  } else if (isSelected) {
                    cardStyle = "bg-amber-500/5 border-amber-500 text-amber-200";
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={answerResult !== null}
                      onClick={() => handleAnswerSubmit(oIdx)}
                      className={`w-full text-left p-3 md:p-3.5 rounded-xl border flex items-center justify-between text-xs md:text-sm gap-3 transition-all focus:outline-none ${cardStyle}`}
                    >
                      <span className="leading-relaxed font-medium break-words flex-1 whitespace-normal">{opt}</span>
                      
                      {/* Interactive icons showing state */}
                      {answerResult === null ? (
                        <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-500 select-none flex-shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                      ) : isCorrectAnswer ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : isSelected ? (
                        <X className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Explanation section displayed post-submission */}
              {answerResult !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-xl mb-5 text-xs leading-relaxed ${
                    answerResult === 'CORRECT' 
                      ? 'bg-green-500/5 text-green-200 border border-green-500/15' 
                      : 'bg-rose-500/5 text-rose-200 border border-rose-500/15'
                  }`}
                >
                  <p className="font-bold uppercase tracking-wider mb-1 font-mono text-[10px] flex items-center gap-1">
                    {answerResult === 'CORRECT' ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-green-400" />
                        ՄԻԱՆԳԱՄԱՅՆ ՃԻՇՏ Է՛
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5 text-rose-400" />
                        ԱՎԱ՛Ղ, ՍԽԱԼ ՊԱՏԱՍԽԱՆ
                      </>
                    )}
                  </p>
                  <p className="mt-1 break-words whitespace-normal">{currentQuestion.explanation}</p>
                  <p className="mt-2 text-[11px] text-yellow-300 italic font-medium pt-2 border-t border-white/5 break-words whitespace-normal">
                    {currentQuestion.explanationArm}
                  </p>
                </motion.div>
              )}

              {/* Proceed Action triggered either way */}
              {answerResult !== null && (
                <button 
                  type="button"
                  onClick={handleQuizDone}
                  className={`w-full text-slate-950 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm flex-shrink-0 ${
                    answerResult === 'CORRECT' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500' 
                      : 'bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-450 hover:to-red-550 text-white'
                  }`}
                >
                  <span>
                    {answerResult === 'CORRECT' 
                      ? 'ԳԵՐԱԶԱՆՑ Է, ԲԱՑԵԼ ՏԱՌԸ' 
                      : 'ՀԱՍԿԱՑԱ, ՓՈԽԱՆՑԵԼ ՔԱՅԼԸ'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GUESS LETTER MODAL / INPUT BOARD SCREEN */}
      <AnimatePresence>
        {phase === 'GUESS_LETTER' && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-600/70 rounded-2xl max-w-xl w-full p-6 shadow-2xl"
            >
              <div className="text-center mb-5">
                <span className="bg-amber-500/15 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20">
                  Верный ответ подтвержден!
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-3">
                  НАЗОВИТЕ БУКВУ НА ТАБЛО
                </h3>
                <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
                  Выберите букву испанского алфавита. Успешное попадание начислит очки <strong className="text-amber-400 font-mono">{(landedSector?.value || 300)} очков</strong> за каждое вхождение буквы в слово и позволит запустить барабан вновь!
                </p>
              </div>

              {/* LETTERS KEYBOARD GRID */}
              <div className="grid grid-cols-6 xs:grid-cols-7 sm:grid-cols-9 gap-2 mb-6">
                {SPANISH_ALPHABET.map((letter) => {
                  const wasAlreadyGuessed = guessedLetters.includes(letter);
                  const isPresentInWord = targetWord.includes(letter);
                  
                  let keyStyle = "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:bg-slate-950";
                  if (wasAlreadyGuessed) {
                    keyStyle = isPresentInWord 
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-500/50 line-through cursor-not-allowed"
                      : "bg-rose-950/40 border-rose-500/30 text-rose-500/50 line-through cursor-not-allowed";
                  }

                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={wasAlreadyGuessed}
                      onClick={() => handleLetterSelection(letter)}
                      className={`h-11 rounded-lg border font-bold text-center text-sm transition focus:outline-none flex items-center justify-center ${keyStyle}`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              {/* Back out options */}
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => switchTurn()}
                  className="text-xs text-slate-500 hover:text-slate-400 underline underline-offset-4"
                >
                  Сдаться и добровольно передать ход сопернику
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GUESS ENTIRE WORD DIALOG */}
      <AnimatePresence>
        {phase === 'WHOLE_WORD' && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-600/70 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            >
              {/* Force dismiss button */}
              <button 
                type="button"
                onClick={() => setPhase('SPIN_WAIT')}
                className="absolute top-4 right-4 text-slate-450 hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold font-display text-white mb-2 text-center flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-amber-500 animate-pulse" />
                НАЗВАТЬ СЛОВО ЦЕЛИКОМ
              </h3>
              
              <p className="text-xs text-slate-400 text-center mb-5 leading-relaxed">
                Вы уверены? Если вы отгадаете верно, вы заработаете колоссальные <strong className="text-emerald-400">+2500 очков</strong> и победите в этом раунде! За ошибку предусмотрен штраф в <strong className="text-rose-500">400 очков</strong> и передача хода.
              </p>

              <form onSubmit={handleWholeWordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Слово на испанском:</label>
                  <input 
                    type="text"
                    value={typedWord}
                    onChange={(e) => setTypedWord(e.target.value)}
                    placeholder="Например, DISFRUTARE или DISFRUTAR"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3.5 text-center font-bold tracking-widest text-slate-100 uppercase focus:outline-none focus:ring-1 focus:ring-amber-500"
                    autoFocus
                  />
                </div>

                {wholeWordError && (
                  <p className="text-xs text-rose-400 font-medium text-center bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    ⚠️ {wholeWordError}
                  </p>
                )}

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setPhase('SPIN_WAIT')}
                    className="flex-1 bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-semibold py-2 px-3 rounded-lg text-xs"
                  >
                    Отменить
                  </button>

                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs shadow"
                  >
                    Подтвердить ответ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ROUND COMPLETE BANNER */}
      <AnimatePresence>
        {phase === 'ROUND_COMPLETE' && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl text-center relative"
            >
              {/* Golden confetti effect placeholder */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

              <div className="inline-flex bg-emerald-500/15 text-emerald-400 p-3 rounded-full mb-4 animate-bounce border border-emerald-500/30">
                <Trophy className="w-8 h-8 text-emerald-400" />
              </div>

              <h3 className="text-2xl md:text-3xl font-black font-display text-white tracking-tight leading-none mb-1">
                Раунд успешно завершен!
              </h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-4">
                Слово было угадано: <strong className="text-emerald-400">{targetWord}</strong>
              </p>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850/80 mb-6 text-left max-w-md mx-auto">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Грамматический факт:</h4>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">{targetWordObj.clue}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-sm mx-auto mb-6">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3 text-center">Промежуточный зачет дуэли</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-r border-slate-800 pr-2">
                    <p className="text-[10px] text-slate-500 truncate">{player1Name}</p>
                    <p className="text-lg font-mono font-bold text-slate-100">{scores[0]}</p>
                  </div>
                  <div className="pl-2">
                    <p className="text-[10px] text-slate-500 truncate">{player2Name}</p>
                    <p className="text-lg font-mono font-bold text-slate-100">{scores[1]}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  type="button"
                  onClick={handleNextRound}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold py-3 px-5 rounded-xl transition shadow flex items-center justify-center gap-2 text-sm"
                >
                  {roundIndex + 1 < ROUND_WORDS.length ? (
                    <>
                      <span>ПЕРЕЙТИ К СЛЕДУЮЩЕМУ РАУНДУ</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>ПОКАЗАТЬ ИТОГИ ДУЭЛИ</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GAME OVER WRAP-UP MODAL */}
      <AnimatePresence>
        {phase === 'GAME_OVER' && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl text-center"
            >
              <div className="inline-flex bg-amber-500/10 text-amber-400 p-4 rounded-full mb-4 ring-4 ring-amber-500/20">
                <Trophy className="w-10 h-10 text-amber-500" />
              </div>

              <h3 className="text-3xl font-black font-display text-white tracking-tight leading-none mb-1">
                ФИНАЛ ИГРЫ!
              </h3>
              <p className="text-xs text-amber-400/80 uppercase tracking-widest font-mono mb-6">
                Все раунды успешно разыграны
              </p>

              {/* Winner Identification Card */}
              <div className="bg-gradient-to-b from-amber-500/10 to-transparent p-5 rounded-xl border border-amber-500/30 mb-6">
                <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-1">Абсолютный победитель:</p>
                <h4 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                  {scores[0] > scores[1] ? player1Name : scores[1] > scores[0] ? player2Name : "НИЧЬЯ!"}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Общий зачет дуэли: <strong className="text-amber-400">{Math.max(scores[0], scores[1])} баллов</strong>
                </p>
              </div>

              {/* Direct points report */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-sm text-left mb-6 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">1. {player1Name}:</span>
                  <span className="font-bold text-amber-400">{scores[0]} очков</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">2. {player2Name}:</span>
                  <span className="font-bold text-amber-400">{scores[1]} очков</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-5 rounded-xl transition shadow text-sm"
              >
                НАЧАТЬ ИГРУ ЗАНОВО
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER CREDITS */}
      <footer className="py-4 text-center text-[10px] text-slate-600 font-mono border-t border-slate-900 mt-auto bg-slate-950/80">
        Поле чудес 3D © {new Date().getFullYear()} • Учебная игра по спряжению испанских глаголов • Проект разработан на чистом JS/TS React
      </footer>

    </div>
  );
}
