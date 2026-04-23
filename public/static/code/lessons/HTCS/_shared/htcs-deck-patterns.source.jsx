{
  (() => {
    const { COLORS, TYPE_SCALE, FONTS } = window.HTCS_TOKENS;
    const { Eyebrow, Body, BulletList } = window.HTCS_PRIMITIVES;

    function toneColor(tone = 'default') {
      if (tone === 'danger' || tone === 'warning') return COLORS.danger;
      if (tone === 'ok' || tone === 'success') return COLORS.ok;
      if (tone === 'gold') return COLORS.gold;
      return COLORS.accent;
    }

    function Callout({ kicker, children, tone = 'default', style = {}, padding = '28px 0' }) {
      const accent = toneColor(tone);
      return (
        <div
          style={{
            borderTop: `1px solid ${COLORS.rule}`,
            borderBottom: `1px solid ${COLORS.rule}`,
            padding,
            ...style,
          }}
        >
          {kicker && <Eyebrow color={accent} style={{ marginBottom: 14 }}>{kicker}</Eyebrow>}
          <div style={{ fontFamily: FONTS.serif, fontSize: TYPE_SCALE.bodyLg, color: COLORS.ink, lineHeight: 1.3 }}>
            {children}
          </div>
        </div>
      );
    }

    function InfoCard({ title, kicker, children, tone = 'paper', style = {} }) {
      const accent = toneColor(tone);
      const background = tone === 'ink' ? COLORS.ink : COLORS.paper;
      const border = tone === 'ink' ? 'rgba(245,239,227,0.18)' : COLORS.rule;
      const titleColor = tone === 'ink' ? COLORS.paper : COLORS.muted;
      const bodyColor = tone === 'ink' ? COLORS.paper : COLORS.ink;

      return (
        <div style={{ border: `1px solid ${border}`, padding: 28, background, ...style }}>
          {(title || kicker) && (
            <div
              style={{
                fontFamily: FONTS.sans,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontSize: 18,
                color: kicker ? accent : titleColor,
                marginBottom: 12,
              }}
            >
              {kicker || title}
            </div>
          )}
          <div style={{ fontFamily: FONTS.serif, fontSize: 30, color: bodyColor, lineHeight: 1.35 }}>
            {children}
          </div>
        </div>
      );
    }

    function ComparisonCard({ title, subtitle, children, tone = 'paper', style = {} }) {
      return (
        <InfoCard
          title={title}
          tone={tone}
          style={{ minHeight: 0, display: 'flex', flexDirection: 'column', ...style }}
        >
          {subtitle && <Body size="body" style={{ marginBottom: 18, color: COLORS.muted }}>{subtitle}</Body>}
          {children}
        </InfoCard>
      );
    }

    function StatCard({ value, label, note, tone = 'paper', style = {} }) {
      const background = tone === 'ink' ? COLORS.ink : COLORS.paper;
      const border = tone === 'ink' ? 'rgba(245,239,227,0.18)' : COLORS.rule;
      const valueColor = tone === 'ink' ? COLORS.gold : COLORS.ink;
      const labelColor = tone === 'ink' ? COLORS.paper : COLORS.inkSoft;
      const noteColor = tone === 'ink' ? 'rgba(245,239,227,0.55)' : COLORS.muted;

      return (
        <div
          style={{
            border: `1px solid ${border}`,
            background,
            padding: '28px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            ...style,
          }}
        >
          <div style={{ fontFamily: FONTS.serif, fontSize: 86, lineHeight: 0.95, color: valueColor }}>{value}</div>
          <div style={{ fontFamily: FONTS.serif, fontSize: TYPE_SCALE.bodyLg, color: labelColor, lineHeight: 1.2 }}>{label}</div>
          {note && <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.12em', color: noteColor }}>{note}</div>}
        </div>
      );
    }

    function QuoteBlock({ children, source, kicker, variant = 'pull', tone = 'default', style = {} }) {
      const accent = toneColor(tone);
      const base = variant === 'policy'
        ? {
          borderTop: `1px solid ${COLORS.rule}`,
          paddingTop: 16,
          quoteSize: 22,
          sourceSize: 14,
          quoteColor: COLORS.ink,
        }
        : variant === 'warning'
          ? {
            borderLeft: `4px solid ${accent}`,
            paddingLeft: 24,
            quoteSize: TYPE_SCALE.bodyLg,
            sourceSize: 16,
            quoteColor: COLORS.ink,
          }
          : {
            borderTop: `1px solid ${COLORS.rule}`,
            borderBottom: `1px solid ${COLORS.rule}`,
            padding: '28px 0',
            quoteSize: TYPE_SCALE.bodyLg,
            sourceSize: 14,
            quoteColor: COLORS.ink,
          };

      return (
        <div style={{ ...base, ...style }}>
          {kicker && <Eyebrow color={accent} style={{ marginBottom: 14 }}>{kicker}</Eyebrow>}
          <div
            style={{
              fontFamily: FONTS.serif,
              fontStyle: 'italic',
              fontSize: base.quoteSize,
              lineHeight: 1.42,
              color: base.quoteColor,
              textWrap: 'pretty',
            }}
          >
            {children}
          </div>
          {source && (
            <div
              style={{
                marginTop: 12,
                fontFamily: FONTS.sans,
                fontSize: base.sourceSize,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: COLORS.muted,
              }}
            >
              &ndash; {source}
            </div>
          )}
        </div>
      );
    }

    function ProcessStep({ step, title, children, tone = 'default', style = {} }) {
      const accent = toneColor(tone);
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 22, alignItems: 'start', ...style }}>
          <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 56, lineHeight: 1, color: accent }}>
            {String(step).padStart(2, '0')}
          </div>
          <div>
            <div style={{ fontFamily: FONTS.serif, fontSize: TYPE_SCALE.bodyLg, color: COLORS.ink, lineHeight: 1.15, marginBottom: 10 }}>
              {title}
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: TYPE_SCALE.body, color: COLORS.inkSoft, lineHeight: 1.35 }}>
              {children}
            </div>
          </div>
        </div>
      );
    }

    function TimelineStep({ label, title, children, tone = 'default', style = {} }) {
      const accent = toneColor(tone);
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 22, alignItems: 'start', ...style }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, paddingTop: 8 }}>
            {label}
          </div>
          <div style={{ borderLeft: `1px solid ${COLORS.rule}`, paddingLeft: 22 }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: TYPE_SCALE.bodyLg, color: COLORS.ink, lineHeight: 1.15, marginBottom: 10 }}>
              {title}
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: TYPE_SCALE.body, color: COLORS.inkSoft, lineHeight: 1.35 }}>
              {children}
            </div>
          </div>
        </div>
      );
    }

    function RecapBlock({ kicker = 'Mental model', children, body, style = {} }) {
      return (
        <div style={style}>
          <Callout kicker={kicker}>{children}</Callout>
          {body && <Body size="bodyLg" style={{ marginTop: 36 }}>{body}</Body>}
        </div>
      );
    }

    function DiagramFrame({ children, caption, style = {}, padding = 24, tone = 'paper' }) {
      const background = tone === 'ink' ? COLORS.ink : COLORS.paper;
      const border = tone === 'ink' ? 'rgba(245,239,227,0.18)' : COLORS.rule;
      const captionColor = tone === 'ink' ? 'rgba(245,239,227,0.55)' : COLORS.muted;
      return (
        <div style={{ border: `1px solid ${border}`, background, padding, ...style }}>
          {children}
          {caption && (
            <div style={{ marginTop: 14, fontFamily: FONTS.sans, fontSize: 16, letterSpacing: '0.14em', color: captionColor }}>
              {caption}
            </div>
          )}
        </div>
      );
    }

    function DiagramLabel({ children, tone = 'muted', style = {} }) {
      const color = tone === 'accent' ? COLORS.accent : tone === 'ink' ? COLORS.ink : COLORS.muted;
      return (
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 16,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color,
            ...style,
          }}
        >
          {children}
        </div>
      );
    }

    function Legend({ items, style = {} }) {
      return (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', ...style }}>
          {items.map((item) => (
            <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 14, height: 14, borderRadius: 999, background: item.color, display: 'inline-block' }} />
              <span style={{ fontFamily: FONTS.sans, fontSize: 16, letterSpacing: '0.08em', color: COLORS.muted }}>{item.label}</span>
            </div>
          ))}
        </div>
      );
    }

    function Badge({ children, tone = 'muted', filled = false, style = {} }) {
      const color = toneColor(tone);
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 12px',
            border: `1px solid ${color}`,
            background: filled ? color : 'transparent',
            color: filled ? COLORS.paper : color,
            fontFamily: FONTS.sans,
            fontSize: 14,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            ...style,
          }}
        >
          {children}
        </span>
      );
    }

    function Card(props) {
      return <InfoCard {...props} />;
    }

    function TosPullQuote({ children, source, style = {} }) {
      return (
        <QuoteBlock variant="policy" source={source} style={style}>
          {children}
        </QuoteBlock>
      );
    }

    const HTCS_PATTERNS = {
      Callout,
      InfoCard,
      ComparisonCard,
      StatCard,
      QuoteBlock,
      ProcessStep,
      TimelineStep,
      RecapBlock,
      DiagramFrame,
      DiagramLabel,
      Legend,
      Badge,
      Card,
      TosPullQuote,
      BulletList,
    };

    window.HTCS_PATTERNS = HTCS_PATTERNS;
    Object.assign(window, HTCS_PATTERNS);
  })();
}
