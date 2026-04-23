{
  (() => {
    const { COLORS, TYPE_SCALE, SPACING, FONTS } = window.HTCS_TOKENS;

    function readMeta() {
      return window.HTCS_DECK_META || {};
    }

    function SlideFrame({ variant = 'page', pad = true, footer = true, slideNo, children, style = {} }) {
      const bg = variant === 'ink' ? COLORS.ink
        : variant === 'paper' ? COLORS.paper
          : variant === 'bleed' ? COLORS.cream
            : COLORS.cream;
      const fg = variant === 'ink' ? COLORS.paper : COLORS.ink;

      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: bg,
            color: fg,
            fontFamily: FONTS.serif,
            position: 'relative',
            overflow: 'hidden',
            ...style,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: pad ? `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px` : 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </div>
          {footer && <SlideFooter variant={variant} slideNo={slideNo} />}
        </div>
      );
    }

    function SlideFooter({ variant, courseLabel, deckLabel }) {
      const meta = readMeta();
      const dim = variant === 'ink' ? 'rgba(245,239,227,0.45)' : COLORS.muted;
      const rule = variant === 'ink' ? 'rgba(245,239,227,0.18)' : COLORS.ruleFaint;

      return (
        <div
          style={{
            position: 'absolute',
            left: SPACING.paddingX,
            right: SPACING.paddingX,
            bottom: 36,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: FONTS.sans,
            fontSize: 24,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: dim,
            borderTop: `1px solid ${rule}`,
            paddingTop: 18,
          }}
        >
          <span>{courseLabel || meta.courseLabel || 'HTCS'}</span>
          <span>{deckLabel || meta.deckTitle || meta.deckLabel || ''}</span>
        </div>
      );
    }

    function Eyebrow({ children, color, style = {} }) {
      return (
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: TYPE_SCALE.eyebrow,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            fontWeight: 500,
            color: color || COLORS.accent,
            marginBottom: 24,
            ...style,
          }}
        >
          {children}
        </div>
      );
    }

    function Title({ children, size = 'title', color, style = {} }) {
      const fs = TYPE_SCALE[size] || TYPE_SCALE.title;
      return (
        <h1
          style={{
            fontFamily: FONTS.serif,
            fontWeight: 500,
            fontSize: fs,
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            color: color || COLORS.ink,
            margin: 0,
            textAlign: 'left',
            textWrap: 'balance',
            ...style,
          }}
        >
          {children}
        </h1>
      );
    }

    function Subtitle({ children, color, style = {} }) {
      return (
        <div
          style={{
            fontFamily: FONTS.serif,
            fontStyle: 'italic',
            fontSize: TYPE_SCALE.subtitle,
            lineHeight: 1.2,
            color: color || COLORS.inkSoft,
            margin: 0,
            marginTop: 20,
            textWrap: 'balance',
            ...style,
          }}
        >
          {children}
        </div>
      );
    }

    function Body({ children, size = 'body', color, style = {} }) {
      return (
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: TYPE_SCALE[size] || TYPE_SCALE.body,
            lineHeight: 1.38,
            color: color || COLORS.inkSoft,
            textWrap: 'pretty',
            ...style,
          }}
        >
          {children}
        </div>
      );
    }

    function Rule({ color, style = {} }) {
      return <div style={{ height: 1, background: color || COLORS.rule, width: '100%', ...style }} />;
    }

    function Mono({ children, style = {} }) {
      return (
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: '0.88em',
            letterSpacing: '-0.01em',
            color: COLORS.ink,
            ...style,
          }}
        >
          {children}
        </span>
      );
    }

    function Numeral({ n, color, style = {} }) {
      return (
        <div
          style={{
            fontFamily: FONTS.serif,
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 56,
            color: color || COLORS.accent,
            lineHeight: 1,
            ...style,
          }}
        >
          {String(n).padStart(2, '0')}
        </div>
      );
    }

    function Bullet({ children }) {
      return <li style={{ marginBottom: 14 }}>{children}</li>;
    }

    function BulletList({ items, children, style = {}, gap = 14 }) {
      const renderedChildren = items
        ? items.map((item, index) => <Bullet key={index}>{item}</Bullet>)
        : children;

      return (
        <ul
          style={{
            margin: 0,
            paddingLeft: 32,
            display: 'flex',
            flexDirection: 'column',
            gap,
            ...style,
          }}
        >
          {renderedChildren}
        </ul>
      );
    }

    function TwoCol({ left, right, columns = '1fr 1fr', gap = 56, style = {} }) {
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: columns,
            gap,
            marginTop: 44,
            flex: 1,
            ...style,
          }}
        >
          {left}
          {right}
        </div>
      );
    }

    function SectionStack({ children, gap = 24, style = {} }) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap,
            ...style,
          }}
        >
          {children}
        </div>
      );
    }

    function ContentBand({ children, gap = 24, align = 'stretch', justify = 'flex-start', style = {} }) {
      return (
        <div
          style={{
            display: 'flex',
            gap,
            alignItems: align,
            justifyContent: justify,
            ...style,
          }}
        >
          {children}
        </div>
      );
    }

    function ActionRow({ children, gap = 14, wrap = true, justify = 'flex-start', style = {} }) {
      return (
        <div
          style={{
            display: 'flex',
            gap,
            flexWrap: wrap ? 'wrap' : 'nowrap',
            justifyContent: justify,
            alignItems: 'center',
            ...style,
          }}
        >
          {children}
        </div>
      );
    }

    function buttonTone(tone) {
      if (tone === 'accent') {
        return { background: COLORS.accent, color: COLORS.paper, border: COLORS.accent };
      }
      if (tone === 'paper') {
        return { background: COLORS.paper, color: COLORS.ink, border: COLORS.rule };
      }
      if (tone === 'ghost') {
        return { background: 'transparent', color: COLORS.ink, border: COLORS.rule };
      }
      return { background: COLORS.ink, color: COLORS.paper, border: COLORS.ink };
    }

    function DeckButton({ children, tone = 'ink', active = false, disabled = false, style = {}, ...props }) {
      const [highlighted, setHighlighted] = React.useState(false);
      const { onMouseEnter, onMouseLeave, onFocus, onBlur, ...buttonProps } = props;
      const palette = buttonTone(active ? 'accent' : tone);
      const hoverPalette = { background: COLORS.gold, color: COLORS.paper, border: COLORS.gold };
      const displayPalette = !disabled && highlighted ? hoverPalette : palette;
      return (
        <button
          {...buttonProps}
          disabled={disabled}
          onMouseEnter={(event) => {
            setHighlighted(true);
            if (onMouseEnter) onMouseEnter(event);
          }}
          onMouseLeave={(event) => {
            setHighlighted(false);
            if (onMouseLeave) onMouseLeave(event);
          }}
          onFocus={(event) => {
            setHighlighted(true);
            if (onFocus) onFocus(event);
          }}
          onBlur={(event) => {
            setHighlighted(false);
            if (onBlur) onBlur(event);
          }}
          style={{
            fontFamily: FONTS.sans,
            fontSize: 24,
            letterSpacing: '0.08em',
            padding: '14px 24px',
            border: `1px solid ${displayPalette.border}`,
            background: displayPalette.background,
            color: displayPalette.color,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.45 : 1,
            borderRadius: 5,
            boxShadow: !disabled && highlighted ? '0 0 0 3px rgba(184,137,59,0.18)' : 'none',
            transition: 'background 140ms ease, border-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
            ...style,
          }}
        >
          {children}
        </button>
      );
    }

    function ToggleButton({ active = false, tone = 'ghost', children, ...props }) {
      return (
        <DeckButton tone={tone} active={active} {...props}>
          {children}
        </DeckButton>
      );
    }

    const HTCS_PRIMITIVES = {
      SlideFrame,
      SlideFooter,
      Eyebrow,
      Title,
      Subtitle,
      Body,
      Rule,
      Mono,
      Numeral,
      Bullet,
      BulletList,
      TwoCol,
      SectionStack,
      ContentBand,
      ActionRow,
      DeckButton,
      ToggleButton,
    };

    window.HTCS_PRIMITIVES = HTCS_PRIMITIVES;
    Object.assign(window, HTCS_PRIMITIVES);
  })();
}
