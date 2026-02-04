import Link from 'next/link'
import { Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer
      dir="rtl"
      className="bg-white dark:bg-slate-900/50 border-t border-border-subtle dark:border-slate-700/50 py-6 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        {/* 4 CTA row – light: accent, dark: amber explicit for contrast >4.5:1 */}
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-6"
          aria-label="روابط مهمة"
        >
          <Link
            href="/about"
            className="!flex !items-center !justify-center !min-h-[44px] !min-w-[44px] !transition-colors !text-[rgb(var(--color-accent-primary))] hover:!text-[rgb(var(--color-accent-primary))] touch-manipulation"
          >
            قصتنا
          </Link>
          <Link
            href="/faq"
            className="!flex !items-center !justify-center !min-h-[44px] !min-w-[44px] !transition-colors !text-[rgb(var(--color-accent-primary))] hover:!text-[rgb(var(--color-accent-primary))] touch-manipulation"
          >
            تساؤلات
          </Link>
          <Link
            href="/privacy"
            className="!flex !items-center !justify-center !min-h-[44px] !min-w-[44px] !transition-colors !text-[rgb(var(--color-accent-primary))] hover:!text-[rgb(var(--color-accent-primary))] touch-manipulation"
          >
            الخصوصية
          </Link>
          <Link
            href="/feedback"
            className="!flex !items-center !justify-center !min-h-[44px] !min-w-[44px] !transition-colors !text-[rgb(var(--color-accent-primary))] hover:!text-[rgb(var(--color-accent-primary))] touch-manipulation"
          >
            شاركنا رأيك
          </Link>
        </nav>

        {/* Icons row – dark:fill-amber-300 */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <a
            href="mailto:support@askseba.com"
            className="!flex !items-center !justify-center !min-h-[44px] !min-w-[44px] !transition-colors !text-[rgb(var(--color-accent-primary))] hover:!text-[rgb(var(--color-accent-primary))] [&_svg]:dark:!fill-amber-200 touch-manipulation"
            aria-label="تواصل معنا بالبريد الإلكتروني"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="https://instagram.com/askseba"
            target="_blank"
            rel="noopener noreferrer"
            className="!flex !items-center !justify-center !min-h-[44px] !min-w-[44px] !transition-colors !text-[rgb(var(--color-accent-primary))] hover:!text-[rgb(var(--color-accent-primary))] [&_svg]:dark:!fill-amber-200 touch-manipulation"
            aria-label="تابعنا على إنستغرام"
          >
            <Instagram className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="https://twitter.com/askseba"
            target="_blank"
            rel="noopener noreferrer"
            className="!flex !items-center !justify-center !min-h-[44px] !min-w-[44px] !transition-colors !text-[rgb(var(--color-accent-primary))] hover:!text-[rgb(var(--color-accent-primary))] [&_svg]:dark:!fill-amber-200 touch-manipulation"
            aria-label="تابعنا على تويتر"
          >
            <Twitter className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>

        {/* Copyright – dark:text-slate-400 */}
        <div className="!border-t !border-slate-200 dark:!border-slate-800 pt-4 text-center">
          <p className="!text-[rgb(var(--color-accent-primary))] text-sm">
            © {new Date().getFullYear()} Ask Seba. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
