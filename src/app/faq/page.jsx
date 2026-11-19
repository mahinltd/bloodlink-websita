import FaqAccordion from '@/components/FaqAccordion';
import Link from 'next/link';

export const metadata = {
  title: 'FAQ — Blood Donation Questions',
  description:
    'How to become a blood donor in Bangladesh? Is BloodLink free? 90-day rule, SOS requests, NID verification — all answered.',
  keywords: ['blood donation faq', 'কীভাবে রক্ত দেব', 'blood donor rules bangladesh'],
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions | BloodLink',
    description: 'Everything about blood donation in Bangladesh.',
    url: '/faq',
  },
};

const FAQS = [
  {
    q: 'BloodLink কী?',
    a: 'BloodLink হলো বাংলাদেশের একটি স্বেচ্ছামূলক, অলাভজনক রক্তদান প্ল্যাটফর্ম। আমরা রক্তদাতা ও রোগীর মধ্যে সরাসরি সংযোগ ঘটাই — smart matching, SOS alert এবং real-time chat-এর মাধ্যমে।',
  },
  {
    q: 'এখানে কি রক্ত কেনা-বেচা হয়?',
    a: 'একদমই না। BloodLink-এ রক্ত কেনাবেচা কঠোরভাবে নিষিদ্ধ। কেউ টাকার বিনিময়ে রক্ত চাইলে অ্যাপের Report ফিচার দিয়ে রিপোর্ট করুন — অভিযুক্ত ব্যবহারকারীকে স্থায়ীভাবে ban করা হয়।',
  },
  {
    q: 'কীভাবে রক্তদাতা হবো?',
    a: 'BloodLink Android অ্যাপ ডাউনলোড করুন, Donor হিসেবে register করুন (বয়স ১৮–৬৫, ওজন ন্যূনতম ৫০ কেজি প্রত্যাশিত)। আপনার blood group ও location অনুযায়ী কাছাকাছি রোগীর request পেলে notification যাবে।',
  },
  {
    q: 'কতদিন পরপর রক্ত দেওয়া যায়?',
    a: 'স্বাস্থ্যগত নিরাপত্তার জন্য দুইবার রক্তদানের মধ্যে ন্যূনতম ৯০ দিন ব্যবধান রাখা বাধ্যতামূলক। অ্যাপ স্বয়ংক্রিয়ভাবে আপনার পরবর্তী eligibility date হিসাব করে।',
  },
  {
    q: 'SOS request কী?',
    a: 'SOS হলো সবচেয়ে জরুরি ধরনের রক্তের অনুরোধ (৩ ঘণ্টার মধ্যে প্রয়োজন)। SOS request আশেপাশের সব compatible donor-এর কাছে সর্বোচ্চ অগ্রাধিকারে push notification পাঠায়।',
  },
  {
    q: 'NID verification কেন?',
    a: 'নিরাপত্তার জন্য। NID-verified donor-রা verified badge পান, যা requester-দের আস্থা দেয়। আপনার NID-এর ছবি verification-এর পর সার্ভার থেকে স্থায়ীভাবে মুছে ফেলা হয়।',
  },
  {
    q: 'অ্যাপটি কি ফ্রি?',
    a: 'হ্যাঁ, সম্পূর্ণ ফ্রি — চিরকালের জন্য। কোনো বিজ্ঞাপন, সাবস্ক্রিপশন বা লুকানো চার্জ নেই।',
  },
  {
    q: 'আমার ব্যক্তিগত তথ্য কি নিরাপদ?',
    a: 'আপনার ফোন নম্বর শুধু তখনই দেখা যায় যখন আপনি available থাকেন এবং কোনো request-এ সাড়া দেন। আমরা কারো তথ্য বিক্রি করি না।',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="bg-gradient-to-b from-cream to-white">
        <div className="container-x py-16 text-center sm:py-20">
          <span className="eyebrow">❓ FAQ</span>
          <h1 className="section-title mt-4">Frequently Asked Questions</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/60">
            Everything you need to know about BloodLink.
          </p>
        </div>
      </section>

      <section className="container-x pb-20">
        <FaqAccordion items={FAQS} />
        <p className="mt-10 text-center text-sm text-ink/50">
          আরও প্রশ্ন আছে?{' '}
          <Link href="/contact" className="font-semibold text-primary hover:underline">
            Contact us →
          </Link>
        </p>
      </section>
    </main>
  );
}