(() => {
  {
    (() => {
      const { COLORS, FONTS, TYPE_SCALE } = window.HTCS_TOKENS;
      function hexToBits(hex) {
        if (!hex) return [];
        const clean = hex.replace(/[^0-9a-f]/gi, "");
        const bits = [];
        for (const ch of clean) {
          const value = parseInt(ch, 16);
          for (let bit = 3; bit >= 0; bit -= 1) bits.push(value >> bit & 1);
        }
        return bits;
      }
      function DocumentSvg({ width = 120, height = 150, tone = "paper", label, style = {} }) {
        const paper = tone === "ink" ? COLORS.ink : COLORS.paper;
        const ink = tone === "ink" ? COLORS.paper : COLORS.ink;
        const muted = tone === "ink" ? "rgba(245,239,227,0.55)" : COLORS.muted;
        return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 120 150", width, height, style }, /* @__PURE__ */ React.createElement("rect", { x: "8", y: "8", width: "88", height: "112", fill: paper, stroke: ink, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("polygon", { points: "84,8 96,8 96,20", fill: muted }), /* @__PURE__ */ React.createElement("line", { x1: "20", y1: "40", x2: "80", y2: "40", stroke: muted, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "20", y1: "56", x2: "80", y2: "56", stroke: muted, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "20", y1: "72", x2: "72", y2: "72", stroke: muted, strokeWidth: "2" }), label && /* @__PURE__ */ React.createElement("text", { x: "52", y: "142", textAnchor: "middle", fontFamily: FONTS.sans, fontSize: "12", letterSpacing: "0.14em", fill: muted }, label));
      }
      function FileIconSvg({ size = 90, label, style = {} }) {
        return /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10, ...style } }, /* @__PURE__ */ React.createElement(DocumentSvg, { width: size * 0.8, height: size }), label && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: FONTS.mono, fontSize: 15, color: COLORS.muted } }, label));
      }
      function DocCard({ w = 220, h = 290, label, foot, tone = "paper", style = {} }) {
        const bg = tone === "ink" ? COLORS.ink : tone === "danger" ? "#fdecea" : COLORS.paper;
        const fg = tone === "ink" ? COLORS.paper : COLORS.ink;
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              width: w,
              height: h,
              background: bg,
              color: fg,
              border: `1px solid ${COLORS.rule}`,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "22px 22px",
              fontFamily: FONTS.mono,
              fontSize: 24,
              lineHeight: 1.45,
              boxShadow: tone === "ink" ? "none" : "0 1px 0 rgba(15,31,58,0.04)",
              ...style
            }
          },
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                position: "absolute",
                top: 0,
                right: 0,
                width: 22,
                height: 22,
                background: `linear-gradient(135deg, ${COLORS.rule} 0 50%, transparent 50% 100%)`
              }
            }
          ),
          /* @__PURE__ */ React.createElement("div", { style: { whiteSpace: "pre-wrap", overflow: "hidden" } }, label),
          foot && /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                fontSize: 14,
                color: tone === "ink" ? "rgba(245,239,227,0.55)" : COLORS.muted,
                borderTop: `1px solid ${tone === "ink" ? "rgba(245,239,227,0.18)" : COLORS.ruleFaint}`,
                paddingTop: 10
              }
            },
            foot
          )
        );
      }
      function HashBox({ value, diffFrom, w = 420, label, style = {} }) {
        const chars = Array.from(value || "");
        const base = diffFrom ? Array.from(diffFrom) : null;
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              width: w,
              padding: "20px 24px",
              background: COLORS.ink,
              color: COLORS.paper,
              fontFamily: FONTS.mono,
              fontSize: 24,
              letterSpacing: "-0.01em",
              lineHeight: 1.45,
              wordBreak: "break-all",
              position: "relative",
              ...style
            }
          },
          label && /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                fontFamily: FONTS.sans,
                fontSize: 14,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(245,239,227,0.55)",
                marginBottom: 10
              }
            },
            label
          ),
          /* @__PURE__ */ React.createElement("div", null, chars.map((char, index) => {
            const diff = base && base[index] !== char;
            return /* @__PURE__ */ React.createElement(
              "span",
              {
                key: index,
                style: {
                  color: diff ? "#F2C46B" : "inherit",
                  background: diff ? "rgba(242,196,107,0.18)" : "transparent"
                }
              },
              char
            );
          }))
        );
      }
      function HashBoxSvg(props) {
        return /* @__PURE__ */ React.createElement(HashBox, { ...props });
      }
      function HashPipeline({ inputLabel = "message", digest, w = 1400, h = 320 }) {
        const safeDigest = digest || "a665a45920422f9d417c88fa67cb01e1";
        return /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: h, style: { display: "block" } }, /* @__PURE__ */ React.createElement("g", { transform: "translate(80, 30)" }, /* @__PURE__ */ React.createElement("rect", { width: "300", height: "260", fill: COLORS.paper, stroke: COLORS.rule }), /* @__PURE__ */ React.createElement("polygon", { points: "278,0 300,0 300,22", fill: COLORS.rule }), /* @__PURE__ */ React.createElement("text", { x: "150", y: "140", textAnchor: "middle", fontFamily: FONTS.mono, fontSize: "26", fill: COLORS.inkSoft }, inputLabel), /* @__PURE__ */ React.createElement("text", { x: "150", y: "172", textAnchor: "middle", fontFamily: FONTS.mono, fontSize: "24", fill: COLORS.muted }, "arbitrary length")), /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("line", { x1: "400", y1: "160", x2: "560", y2: "160", stroke: COLORS.ink, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("polygon", { points: "560,160 548,152 548,168", fill: COLORS.ink })), /* @__PURE__ */ React.createElement("g", { transform: "translate(560, 80)" }, /* @__PURE__ */ React.createElement("rect", { width: "240", height: "160", fill: COLORS.ink }), /* @__PURE__ */ React.createElement("text", { x: "120", y: "88", textAnchor: "middle", fontFamily: FONTS.serif, fontStyle: "italic", fontSize: "56", fill: COLORS.paper }, "H(x)"), /* @__PURE__ */ React.createElement("text", { x: "120", y: "130", textAnchor: "middle", fontFamily: FONTS.sans, fontSize: "24", letterSpacing: "3", fill: "rgba(245,239,227,0.65)" }, "HASH FUNCTION")), /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("line", { x1: "820", y1: "160", x2: "980", y2: "160", stroke: COLORS.ink, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("polygon", { points: "980,160 968,152 968,168", fill: COLORS.ink })), /* @__PURE__ */ React.createElement("g", { transform: "translate(990, 80)" }, /* @__PURE__ */ React.createElement("rect", { width: "380", height: "160", fill: COLORS.paper, stroke: COLORS.ink, strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "190", y: "76", textAnchor: "middle", fontFamily: FONTS.mono, fontSize: "24", fill: COLORS.ink }, safeDigest.slice(0, 16)), /* @__PURE__ */ React.createElement("text", { x: "190", y: "106", textAnchor: "middle", fontFamily: FONTS.mono, fontSize: "24", fill: COLORS.ink }, safeDigest.slice(16, 32)), /* @__PURE__ */ React.createElement("text", { x: "190", y: "140", textAnchor: "middle", fontFamily: FONTS.sans, fontSize: "24", letterSpacing: "3", fill: COLORS.muted }, "FIXED LENGTH \xB7 256 BIT")));
      }
      const PEER_SHIRTS = {
        Alice: "#3D8B3D",
        Bob: "#2E5C8A",
        Charlie: "#B8893B",
        Dana: "#8A4F4D",
        Eve: "#7A5C91",
        You: "#5B4B8A",
        User: "#7A6A58",
        Peer: "#6E6A63"
      };
      function peerShirtColor(name) {
        return PEER_SHIRTS[name] || COLORS.inkSoft;
      }
      function peerLetter(name, fallback = "?") {
        const clean = String(name || "").trim();
        if (!clean) return fallback;
        return clean[0].toUpperCase();
      }
      function Person({ name, color = COLORS.ink, tint = "#E8DDC4", size = 180, style = {} }) {
        const isEve = name === "Eve";
        const stripeId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
        const shirt = peerShirtColor(name);
        const letter = peerLetter(name);
        return /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 14, ...style } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 120 140", width: size, height: size * 140 / 120 }, isEve && /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("pattern", { id: `eve-shirt-${stripeId}`, width: "14", height: "14", patternUnits: "userSpaceOnUse" }, /* @__PURE__ */ React.createElement("rect", { width: "14", height: "7", fill: "#FFFFFF" }), /* @__PURE__ */ React.createElement("rect", { y: "7", width: "14", height: "7", fill: color }))), /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M10 140 Q10 90 60 90 Q110 90 110 140 Z",
            fill: isEve ? `url(#eve-shirt-${stripeId})` : shirt,
            stroke: color,
            strokeWidth: "2"
          }
        ), /* @__PURE__ */ React.createElement("rect", { x: "50", y: "78", width: "20", height: "14", fill: tint, stroke: color, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "60", cy: "48", r: "32", fill: tint, stroke: color, strokeWidth: "2" }), isEve ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "36", y: "44", width: "48", height: "14", rx: "2", fill: color, opacity: "0.88" }), /* @__PURE__ */ React.createElement("path", { d: "M50 66 Q60 62 70 66", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "50", cy: "50", r: "2", fill: color }), /* @__PURE__ */ React.createElement("circle", { cx: "70", cy: "50", r: "2", fill: color }), /* @__PURE__ */ React.createElement("path", { d: "M52 62 Q60 68 68 62", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" })), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: "60",
            y: "122",
            textAnchor: "middle",
            fontFamily: FONTS.sans,
            fontSize: "30",
            fontWeight: "700",
            fill: isEve ? COLORS.accent : COLORS.paper,
            paintOrder: isEve ? "stroke" : void 0,
            stroke: isEve ? COLORS.paper : void 0,
            strokeWidth: isEve ? "0.8" : void 0
          },
          letter
        )), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: FONTS.serif, fontSize: 32, fontStyle: "italic", color: COLORS.ink } }, name));
      }
      function NetworkPersonSvg({ name = "Peer", scale = 1 }) {
        const color = COLORS.ink;
        const tint = "#E8DDC4";
        const isEve = name === "Eve";
        const stripeId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
        const shirt = peerShirtColor(name);
        const letter = peerLetter(name, "P");
        return /* @__PURE__ */ React.createElement("g", { transform: `scale(${scale})` }, isEve && /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("pattern", { id: `eve-network-shirt-${stripeId}`, width: "14", height: "14", patternUnits: "userSpaceOnUse" }, /* @__PURE__ */ React.createElement("rect", { width: "14", height: "7", fill: "#FFFFFF" }), /* @__PURE__ */ React.createElement("rect", { y: "7", width: "14", height: "7", fill: color }))), /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M10 140 Q10 90 60 90 Q110 90 110 140 Z",
            fill: isEve ? `url(#eve-network-shirt-${stripeId})` : shirt,
            stroke: color,
            strokeWidth: "2"
          }
        ), /* @__PURE__ */ React.createElement("rect", { x: "50", y: "78", width: "20", height: "14", fill: tint, stroke: color, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "60", cy: "48", r: "32", fill: tint, stroke: color, strokeWidth: "2" }), isEve ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "36", y: "44", width: "48", height: "14", rx: "2", fill: color, opacity: "0.88" }), /* @__PURE__ */ React.createElement("path", { d: "M50 66 Q60 62 70 66", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "50", cy: "50", r: "2", fill: color }), /* @__PURE__ */ React.createElement("circle", { cx: "70", cy: "50", r: "2", fill: color }), /* @__PURE__ */ React.createElement("path", { d: "M52 62 Q60 68 68 62", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" })), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: "60",
            y: "122",
            textAnchor: "middle",
            fontFamily: FONTS.sans,
            fontSize: "28",
            fontWeight: "700",
            fill: isEve ? COLORS.accent : COLORS.paper,
            paintOrder: isEve ? "stroke" : void 0,
            stroke: isEve ? COLORS.paper : void 0,
            strokeWidth: isEve ? "0.8" : void 0
          },
          letter
        ));
      }
      function PersonSvg({ name, color = COLORS.ink, tint = "#E8DDC4" }) {
        const isEve = name === "Eve";
        const stripeId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
        const shirt = peerShirtColor(name);
        const letter = peerLetter(name);
        return /* @__PURE__ */ React.createElement("g", null, isEve && /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("pattern", { id: `personsvg-eve-shirt-${stripeId}`, width: "14", height: "14", patternUnits: "userSpaceOnUse" }, /* @__PURE__ */ React.createElement("rect", { width: "14", height: "7", fill: "#FFFFFF" }), /* @__PURE__ */ React.createElement("rect", { y: "7", width: "14", height: "7", fill: color }))), /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M10 140 Q10 90 60 90 Q110 90 110 140 Z",
            fill: isEve ? `url(#personsvg-eve-shirt-${stripeId})` : shirt,
            stroke: color,
            strokeWidth: "2"
          }
        ), /* @__PURE__ */ React.createElement("rect", { x: "50", y: "78", width: "20", height: "14", fill: tint, stroke: color, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "60", cy: "48", r: "32", fill: tint, stroke: color, strokeWidth: "2" }), isEve ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "36", y: "44", width: "48", height: "14", rx: "2", fill: color, opacity: "0.88" }), /* @__PURE__ */ React.createElement("path", { d: "M50 66 Q60 62 70 66", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "50", cy: "50", r: "2", fill: color }), /* @__PURE__ */ React.createElement("circle", { cx: "70", cy: "50", r: "2", fill: color }), /* @__PURE__ */ React.createElement("path", { d: "M52 62 Q60 68 68 62", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" })), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: "60",
            y: "122",
            textAnchor: "middle",
            fontFamily: FONTS.sans,
            fontSize: "30",
            fontWeight: "700",
            fill: isEve ? COLORS.accent : COLORS.paper,
            paintOrder: isEve ? "stroke" : void 0,
            stroke: isEve ? COLORS.paper : void 0,
            strokeWidth: isEve ? "0.8" : void 0
          },
          letter
        ));
      }
      function FriendBust({ name, size = 140, label, owe, get, captionSize, captionAbove = false, style = {} }) {
        const isEve = name === "Eve";
        const stripeId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
        const shirt = peerShirtColor(name);
        const letter = peerLetter(label || name);
        const tint = "#E8DDC4";
        const ink = COLORS.ink;
        const captionFontSize = captionSize || Math.max(14, Math.round(size * 0.16));
        const caption = /* @__PURE__ */ React.createElement("div", { style: { fontFamily: FONTS.serif, fontStyle: "italic", fontSize: captionFontSize, color: COLORS.ink } }, label || name);
        return /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", flexDirection: "column", alignItems: "center", gap: Math.max(4, Math.round(size * 0.06)), ...style } }, captionAbove && caption, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 120 152", width: size, height: size * 152 / 120 }, isEve && /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("pattern", { id: `eve-friend-shirt-${stripeId}`, width: "14", height: "14", patternUnits: "userSpaceOnUse" }, /* @__PURE__ */ React.createElement("rect", { width: "14", height: "7", fill: "#FFFFFF" }), /* @__PURE__ */ React.createElement("rect", { y: "7", width: "14", height: "7", fill: ink }))), /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M10 140 Q10 90 60 90 Q110 90 110 140 Z",
            fill: isEve ? `url(#eve-friend-shirt-${stripeId})` : shirt,
            stroke: ink,
            strokeWidth: "2"
          }
        ), /* @__PURE__ */ React.createElement("rect", { x: "50", y: "78", width: "20", height: "14", fill: tint, stroke: ink, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "60", cy: "48", r: "32", fill: tint, stroke: ink, strokeWidth: "2" }), isEve ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "36", y: "44", width: "48", height: "14", rx: "2", fill: ink, opacity: "0.88" }), /* @__PURE__ */ React.createElement("path", { d: "M50 66 Q60 62 70 66", fill: "none", stroke: ink, strokeWidth: "2", strokeLinecap: "round" })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "50", cy: "50", r: "2", fill: ink }), /* @__PURE__ */ React.createElement("circle", { cx: "70", cy: "50", r: "2", fill: ink }), /* @__PURE__ */ React.createElement("path", { d: "M52 62 Q60 68 68 62", fill: "none", stroke: ink, strokeWidth: "2", strokeLinecap: "round" })), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: "60",
            y: "123",
            textAnchor: "middle",
            fontFamily: FONTS.sans,
            fontSize: "30",
            fontWeight: "700",
            fill: isEve ? COLORS.accent : COLORS.paper,
            paintOrder: isEve ? "stroke" : void 0,
            stroke: isEve ? COLORS.paper : void 0,
            strokeWidth: isEve ? "0.8" : void 0
          },
          letter
        )), !captionAbove && caption, owe !== void 0 && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: FONTS.sans, fontSize: Math.max(11, Math.round(captionFontSize * 0.7)), letterSpacing: "0.12em", color: COLORS.accent, textTransform: "uppercase" } }, "owes $", owe), get !== void 0 && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: FONTS.sans, fontSize: Math.max(11, Math.round(captionFontSize * 0.7)), letterSpacing: "0.12em", color: COLORS.ok, textTransform: "uppercase" } }, "gets $", get));
      }
      function PeerSvg({ variant = "person", ...props }) {
        if (variant === "friend") return /* @__PURE__ */ React.createElement(FriendBust, { ...props });
        return /* @__PURE__ */ React.createElement(Person, { ...props });
      }
      function ServerRackSvg({ down = false, scale = 1, showLabel = true }) {
        const color = down ? COLORS.muted : COLORS.ink;
        return /* @__PURE__ */ React.createElement("g", { transform: `scale(${scale})` }, /* @__PURE__ */ React.createElement("rect", { x: "8", y: "10", width: "104", height: "120", rx: "4", fill: down ? "#E8E4D8" : COLORS.paper, stroke: color, strokeWidth: "2" }), [34, 58, 82].map((y, index) => /* @__PURE__ */ React.createElement("g", { key: index }, /* @__PURE__ */ React.createElement("rect", { x: "18", y, width: "84", height: "18", fill: down ? COLORS.ruleFaint : "#f5f2ea", stroke: color, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("circle", { cx: "88", cy: y + 9, r: "4", fill: down ? COLORS.muted : COLORS.ok }))), showLabel && /* @__PURE__ */ React.createElement("text", { x: "60", y: "148", textAnchor: "middle", fontFamily: FONTS.sans, fontSize: "14", letterSpacing: "0.12em", fill: color }, "HUB"));
      }
      function NetworkLinkLine({ x1, y1, x2, y2, active = true, dashed = false }) {
        return /* @__PURE__ */ React.createElement(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: active ? COLORS.ink : COLORS.rule,
            strokeWidth: active ? 2.5 : 1.5,
            strokeDasharray: dashed ? "6 6" : "none",
            opacity: active ? 1 : 0.35
          }
        );
      }
      function PacketOnEdge({ x1, y1, x2, y2, t, phase = 0, color = COLORS.gold, r = 5 }) {
        const progress = ((t * 0.55 + phase) % 1 + 1) % 1;
        const x = x1 + (x2 - x1) * progress;
        const y = y1 + (y2 - y1) * progress;
        return /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y, r, fill: color, opacity: 0.95 });
      }
      function KeyIcon({ kind = "public", size = 120, label, style = {} }) {
        const fill = kind === "private" ? COLORS.accent : kind === "symmetric" ? COLORS.ink : COLORS.gold;
        return /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10, ...style } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 80", width: size * 2.5, height: size }, /* @__PURE__ */ React.createElement("circle", { cx: "40", cy: "40", r: "28", fill: "none", stroke: fill, strokeWidth: "7" }), /* @__PURE__ */ React.createElement("circle", { cx: "40", cy: "40", r: "9", fill }), /* @__PURE__ */ React.createElement("rect", { x: "72", y: "34", width: "110", height: "12", fill }), /* @__PURE__ */ React.createElement("rect", { x: "150", y: "46", width: "12", height: "18", fill }), /* @__PURE__ */ React.createElement("rect", { x: "130", y: "46", width: "10", height: "14", fill })), label && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: FONTS.sans, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: fill, fontWeight: 500 } }, label));
      }
      function KeyIconSvg({ kind = "public", label, small = false }) {
        const fill = kind === "private" ? COLORS.accent : kind === "symmetric" ? COLORS.ink : COLORS.gold;
        const scale = small ? 0.7 : 1;
        const labelX = small ? 70 : 100;
        const labelY = small ? 100 : 110;
        const labelSize = small ? 12 : 14;
        return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("g", { transform: `scale(${scale})` }, /* @__PURE__ */ React.createElement("circle", { cx: "40", cy: "40", r: "28", fill: "none", stroke: fill, strokeWidth: "7" }), /* @__PURE__ */ React.createElement("circle", { cx: "40", cy: "40", r: "9", fill }), /* @__PURE__ */ React.createElement("rect", { x: "72", y: "34", width: "110", height: "12", fill }), /* @__PURE__ */ React.createElement("rect", { x: "150", y: "46", width: "12", height: "18", fill }), /* @__PURE__ */ React.createElement("rect", { x: "130", y: "46", width: "10", height: "14", fill })), label && /* @__PURE__ */ React.createElement(
          "text",
          {
            x: labelX,
            y: labelY,
            textAnchor: "middle",
            fontFamily: FONTS.sans,
            fontSize: labelSize,
            letterSpacing: "2",
            fill
          },
          label
        ));
      }
      function Padlock({ open = false, color = COLORS.ink, size = 90, style = {} }) {
        return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 80 100", width: size, height: size * 100 / 80, style }, /* @__PURE__ */ React.createElement("path", { d: open ? "M22 44 V28 Q22 12 42 12 Q60 12 62 28" : "M22 44 V28 Q22 12 40 12 Q58 12 58 28 V44", fill: "none", stroke: color, strokeWidth: "6", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("rect", { x: "12", y: "44", width: "56", height: "48", fill: color }), /* @__PURE__ */ React.createElement("circle", { cx: "40", cy: "66", r: "5", fill: COLORS.paper }), /* @__PURE__ */ React.createElement("rect", { x: "38", y: "68", width: "4", height: "14", fill: COLORS.paper }));
      }
      function Envelope({ w = 200, h = 130, locked = false, label, style = {} }) {
        return /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10, ...style } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 130", width: w, height: h }, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "2", width: "196", height: "126", fill: COLORS.paper, stroke: COLORS.ink, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("polyline", { points: "2,2 100,74 198,2", fill: "none", stroke: COLORS.ink, strokeWidth: "2" }), locked && /* @__PURE__ */ React.createElement("g", { transform: "translate(76, 65)" }, /* @__PURE__ */ React.createElement(Padlock, { size: 48 }))), label && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: FONTS.mono, fontSize: 15, color: COLORS.muted } }, label));
      }
      function SealedEnvelopeSvg({ label = "ciphertext" }) {
        return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", { x: "1", y: "1", width: "118", height: "78", fill: COLORS.paper, stroke: COLORS.ink, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("polyline", { points: "1,1 60,46 119,1", fill: "none", stroke: COLORS.ink, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("g", { transform: "translate(44, 28)" }, /* @__PURE__ */ React.createElement("path", { d: "M9 18 V12 Q9 5 16 5 Q23 5 23 12 V18", fill: "none", stroke: COLORS.ink, strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("rect", { x: "4", y: "18", width: "24", height: "20", fill: COLORS.ink }), /* @__PURE__ */ React.createElement("circle", { cx: "16", cy: "27", r: "2", fill: COLORS.paper }), /* @__PURE__ */ React.createElement("rect", { x: "15", y: "28", width: "2", height: "6", fill: COLORS.paper })), label && /* @__PURE__ */ React.createElement(
          "text",
          {
            x: "60",
            y: "98",
            textAnchor: "middle",
            fontFamily: FONTS.mono,
            fontSize: "20",
            fill: COLORS.muted
          },
          label
        ));
      }
      function StageArrow({ from, to, label, sublabel, color = COLORS.ink, curve = -60, style = {} }) {
        const [x1, y1] = from;
        const [x2, y2] = to;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 + curve;
        return /* @__PURE__ */ React.createElement("g", { style }, /* @__PURE__ */ React.createElement("path", { d: `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`, fill: "none", stroke: color, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("polygon", { points: `${x2},${y2} ${x2 - 12},${y2 - 6} ${x2 - 12},${y2 + 6}`, fill: color }), label && /* @__PURE__ */ React.createElement("text", { x: midX, y: midY - 12, textAnchor: "middle", fontFamily: FONTS.serif, fontStyle: "italic", fontSize: "24", fill: color }, label), sublabel && /* @__PURE__ */ React.createElement("text", { x: midX, y: midY + 14, textAnchor: "middle", fontFamily: FONTS.mono, fontSize: "24", fill: COLORS.muted, letterSpacing: "1" }, sublabel));
      }
      function PaymentArrow({ x1, y1, x2, y2, curve = -30, label, dashed = false, faded = false, color, labelOffset = 0, labelT = 0.5, crossedLabel = false }) {
        const stroke = color || COLORS.gold;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const nx = -dy / len;
        const ny = dx / len;
        const mx = (x1 + x2) / 2 + nx * curve;
        const my = (y1 + y2) / 2 + ny * curve;
        const t = labelT;
        const omt = 1 - t;
        const lx = omt * omt * x1 + 2 * omt * t * mx + t * t * x2;
        const ly = omt * omt * y1 + 2 * omt * t * my + t * t * y2;
        const markerId = `pa-head-${stroke.replace("#", "")}`;
        return /* @__PURE__ */ React.createElement("g", { opacity: faded ? 0.32 : 1 }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: markerId, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" }, /* @__PURE__ */ React.createElement("path", { d: "M0,0 L10,5 L0,10 z", fill: stroke }))), /* @__PURE__ */ React.createElement("path", { d: `M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`, fill: "none", stroke, strokeWidth: "2", strokeDasharray: dashed ? "6 5" : "none", markerEnd: `url(#${markerId})` }), label && /* @__PURE__ */ React.createElement("g", { transform: `translate(${lx + nx * labelOffset}, ${ly + ny * labelOffset})` }, /* @__PURE__ */ React.createElement("rect", { x: "-26", y: "-13", width: "52", height: "22", rx: "3", fill: COLORS.paper, stroke, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "0", y: "3", textAnchor: "middle", fontFamily: FONTS.mono, fontSize: "13", fill: stroke }, label), crossedLabel && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: "-24", y1: "-11", x2: "24", y2: "9", stroke: COLORS.danger, strokeWidth: "3.2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("line", { x1: "-24", y1: "9", x2: "24", y2: "-11", stroke: COLORS.danger, strokeWidth: "3.2", strokeLinecap: "round" }))));
      }
      function BitGrid({ hexA, hexB, cols = 16, dot = 22, gap = 6, style = {} }) {
        const bitsA = hexToBits(hexA);
        const bitsB = hexB ? hexToBits(hexB) : null;
        const count = Math.min(bitsA.length, 256);
        const rows = Math.ceil(count / cols);
        return /* @__PURE__ */ React.createElement("svg", { width: cols * (dot + gap), height: rows * (dot + gap), style }, Array.from({ length: count }).map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const bitA = bitsA[index];
          const bitB = bitsB ? bitsB[index] : bitA;
          const changed = bitA !== bitB;
          const on = bitB === 1;
          let fill = on ? COLORS.ink : "transparent";
          let stroke = COLORS.rule;
          if (changed) {
            fill = COLORS.accent;
            stroke = COLORS.accent;
          }
          return /* @__PURE__ */ React.createElement("rect", { key: index, x: col * (dot + gap), y: row * (dot + gap), width: dot, height: dot, fill, stroke, strokeWidth: "1.5" });
        }));
      }
      function CellGridSvg({ rows = 8, cols = 8, active = [], size = 24, gap = 6, style = {} }) {
        const activeSet = new Set(active.map((entry) => Array.isArray(entry) ? `${entry[0]}-${entry[1]}` : String(entry)));
        return /* @__PURE__ */ React.createElement("svg", { width: cols * (size + gap), height: rows * (size + gap), style }, Array.from({ length: rows }).flatMap((_, row) => Array.from({ length: cols }).map((__, col) => {
          const isActive = activeSet.has(`${row}-${col}`);
          return /* @__PURE__ */ React.createElement(
            "rect",
            {
              key: `${row}-${col}`,
              x: col * (size + gap),
              y: row * (size + gap),
              width: size,
              height: size,
              fill: isActive ? COLORS.gold : COLORS.paper,
              stroke: isActive ? COLORS.gold : COLORS.rule,
              strokeWidth: "1.5"
            }
          );
        })));
      }
      function BlockCard({ prevHash, lines, pow, hash, highlight, dim, tampered, compromised, prevHashBroken, width = 230 }) {
        const border = tampered || compromised ? COLORS.danger : highlight ? COLORS.gold : dim ? COLORS.ruleFaint : COLORS.rule;
        const shellGlow = tampered ? "0 0 0 4px rgba(155,42,27,0.28)" : compromised ? "0 0 0 3px rgba(155,42,27,0.18)" : highlight ? "0 0 0 4px rgba(184,137,59,0.18)" : "none";
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              width,
              border: `1.5px solid ${border}`,
              background: COLORS.paper,
              opacity: dim ? 0.55 : 1,
              fontFamily: FONTS.serif,
              boxShadow: shellGlow,
              transition: "box-shadow 180ms ease, border-color 180ms ease"
            }
          },
          /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", borderBottom: `1px solid ${COLORS.ruleFaint}`, fontFamily: FONTS.mono, fontSize: 14, color: prevHashBroken ? COLORS.danger : COLORS.muted, textAlign: "center", background: prevHashBroken ? "rgba(155,42,27,0.06)" : "transparent" } }, prevHash || "genesis", prevHashBroken && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.danger, marginTop: 2 } }, "prev hash mismatch")),
          /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 14px", minHeight: 110 } }, lines && lines.map((line, index) => /* @__PURE__ */ React.createElement("div", { key: index, style: { fontSize: 16, color: COLORS.ink, marginBottom: 4 } }, line))),
          hash && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", borderTop: `1px solid ${COLORS.ruleFaint}`, borderBottom: `1px solid ${COLORS.ruleFaint}`, fontFamily: FONTS.mono, fontSize: 13, color: tampered ? COLORS.danger : COLORS.muted, textAlign: "center" } }, "hash: ", hash, tampered && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.danger, marginTop: 2 } }, "no leading zeros \u2014 invalid")),
          /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", borderTop: `1px solid ${COLORS.ruleFaint}`, fontFamily: FONTS.sans, fontSize: 13, letterSpacing: "0.18em", color: tampered ? COLORS.danger : COLORS.gold, textAlign: "center", textTransform: "uppercase" } }, tampered ? "\u2717 proof of work failed" : pow || "proof of work")
        );
      }
      function BlockSvg({ size = 230, ...props }) {
        return /* @__PURE__ */ React.createElement(BlockCard, { width: size, ...props });
      }
      function MinerSvg({ winner = false, size = 80 }) {
        const fill = winner ? COLORS.gold : COLORS.muted;
        const tint = winner ? "#F5EFE3" : "#D4CCBC";
        const outline = winner ? COLORS.gold : COLORS.ink;
        return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 120 152", width: size, height: size * 152 / 120 }, /* @__PURE__ */ React.createElement("path", { d: "M10 140 Q10 90 60 90 Q110 90 110 140 Z", fill, stroke: outline, strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("rect", { x: "50", y: "78", width: "20", height: "14", fill: tint, stroke: outline, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "60", cy: "48", r: "32", fill: tint, stroke: outline, strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("circle", { cx: "50", cy: "50", r: "3", fill }), /* @__PURE__ */ React.createElement("circle", { cx: "70", cy: "50", r: "3", fill }), /* @__PURE__ */ React.createElement("path", { d: "M52 62 Q60 68 68 62", fill: "none", stroke: fill, strokeWidth: "2.5", strokeLinecap: "round" }));
      }
      const HTCS_ASSETS = {
        hexToBits,
        DocumentSvg,
        FileIconSvg,
        DocCard,
        HashBox,
        HashBoxSvg,
        HashPipeline,
        Person,
        PersonSvg,
        NetworkPersonSvg,
        FriendBust,
        PeerSvg,
        ServerRackSvg,
        NetworkLinkLine,
        PacketOnEdge,
        KeyIcon,
        KeyIconSvg,
        Padlock,
        Envelope,
        SealedEnvelopeSvg,
        StageArrow,
        PaymentArrow,
        BitGrid,
        CellGridSvg,
        BlockCard,
        BlockSvg,
        MinerSvg
      };
      window.HTCS_ASSETS = HTCS_ASSETS;
      Object.assign(window, HTCS_ASSETS);
    })();
  }
})();
