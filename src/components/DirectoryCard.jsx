import BloodGroupBadge from './BloodGroupBadge';
import {
  formatContactNumber,
  normalizeAvailableGroups,
  toDisplayText,
} from '@/lib/format';

export default function DirectoryCard({ item, type }) {
  const name = toDisplayText(item?.name);
  const address = toDisplayText(item?.address);
  const district = toDisplayText(item?.district);
  const division = toDisplayText(item?.division);
  const location = [district, division].filter(Boolean).join(', ');
  const contactNumber = formatContactNumber(item?.contactNumber);
  const availableGroups = normalizeAvailableGroups(item?.availableGroups);
  const icon = type === 'hospital' ? '🏥' : '🩸';

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

      <h3 className="font-display mt-4 text-lg font-bold text-ink">{name}</h3>
      {address && <p className="mt-1 text-sm text-ink/60">{address}</p>}
      {location && (
        <p className="mt-1 text-xs font-medium text-ink/40">📍 {location}</p>
      )}

      {contactNumber && (
        <a
          href={`tel:${contactNumber}`}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          📞 {contactNumber}
        </a>
      )}

      {type === 'bloodBank' && availableGroups.length > 0 && (
        <div className="mt-4 border-t border-ink/5 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">
            Available Groups
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {availableGroups.map((g) => (
              <BloodGroupBadge key={g} group={g} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}