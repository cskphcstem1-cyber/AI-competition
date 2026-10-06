export default function HomeCat({
  decorations = [],
  size = "lg",
  className = "",
  moving = false,
}) {
  const hat = decorations.find((id) => id.startsWith("cat-hat-"));
  const eyes = decorations.find((id) => id.startsWith("cat-eyes-"));
  const neck = decorations.find((id) => id.startsWith("cat-neck-"));
  const held = decorations.find((id) => id.startsWith("cat-held-"));
  const dim = size === "sm" ? "h-24 w-24" : size === "md" ? "h-36 w-36" : "h-44 w-44 sm:h-52 sm:w-52";

  return (
    <div className={`relative ${dim} ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 200 200"
        className={`h-full w-full drop-shadow-lg ${moving ? "home-cat-bob" : ""}`}
      >
        <ellipse cx="100" cy="186" rx="48" ry="8" fill="#0f172a" opacity="0.12" />
        <path
          className={moving ? "home-cat-tail" : ""}
          d="M138 148 Q168 132 176 88 Q170 108 148 128"
          fill="none"
          stroke="#f4a261"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <ellipse cx="72" cy="168" rx="22" ry="14" fill="#f4a261" />
        <ellipse cx="128" cy="168" rx="22" ry="14" fill="#f4a261" />
        <ellipse cx="100" cy="128" rx="58" ry="50" fill="#f4a261" />
        <ellipse cx="100" cy="132" rx="22" ry="28" fill="#ffe8d6" />
        <path d="M48 78 L62 28 L88 68 Z" fill="#f4a261" />
        <path d="M152 78 L138 28 L112 68 Z" fill="#f4a261" />
        <path d="M58 72 L66 42 L80 68 Z" fill="#ffb4a2" />
        <path d="M142 72 L134 42 L120 68 Z" fill="#ffb4a2" />
        <circle cx="100" cy="88" r="46" fill="#f4a261" />
        <ellipse cx="100" cy="102" rx="18" ry="12" fill="#ffe8d6" />
        <g className={moving && eyes !== "cat-eyes-shades" ? "home-cat-eyes" : undefined}>
          {eyes === "cat-eyes-shades" ? (
            <g>
              <rect x="62" y="74" width="76" height="18" rx="8" fill="#1e293b" />
              <rect x="68" y="77" width="28" height="12" rx="4" fill="#0ea5e9" opacity="0.35" />
              <rect x="104" y="77" width="28" height="12" rx="4" fill="#0ea5e9" opacity="0.35" />
            </g>
          ) : eyes === "cat-eyes-round" ? (
            <g>
              <circle cx="82" cy="84" r="14" fill="none" stroke="#334155" strokeWidth="3" />
              <circle cx="118" cy="84" r="14" fill="none" stroke="#334155" strokeWidth="3" />
              <path d="M96 84 H104" stroke="#334155" strokeWidth="3" />
              <circle cx="82" cy="84" r="5" fill="#1e293b" />
              <circle cx="118" cy="84" r="5" fill="#1e293b" />
            </g>
          ) : (
            <g>
              <ellipse cx="82" cy="84" rx="8" ry="10" fill="#1e293b" />
              <ellipse cx="118" cy="84" rx="8" ry="10" fill="#1e293b" />
              <circle cx="85" cy="81" r="2.4" fill="#fff" />
              <circle cx="121" cy="81" r="2.4" fill="#fff" />
            </g>
          )}
        </g>
        <ellipse cx="100" cy="104" rx="8" ry="5" fill="#e76f51" />
        <path d="M100 109 Q88 118 78 112" fill="none" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
        <path d="M100 109 Q112 118 122 112" fill="none" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 98 H28" stroke="#9a3412" strokeWidth="1.6" />
        <path d="M60 106 H26" stroke="#9a3412" strokeWidth="1.6" />
        <path d="M62 114 H32" stroke="#9a3412" strokeWidth="1.6" />
        <path d="M142 98 H172" stroke="#9a3412" strokeWidth="1.6" />
        <path d="M140 106 H174" stroke="#9a3412" strokeWidth="1.6" />
        <path d="M138 114 H168" stroke="#9a3412" strokeWidth="1.6" />
        {neck === "cat-neck-bell" && (
          <g>
            <path d="M70 138 Q100 152 130 138" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <circle cx="100" cy="154" r="8" fill="#fbbf24" />
            <circle cx="100" cy="156" r="2" fill="#92400e" />
          </g>
        )}
        {neck === "cat-neck-bow" && (
          <g>
            <ellipse cx="86" cy="148" rx="12" ry="8" fill="#ef4444" />
            <ellipse cx="114" cy="148" rx="12" ry="8" fill="#ef4444" />
            <circle cx="100" cy="148" r="5" fill="#b91c1c" />
          </g>
        )}
        {neck === "cat-neck-scarf" && (
          <g>
            <path d="M68 136 Q100 158 132 136" fill="#22c55e" />
            <path d="M118 148 L142 176 L128 180 Z" fill="#16a34a" />
          </g>
        )}
        {neck === "cat-neck-tie" && (
          <g>
            <path d="M92 140 L100 148 L108 140 Z" fill="#0ea5e9" />
            <path d="M96 148 L100 176 L104 148 Z" fill="#0284c7" />
          </g>
        )}
        {hat === "cat-hat-party" && (
          <g>
            <path d="M100 8 L132 62 L68 62 Z" fill="#f43f5e" />
            <circle cx="100" cy="8" r="7" fill="#fbbf24" />
            <circle cx="88" cy="48" r="4" fill="#38bdf8" />
            <circle cx="112" cy="42" r="4" fill="#a3e635" />
          </g>
        )}
        {hat === "cat-hat-wizard" && (
          <g>
            <ellipse cx="100" cy="58" rx="42" ry="10" fill="#312e81" />
            <path d="M100 4 L128 56 L72 56 Z" fill="#4338ca" />
            <circle cx="104" cy="28" r="4" fill="#fbbf24" />
          </g>
        )}
        {hat === "cat-hat-crown" && (
          <g>
            <path d="M64 52 L76 28 L92 48 L100 22 L108 48 L124 28 L136 52 Z" fill="#fbbf24" />
            <circle cx="76" cy="26" r="4" fill="#ef4444" />
            <circle cx="100" cy="20" r="4" fill="#38bdf8" />
            <circle cx="124" cy="26" r="4" fill="#a855f7" />
          </g>
        )}
        {hat === "cat-hat-flower" && (
          <g>
            <circle cx="58" cy="52" r="8" fill="#fb7185" />
            <circle cx="70" cy="48" r="8" fill="#fb7185" />
            <circle cx="70" cy="60" r="8" fill="#fb7185" />
            <circle cx="52" cy="60" r="8" fill="#fb7185" />
            <circle cx="61" cy="56" r="5" fill="#fde047" />
          </g>
        )}
        {held === "cat-held-yarn" && (
          <g>
            <circle cx="154" cy="158" r="14" fill="#f43f5e" />
            <path d="M144 152 Q154 158 164 152" fill="none" stroke="#fff" strokeWidth="1.5" />
            <path d="M144 160 Q154 166 164 160" fill="none" stroke="#fff" strokeWidth="1.5" />
          </g>
        )}
        {held === "cat-held-book" && (
          <g>
            <rect x="138" y="148" width="28" height="22" rx="3" fill="#0369a1" />
            <path d="M152 148 V170" stroke="#bae6fd" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
}
