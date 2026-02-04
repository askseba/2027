import Link from 'next/link'
import { Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer
      dir="rtl"
      className="bg-white dark:bg-surface border-t border-border-subtle py-6 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        {/* 4 CTA row */}
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-6"
          aria-label="روابط مهمة"
        >
          <Link
            href="/about"
            className="min-touch-target inline-flex items-center text-[#8f6501] hover:text-[#db9b02] transition-colors touch-manipulation"
          >
            قصتنا
          </Link>
          <Link
            href="/faq"
            className="min-touch-target inline-flex items-center text-[#8f6501] hover:text-[#db9b02] transition-colors touch-manipulation"
          >
            تساؤلات
          </Link>
          <Link
            href="/privacy"
            className="min-touch-target inline-flex items-center text-[#8f6501] hover:text-[#db9b02] transition-colors touch-manipulation"
          >
            الخصوصية
          </Link>
          <Link
            href="/feedback"
            className="min-touch-target inline-flex items-center text-[#8f6501] hover:text-[#db9b02] transition-colors touch-manipulation"
          >
            شاركنا رأيك
          </Link>
        </nav>

        {/* Icons row */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <a
            href="mailto:support@askseba.com"
            className="min-touch-target flex items-center justify-center text-[#8f6501] hover:text-[#db9b02] transition-colors touch-manipulation"
            aria-label="تواصل معنا بالبريد الإلكتروني"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="https://instagram.com/askseba"
            target="_blank"
            rel="noopener noreferrer"
            className="min-touch-target flex items-center justify-center text-[#8f6501] hover:text-[#db9b02] transition-colors touch-manipulation"
            aria-label="تابعنا على إنستغرام"
          >
            <Instagram className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="https://twitter.com/askseba"
            target="_blank"
            rel="noopener noreferrer"
            className="min-touch-target flex items-center justify-center text-[#8f6501] hover:text-[#db9b02] transition-colors touch-manipulation"
            aria-label="تابعنا على تويتر"
          >
            <Twitter className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-border-subtle pt-4 text-center">
          <p className="text-[#8f6501] text-sm">
            © {new Date().getFullYear()} Ask Seba. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
