import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface BitProps {
  value: string;
  index: number;
  isHighlighted: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Bit: React.FC<BitProps> = ({ value, index, isHighlighted, onMouseEnter, onMouseLeave }) => (
  <div 
    className={`bit ${value === '1' ? 'bit-1' : 'bit-0'} ${isHighlighted ? 'highlight' : ''}`}
    data-val={value}
    data-index={index}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {value}
  </div>
);

export default function BinaryExplorer() {
  const [currentBits, setCurrentBits] = useState(32);
  const [inputType, setInputType] = useState<'int' | 'char' | 'hex'>('int');
  const [inputValue, setInputValue] = useState('42');
  const [binaryString, setBinaryString] = useState('0'.repeat(32));
  const [interpretations, setInterpretations] = useState({
    int: '0',
    char: '.',
    hex: '0x00000000',
    bool: 'False'
  });
  const [highlightedTarget, setHighlightedTarget] = useState<string | null>(null);
  const [showCharWarning, setShowCharWarning] = useState(false);

  // System options
  const systems = [
    { bits: 8, icon: '🕹️', title: 'Retro Console', label: '8-bit Word Size' },
    { bits: 16, icon: '💾', title: 'Classic PC', label: '16-bit Word Size' },
    { bits: 32, icon: '📱', title: 'Early Smartphone', label: '32-bit Word Size' },
    { bits: 64, icon: '🖥️', title: 'Modern System', label: '64-bit Word Size' },
  ];

  const processInput = useCallback(() => {
    let rawVal = inputValue.trim();
    let bigVal = 0n;
    const bits = BigInt(currentBits);

    try {
      if (rawVal === '') {
        bigVal = 0n;
      } else if (inputType === 'int') {
        bigVal = BigInt(rawVal);
      } else if (inputType === 'char') {
        const charCode = rawVal.charCodeAt(0) || 0;
        bigVal = BigInt(charCode);
      } else if (inputType === 'hex') {
        const hexVal = rawVal.replace(/^0x/i, '');
        bigVal = BigInt('0x' + (hexVal || '0'));
      }

      // Apply mask for word size
      const mask = (1n << bits) - 1n;
      
      if (bigVal < 0n) {
        // Two's complement for negative numbers
        bigVal = ((-bigVal ^ mask) + 1n) & mask;
      } else {
        bigVal = bigVal & mask;
      }

      // Convert to binary string
      const binStr = bigVal.toString(2).padStart(currentBits, '0');
      setBinaryString(binStr);
      
    } catch (e) {
      setBinaryString('0'.repeat(currentBits));
    }
  }, [inputValue, inputType, currentBits]);

  const updateInterpretations = useCallback((binStr: string) => {
    // Signed Integer (Two's Complement)
    const isNegative = binStr[0] === '1';
    let intVal: bigint;
    
    if (isNegative && currentBits > 1) {
      const inverted = binStr.split('').map(b => b === '1' ? '0' : '1').join('');
      intVal = -(BigInt('0b' + inverted) + 1n);
    } else {
      intVal = BigInt('0b' + binStr);
    }

    // Character from lowest 8 bits
    const lowest8 = binStr.slice(-8);
    const charCode = parseInt(lowest8, 2);
    let charDisplay = '.';
    if (charCode >= 32 && charCode <= 126) {
      charDisplay = String.fromCharCode(charCode);
    } else if (charCode > 0) {
      charDisplay = `[${charCode}]`;
    }

    // Hex
    let hexVal = BigInt('0b' + binStr).toString(16).toUpperCase();
    const hexPadding = Math.ceil(currentBits / 4);
    const paddedHex = hexVal.padStart(hexPadding, '0');
    
    // Boolean
    const isTrue = binStr.includes('1');
    const boolDisplay = isTrue ? 'True' : 'False';

    setInterpretations({
      int: intVal.toString(),
      char: charDisplay,
      hex: `0x${paddedHex}`,
      bool: boolDisplay
    });
  }, [currentBits]);

  // Update when binary changes
  useEffect(() => {
    updateInterpretations(binaryString);
  }, [binaryString, updateInterpretations]);

  // Process input when dependencies change
  useEffect(() => {
    processInput();
  }, [processInput]);

  const handleSystemChange = (bits: number) => {
    setCurrentBits(bits);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Show warning for character mode with extra characters
    if (inputType === 'char' && newValue.length > 1) {
      setShowCharWarning(true);
      setTimeout(() => setShowCharWarning(false), 3000);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputType(e.target.value as 'int' | 'char' | 'hex');
    setInputValue('');
  };

  const highlightBits = (target: string | null) => {
    setHighlightedTarget(target);
  };

  // Render binary bits grouped by bytes
  const renderBinaryDisplay = () => {
    const bits = binaryString.split('');
    const numBytes = currentBits / 8;
    const byteGroups: React.ReactNode[] = [];

    for (let byteIdx = 0; byteIdx < numBytes; byteIdx++) {
      const byteBits: React.ReactNode[] = [];
      
      for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
        const globalBitIndex = byteIdx * 8 + bitIdx;
        const bitValue = bits[globalBitIndex];
        const bitPositionFromRight = currentBits - 1 - globalBitIndex; // LSB is 0
        
        const isHighlighted = highlightedTarget === 'all' || 
          (highlightedTarget === 'byte0' && bitPositionFromRight < 8);

        byteBits.push(
          <Bit
            key={globalBitIndex}
            value={bitValue}
            index={bitPositionFromRight}
            isHighlighted={isHighlighted}
            onMouseEnter={() => highlightBits('all')}
            onMouseLeave={() => highlightBits(null)}
          />
        );
      }

      byteGroups.push(
        <div key={byteIdx} className="byte-group">
          {byteBits}
        </div>
      );
    }

    return byteGroups;
  };

  return (
    <main className="page binary-explorer">
      <div className="container widgets-page">
        <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Link className="btn btn--outline" to="/code">← Computer Science</Link>
          <h1 className="h1" style={{ margin: 0 }}>Binary Interpretation Explorer</h1>
        </div>

        <div className="panel" style={{ marginBottom: '1.5rem' }}>
          <p className="muted" style={{ marginBottom: '1.25rem', fontSize: '1.05rem' }}>
            The exact same bits produce entirely different realities depending on how the software reads them.
          </p>

          {/* System Selector */}
          <div className="section">
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>WORD SIZE (MEMORY WIDTH)</div>
            <div className="system-grid">
              {systems.map((system) => (
                <div
                  key={system.bits}
                  className={`system-card ${currentBits === system.bits ? 'active' : ''}`}
                  onClick={() => handleSystemChange(system.bits)}
                >
                  <div className="system-icon">{system.icon}</div>
                  <div className="system-title">{system.title}</div>
                  <div className="system-bits">{system.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Controls */}
          <div className="input-section">
            <div className="field" style={{ minWidth: '200px' }}>
              <label>Interpretation Type</label>
              <select 
                value={inputType} 
                onChange={handleTypeChange}
                className="select"
                style={{ fontSize: '1.1rem', padding: '0.75rem' }}
              >
                <option value="int">Signed Integer</option>
                <option value="char">Character (A-Z)</option>
                <option value="hex">Hexadecimal (0x)</option>
              </select>
            </div>
            
            <div className="field" style={{ flex: 1, maxWidth: '280px' }}>
              <label>Data Value</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  maxLength={inputType === 'char' ? 8 : 20}
                  placeholder={inputType === 'char' ? "A" : inputType === 'hex' ? "0x2A" : "42"}
                  className="input"
                  style={{ 
                    fontSize: '1.35rem', 
                    padding: '0.85rem 1rem',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    width: '100%'
                  }}
                />
                {inputType === 'char' && inputValue.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    pointerEvents: 'none'
                  }}>
                    {inputValue.slice(1)}
                  </div>
                )}
              </div>
              <div className="helper-text" style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                {inputType === 'int' && 'Any integer (positive or negative)'}
                {inputType === 'char' && 'Single character — only the first is used'}
                {inputType === 'hex' && 'Hex value (e.g. 2A, 0xFF, or just FF)'}
              </div>
            </div>
          </div>
        </div>

        {/* Binary Memory Display */}
        <div className="panel binary-master" style={{ marginBottom: '1.5rem' }}>
          <div className="binary-title">PHYSICAL MEMORY (RAW BINARY) — {currentBits}-BIT WORD</div>
          <div className="bit-container">
            {renderBinaryDisplay()}
          </div>
          <div style={{ 
            marginTop: '1.25rem', 
            display: 'flex', 
            gap: '2rem', 
            justifyContent: 'center', 
            fontSize: '0.9rem',
            color: 'var(--hw-gray-600)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="bit bit-0" style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', borderRadius: '4px' }}>0</div>
              <span>ZERO (false / off)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="bit bit-1" style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', borderRadius: '4px' }}>1</div>
              <span>ONE (true / on)</span>
            </div>
          </div>
        </div>

        {/* Interpretations */}
        <div className="interpretations-grid">
          <div 
            className="interp-card"
            onMouseEnter={() => highlightBits('all')}
            onMouseLeave={() => highlightBits(null)}
          >
            <div className="interp-label">AS SIGNED INTEGER</div>
            <div className="interp-value" style={{ color: interpretations.int.startsWith('-') ? '#c8102e' : 'inherit' }}>
              {interpretations.int}
            </div>
            <span className="interp-subtext">Two's Complement • {currentBits} bits</span>
          </div>

          <div 
            className="interp-card"
            onMouseEnter={() => highlightBits('byte0')}
            onMouseLeave={() => highlightBits(null)}
          >
            <div className="interp-label">AS CHARACTER</div>
            <div className="interp-value" style={{ fontSize: '2rem', fontFamily: 'monospace' }}>
              {interpretations.char}
            </div>
            <span className="interp-subtext">Lowest 8 bits as ASCII</span>
          </div>

          <div 
            className="interp-card"
            onMouseEnter={() => highlightBits('all')}
            onMouseLeave={() => highlightBits(null)}
          >
            <div className="interp-label">AS HEXADECIMAL</div>
            <div className="interp-value" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
              {interpretations.hex}
            </div>
            <span className="interp-subtext">Base-16 representation</span>
          </div>

          <div 
            className="interp-card"
            onMouseEnter={() => highlightBits('all')}
            onMouseLeave={() => highlightBits(null)}
          >
            <div className="interp-label">AS BOOLEAN</div>
            <div 
              className="interp-value"
              style={{ 
                color: interpretations.bool === 'True' ? '#15803d' : '#b91c1c',
                fontWeight: 700 
              }}
            >
              {interpretations.bool}
            </div>
            <span className="interp-subtext">Non-zero memory?</span>
          </div>
        </div>

        <div className="panel" style={{ marginTop: '2rem' }}>
          <h3 className="h5" style={{ marginBottom: '0.75rem' }}>How It Works</h3>
          <div className="grid grid-2 gap-md">
            <div>
              <div className="eyebrow">MEMORY IS JUST BITS</div>
              <p className="muted" style={{ fontSize: '0.9rem' }}>
                The same sequence of 1s and 0s can be interpreted as an integer, a character, 
                a memory address, or even an instruction. This explorer shows how different 
                data types reinterpret the exact same physical memory.
              </p>
            </div>
            <div>
              <div className="eyebrow">TWO'S COMPLEMENT</div>
              <p className="muted" style={{ fontSize: '0.9rem' }}>
                Negative numbers use two's complement. The leftmost bit is the sign bit. 
                Try entering negative numbers to see how the bit patterns change.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Character Input Warning Overlay */}
      {showCharWarning && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '1.25rem 2rem',
          borderRadius: '12px',
          maxWidth: '320px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.4)',
          zIndex: 100,
          animation: 'fadeInOut 3s forwards'
        }}>
          <div style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 600 }}>
            Single Character Only
          </div>
          <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.5 }}>
            Only the <strong>first character</strong> is stored in the memory cell.<br />
            Extra characters are ignored.
          </p>
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid rgba(0, 0, 0, 0.85)'
          }} />
        </div>
      )}

      {/* Note: Binary Explorer styles are defined in index.css */}
    </main>
  );
}
