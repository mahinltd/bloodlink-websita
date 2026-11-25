import Image from 'next/image';
import { getAppVersion } from '@/lib/api';

export const metadata = {
  title: 'Download BloodLink App for Android',
  description:
    'Download the BloodLink Android app — get SOS blood alerts, chat with donors, track donations and earn badges. Free APK download.',
  keywords: ['blood donation app download', 'bloodlink apk', 'blood donor app android'],
  alternates: { canonical: '/download' },
  openGraph: {
    title: 'Download BloodLink App',
    description: 'Carry a lifeline in your pocket. Free Android app.',
    url: '/download',
  },
};

const steps = [
  { icon: '⬇️', title: 'Download APK', text: 'Click the download button below to get the latest APK file.' },
  { icon: '⚙️', title: 'Allow Install', text: 'When prompted, allow "Install from unknown sources" for your browser.' },
  { icon: '📲', title: 'Install & Open', text: 'Open the downloaded file and tap Install.' },
  { icon: '🩸', title: 'Register as Donor', text: 'Create your profile, verify your NID, and start saving lives.' },
];

export default async function DownloadPage() {
  const version = await getAppVersion();

  return (
    <main>
      <section className="bg-gradient-to-b from-cream to-white">
        <div className="container-x section-pad grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div className="text-center lg:text-left">
            <span className="eyebrow">📱 Android App</span>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-ink sm:text-5xl">
              Carry a Lifeline in Your Pocket
            </h1>
            <p className="mx-auto mt-4 max-w-md text-ink/60 lg:mx-0">
              Get instant SOS alerts, chat with requesters, track your donation
              journey and earn badges — all in one app.
            </p>

            <div className="mt-8">
              {version?.apkUrl ? (
                <a
                  href={version.apkUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !px-8 !py-4 text-base"
                >
                  ⬇ Download APK
                  {version.latestVersion ? ` (v${version.latestVersion})` : ''}
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-ink/10 px-8 py-4 text-base font-semibold text-ink/40"
                >
                  ⏳ Coming Soon
                </button>
              )}
              <p className="mt-4 text-xs text-ink/40">
                {version?.fileSizeMB ? `Size: ~${version.fileSizeMB} MB • ` : ''}
                Android 8.0+ • iOS coming soon
              </p>
            </div>

            {version?.releaseNotes && (
              <div className="mt-8 rounded-2xl border border-ink/5 bg-white p-5 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  What&apos;s New {version.latestVersion ? `— v${version.latestVersion}` : ''}
                </p>
                <p className="mt-2 text-sm text-ink/60">{version.releaseNotes}</p>
              </div>
            )}

            {version?.sha256 && (
              <div className="mt-4 rounded-2xl bg-ink p-5 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                  🔐 SHA-256 (verify your download)
                </p>
                <p className="mt-2 break-all font-mono text-xs text-white/80">
                  {version.sha256}
                </p>
              </div>
            )}
          </div>

          {/* Right — logo visual */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="animate-pulse-ring rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-primary/10">
              <Image
                src="/images/logo-stacked.png"
                alt="BloodLink App"
                width={400}
                height={420}
                className="w-full rounded-2xl"
              />
            </div>
            <div className="animate-float absolute -right-4 top-8 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-right-8">
              <p className="text-xs font-semibold text-ink/50">🏅 Badge Unlocked</p>
              <p className="text-sm font-bold text-ink">Life Saver 🥉</p>
            </div>
            <div className="animate-float-delayed absolute -left-4 bottom-16 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-left-8">
              <p className="text-xs font-semibold text-primary">🆘 SOS Nearby</p>
              <p className="text-sm font-bold text-ink">O+ needed — 800m</p>
            </div>
          </div>
        </div>
      </section>

      {/* Install steps */}
      <section className="container-x section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">🛠️ Installation</span>
          <h2 className="section-title mt-4">Install in 4 Easy Steps</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card relative p-7">
              <span className="font-display absolute right-6 top-5 text-4xl font-extrabold text-primary/10">
                {i + 1}
              </span>
              <div className="text-3xl">{s.icon}</div>
              <h3 className="font-display mt-3 font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ink/40">
          🔒 Every APK is SHA-256 verified. BloodLink will never ask for payment — blood is donated, never sold.
        </p>
      </section>
    </main>
  );
}