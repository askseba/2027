import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4"
    >
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <AlertTriangle className="w-20 h-20 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-brown-text mb-4">
          الصفحة غير موجودة
        </h1>

        {/* Description */}
        <p className="text-brown-text/70 mb-8 text-lg leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم حذفها.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 mb-8">
          <Button asChild variant="primary" size="lg" className="w-full">
            <Link href="/">العودة للرئيسية</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/quiz/step1-favorites">تصفح العطور</Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-6 border-t border-brown-text/10">
          <p className="text-sm text-brown-text/60 mb-4">روابط سريعة:</p>
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <Link
              href="/"
              className="text-sm text-brown-text/60 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              الرئيسية
            </Link>
            <span className="text-brown-text/40">•</span>
            <Link
              href="/quiz/step1-favorites"
              className="text-sm text-brown-text/60 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              الاختبار
            </Link>
            <span className="text-brown-text/40">•</span>
            <Link
              href="/dashboard"
              className="text-sm text-brown-text/60 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              المفضلة
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
