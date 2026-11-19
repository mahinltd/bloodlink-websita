const steps = [
  {
    icon: '📝',
    title: 'Create Your Profile',
    text: 'Register as a donor with your blood group and location. NID verification earns you a trusted badge.',
  },
  {
    icon: '🎯',
    title: 'Get Matched Instantly',
    text: 'Our smart matching engine finds compatible donors near the patient — SOS alerts reach donors in seconds.',
  },
  {
    icon: '💬',
    title: 'Chat & Coordinate',
    text: 'Talk directly with the requester through secure in-app chat with live location sharing.',
  },
  {
    icon: '🏅',
    title: 'Donate & Earn Badges',
    text: 'Complete the donation, grow your history, and unlock badges — from First Drop to Legend.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="container-x section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">⚙️ How It Works</span>
          <h2 className="section-title mt-4">Saving a Life Takes Minutes</h2>
          <p className="mt-3 text-ink/60">
            From registration to donation — a simple, guided journey.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="card relative p-7">
              <span className="font-display absolute right-6 top-5 text-5xl font-extrabold text-primary/10">
                {i + 1}
              </span>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                {step.icon}
              </div>
              <h3 className="font-display mt-5 text-lg font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}