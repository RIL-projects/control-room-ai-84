interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function MiniSparkline({ data, width = 80, height = 24, color = "hsl(213, 58%, 45%)" }: MiniSparklineProps) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(" ");

  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth={1.5} points={points} />
    </svg>
  );
}
