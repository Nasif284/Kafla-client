export default function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#e5e9e5] rounded-xl ${className}`} />;
}