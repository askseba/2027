# Quiz Flow Decisions - Ask Seba v1.3

## Step 1: Symptoms → DISABLED (2026-01-05)

**Generated Files:**
- `SymptomCard.tsx` - Component for symptom selection cards
- `symptoms.ts` - Data file with 8 skin condition symptoms
- `/quiz/step1-symptoms` - Page component for symptoms selection

**Reason:** 
لا يخدم منطق Ask Seba (محبوبة → مكروهة → حساسية)

The symptoms flow doesn't align with the core Ask Seba quiz logic which follows:
1. **Favorites** (المحبوبة) - User selects preferred perfumes
2. **Disliked** (المكروهة) - User selects disliked perfumes  
3. **Allergy** (الحساسية) - User specifies allergies and sensitivities

**Status:** 
Preserved in `/quiz/symptoms-archive/` for reference

**Replacement:** 
Step1 Favorites (pending)

---

## Current Quiz Flow

```
Home → Step1 (Favorites) → Step2 (Disliked) → Step3 (Allergy) → Results → Detail
```

**Status:**
- ✅ Step 3 (Allergy) - Implemented
- 🔄 Step 1 (Favorites) - Pending
- 🔄 Step 2 (Disliked) - Pending
