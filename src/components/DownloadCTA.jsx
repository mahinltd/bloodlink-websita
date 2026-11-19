import Link from 'next/link';

export default function DownloadCTA() {
  return (
    <section className="bg-white">
      <div className="container-x section-pad">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-dark px-8 py-16 text-center text-white sm:px-16 sm:py-20">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-white/10" />

          <span className="eyebrow !bg-white/15 !text-white">📱 Android App</span>
          <h2 className="font-display mx-auto mt-5 max-w-2xl text-3xl font-extrabold sm:text-5xl">
            Become Someone&apos;s Hero Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Download BloodLink, register as a donor, and get notified when someone
            nearby needs your blood group. Free forever — no ads, no selling.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/download"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              ⬇ Download for Android
            </Link>
          </div>
          <p className="mt-5 text-xs text-white/60">
            Secure APK • SHA-256 verified • iOS coming soon
          </p>
        </div>
      </div>
    </section>
  );
}