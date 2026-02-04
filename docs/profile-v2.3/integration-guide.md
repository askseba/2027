# دليل دمج ملفات الملف الشخصي (Profile V2.3) 🚀

بناءً على تقرير التدقيق من Cursor، إليك الخطوات اللازمة لضمان عمل الملفات الجديدة بشكل مثالي مع مشروعك الحالي:

## 1. تحديث إعدادات المصادقة (Auth Configuration)
بما أن المشروع يستخدم **JWT-only strategy**، يجب تحديث `src/auth.ts` لضمان انتقال بيانات `bio` و `image` إلى الجلسة:

```typescript
// src/auth.ts
callbacks: {
  async jwt({ token, user, trigger, session }) {
    if (user) {
      token.id = user.id;
      token.bio = user.bio;
    }
    // تحديث التوكن عند استخدام update() من الواجهة
    if (trigger === "update" && session) {
      token.bio = session.bio || token.bio;
      token.image = session.image || token.image;
    }
    return token;
  },
  async session({ session, token }) {
    if (token && session.user) {
      session.user.id = token.id as string;
      session.user.bio = token.bio as string;
      session.user.image = token.image as string;
    }
    return session;
  }
}
```

## 2. المتطلبات والتبعيات (Dependencies)
يجب تثبيت المكتبات التالية لضمان عمل الرفع:
```bash
npm install @vercel/blob uuid
# أو
pnpm add @vercel/blob uuid
```

## 3. متغيرات البيئة (Environment Variables)
تأكد من إضافة المفتاح التالي في ملف `.env.local`:
```env
BLOB_READ_WRITE_TOKEN=your_token_here
```

## 4. هيكلة الملفات المقترحة
لضمان توافق المسارات في الكود:
- ضع `page.tsx` في: `src/app/profile/page.tsx`
- ضع `route.ts` في: `src/app/api/avatar/route.ts`

## 5. ملاحظات التوافق
- **Theme**: تم التأكد من استخدام الألوان المكتشفة (`cream`, `brown`, `primary`).
- **RTL**: الكود يدعم العربية والاتجاه من اليمين لليسار بشكل كامل.
- **Optimistic UI**: ميزة تحديث الـ Bio تعمل محلياً فوراً لتعويض تأخير الـ JWT.
