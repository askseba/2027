'use client'

import Link from 'next/link'
import content from '@/content/content.json'
import { ArrowLeft, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const data = content.about

  // استخدام stats مباشرة من content.json
  const stats = data.stats

  return (
    <div dir="rtl" className="min-h-screen bg-cream-bg text-brand-brown">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link 
          href="/profile" 
          className="flex items-center gap-2 text-brand-brown mb-6 hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>الرجوع للملف الشخصي</span>
        </Link>

        {/* Hero Section with Gradient */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 py-16 px-6 rounded-3xl bg-gradient-to-br from-gradient-start to-brand-gold text-white"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            {data.hero.title}
          </h1>
          <p className="text-xl md:text-2xl font-bold mb-8 text-white/90">
            {data.hero.subtitle}
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-gradient-start px-8 py-4 rounded-3xl font-bold hover:bg-white/90 transition-colors shadow-lg"
          >
            {data.hero.cta}
          </Link>
        </motion.section>

        {/* Feature Cards Section - 3 column grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl p-6 border border-brand-brown/20 hover:bg-accent-primary/10 dark:hover:bg-accent-primary/20 transition-colors"
              >
                <div className="text-4xl mb-4">{section.icon}</div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-brand-brown dark:text-text-primary">{section.title}</h2>
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
                <div className="text-4xl md:text-5xl font-bold text-brand-gold mb-3">
                  {stat.number}
                </div>
                <div className="text-lg text-brand-brown font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">ماذا يقول عملاؤنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.testimonials.map((testimonial, index) => (
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
            {data.values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl p-6 border border-brand-brown/20 hover:bg-accent-primary/10 dark:hover:bg-accent-primary/20 transition-colors"
              >
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-brand-brown dark:text-text-primary">{value.title}</h3>
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{data.cta.title}</h2>
          <p className="text-base mb-6">{data.cta.body}</p>
          <Link
            href={data.cta.button_href}
            className="inline-block bg-brand-gold text-white px-8 py-4 rounded-3xl font-bold hover:bg-brand-gold/90 transition-colors shadow-lg"
          >
            {data.cta.button}
          </Link>
        </motion.section>
      </div>
    </div>
  )
}
