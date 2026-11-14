/**
 * Ambient background component rendering abstract 3D orange ribbon shapes
 * and flowing organic forms behind the main interface.
 * Preserves full content readability while providing the signature
 * "Warm Liquid Glass" aerospace identity.
 */
export function AmbientRibbons() {
  return (
    <div
      className="ambient-ribbons-container fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Dynamic warm radial ambient glow */}
      <div className="ambient-glow absolute -top-40 -left-40 h-[650px] w-[650px] rounded-full blur-[130px] transition-opacity duration-1000" />
      <div className="ambient-glow-secondary absolute top-1/3 -right-40 h-[700px] w-[700px] rounded-full blur-[140px] transition-opacity duration-1000" />
      <div className="ambient-glow-bottom absolute -bottom-40 left-1/4 h-[600px] w-[600px] rounded-full blur-[120px] transition-opacity duration-1000" />

      {/* Abstract 3D organic ribbon vector shapes */}
      <svg
        className="ambient-ribbon-svg absolute inset-0 h-full w-full opacity-60 transition-opacity duration-700"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ignis-ribbon-1" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#EA580C" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#FFB066" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFF0E0" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="ignis-ribbon-2" x1="100%" y1="10%" x2="0%" y2="90%">
            <stop offset="0%" stopColor="#FF9800" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#F97316" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="ignis-ribbon-sheen" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#FFF0E0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </linearGradient>

          <filter id="ribbon-blur-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="35" />
          </filter>
          <filter id="ribbon-blur-sheen" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* Large sweeping 3D primary ribbon */}
        <path
          className="anim-ribbon-primary"
          d="M-120 180 C 280 80, 520 460, 940 310 C 1220 210, 1420 420, 1600 360 C 1600 480, 1380 540, 1020 460 C 620 370, 360 620, -120 420 Z"
          fill="url(#ignis-ribbon-1)"
          filter="url(#ribbon-blur-soft)"
        />

        {/* Secondary organic loop ribbon */}
        <path
          className="anim-ribbon-secondary"
          d="M200 880 C 480 620, 760 840, 1140 680 C 1360 590, 1520 720, 1650 640 L 1620 780 C 1380 880, 1080 780, 820 900 C 540 1020, 340 960, 200 880 Z"
          fill="url(#ignis-ribbon-2)"
          filter="url(#ribbon-blur-soft)"
        />

        {/* Delicate foreground edge sheen lines for 3D depth */}
        <path
          className="anim-ribbon-sheen"
          d="M-80 200 C 300 110, 540 480, 960 330 C 1240 230, 1440 440, 1580 380"
          stroke="url(#ignis-ribbon-sheen)"
          strokeWidth="3"
          fill="none"
          filter="url(#ribbon-blur-sheen)"
        />
        <path
          d="M240 860 C 500 640, 780 820, 1120 700 C 1320 620, 1480 730, 1600 660"
          stroke="url(#ignis-ribbon-sheen)"
          strokeWidth="2"
          fill="none"
          filter="url(#ribbon-blur-sheen)"
        />
      </svg>
    </div>
  );
}
