export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`ms ${className}`}>{name}</span>;
}
