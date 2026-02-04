'use client'
import { Lock, Star, Sparkles, ArrowLeft, CheckCircle2, Zap } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { Button } from './button'

interface UpgradePromptProps {
  className?: string
}

export function UpgradePrompt({ className = '' }: UpgradePromptProps) {
  return (
    <div 
      className={`relative bg-white dark:bg-surface-elevated rounded-[2.5rem] p-8 md:p-16 border border-primary/10 dark:border-border-subtle shadow-elevation-3 overflow-hidden ${className}`}
      dir="rtl"
    >
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 dark:bg-amber-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
        {/* Left: Visual Content */}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-amber-500/20 text-primary dark:text-amber-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Zap className="w-4 h-4 fill-current" />
            عرض خاص للمشتركين الجدد
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-text-primary dark:text-text-primary mb-6 leading-tight">
            افتح الإمكانات الكاملة <br />
            <span className="text-primary dark:text-amber-500">لصبا بريميوم</span>
          </h2>
          
          <p className="text-lg text-text-secondary dark:text-text-muted mb-8 leading-relaxed">
            لا تكتفِ بالنتائج الأساسية. احصل على تحليل عميق، تنبيهات حصرية، وقائمة عطور لا تنتهي مخصصة لك وحدك.
          </p>

          <div className="space-y-4 mb-10">
            {[
              "تحليل DNA العطري المتقدم بدقة 99%",
              "تنبيهات فورية عند انخفاض الأسعار في المتاجر",
              "الوصول إلى أكثر من 5000 عطر حصري",
              "دعم فني واستشارات عطرية خاصة"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-safe-green dark:text-green-400" />
                <span className="font-bold text-text-primary dark:text-text-primary">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => signIn()}
              className="px-10 py-7 text-xl shadow-button"
            >
              ابدأ تجربتك المجانية
              <ArrowLeft className="mr-2 w-6 h-6" />
            </Button>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold text-text-primary dark:text-text-primary">فقط 29 ريال / شهر</p>
              <p className="text-xs text-text-secondary dark:text-text-muted text-right">يمكنك الإلغاء في أي وقت</p>
            </div>
          </div>
        </div>

        {/* Right: Feature Cards */}
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <div className="bg-cream-bg dark:bg-surface-muted p-6 rounded-3xl border border-primary/5 dark:border-border-subtle transform hover:-translate-y-2 transition-transform">
            <div className="bg-white dark:bg-surface w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Lock className="w-6 h-6 text-primary dark:text-amber-500" />
            </div>
            <h4 className="font-bold text-text-primary dark:text-text-primary mb-1">محتوى حصري</h4>
            <p className="text-xs text-text-secondary dark:text-text-muted">تقارير مفصلة عن كل عطر</p>
          </div>
          
          <div className="bg-primary/5 dark:bg-amber-500/10 p-6 rounded-3xl border border-primary/10 dark:border-border-subtle transform translate-y-8 hover:-translate-y-2 transition-transform">
            <div className="bg-white dark:bg-surface w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Star className="w-6 h-6 text-primary dark:text-amber-500 fill-current" />
            </div>
            <h4 className="font-bold text-text-primary dark:text-text-primary mb-1">تقييمات الخبراء</h4>
            <p className="text-xs text-text-secondary dark:text-text-muted">آراء حقيقية من خبراء العطور</p>
          </div>

          <div className="bg-white dark:bg-surface p-6 rounded-3xl border border-primary/5 dark:border-border-subtle shadow-elevation-1 transform hover:-translate-y-2 transition-transform">
            <div className="bg-cream-bg dark:bg-surface-muted w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary dark:text-amber-500" />
            </div>
            <h4 className="font-bold text-text-primary dark:text-text-primary mb-1">ذكاء اصطناعي</h4>
            <p className="text-xs text-text-secondary dark:text-text-muted">توصيات تتطور مع ذوقك</p>
          </div>

          <div className="bg-cream-bg dark:bg-surface-muted p-6 rounded-3xl border border-primary/5 dark:border-border-subtle transform translate-y-8 hover:-translate-y-2 transition-transform">
            <div className="bg-white dark:bg-surface w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Zap className="w-6 h-6 text-primary dark:text-amber-500" />
            </div>
            <h4 className="font-bold text-text-primary dark:text-text-primary mb-1">سرعة فائقة</h4>
            <p className="text-xs text-text-secondary dark:text-text-muted">نتائج فورية بدون انتظار</p>
          </div>
        </div>
      </div>
    </div>
  )
}
