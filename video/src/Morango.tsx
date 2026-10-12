import { C } from "./tema";

export const Morango: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 40 44" style={style}>
    <path d="M20 43 C9 38 2 27 3 18 C4 12 11 9 20 12 C29 9 36 12 37 18 C38 27 31 38 20 43Z" fill={C.berry} />
    <path d="M9 17 C12 14 16 14 18 15" stroke="#FF8A98" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    <g fill={C.seed}>
      <ellipse cx={12} cy={22} rx={1.2} ry={1.9} />
      <ellipse cx={20} cy={20} rx={1.2} ry={1.9} />
      <ellipse cx={28} cy={22} rx={1.2} ry={1.9} />
      <ellipse cx={15} cy={29} rx={1.2} ry={1.9} />
      <ellipse cx={25} cy={29} rx={1.2} ry={1.9} />
      <ellipse cx={20} cy={36} rx={1.2} ry={1.9} />
    </g>
    <path d="M20 15 L9 10 L15 9.5 L11 4 L20 8.5 L29 4 L25 9.5 L31 10 Z" fill={C.leaf} />
    <path d="M20 9 q1 -5 5 -7.5" stroke="#3E8436" strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </svg>
);
