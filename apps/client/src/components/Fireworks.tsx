"use client";

const colors = ["bg-yellow-400", "bg-pink-400", "bg-blue-400", "bg-green-400"];

export default function Fireworks() {
  return (
    <>
      {Array.from({ length: 25 }).map((_, i) => {
        const x = Math.random() * 600 - 300;
        const y = Math.random() * -500;
        const delay = Math.random();

        return (
          <span
            key={i}
            className={`firework-particle absolute w-2 h-2 rounded-full ${
              colors[i % colors.length]
            }`}
            style={
              {
                left: "50%",
                top: "60%",
                "--firework-x": `${x}px`,
                "--firework-y": `${y}px`,
                animationDelay: `${delay}s`,
              } as React.CSSProperties
            }
          />
        );
      })}

      <style jsx>{`
        .firework-particle {
          opacity: 0;
          transform: translate(0, 0) scale(0);
          animation: firework 3s ease-in-out infinite;
        }

        @keyframes firework {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          15% {
            opacity: 1;
            transform: translate(
                calc(var(--firework-x) * 0.15),
                calc(var(--firework-y) * 0.15)
              )
              scale(1);
          }
          65% {
            opacity: 0.8;
            transform: translate(var(--firework-x), var(--firework-y))
              scale(0.5);
          }
          100% {
            opacity: 0;
            transform: translate(var(--firework-x), var(--firework-y))
              scale(0.5);
          }
        }
      `}</style>
    </>
  );
}
