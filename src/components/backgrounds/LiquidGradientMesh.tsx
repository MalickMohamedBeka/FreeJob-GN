export function LiquidGradientMesh() {
  return (
    <>
      <style>{`
        @keyframes liquidFloat1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -20px); }
          50% { transform: translate(-20px, 30px); }
          75% { transform: translate(-30px, -20px); }
        }

        @keyframes liquidFloat2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-30px, 25px); }
          50% { transform: translate(20px, -25px); }
          75% { transform: translate(30px, 20px); }
        }

        @keyframes liquidFloat3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, -30px); }
          50% { transform: translate(-30px, -20px); }
          75% { transform: translate(10px, 30px); }
        }

        .liquid-gradient-mesh {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .liquid-blob {
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>

      <svg
        className="liquid-gradient-mesh"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur1">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
          </filter>
          <filter id="blur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="70" />
          </filter>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A3D" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0052CC" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0052CC" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF7A3D" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="grad3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FF7A3D" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0052CC" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Base gradient background */}
        <rect width="1440" height="900" fill="#FAFAFA" />

        {/* Liquid blobs - positioned for beautiful organic flow */}
        <circle
          className="liquid-blob"
          cx="200"
          cy="150"
          r="300"
          fill="url(#grad1)"
          filter="url(#blur1)"
          style={{ animation: 'liquidFloat1 12s ease-in-out infinite' }}
        />

        <circle
          className="liquid-blob"
          cx="1200"
          cy="200"
          r="280"
          fill="url(#grad2)"
          filter="url(#blur1)"
          style={{ animation: 'liquidFloat2 14s ease-in-out infinite' }}
        />

        <circle
          className="liquid-blob"
          cx="700"
          cy="700"
          r="320"
          fill="url(#grad1)"
          filter="url(#blur2)"
          style={{ animation: 'liquidFloat3 16s ease-in-out infinite' }}
        />

        <circle
          className="liquid-blob"
          cx="100"
          cy="700"
          r="250"
          fill="url(#grad2)"
          filter="url(#blur1)"
          style={{ animation: 'liquidFloat1 15s ease-in-out infinite' }}
        />

        <circle
          className="liquid-blob"
          cx="1300"
          cy="650"
          r="200"
          fill="url(#grad3)"
          filter="url(#blur2)"
          style={{ animation: 'liquidFloat2 13s ease-in-out infinite' }}
        />
      </svg>
    </>
  );
}
