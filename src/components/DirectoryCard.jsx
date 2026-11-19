import BloodGroupBadge from './BloodGroupBadge';

export default function DirectoryCard({ item, type }) {
  const icon = type === 'hospital' ? '🏥' : '🩸';
  const location = [item.upazila, item.district, item.division]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
          {icon}
        </div>
        {item.isVerified && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700">
            ✓ Verified
          </span>
        )}
      </div>

      <h3 className="font-display mt-4 text-lg font-bold text-ink">{item.name}</h3>
      {item.address && <p className="mt-1 text-sm text-ink/60">{item.address}</p>}
      {location && (
        <p className="mt-1 text-xs font-medium text-ink/40">📍 {location}</p>
      )}

      {item.phone && (
        <a
          href={`tel:${item.phone}`}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          📞 {item.phone}
        </a>
      )}

      {type === 'bloodBank' && item.availableGroups?.length > 0 && (
        <div className="mt-4 border-t border-ink/5 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">
            Available Groups
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.availableGroups.map((g) => (
              <BloodGroupBadge key={g} group={g} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}