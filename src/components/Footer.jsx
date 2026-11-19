import Link from 'next/link';
import Image from 'next/image';
import { SITE, NAV_LINKS } from '@/constants/site';

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x section-pad grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Image
            src="/images/logo-white.png"
            alt="BloodLink"
            width={170}
            height={48}
            className="h-11 w-auto rounded-lg"
          />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {SITE.description}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            100% Voluntary &amp; Non-Profit
          </div>
        </div>

        {/* Platform */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/40">
            Platform
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/70 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get the app */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/40">
            Get the App
          </h4>
          <p className="mt-4 text-sm text-white/60">
            Download BloodLink for Android and become a lifesaver today.
          </p>
          <Link href="/download" className="btn-primary mt-5">
            ⬇ Download APK
          </Link>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/40">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>📧 {SITE.supportEmail}</li>
            <li>🌐 {SITE.domain}</li>
            <li>📍 khulna, Bangladesh</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} BloodLink. Made with ❤️ in Bangladesh.</p>
          <p className="text-center">
            ⚠️ Blood buying or selling is strictly prohibited on BloodLink.
          </p>
        </div>
      </div>
    </footer>
  );
}