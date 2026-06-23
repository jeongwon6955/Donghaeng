export function Icon({ name, className = '', size }: { name: string; className?: string; size?: number }) {
  return (
    <span className={`ms ${className}`} style={size ? { fontSize: `${size}px` } : undefined}>
      {name}
    </span>
  );
}
