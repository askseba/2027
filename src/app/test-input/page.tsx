'use client'

import { Input } from '@/components/ui/input'
import { Search, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function TestInputPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('البريد الإلكتروني مطلوب')
    } else if (!value.includes('@')) {
      setEmailError('البريد الإلكتروني غير صحيح')
    } else {
      setEmailError('')
    }
  }

  return (
    <div className="min-h-screen bg-cream-bg p-8" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-brown-text mb-2">
            اختبار Input Component
          </h1>
          <p className="text-brown-text/70">
            جميع أشكال حقول الإدخال الموحدة
          </p>
        </div>

        {/* Basic Input */}
        <div>
          <h2 className="text-xl font-bold text-brown-text mb-4">Basic Input</h2>
          <Input
            label="الاسم الكامل"
            placeholder="أدخل اسمك الكامل"
            helperText="يُستخدم في الشهادة"
          />
        </div>

        {/* With Start Icon */}
        <div>
          <h2 className="text-xl font-bold text-brown-text mb-4">With Icon</h2>
          <Input
            label="البحث"
            type="search"
            placeholder="ابحث عن عطر..."
            startIcon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* With Error */}
        <div>
          <h2 className="text-xl font-bold text-brown-text mb-4">With Error</h2>
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              validateEmail(e.target.value)
            }}
            onBlur={(e) => validateEmail(e.target.value)}
            error={emailError}
            startIcon={<Mail className="w-5 h-5" />}
            endIcon={emailError ? <AlertCircle className="w-5 h-5 text-red-500" /> : null}
          />
        </div>

        {/* Password */}
        <div>
          <h2 className="text-xl font-bold text-brown-text mb-4">Password</h2>
          <Input
            label="كلمة المرور"
            type="password"
            helperText="يجب أن تكون 8 أحرف على الأقل"
            startIcon={<Lock className="w-5 h-5" />}
          />
        </div>

        {/* Disabled */}
        <div>
          <h2 className="text-xl font-bold text-brown-text mb-4">Disabled</h2>
          <Input
            label="حقل معطل"
            disabled
            value="لا يمكن التعديل"
            startIcon={<User className="w-5 h-5" />}
          />
        </div>

        {/* Loading State */}
        <div>
          <h2 className="text-xl font-bold text-brown-text mb-4">Loading State</h2>
          <Input
            label="جاري التحميل..."
            placeholder="البحث..."
            startIcon={<Search className="w-5 h-5" />}
            endIcon={
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
            }
          />
        </div>
      </div>
    </div>
  )
}
