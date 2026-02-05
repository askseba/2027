'use client'

import { Link } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

type SectionItem = {
  id: string
  title: string
  icon: string
  body: string[]
  bullets: string[]
}

type StatItem = { number: string; label: string }
type TestimonialItem = { quote: string; author: string; city: string }
type ValueItem = { title: string; description: string }

export default function AboutPage() {
  const locale = useLocale()
  const t = useTranslations('about')
  const direction = locale === 'ar' ? 'rtl' : 'ltr'

  const sections = t.raw('sections') as SectionItem[]
  const stats = t.raw('stats') as StatItem[]
  const testimonials = t.raw('testimonials') as TestimonialItem[]
  const values = t.raw('values') as ValueItem[]

  return (
    <div dir={direction} className="min-h-screen bg-cream-bg text-brand-brown">
      {/* About page font sizes: PX only, no Tailwind arbitrary – survives Tailwind v4 / cache */}
      <style jsx>{`
        .hero-h1 {
          font-size: 24px !important;
        }
        @media (min-width: 768px) {
          .hero-h1 {
            font-size: 30px !important;
          }
        }
        @media (min-width: 1024px) {
          .hero-h1 {
            font-size: 36px !important;
          }
        }
        .about-subtitle {
          font-size: 18px !important;
        }
        @media (min-width: 768px) {
          .about-subtitle {
            font-size: 20px !important;
          }
        }
        .about-h2 {
          font-size: 24px !important;
        }
        @media (min-width: 768px) {
          .about-h2 {
            font-size: 30px !important;
          }
        }
        @media (min-width: 1024px) {
          .about-h2 {
            font-size: 36px !important;
          }
        }
        .about-stats {
          font-size: 24px !important;
        }
        @media (min-width: 768px) {
          .about-stats {
            font-size: 30px !important;
          }
        }
        .about-h3 {
          font-size: 20px !important;
        }
        @media (min-width: 768px) {
          .about-h3 {
            font-size: 24px !important;
          }
        }
        @media (min-width: 1024px) {
          .about-h3 {
            font-size: 30px !important;
          }
        }
        .about-icon {
          font-size: 24px !important;
        }
      `}</style>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/profile"
          className="flex items-center gap-2 text-brand-brown mb-6 hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('backToProfile')}</span>
        </Link>

        {/* Hero Section with Gradient */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 py-16 px-6 rounded-3xl bg-gradient-to-br from-gradient-start to-brand-gold text-white"
        >
          <h1 className="hero-h1 font-bold mb-4 text-white">
            {t('hero.title')}
          </h1>
          <p className="about-subtitle font-bold mb-8 text-white/90">
            {t('hero.subtitle')}
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-gradient-start px-8 py-4 rounded-3xl font-bold hover:bg-white/90 transition-colors shadow-lg"
          >
            {t('hero.cta')}
          </Link>
        </motion.section>

        {/* Feature Cards Section - 3 column grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl p-6 border border-brand-brown/20 hover:bg-accent-primary/10 dark:hover:bg-accent-primary/20 transition-colors"
              >
                <div className="about-icon mb-4">{section.icon}</div>
                <h2 className="about-h2 font-bold mb-4 text-brand-brown dark:text-text-primary">{section.title}</h2>
                {section.body.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="text-base text-brand-brown dark:text-text-primary">{paragraph}</p>
                    ))}
                  </div>
                )}
                {section.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-base text-brand-brown dark:text-text-primary">
                    {section.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section - 3 cards animated */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl p-8 border border-brand-brown/20 text-center hover:shadow-xl transition-shadow"
              >
                <div className="about-stats font-bold text-brand-gold mb-3">
                  {stat.number}
                </div>
                <div className="text-base text-brand-brown font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="about-h2 font-bold mb-8 text-center">{t('testimonialsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl p-6 border border-brand-brown/20 dark:border-[var(--color-text-primary)]/20 hover:bg-accent-primary/10 dark:hover:bg-accent-primary/20 transition-colors relative"
              >
                <Quote className="w-8 h-8 text-brand-gold dark:text-accent-primary mb-4" aria-hidden />
                <p className="text-base mb-4 text-brand-brown dark:text-text-primary">{testimonial.quote}</p>
                <div className="text-sm font-bold text-brand-brown dark:text-text-primary">
                  {testimonial.author} - {testimonial.city}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl p-6 border border-brand-brown/20 hover:bg-accent-primary/10 dark:hover:bg-accent-primary/20 transition-colors"
              >
                <h3 className="about-h3 font-bold mb-2 text-brand-brown dark:text-text-primary">{value.title}</h3>
                <p className="text-base text-brand-brown/80 dark:text-text-muted">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl p-8 border border-brand-brown/20 text-center"
        >
          <h2 className="about-h2 font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-base mb-6">{t('cta.body')}</p>
          <Link
            href={t('cta.button_href')}
            className="inline-block bg-brand-gold text-white px-8 py-4 rounded-3xl font-bold hover:bg-brand-gold/90 transition-colors shadow-lg"
          >
            {t('cta.button')}
          </Link>
        </motion.section>
      </div>
    </div>
  )
}
