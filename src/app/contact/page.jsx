import { SITE } from '@/constants/site';

export const metadata = {
  title: 'Contact Us',
  description:
    'Contact the BloodLink team — support, abuse reports, and partnerships. We respond within 24 hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact BloodLink',
    description: 'Get in touch — we respond within 24 hours.',
    url: '/contact',
  },
};

const channels = [
  {
    icon: '📧',
    title: 'General Support',
    text: 'Questions, feedback or need help with the app?',
    action: `mailto:${SITE.supportEmail}`,
    actionLabel: SITE.supportEmail,
  },
  {
    icon: '🚨',
    title: 'Report Abuse',
    text: 'Someone asking money for blood, fake requests or harassment? Report immediately — we act within 24 hours.',
    action: `mailto:${SITE.supportEmail}?subject=Abuse Report - BloodLink`,
    actionLabel: 'Report Now',
  },
  {
    icon: '🤝',
    title: 'Partnerships',
    text: 'Hospital, blood bank or organization interested in working with us?',
    action: `mailto:${SITE.supportEmail}?subject=Partnership - BloodLink`,
    actionLabel: 'Start a Conversation',
  },
];

export default function ContactPage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-cream to-white">
        <div className="container-x py-16 text-center sm:py-20">
          <span className="eyebrow">📬 Contact</span>
          <h1 className="section-title mt-4">We Are Here to Help</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/60">
            Usually we respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {channels.map((c) => (
            <div key={c.title} className="card flex flex-col p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                {c.icon}
              </div>
              <h3 className="font-display mt-4 font-bold text-ink">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">{c.text}</p>
              <a
                href={c.action}
                className="mt-5 inline-flex items-center justify-center rounded-full border-2 border-primary/15 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                {c.actionLabel}
              </a>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl bg-cream p-8 text-center">
          <p className="text-sm text-ink/60">
            🩸 <strong className="text-ink">জরুরি রক্তের প্রয়োজন?</strong> Website-এ
            অপেক্ষা না করে সরাসরি অ্যাপে SOS request দিন — কাছের donor-রা সঙ্গে সঙ্গে
            notification পাবেন।
          </p>
        </div>
      </section>
    </main>
  );
}