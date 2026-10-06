function TipBulbIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FBBF24"
        d="M24 4c-8.3 0-15 6.6-15 14.7 0 5.5 3 10.3 7.4 12.9L18 35h12l1.6-3.4C36 29 39 24.2 39 18.7 39 10.6 32.3 4 24 4z"
      />
      <path
        fill="none"
        stroke="#FDE68A"
        strokeWidth="2.4"
        strokeLinecap="round"
        d="M18.5 20.5c2.2-5.2 3.7-7.5 5.5-7.5s3.3 2.3 5.5 7.5"
      />
      <rect x="18.5" y="34.5" width="11" height="2.2" rx="1" fill="#F59E0B" />
      <rect x="17.5" y="36.8" width="13" height="2.6" rx="1.3" fill="#D1D5DB" />
      <rect x="18.2" y="39.6" width="11.6" height="2.6" rx="1.3" fill="#9CA3AF" />
      <path fill="#9CA3AF" d="M20.5 42.4h7c0 1.8-1.6 3.2-3.5 3.2s-3.5-1.4-3.5-3.2z" />
    </svg>
  );
}

export default function Tip({
  children,
  centerLabel = false,
  oneLine = false,
  label = "提示",
}) {
  if (centerLabel) {
    return (
      <div className="tip-box flex items-center gap-3 !overflow-x-auto !px-4 !py-4">
        <p className="tip-box-label mb-0 flex shrink-0 items-center gap-1.5 !px-0 text-sm font-bold text-amber-800">
          <TipBulbIcon className="h-6 w-6" />
          {label}
        </p>
        <div
          className={`tip-box-body !px-0 text-sm font-medium text-amber-900/80 ${
            oneLine ? "whitespace-nowrap" : "min-w-0"
          }`}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="tip-box">
      <p className="tip-box-label mb-1 flex items-center gap-1.5 text-sm font-bold text-amber-800">
        <TipBulbIcon className="h-6 w-6" />
        {label}
      </p>
      <div className="tip-box-body text-sm font-medium text-amber-900/80">
        {children}
      </div>
    </div>
  );
}
