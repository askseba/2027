"use client"

type ResultsLoadingScreenProps = {
  direction?: 'rtl' | 'ltr'
}

const MESSAGES = [
  'نبحث في آلاف العطور',
  'نحلل ذوقك العطري',
  'نرسم بصمتك الفريدة',
  'نختار ما يليق بك',
  'لحظات وتكتمل بصمتك…',
]

const PARTICLES = [
  { x: '24%', dur: '2.1s', delay: '0.2s' },
  { x: '31%', dur: '3.2s', delay: '1.1s' },
  { x: '38%', dur: '2.7s', delay: '0.6s' },
  { x: '46%', dur: '3.6s', delay: '2.0s' },
  { x: '54%', dur: '2.4s', delay: '0.9s' },
  { x: '61%', dur: '3.1s', delay: '1.8s' },
  { x: '68%', dur: '2.3s', delay: '1.3s' },
  { x: '75%', dur: '3.8s', delay: '2.6s' },
]

export function ResultsLoadingScreen({ direction = 'rtl' }: ResultsLoadingScreenProps) {
  return (
    <div
      className="min-h-screen bg-cream-bg dark:!bg-surface pb-20 flex items-center justify-center overflow-hidden"
      dir={direction}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="sr-only">جاري تحليل تفضيلاتك العطرية وتحضير النتائج</span>

      <div className="scene">
        <div className="orbWrapper" aria-hidden="true">
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
          <div className="orb" />
          <div className="particles">
            {PARTICLES.map((particle, index) => (
              <div
                key={index}
                className="particle"
                style={
                  {
                    '--x': particle.x,
                    '--dur': particle.dur,
                    '--delay': particle.delay,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>

        <div className="textArea">
          <div className="label">✦ تحليل بصمتك ✦</div>

          <div className="messageWrapper" aria-hidden="true">
            {MESSAGES.map((msg, index) => (
              <div
                key={msg}
                className="message"
                style={{ animationDelay: `${index * 2.4}s` }}
              >
                {msg}
              </div>
            ))}
          </div>

          <div className="dots" aria-hidden="true">
            {MESSAGES.map((_, index) => (
              <div
                key={index}
                className="dot"
                style={{ animationDelay: `${index * 2.4}s` }}
              />
            ))}
          </div>

          <div className="progressTrack" aria-hidden="true">
            <div className="progressFill" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .scene {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 48px;
          z-index: 1;
          padding-inline: 24px;
        }

        .scene::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: -1;
        }

        .orbWrapper {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          border: 1px solid #c9a96e;
          opacity: 0;
          animation: ringExpand 3s ease-out infinite;
        }

        .ring:nth-child(2) {
          animation-delay: 1s;
        }

        .ring:nth-child(3) {
          animation-delay: 2s;
        }

        .orb {
          width: 110px;
          height: 110px;
          border-radius: 9999px;
          background: radial-gradient(circle at 35% 35%, #f0dfc0 0%, #d4a96a 40%, #a87840 75%, #7a5228 100%);
          box-shadow:
            0 0 40px rgba(201, 169, 110, 0.4),
            0 0 80px rgba(201, 169, 110, 0.15),
            inset 0 -10px 30px rgba(0, 0, 0, 0.15);
          animation: breathe 3.5s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }

        .orb::after {
          content: '';
          position: absolute;
          top: 18%;
          left: 22%;
          width: 28%;
          height: 20%;
          background: radial-gradient(ellipse, rgba(255, 255, 255, 0.55) 0%, transparent 100%);
          border-radius: 9999px;
          transform: rotate(-30deg);
        }

        .particles {
          position: absolute;
          inset: -40px;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: #c9a96e;
          opacity: 0;
          animation: floatUp var(--dur) ease-in infinite;
          animation-delay: var(--delay);
          left: var(--x);
          bottom: 30%;
        }

        .textArea {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .label {
          font-size: 12px;
          letter-spacing: 0.2em;
          color: #c9a96e;
          font-weight: 500;
          opacity: 0.9;
        }

        .messageWrapper {
          position: relative;
          height: 32px;
          width: 260px;
          overflow: hidden;
        }

        .message {
          position: absolute;
          inset-inline: 0;
          font-size: 18px;
          font-weight: 500;
          color: #c9a96e;
          letter-spacing: 0.02em;
          text-align: center;
          opacity: 0;
          transform: translateY(14px);
          animation: messageCycle 12s infinite;
        }

        .progressTrack {
          width: 140px;
          height: 2px;
          background: rgba(201, 169, 110, 0.15);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progressFill {
          height: 100%;
          width: 40%;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent, #c9a96e, transparent);
          animation: sweep 2s ease-in-out infinite;
        }

        .dots {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: rgba(201, 169, 110, 0.3);
          animation: dotCycle 12s infinite;
        }

        :global(.dark) .orb {
          box-shadow:
            0 0 50px rgba(201, 169, 110, 0.5),
            0 0 100px rgba(201, 169, 110, 0.2),
            inset 0 -12px 35px rgba(0, 0, 0, 0.3);
        }

        @keyframes ringExpand {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 40px rgba(201, 169, 110, 0.4), 0 0 80px rgba(201, 169, 110, 0.15), inset 0 -10px 30px rgba(0, 0, 0, 0.15);
          }
          50% {
            transform: scale(1.12);
            box-shadow: 0 0 60px rgba(201, 169, 110, 0.6), 0 0 120px rgba(201, 169, 110, 0.25), inset 0 -10px 30px rgba(0, 0, 0, 0.15);
          }
        }

        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          20% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: translateY(-90px) scale(0.3);
          }
        }

        @keyframes messageCycle {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          8% {
            opacity: 1;
            transform: translateY(0);
          }
          28% {
            opacity: 1;
            transform: translateY(0);
          }
          36% {
            opacity: 0;
            transform: translateY(-14px);
          }
          100% {
            opacity: 0;
            transform: translateY(-14px);
          }
        }

        @keyframes dotCycle {
          0%,
          100% {
            background: rgba(201, 169, 110, 0.3);
            transform: scale(1);
          }
          8%,
          28% {
            background: #c9a96e;
            transform: scale(1.3);
          }
          36% {
            background: rgba(201, 169, 110, 0.3);
            transform: scale(1);
          }
        }

        @keyframes sweep {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(350%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ring,
          .orb,
          .particle,
          .message,
          .progressFill,
          .dot {
            animation: none !important;
          }

          .message {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
