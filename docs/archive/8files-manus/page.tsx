import { HeroSection } from '@/components/landing/HeroSection';
import { QuestionsSection } from '@/components/landing/QuestionsSection';
import { CTASection } from '@/components/landing/CTASection';
import { StatsSection } from '@/components/landing/StatsSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { HeadlineSection } from '@/components/landing/HeadlineSection';
import { ValuePropSection } from '@/components/landing/ValuePropSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* HeroSection يحتوي على الشعار في الأعلى كما في التصميم الأصلي */}
      <HeroSection /> 
      
      {/* الأقسام الجديدة بالترتيب الصحيح */}
      <QuestionsSection />
      <HeadlineSection />
      <CTASection />
      <StatsSection />
      <ValuePropSection />
      <BenefitsSection />
    </main>
  );
}
