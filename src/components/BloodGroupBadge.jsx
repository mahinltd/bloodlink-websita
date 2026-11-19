export default function BloodGroupBadge({ group, size = 'md' }) {
  const sizes = {
    sm: 'h-8 min-w-8 px-2 text-xs',
    md: 'h-10 min-w-10 px-3 text-sm',
    lg: 'h-12 min-w-12 px-4 text-base',
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-primary/10 font-bold text-primary ${sizes[size]}`}
    >
      {group}
    </span>
  );
}