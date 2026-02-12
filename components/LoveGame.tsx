import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRIVIA_QUESTIONS } from '../constants';
import { ConfettiEffect } from './Confetti';
import { EmojiReaction } from './EmojiReaction';
import { 
  PixelTrophy, PixelHeart, PixelPlay, PixelCheck, 
  PixelArrowLeft, PixelArrowRight, PixelClose, PixelGamepad 
} from './PixelIcons';

// --- Types & Constants for Snake ---
const GRID_SIZE = 15;
const INITIAL_SPEED = 150;

type Point = { x: number, y: number };
type GameState = 'playing' | 'gameover' | 'won';

// Define Corner Trees (3 per corner to create a "forest" feel without blocking too much)
const CORNER_TREES: Point[] = [
  // Top Left
  {x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1},
  // Top Right
  {x: 14, y: 0}, {x: 13, y: 0}, {x: 14, y: 1}, {x: 13, y: 1},
  // Bottom Left
  {x: 0, y: 14}, {x: 1, y: 14}, {x: 0, y: 13}, {x: 1, y: 13},
  // Bottom Right
  {x: 14, y: 14}, {x: 13, y: 14}, {x: 14, y: 13}, {x: 13, y: 13},
];

// --- Helper Components ---

// On-Screen D-Pad Button
const DPadBtn = ({ rotate, onClick }: { rotate: number, onClick: () => void }) => (
  <button 
    className="w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-gray-300 border-b-4 border-b-gray-400 active:border-b-2 active:translate-y-0.5 rounded-xl flex items-center justify-center shadow-sm active:shadow-none transition-all touch-manipulation group"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    onPointerDown={(e) => { e.preventDefault(); onClick(); }}
  >
    <div style={{ transform: `rotate(${rotate}deg)` }}>
      <PixelArrowRight size={24} className="text-gray-600 group-hover:text-love-500 transition-colors" />
    </div>
  </button>
);

// --- Snake Game Component ---
const SnakeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Point>({ x: 7, y: 4 });
  const [stones, setStones] = useState<Point[]>([]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 }); // Moving Up initially
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [isPaused, setIsPaused] = useState(false);
  
  // Animation State
  const [headScale, setHeadScale] = useState(1);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Controls
  const handleDirection = useCallback((newDir: Point) => {
    setNextDirection((prev) => {
      // Prevent 180 degree turns
      if (prev.x !== 0 && newDir.x !== 0) return prev;
      if (prev.y !== 0 && newDir.y !== 0) return prev;
      return newDir;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp': handleDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': handleDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': handleDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': handleDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirection]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const moveSnake = () => {
      setDirection(nextDirection);
      
      const head = snake[0];
      const newHead = { x: head.x + nextDirection.x, y: head.y + nextDirection.y };

      // 1. Wall Collision Check
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameState('gameover');
        return;
      }

      // 2. Tree Collision Check
      if (CORNER_TREES.some(t => t.x === newHead.x && t.y === newHead.y)) {
        setGameState('gameover');
        return;
      }

      // 3. Stone Collision Check
      if (stones.some(s => s.x === newHead.x && s.y === newHead.y)) {
        setGameState('gameover');
        return;
      }

      // 4. Self Collision Check
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState('gameover');
        return;
      }

      const newSnake = [newHead, ...snake];

      // 5. Food Check
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 1;
        setScore(newScore);
        
        // Pop Effect
        setHeadScale(1.4);
        setTimeout(() => setHeadScale(1), 200);

        // Increase Difficulty
        if (newScore % 5 === 0) {
           setGameSpeed(prev => Math.max(prev - 10, 80)); // Cap speed at 80ms
           
           // Add a Stone
           let newStone;
           do {
             newStone = { 
                x: Math.floor(Math.random() * GRID_SIZE), 
                y: Math.floor(Math.random() * GRID_SIZE) 
             };
           } while (
             newSnake.some(s => s.x === newStone.x && s.y === newStone.y) ||
             CORNER_TREES.some(t => t.x === newStone.x && t.y === newStone.y) ||
             (newStone.x === food.x && newStone.y === food.y) ||
             stones.some(s => s.x === newStone.x && s.y === newStone.y)
           );
           setStones(prev => [...prev, newStone]);
        }

        // Generate new food
        let newFood;
        do {
          newFood = { 
            x: Math.floor(Math.random() * GRID_SIZE), 
            y: Math.floor(Math.random() * GRID_SIZE) 
          };
        } while (
          newSnake.some(s => s.x === newFood.x && s.y === newFood.y) ||
          CORNER_TREES.some(t => t.x === newFood.x && t.y === newFood.y) ||
          stones.some(s => s.x === newFood.x && s.y === newFood.y)
        );
        setFood(newFood);
      } else {
        newSnake.pop(); // Remove tail
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameInterval);
  }, [snake, nextDirection, gameState, isPaused, food, stones, gameSpeed, score]);

  // Save High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  // Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas Size
    const size = Math.min(window.innerWidth - 40, 400); // Responsive size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const tileSize = size / GRID_SIZE;

    // Helper to draw 3D Block with optional Scaling and Z-offset
    const drawBlock = (
      x: number, 
      y: number, 
      colorTop: string, 
      colorSide: string, 
      heightRatio: number = 0.2, 
      scale: number = 1,
      zOffset: number = 0 // Vertical visual offset in blocks (negative is up)
    ) => {
      // Calculate center for scaling
      const cx = (x + 0.5) * tileSize;
      const cy = (y + 0.5) * tileSize;
      
      const w = tileSize * scale;
      // Current drawn height of the block face
      const h = tileSize * heightRatio * scale;
      // Visual depth of top face
      const dh = tileSize * scale; 

      const px = cx - w/2;
      const py = cy - dh/2 + (zOffset * tileSize); // Apply Z offset here

      // Shadow (only if on ground)
      if (zOffset === 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(px + 2, py + dh + 2, w, -2); 
      }

      // Side Face (Bottom part)
      ctx.fillStyle = colorSide;
      ctx.fillRect(px, py + dh - h, w, h);

      // Top Face
      ctx.fillStyle = colorTop;
      ctx.fillRect(px, py, w, dh - h);
      
      // Highlight/Border for pixel look
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(px, py, w, 2); // Top highlight
      
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, w, dh - h);
    };

    // 1. Draw Background (Detailed Grass)
    ctx.clearRect(0, 0, size, size);
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isAlt = (x + y) % 2 === 0;
        drawBlock(
          x, y, 
          isAlt ? '#a7f3d0' : '#6ee7b7', 
          isAlt ? '#059669' : '#047857', 
          0.1
        );
      }
    }

    // 2. Draw Trees
    CORNER_TREES.forEach(tree => {
      // Trunk
      drawBlock(tree.x, tree.y, '#b45309', '#78350f', 0.5);
      // Leaves (Shifted up by -0.4 blocks)
      drawBlock(tree.x, tree.y, '#15803d', '#14532d', 0.6, 1, -0.4);
    });

    // 3. Draw Stones
    stones.forEach(stone => {
       drawBlock(stone.x, stone.y, '#9ca3af', '#4b5563', 0.3);
       // Add some texture
       const px = stone.x * tileSize;
       const py = stone.y * tileSize;
       ctx.fillStyle = '#6b7280';
       ctx.fillRect(px + tileSize*0.3, py + tileSize*0.2, tileSize*0.2, tileSize*0.1);
       ctx.fillRect(px + tileSize*0.6, py + tileSize*0.5, tileSize*0.1, tileSize*0.1);
    });

    // 4. Draw Food (Apple)
    drawBlock(food.x, food.y, '#f43f5e', '#be123c', 0.25); 
    // Draw Leaf/Stem
    const fx = food.x * tileSize;
    const fy = food.y * tileSize;
    ctx.fillStyle = '#3f2e26';
    ctx.fillRect(fx + tileSize/2 - 2, fy - 6, 4, 6);
    ctx.fillStyle = '#a3e635'; 
    ctx.fillRect(fx + tileSize/2, fy - 8, 8, 6);

    // 5. Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      // Head uses dynamic scale
      const currentScale = isHead ? headScale : 1;
      
      drawBlock(
        segment.x, 
        segment.y, 
        isHead ? '#fcd34d' : '#4ade80', 
        isHead ? '#d97706' : '#16a34a', 
        0.25,
        currentScale
      );
      
      // Draw Face on Head
      if (isHead) {
        // We need to re-calculate positions based on scale
        const cx = (segment.x + 0.5) * tileSize;
        const cy = (segment.y + 0.5) * tileSize;
        const w = tileSize * currentScale;
        const px = cx - w/2;
        const py = cy - w/2;
        
        const eyeSize = w * 0.15;
        const eyeOffset = w * 0.2;
        
        // Eyes (White background)
        ctx.fillStyle = 'white';
        let lx = px + eyeOffset, ly = py + eyeOffset;
        let rx = px + w - eyeOffset - eyeSize, ry = py + eyeOffset;
        
        ctx.fillRect(lx, ly, eyeSize, eyeSize);
        ctx.fillRect(rx, ry, eyeSize, eyeSize);
        
        // Pupils (Black)
        ctx.fillStyle = '#1f2937';
        // Look in direction
        const pupilOffsetX = direction.x * 2;
        const pupilOffsetY = direction.y * 2;
        ctx.fillRect(lx + 2 + pupilOffsetX, ly + 2 + pupilOffsetY, eyeSize/2, eyeSize/2);
        ctx.fillRect(rx + 2 + pupilOffsetX, ry + 2 + pupilOffsetY, eyeSize/2, eyeSize/2);
        
        // Blush
        ctx.fillStyle = '#f43f5e';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(lx - 2, ly + eyeSize, 6, 3);
        ctx.fillRect(rx + 2, ry + eyeSize, 6, 3);
        ctx.globalAlpha = 1.0;
      }
    });

  }, [snake, food, gameState, direction, headScale, stones]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
         <button onClick={onBack} className="pixel-btn pixel-btn-red p-2 aspect-square">
            <PixelClose size={16} />
         </button>
         <div className="flex flex-col items-center">
             <h2 className="font-script text-xl md:text-3xl text-white retro-text mb-2">PIXEL SNAKE</h2>
             <div className="flex gap-4 text-xs md:text-sm font-bold text-white bg-love-500 px-4 py-1.5 rounded-full border-2 border-gray-900 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                <span>SCORE: {score}</span>
                <span>BEST: {highScore}</span>
             </div>
         </div>
         <div className="w-8"></div> {/* Spacer */}
      </div>

      {/* Game Area */}
      <div className="relative p-2 bg-love-100 border-4 border-love-300 rounded-xl shadow-[6px_6px_0_rgba(190,18,60,0.2)]">
        <canvas 
          ref={canvasRef} 
          className="rounded-lg shadow-inner bg-[#a7f3d0] cursor-pointer"
        />
        
        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameState === 'gameover' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm z-10"
            >
              <div className="bg-white p-6 rounded-xl border-4 border-gray-900 shadow-[8px_8px_0_#ef4444] text-center">
                 <h3 className="font-script text-2xl text-red-500 mb-2">GAME OVER</h3>
                 <p className="font-bold text-gray-700 mb-4">Score: {score}</p>
                 <button 
                   onClick={() => {
                     setSnake([{ x: 7, y: 7 }]);
                     setDirection({ x: 0, y: -1 });
                     setNextDirection({ x: 0, y: -1 });
                     setScore(0);
                     setStones([]);
                     setGameSpeed(INITIAL_SPEED);
                     setGameState('playing');
                   }}
                   className="pixel-btn pixel-btn-green w-full"
                 >
                   TRY AGAIN
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-6 grid grid-cols-3 gap-2 md:gap-4">
         <div className="col-start-2">
            <DPadBtn rotate={-90} onClick={() => handleDirection({ x: 0, y: -1 })} />
         </div>
         <div className="col-start-1 row-start-2">
            <DPadBtn rotate={180} onClick={() => handleDirection({ x: -1, y: 0 })} />
         </div>
         <div className="col-start-2 row-start-2">
            <DPadBtn rotate={90} onClick={() => handleDirection({ x: 0, y: 1 })} />
         </div>
         <div className="col-start-3 row-start-2">
            <DPadBtn rotate={0} onClick={() => handleDirection({ x: 1, y: 0 })} />
         </div>
      </div>
      
      <p className="mt-4 text-xs text-love-800/60 font-bold hidden md:block">Use Arrow Keys to Move</p>
    </div>
  );
};

// --- Trivia Game Component ---
const TriviaGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === TRIVIA_QUESTIONS[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    setTimeout(() => {
      if (currentQuestion < TRIVIA_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col">
       <button onClick={onBack} className="self-start mb-4 pixel-btn pixel-btn-white p-2 aspect-square">
          <PixelArrowLeft size={20} />
       </button>

      <ConfettiEffect trigger={showConfetti || (isFinished && score > TRIVIA_QUESTIONS.length / 2)} />
      
      {!isFinished ? (
        <div className="w-full">
          <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border-2 border-gray-900">
            <span className="text-love-800 font-bold font-script">Question {currentQuestion + 1}/{TRIVIA_QUESTIONS.length}</span>
            <div className="flex items-center gap-2">
                <PixelHeart size={20} className="text-love-500" />
                <span className="text-love-600 font-bold font-script">{score}</span>
            </div>
          </div>
          
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white p-4 md:p-8 rounded-2xl shadow-[8px_8px_0_rgba(0,0,0,0.1)] border-4 border-gray-900"
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 font-script leading-normal">{TRIVIA_QUESTIONS[currentQuestion].question}</h3>
            
            <div className="space-y-4">
              {TRIVIA_QUESTIONS[currentQuestion].options.map((option, idx) => {
                let btnClass = "pixel-btn w-full justify-between";
                if (selectedOption !== null) {
                  if (idx === TRIVIA_QUESTIONS[currentQuestion].correctAnswer) {
                    btnClass += " pixel-btn-green";
                  } else if (selectedOption === idx) {
                    btnClass += " pixel-btn-red";
                  } else {
                    btnClass += " pixel-btn-white opacity-50";
                  }
                } else {
                  btnClass += " pixel-btn-white hover:bg-gray-100";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => selectedOption === null && handleAnswer(idx)}
                    className={btnClass}
                    disabled={selectedOption !== null}
                    style={{ textTransform: 'none', fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1rem', fontWeight: 'bold' }}
                  >
                    <span>{option}</span>
                    {selectedOption !== null && idx === TRIVIA_QUESTIONS[currentQuestion].correctAnswer && (
                      <PixelCheck size={24} />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl text-center border-4 border-love-200"
        >
          <div className="flex justify-center mb-6">
            <PixelTrophy size={80} />
          </div>
          <h2 className="text-3xl font-script text-love-800 mb-2">Game Over!</h2>
          <p className="text-xl text-gray-600 mb-6 font-bold">
            You scored {score} out of {TRIVIA_QUESTIONS.length}!
          </p>
          
          {score === TRIVIA_QUESTIONS.length ? (
             <div className="bg-love-50 p-6 rounded-xl mb-8 border-4 border-love-200">
               <h3 className="font-bold text-love-700 mb-2 font-script">Secret Reward Unlocked! 🎁</h3>
               <p className="text-love-900 italic font-bold">"You know me better than anyone. I love you! ❤️"</p>
             </div>
          ) : (
             <p className="text-gray-500 mb-6 font-bold">Get a perfect score to see the secret message!</p>
          )}

          <div className="flex gap-4 justify-center mb-8">
            <EmojiReaction emoji="🎉" />
            <EmojiReaction emoji="🏆" />
          </div>

          <button 
            onClick={resetGame}
            className="pixel-btn pixel-btn-pink w-full"
          >
            <PixelPlay size={20} />
            <span className="font-script">Play Again</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

// --- Main Menu Component ---
const GameMenu: React.FC<{ onSelect: (mode: 'trivia' | 'snake') => void }> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full max-w-lg">
      <div className="text-center mb-4">
        <h2 className="font-script text-2xl md:text-3xl text-white retro-text mb-2">Game Zone</h2>
        <p className="text-white font-bold drop-shadow-md">Choose your challenge!</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect('snake')}
        className="group relative w-full bg-green-500 border-4 border-gray-900 rounded-xl p-6 flex items-center justify-between shadow-[6px_6px_0_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0_rgba(0,0,0,0.3)] transition-all overflow-hidden"
      >
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] opacity-20"></div>
         <div className="relative z-10 flex flex-col items-start text-white">
            <h3 className="font-script text-xl md:text-2xl drop-shadow-[2px_2px_0_#000]">PIXEL SNAKE</h3>
            <span className="text-sm font-bold opacity-90 mt-1">Classic Arcade Action</span>
         </div>
         <div className="relative z-10 bg-white/20 p-3 rounded-full border-2 border-white/50">
            <PixelGamepad size={40} className="text-white" />
         </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect('trivia')}
        className="group relative w-full bg-love-500 border-4 border-gray-900 rounded-xl p-6 flex items-center justify-between shadow-[6px_6px_0_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0_rgba(0,0,0,0.3)] transition-all overflow-hidden"
      >
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] opacity-20"></div>
         <div className="relative z-10 flex flex-col items-start text-white">
            <h3 className="font-script text-xl md:text-2xl drop-shadow-[2px_2px_0_#000]">LOVE TRIVIA</h3>
            <span className="text-sm font-bold opacity-90 mt-1">How well do you know us?</span>
         </div>
         <div className="relative z-10 bg-white/20 p-3 rounded-full border-2 border-white/50">
            <PixelHeart size={40} className="text-white" />
         </div>
      </motion.button>
    </div>
  );
};

// --- Main Export ---
export const LoveGame: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'trivia' | 'snake'>('menu');

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 w-full">
      <AnimatePresence mode="wait">
        {mode === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full flex justify-center"
          >
            <GameMenu onSelect={setMode} />
          </motion.div>
        )}
        {mode === 'trivia' && (
          <motion.div 
            key="trivia"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="w-full"
          >
            <TriviaGame onBack={() => setMode('menu')} />
          </motion.div>
        )}
        {mode === 'snake' && (
          <motion.div 
            key="snake"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            <SnakeGame onBack={() => setMode('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};