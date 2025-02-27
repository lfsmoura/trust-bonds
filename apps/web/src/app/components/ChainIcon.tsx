export function ChainIcon() {
  return (
    <svg
      width="32"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mr-2"
    >
      {/* Infinity-like chain path */}
      <path
        d="M8 12C8 14.2091 6.20914 16 4 16C1.79086 16 0 14.2091 0 12C0 9.79086 1.79086 8 4 8C6.20914 8 8 9.79086 8 12ZM24 12C24 14.2091 22.2091 16 20 16C17.7909 16 16 14.2091 16 12C16 9.79086 17.7909 8 20 8C22.2091 8 24 9.79086 24 12ZM5 12H19"
        stroke="#EAB308"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      />

      {/* Sparkles with different animations */}
      <circle
        cx="5"
        cy="16"
        r="1"
        fill="#FACC15"
        className="animate-[ping_2s_ease-in-out_infinite]"
      />
      <circle
        cx="19"
        cy="8"
        r="1"
        fill="#FACC15"
        className="animate-[ping_1.5s_ease-in-out_0.5s_infinite]"
      />

      {/* Additional sparkles */}
      <circle
        cx="12"
        cy="14"
        r="0.5"
        fill="#FEF08A"
        className="animate-[ping_2.5s_ease-in-out_0.8s_infinite]"
      />
      <circle
        cx="12"
        cy="10"
        r="0.5"
        fill="#FEF08A"
        className="animate-[ping_2.2s_ease-in-out_0.3s_infinite]"
      />
    </svg>
  );
}
