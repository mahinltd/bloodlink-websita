import Link from 'next/link';
import Image from 'next/image';
import BloodGroupBadge from './BloodGroupBadge';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-white to-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-x section-pad relative grid items-center gap-14 lg:grid-cols-2">
        {/* Left — copy */}
        <div>
          <span className="eyebrow">🩸 Voluntary • Non-Profit • Bangladesh</span>

          <h1 className="font-display mt-6 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            রক্ত দিন,
            <br />
            <span className="text-primary">প্রাণ বাঁচান।</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/60 sm:text-lg">
            BloodLink connects voluntary blood donors with patients in critical
            need — smart matching, instant SOS alerts, and real-time chat.
            One donation can save up to <strong className="text-ink">three lives</strong>.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/download" className="btn-primary text-base">
              ⬇ Download the App
            </Link>
            <Link href="/blood-banks" className="btn-outline text-base">
              Find Blood Banks
            </Link>
          </div>

          {/* Trust chips */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink/50">
            <span className="flex items-center gap-2">✅ NID Verified Donors</span>
            <span className="flex items-center gap-2">⚡ SOS in Minutes</span>
            <span className="flex items-center gap-2">🔒 100% Free Forever</span>
          </div>
        </div>

        {/* Right — visual */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="animate-pulse-ring relative rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-primary/10">
            <Image
              src="/images/logo-stacked.png"
              alt="BloodLink"
              width={400}
              height={420}
              className="w-full rounded-2xl"
              priority
            />
          </div>

          {/* Floating chips */}
          <div className="animate-float absolute -left-4 top-10 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink/10 sm:-left-10">
            <p className="text-xs font-semibold text-ink/50">🆘 SOS Alert</p>
            <p className="mt-0.5 text-sm font-bold text-ink">
              2 bags <span className="text-primary">O+</span> needed
            </p>
          </div>

          <div className="animate-float-delayed absolute -right-4 bottom-24 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink/10 sm:-right-8">
            <p className="text-xs font-semibold text-green-600">✅ Donor Found</p>
            <p className="mt-0.5 text-sm font-bold text-ink">1.2 km away</p>
          </div>

          <div className="animate-float absolute -bottom-5 left-8 flex gap-2 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink/10">
            {['O+', 'A+', 'B+', 'AB+'].map((g) => (
              <BloodGroupBadge key={g} group={g} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}