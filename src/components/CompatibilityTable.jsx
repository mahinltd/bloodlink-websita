import { BLOOD_GROUPS, CAN_RECEIVE_FROM } from '@/constants/bloodGroups';
import BloodGroupBadge from './BloodGroupBadge';

export default function CompatibilityTable() {
  return (
    <section className="bg-cream">
      <div className="container-x section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">🧬 Blood Compatibility</span>
          <h2 className="section-title mt-4">Who Can You Save?</h2>
          <p className="mt-3 text-ink/60">
            <strong>O−</strong> is the universal donor. <strong>AB+</strong> is the
            universal receiver. Find your group below.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BLOOD_GROUPS.map((group) => (
            <div key={group} className="card p-6">
              <div className="flex items-center justify-between">
                <BloodGroupBadge group={group} size="lg" />
                {group === 'O-' && (
                  <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-white">
                    Universal Donor
                  </span>
                )}
                {group === 'AB+' && (
                  <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-bold uppercase text-white">
                    Universal Receiver
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink/40">
                Can receive from
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CAN_RECEIVE_FROM[group].map((g) => (
                  <BloodGroupBadge key={g} group={g} size="sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}