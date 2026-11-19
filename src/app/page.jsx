import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import HowItWorks from '@/components/HowItWorks';
import CompatibilityTable from '@/components/CompatibilityTable';
import DownloadCTA from '@/components/DownloadCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsSection />
      <HowItWorks />
      <CompatibilityTable />
      <DownloadCTA />
    </main>
  );
}