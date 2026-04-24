import React, { useState, useEffect, useCallback } from 'react';
import { WidgetShell } from '../components/widget';
import { IconGamepad, IconFloppy, IconPhone, IconDesktop, IconLock } from '../components/icons';

type InputType = 'int' | 'char' | 'hex' | 'eth';

const systems: { bits: number; icon: React.ReactNode; title: string; label: string }[] = [
  { bits: 8,   icon: <IconGamepad size={20} />, title: 'Retro Console',   label: '8-bit' },
  { bits: 16,  icon: <IconFloppy size={20} />,  title: 'Classic PC',      label: '16-bit' },
  { bits: 32,  icon: <IconPhone size={20} />,   title: 'Early Smartphone', label: '32-bit' },
  { bits: 64,  icon: <IconDesktop size={20} />, title: 'Modern System',   label: '64-bit' },
  { bits: 160, icon: <IconLock size={20} />,    title: 'Crypto Wallet',   label: '160-bit' },
];

const DEMO_ETH_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bE7e';
const ETH_ADDRESS_BITS = 160;

interface BitTileProps {
  value: string;
  index: number;
  isHighlighted: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const BitTile: React.FC<BitTileProps> = ({ value, index, isHighlighted, onMouseEnter, onMouseLeave }) => (
  <div
    className={`bit-tile ${value === '1' ? 'bit-tile--one' : 'bit-tile--zero'}${isHighlighted ? ' bit-tile--highlight' : ''}`}
    data-val={value}
    data-index={index}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {value}
  </div>
);

// Format a 160-bit binary string into a readable, grouped 0x-hex Ethereum address.
function formatEthAddress(bits160: string): string {
  let bigVal = 0n;
  for (let i = 0; i < 160; i++) bigVal = (bigVal << 1n) | (bits160[i] === '1' ? 1n : 0n);
  const hex = bigVal.toString(16).padStart(40, '0');
  const groups: string[] = [];
  for (let i = 0; i < 40; i += 4) groups.push(hex.slice(i, i + 4));
  return '0x' + groups.join(' ');
}

export default function BinaryExplorer() {
  const [currentBits, setCurrentBits] = useState(32);
  const [inputType, setInputType] = useState<InputType>('int');
  const [inputValue, setInputValue] = useState('42');
  const [binaryString, setBinaryString] = useState('0'.repeat(32));
  const [ethAddressBits, setEthAddressBits] = useState<string | null>(null);
  const [interpretations, setInterpretations] = useState({
    int: '0',
    char: '.',
    hex: '0x00000000',
    bool: 'False',
  });
  const [highlightedTarget, setHighlightedTarget] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const processInput = useCallback(() => {
    const rawVal = inputValue.trim();
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
      } else if (inputType === 'eth') {
        const hexRaw = rawVal.replace(/^0x/i, '');
        const hexClean = hexRaw.replace(/[^0-9a-fA-F]/g, '').slice(0, 40);
        bigVal = BigInt('0x' + (hexClean || '0'));
      }

      if (inputType === 'eth') {
        const mask160 = (1n << 160n) - 1n;
        const ethVal = bigVal & mask160;
        setEthAddressBits(ethVal.toString(2).padStart(160, '0'));
      } else {
        setEthAddressBits(null);
      }

      const mask = (1n << bits) - 1n;
      if (bigVal < 0n) {
        bigVal = ((-bigVal ^ mask) + 1n) & mask;
      } else {
        bigVal = bigVal & mask;
      }

      setBinaryString(bigVal.toString(2).padStart(currentBits, '0'));
    } catch {
      setBinaryString('0'.repeat(currentBits));
      if (inputType === 'eth') setEthAddressBits('0'.repeat(160));
    }
  }, [inputValue, inputType, currentBits]);

  const updateInterpretations = useCallback((binStr: string) => {
    const isNegative = binStr[0] === '1';
    let intVal: bigint;
    if (isNegative && currentBits > 1) {
      const inverted = binStr.split('').map(b => b === '1' ? '0' : '1').join('');
      intVal = -(BigInt('0b' + inverted) + 1n);
    } else {
      intVal = BigInt('0b' + binStr);
    }

    const lowest8 = binStr.slice(-8);
    const charCode = parseInt(lowest8, 2);
    let charDisplay = '.';
    if (charCode >= 32 && charCode <= 126) {
      charDisplay = String.fromCharCode(charCode);
    } else if (charCode > 0) {
      charDisplay = `[${charCode}]`;
    }

    const hexVal = BigInt('0b' + binStr).toString(16).toUpperCase();
    const hexPadding = Math.ceil(currentBits / 4);
    const paddedHex = hexVal.padStart(hexPadding, '0');

    setInterpretations({
      int: intVal.toString(),
      char: charDisplay,
      hex: `0x${paddedHex}`,
      bool: binStr.includes('1') ? 'True' : 'False',
    });
  }, [currentBits]);

  useEffect(() => { updateInterpretations(binaryString); }, [binaryString, updateInterpretations]);
  useEffect(() => { processInput(); }, [processInput]);

  useEffect(() => {
    if (!showHowItWorks) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowHowItWorks(false); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showHowItWorks]);

  const handleSystemChange = (bits: number) => {
    setCurrentBits(bits);
    if (bits === ETH_ADDRESS_BITS && inputType !== 'eth') {
      setInputType('eth');
      setInputValue(DEMO_ETH_ADDRESS);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as InputType;
    setInputType(next);
    if (next === 'eth') setInputValue(DEMO_ETH_ADDRESS);
    else setInputValue('');
  };

  const renderBitContainer = (bits: string, totalBits: number, highlightMode: 'all' | 'byte0' | 'none' = 'all') => {
    const numBytes = totalBits / 8;
    const byteGroups: React.ReactNode[] = [];
    for (let byteIdx = 0; byteIdx < numBytes; byteIdx++) {
      const byteBits: React.ReactNode[] = [];
      for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
        const globalBitIndex = byteIdx * 8 + bitIdx;
        const bitValue = bits[globalBitIndex] ?? '0';
        const bitPositionFromRight = totalBits - 1 - globalBitIndex;
        const isHighlighted =
          (highlightMode === 'all'   && highlightedTarget === 'all') ||
          (highlightMode === 'byte0' && highlightedTarget === 'byte0' && bitPositionFromRight < 8) ||
          (highlightMode === 'all'   && highlightedTarget === 'byte0' && byteIdx === numBytes - 1);
        byteBits.push(
          <BitTile
            key={globalBitIndex}
            value={bitValue}
            index={bitPositionFromRight}
            isHighlighted={isHighlighted}
            onMouseEnter={() => setHighlightedTarget('all')}
            onMouseLeave={() => setHighlightedTarget(null)}
          />
        );
      }
      byteGroups.push(
        <div key={byteIdx} className="bit-byte-group">
          {byteBits}
        </div>
      );
    }
    return byteGroups;
  };

  const formattedEth = ethAddressBits ? formatEthAddress(ethAddressBits) : null;
  const showExtraEthBlock = inputType === 'eth' && ethAddressBits && currentBits < ETH_ADDRESS_BITS;

  return (
    <main className="page be-page">
      <div className="container container--wide">

        <section className="be-hero">
          <div className="eyebrow">Computer Science Explorer</div>
          <h1 className="h2 be-hero__title">Binary Interpretation Explorer</h1>
          <p className="lead be-hero__lead">
            The exact same bits produce entirely different realities depending on how the software reads them.
          </p>
        </section>

        <WidgetShell
          controls={
            <>
              <section className="panel al-side-panel">
                <div className="widget-panel__head">
                  <div className="eyebrow">Word Size</div>
                </div>
                <div className="grid grid-3 gap-sm">
                  {systems.map(system => (
                    <div
                      key={system.bits}
                      className={`selectable-card${currentBits === system.bits ? ' active' : ''}`}
                      style={{ padding: '.6rem .4rem' }}
                      onClick={() => handleSystemChange(system.bits)}
                    >
                      <div className="selectable-card__icon">{system.icon}</div>
                      <div className="selectable-card__title" style={{ fontSize: '.72rem' }}>{system.title}</div>
                      <div className="selectable-card__sub" style={{ fontSize: '.65rem' }}>{system.label}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel al-side-panel">
                <div className="widget-panel__head">
                  <div className="eyebrow">Input</div>
                </div>
                <div className="al-operation-card">
                  <div className="al-operation-card__title">Interpretation Type</div>
                  <select
                    value={inputType}
                    onChange={handleTypeChange}
                    className="select"
                  >
                    <option value="int">Signed Integer</option>
                    <option value="char">Character (A–Z)</option>
                    <option value="hex">Hexadecimal (0x)</option>
                    <option value="eth">Ethereum Address</option>
                  </select>
                </div>
                <div className="al-operation-card">
                  <div className="al-operation-card__title">Data Value</div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    maxLength={inputType === 'char' ? 8 : inputType === 'eth' ? 42 : 20}
                    placeholder={
                      inputType === 'char' ? 'A' :
                      inputType === 'hex'  ? '0x2A' :
                      inputType === 'eth'  ? DEMO_ETH_ADDRESS : '42'
                    }
                    className="input"
                    style={{ fontFamily: 'monospace', fontWeight: 600 }}
                  />
                  {inputType === 'char' && inputValue.length > 1 && (
                    <div className="alert alert--warning" style={{ margin: '.4rem 0 0', padding: '.4rem .75rem', fontSize: '.8rem' }}>
                      Only the <strong>first character</strong> is used.
                    </div>
                  )}
                  <div className="helper-text">
                    {inputType === 'int'  && 'Any integer (positive or negative)'}
                    {inputType === 'char' && 'Single character — only the first is used'}
                    {inputType === 'hex'  && 'Hex value (e.g. 2A or 0xFF)'}
                    {inputType === 'eth'  && '40-char hex Ethereum address (0x + 40 digits)'}
                  </div>
                </div>
              </section>
            </>
          }

          info={
            <>
              <section className="panel al-side-panel">
                <div className="widget-panel__head">
                  <div className="eyebrow">Interpretations</div>
                </div>
                <div className="be-interp-grid">

                  <div
                    className="be-interp-card"
                    onMouseEnter={() => setHighlightedTarget('all')}
                    onMouseLeave={() => setHighlightedTarget(null)}
                  >
                    <div className="be-interp-card__label">As Signed Integer</div>
                    <div
                      className="be-interp-card__value"
                      style={{ color: interpretations.int.startsWith('-') ? 'var(--hw-red)' : 'inherit' }}
                    >
                      {interpretations.int}
                    </div>
                    <div className="be-interp-card__note">Two's Complement · {currentBits} bits</div>
                  </div>

                  <div
                    className="be-interp-card"
                    onMouseEnter={() => setHighlightedTarget('byte0')}
                    onMouseLeave={() => setHighlightedTarget(null)}
                  >
                    <div className="be-interp-card__label">As Character</div>
                    <div className="be-interp-card__value" style={{ fontFamily: 'monospace' }}>
                      {interpretations.char}
                    </div>
                    <div className="be-interp-card__note">Lowest 8 bits as ASCII</div>
                  </div>

                  <div
                    className="be-interp-card"
                    onMouseEnter={() => setHighlightedTarget('all')}
                    onMouseLeave={() => setHighlightedTarget(null)}
                  >
                    <div className="be-interp-card__label">As Hexadecimal</div>
                    <div
                      className="be-interp-card__value"
                      style={{ fontFamily: 'monospace', letterSpacing: '1px', fontSize: '1.05rem' }}
                    >
                      {interpretations.hex}
                    </div>
                    <div className="be-interp-card__note">Base-16 representation</div>
                  </div>

                  <div
                    className="be-interp-card"
                    onMouseEnter={() => setHighlightedTarget('all')}
                    onMouseLeave={() => setHighlightedTarget(null)}
                  >
                    <div className="be-interp-card__label">As Boolean</div>
                    <div
                      className="be-interp-card__value"
                      style={{ color: interpretations.bool === 'True' ? 'var(--hw-success)' : 'var(--hw-red)' }}
                    >
                      {interpretations.bool}
                    </div>
                    <div className="be-interp-card__note">Non-zero memory?</div>
                  </div>

                  {inputType === 'eth' && formattedEth && (
                    <div
                      className="be-interp-card be-interp-card--eth"
                      onMouseEnter={() => setHighlightedTarget('all')}
                      onMouseLeave={() => setHighlightedTarget(null)}
                    >
                      <div className="be-interp-card__label" style={{ color: 'var(--hw-warning)' }}>
                        As Ethereum Address
                      </div>
                      <div
                        className="be-interp-card__value"
                        style={{ fontFamily: 'monospace', fontSize: '.9rem', letterSpacing: '.5px' }}
                      >
                        {formattedEth}
                      </div>
                      <div className="be-interp-card__note">160-bit · 20 bytes · 40 hex digits</div>
                    </div>
                  )}

                </div>
              </section>

              <section className="panel al-side-panel">
                <button
                  className="btn btn--outline btn--sm btn--block"
                  onClick={() => setShowHowItWorks(true)}
                >
                  How It Works
                </button>
              </section>
            </>
          }
        >
          {/* Center: binary memory visualization */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>

            <div className="mem-viz-frame" data-label={`Physical Memory — ${currentBits}-Bit Word`}>
              <div className="be-word-title">Raw Binary · {currentBits}-bit Word</div>
              <div className="bit-word-container">
                {renderBitContainer(binaryString, currentBits, 'all')}
              </div>
              <div className="legend-key al-legend-inline al-legend-inline--below">
                <div className="legend-key__item">
                  <span className="be-legend-swatch be-legend-swatch--zero" />
                  ZERO (false / off)
                </div>
                <div className="legend-key__item">
                  <span className="be-legend-swatch be-legend-swatch--one" />
                  ONE (true / on)
                </div>
              </div>
            </div>

            {showExtraEthBlock && ethAddressBits && (
              <div
                className="mem-viz-frame"
                data-label="Ethereum Address — 160 Bits · 20 Bytes"
                style={{ borderColor: 'var(--hw-gold)' }}
              >
                <div className="be-word-title" style={{ color: 'var(--hw-warning)' }}>
                  Ethereum Address Memory — 160 Bits · 20 Bytes
                </div>
                <div className="bit-word-container">
                  {renderBitContainer(ethAddressBits, ETH_ADDRESS_BITS, 'all')}
                </div>
                <p className="muted" style={{ marginTop: '1rem', textAlign: 'center', fontSize: '.88rem' }}>
                  A full Ethereum address needs <strong>{ETH_ADDRESS_BITS} bits</strong> — {ETH_ADDRESS_BITS / currentBits}× the size of your current <strong>{currentBits}-bit word</strong>.
                </p>
              </div>
            )}

          </div>
        </WidgetShell>

      </div>

      {showHowItWorks && (
        <div className="popup-overlay" role="presentation" onClick={() => setShowHowItWorks(false)}>
          <section
            className="panel popup popup--sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="be-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="popup__header">
              <div className="eyebrow" id="be-modal-title">How Binary Interpretation Works</div>
              <button
                type="button"
                className="btn btn--outline btn--sm popup__close"
                onClick={() => setShowHowItWorks(false)}
              >
                Close
              </button>
            </div>
            <div className="stack-xs" style={{ fontSize: '.9rem' }}>
              <div className="eyebrow">MEMORY IS JUST BITS</div>
              <p className="muted">
                The same sequence of 1s and 0s can be interpreted as an integer, a character,
                a memory address, or even a machine instruction. This explorer shows how different
                data types reinterpret the exact same physical memory.
              </p>
              <div className="eyebrow" style={{ marginTop: '.5rem' }}>TWO'S COMPLEMENT</div>
              <p className="muted">
                Negative numbers use two's complement encoding. The leftmost bit is the sign bit —
                try entering negative integers to see how the bit pattern changes.
              </p>
              <div className="eyebrow" style={{ marginTop: '.5rem' }}>CRYPTO ADDRESSES ARE HUGE</div>
              <p className="muted">
                An Ethereum address is a <strong>160-bit</strong> hash — five times longer than a 32-bit word.
                That size is what makes collisions effectively impossible (2<sup>160</sup> ≈ 10<sup>48</sup> possibilities).
              </p>
              <div className="eyebrow" style={{ marginTop: '.5rem' }}>WHY 160 BITS?</div>
              <p className="muted">
                Ethereum takes the last 20 bytes of a Keccak-256 hash of your public key.
                20 bytes × 8 bits = 160. Bitcoin's P2PKH addresses use the same 160-bit length.
              </p>
            </div>
          </section>
        </div>
      )}

    </main>
  );
}
