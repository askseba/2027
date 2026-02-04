# 🚀 Ask Seba Feedback V2.3 - Installation Guide

## 📦 Step 1: Install Dependencies (2 minutes)

```bash
# Install required packages
npm install sonner framer-motion lucide-react

# If @radix-ui/react-tooltip not installed:
npm install @radix-ui/react-tooltip
```

---

## 🗂️ Step 2: File Structure

Create these files in your project:

```
src/
├── app/
│   ├── api/
│   │   └── feedback/
│   │       └── suggestions/
│   │           ├── route.ts                    ✅ NEW PATH
│   │           └── [id]/
│   │               └── vote/
│   │                   └── route.ts            ✅ NEW PATH
│   ├── feedback/
│   │   └── page.tsx                            ✅ UPDATED
│   └── layout.tsx                              ✅ ADD TOASTER
├── components/
│   ├── FeedbackCard.tsx                        ✅ UPDATED
│   ├── FeedbackModal.tsx                       (existing)
│   └── AdminModal.tsx                          ✅ UPDATED
└── components/ui/
    └── tooltip.tsx                             ✅ Check if exists
```

---

## 🔧 Step 3: Setup Tooltip Component (if missing)

If `@/components/ui/tooltip` doesn't exist, create it:

```bash
npx shadcn-ui@latest add tooltip
```

Or manually create `src/components/ui/tooltip.tsx`:

```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

---

## 🗄️ Step 4: Verify Prisma Schema
Ensure your `prisma/schema.prisma` has `publicStatus` field:

```prisma
model Suggestion {
  id           String   @id @default(cuid())
  title        String
  description  String   @db.Text
  category     String
  status       String   @default("pending")
  publicStatus String?  // ← CRITICAL: Must exist
  userId       String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user  User   @relation(fields: [userId], references: [id])
  votes Vote[]

  @@index([status])
  @@index([userId])
}
```

If missing, add it and run:

```bash
npx prisma migrate dev --name add_public_status
npx prisma generate
```

---

## ✅ Step 5: Copy Files

Copy the content from artifacts into your project:

1. ✅ `src/app/feedback/page.tsx` → **Artifact #1**
2. ✅ `src/components/FeedbackCard.tsx` → **Artifact #2**
3. ✅ `src/app/api/feedback/suggestions/route.ts` → **Artifact #3**
4. ✅ `src/app/api/feedback/suggestions/[id]/vote/route.ts` → **Artifact #4**
5. ✅ `src/components/AdminModal.tsx` → **Artifact #5**
6. ✅ `src/app/layout.tsx` → **Artifact #6** (add Toaster only)

---

## 🧪 Step 6: Test Locally

```bash
npm run dev
```

Navigate to: `http://localhost:3000/feedback`

---

## 🎯 Step 7: Testing Checklist

### ✅ Visual Tests

1. **Header**
   - [ ] "ساعدنا نكون أفضل لأجلك" appears
   - [ ] Done count shows: "بفضلكم.. X فكرة منكم أصبحت واقعاً!"
   - [ ] "وش ناقصنا؟ 💡" button exists
   - [ ] Admin button shows tooltip on hover (if admin)

2. **Suggestions List**
   - [ ] First suggestion has 🔥 "الأكثر طلباً" badge (if votes > 0)
   - [ ] Status badges show correctly:
     - ✅ "تم الإنجاز"
     - 🛠️ "شغالين عليها حالياً"
     - 🚀 "قادمة قريباً"
     - ⏳ "قيد المراجعة"
   - [ ] Your in_progress suggestion shows ✨ "فكرتك تحت التنفيذ"
   - [ ] Vote count shows "X مهتم"

3. **Vote Button**
   - [ ] Click vote → Toast appears: "تسلم! صوتك وصل وبيصنع فرق ❤️"
   - [ ] Button changes to "أتفق 👍"
   - [ ] Vote count increases by 1
   - [ ] Click again → vote removes (toggles)

4. **Admin Panel** (if admin)
   - [ ] Shows pending suggestions count
   - [ ] Approve → removes from list + success toast
   - [ ] Reject → removes from list + success toast

### ✅ Functional Tests
```bash
# 1. Test API endpoint
curl http://localhost:3000/api/feedback/suggestions \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Expected response:
{
  "suggestions": [...],
  "doneCount": 0
}

# 2. Test vote endpoint
curl -X POST http://localhost:3000/api/feedback/suggestions/SUGGESTION_ID/vote \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Expected response:
{
  "votes": 1,
  "hasVoted": true
}
```

### ✅ Database Tests

Open Prisma Studio and verify:

```bash
npx prisma studio
```

1. Check `Suggestion` table has `publicStatus` column
2. Create test suggestion → status should be `pending`
3. Vote on suggestion → check `Vote` table for entry
4. Approve suggestion → status should change to `approved`

---

## 🎨 Step 8: Seed Test Data (Optional)

Create test suggestions with different statuses:

```typescript
// prisma/seed.ts
const suggestions = await prisma.suggestion.createMany({
  data: [
    {
      title: 'فلتر عائلات عطرية',
      description: 'إضافة فلتر للبحث حسب العائلة العطرية',
      category: 'quiz',
      status: 'approved',
      publicStatus: 'planned',
      userId: adminId,
    },
    {
      title: 'تحسين الخوارزمية',
      description: 'خوارزمية محسّنة للتطابق',
      category: 'matching',
      status: 'approved',
      publicStatus: 'in_progress',
      userId: adminId,
    },
    {
      title: 'فلتر الأمان',
      description: 'استبعاد المكونات الخطرة',
      category: 'safety',
      status: 'approved',
      publicStatus: 'done',
      userId: adminId,
    },
  ],
})

// Add votes to first suggestion
await prisma.vote.create({
  data: {
    suggestionId: suggestions[0].id,
    userId: testUserId,
  },
})
```

Run seed:

```bash
npx prisma db seed
```

---

## 🚀 Step 9: Deploy to Production
```bash
# 1. Push to GitHub
git add .
git commit -m "feat: Add Feedback V2.3 with done count and highlights"
git push

# 2. Deploy to Vercel
vercel --prod

# 3. Run migrations
npx prisma migrate deploy
```

---

## 🔍 Troubleshooting

### Issue 1: "Module not found: Can't resolve 'sonner'"

```bash
npm install sonner
```

### Issue 2: "Property 'publicStatus' does not exist"

```bash
npx prisma migrate dev --name add_public_status
npx prisma generate
```

### Issue 3: Toast not appearing

Check `layout.tsx` has `<Toaster />` component

### Issue 4: Tooltip not working

```bash
npx shadcn-ui@latest add tooltip
```

### Issue 5: Icons not found

```bash
npm install lucide-react
```

### Issue 6: "isMine is not a function"

Verify API returns `isMine` field in response

---

## ✅ Success Checklist

Before marking as complete:

- [ ] All dependencies installed
- [ ] `publicStatus` field exists in schema
- [ ] API path is `/api/feedback/suggestions`
- [ ] Toaster appears in layout
- [ ] Vote toast shows success message
- [ ] Done count displays in header
- [ ] Top voted badge appears
- [ ] My suggestion highlight works
- [ ] Admin panel functions correctly
- [ ] Mobile responsive (test on phone)

---

## 🎯 Final Result

You should see:

```
┌─────────────────────────────────────────────┐
│ ساعدنا نكون أفضل لأجلك                   │
│ بفضلكم.. 1 فكرة منكم أصبحت واقعاً! 🏆    │
│ [وش ناقصنا؟ 💡] 👤 Admin [📋]             │
├─────────────────────────────────────────────┤
│ 🔥 الأكثر طلباً [قادمة قريباً 🚀] ↑24 مهتم│
│ "فلتر عائلات في البحث..."                │
│ [أتفق 👍]                                 │
├─────────────────────────────────────────────┤
│ 🏷️ Matching [شغالين عليها 🛠️] ↑15 مهتم   │
│ "خوارزمية محسّنة..."                     │
│ ✨ فكرتك تحت التنفيذ، شكراً لمشاركتنا!   │
│ [أتفق 👍]                                 │
└─────────────────────────────────────────────┘
```

**🎉 Ready for production!**