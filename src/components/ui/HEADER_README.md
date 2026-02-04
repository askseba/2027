# Header Component - Ask Seba PWA

## 📍 الموقع
`src/components/ui/header.tsx`

## 🎯 البنية
```
[🔔 Notifications] [❤️ Favorites] [👤 Account Hub]
```

## ✨ المميزات

### 1. زر الإشعارات (🔔)
- **للزوار**: تحويل إلى `/login?callbackUrl=/notifications`
- **للمسجلين**: تحويل إلى `/notifications`
- **مؤشر**: نقطة حمراء تظهر للمستخدمين المسجلين

### 2. زر المفضلة (❤️)
- **للزوار**: تحويل إلى `/login?callbackUrl=/dashboard`
- **للمسجلين**: تحويل إلى `/dashboard`
- **تلوين ديناميكي**: قلب ممتلئ بالأحمر عند وجود مفضلات
- **مؤشر**: نقطة ذهبية عند وجود مفضلات

### 3. Account Hub (👤)
**للزوار:**
- الدخول → `/login`
- التسجيل → `/register`

**للمسجلين:**
- الملف الشخصي → `/profile`
- تسجيل الخروج → `signOut({ callbackUrl: '/' })`

## 📦 التبعيات

```json
{
  "next-auth": "^5.0.0-beta.30",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-avatar": "latest",
  "lucide-react": "^0.562.0"
}
```

## 🔧 الاستخدام

### في app/(main)/layout.tsx:

```tsx
import Header from "@/components/ui/header"

export default function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  )
}
```

### أو في ConditionalLayout.tsx:

```tsx
import Header from "@/components/ui/header"
import { Footer } from "@/components/Footer"

export function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? '' : 'flex-1'}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}
```

## 🎨 التخصيص

### تغيير الألوان:
تعديل في `tailwind.config.ts`:
```ts
colors: {
  primary: "hsl(var(--primary))",
  background: "hsl(var(--background))",
  // ...
}
```

### تغيير الارتفاع:
تعديل `h-14` في السطر 51 من `header.tsx`

### إضافة شعار:
```tsx
<div className="flex-1">
  <Link href="/">
    <span className="font-bold text-xl">Ask Seba</span>
  </Link>
</div>
```

## ⚙️ المتطلبات التقنية

✅ Next.js 15.0.0+ App Router  
✅ shadcn/ui + Tailwind CSS v3.4+  
✅ dir="rtl" Arabic support  
✅ useSession() من next-auth/react  
✅ useRouter() من next/navigation  
✅ Avatar مع fallback "👤"  
✅ Mobile-first responsive  
✅ Hover: scale-105 transition-all 0.2s  
✅ Fixed height: h-14 bg-background/95 backdrop-blur  

## 📱 Responsive Design

- **Mobile**: أزرار مدمجة (gap-2)
- **Desktop**: مسافات أوسع (gap-3)
- **Touch targets**: min-h-[44px] لسهولة النقر

## 🔐 حماية Auth

جميع الأزرار محمية:
- التحقق من `status === 'authenticated'`
- تعطيل الأزرار أثناء `status === 'loading'`
- Redirect للزوار مع `callbackUrl`

## 🎯 Accessibility

- `aria-label` لكل زر
- دعم لوحة المفاتيح كامل
- Hover states واضحة
- Focus indicators مرئية

## 📝 Notes

- Header مُثبّت في الأعلى (sticky top-0)
- خلفية شفافة مع backdrop-blur
- RTL support كامل
- لا يحتوي على SearchBar أو Logo (حسب المواصفات)
