export interface Content {
  common: {
    next: string
    back: string
    skip: string
    cancel: string
    save: string
    delete: string
    loading: string
    error: string
    retry: string
    upgrade: string
    goBack: string
    clearAll: string
    add: string
    remove: string
    refresh: string
    updating: string
    resetFilters: string
    dashboard: string
    previous: string
  }
  quiz: {
    title: string
    subtitle: string
    startButton: string
    step1: {
      title: string
      description: string
      minError: string
      maxError: string
      placeholder: string
      helperText: string
      emptyStateTitle: string
      emptyStateDescription: string
      selectedTitle: string
      favoritesLabel: string
      addMoreText: string
      maxWarning: string
      helpText: string
      searchResults: string
      noResults: string
      confirmClear: string
      ariaLabel: string
      searchTimeout: string
      searchRateLimit: string
      searchError: string
    }
    step2: {
      title: string
      description: string
      placeholder: string
      dislikedLabel: string
      addMoreText: string
      selectedTitle: string
      searchResults: string
      noResults: string
      emptyStateTitle: string
      emptyStateDescription: string
      skipButton: string
      skipDescription: string
      dataError: string
    }
    step3: {
      title: string
      description: string
      level1Question: string
      level2Question: string
      level3Question: string
      level3Description: string
      level1Title: string
      level2Title: string
      level3Title: string
      saveButton: string
      transitioning: string
    }
  }
  results: {
    title: string
    noResults: string
    loading: string
    loadingDescription: string
    customResults: string
    allResults: string
    refresh: string
    shareTitle: string
    shareText: string
    sortMatch: string
    sortRating: string
    sortLabel: string
    matchPercentageLabel: string
    familiesLabel: string
    scoreBreakdownTitle: string
    scoreBreakdownTaste: string
    scoreBreakdownSafety: string
    emptyStateTitle: string
    emptyStateDescription: string
    searchPlaceholder: string
    paginationPrevious: string
    paginationNext: string
  }
  errors: {
    networkError: string
    serverError: string
    validationError: string
    dataError: string
    loadError: string
    invalidResponse: string
  }
}

export const content: Content = {
  common: {
    next: 'التالي',
    back: 'السابق',
    skip: 'تخطي',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    retry: 'إعادة المحاولة',
    upgrade: 'ترقية إلى بريميوم',
    goBack: 'رجوع',
    clearAll: 'مسح الكل',
    add: 'إضافة',
    remove: 'إزالة',
    refresh: 'تحديث',
    updating: 'جاري التحديث...',
    resetFilters: 'إعادة تعيين الفلاتر',
    dashboard: 'لوحة التحكم',
    previous: 'السابق'
  },
  quiz: {
    title: 'بصمتك العطرية',
    subtitle: 'اكتشف العطور المثالية لك من خلال اختبار بسيط',
    startButton: 'ابدأ الاختبار',
    step1: {
      title: 'عطور تعجبني 🧡',
      description: 'اختر 3-12 عطراً من المفضّلات لديك',
      minError: 'يجب اختيار 3 عطور على الأقل',
      maxError: 'تم الوصول للحد الأقصى (12)',
      placeholder: 'اكتب اسم عطر للبدء...',
      helperText: 'ابحث عن العطور بالاسم أو الماركة. ستظهر لك أفضل النتائج.',
      emptyStateTitle: 'اكتب اسم عطر للبدء...',
      emptyStateDescription: 'ابحث عن عطورك المفضلة بالاسم أو الماركة',
      selectedTitle: 'العطور المختارة',
      favoritesLabel: 'المفضلة',
      addMoreText: 'عطراً إضافياً على الأقل',
      maxWarning: 'الحد الأقصى 12 عطراً!',
      helpText: '💡 كلما اخترت عطور أكثر، كانت التوصيات أدق وأكثر تناسباً مع ذوقك',
      searchResults: 'نتيجة',
      noResults: 'لا توجد نتائج مطابقة لـ',
      confirmClear: 'هل أنت متأكد من حذف جميع العطور المختارة؟',
      ariaLabel: 'ابحث عن عطر مفضل',
      searchTimeout: 'انتهت مهلة البحث (10 ثوانٍ). الرجاء المحاولة مرة أخرى.',
      searchRateLimit: 'تم تجاوز حد البحث. انتظر قليلاً ثم حاول مرة أخرى.',
      searchError: 'حدث خطأ في البحث. الرجاء المحاولة مرة أخرى.'
    },
    step2: {
      title: '❌ العطور التي لا تعجبني',
      description: 'اختر 3-12 عطور لا تعجبك',
      placeholder: 'ابحث عن عطر...',
      dislikedLabel: 'غير المفضلة',
      addMoreText: 'عطراً إضافياً على الأقل',
      selectedTitle: 'العطور المختارة',
      searchResults: 'نتائج البحث',
      noResults: 'لا توجد نتائج مطابقة لبحثك',
      emptyStateTitle: 'ابدأ البحث عن عطرك المفضل',
      emptyStateDescription: 'اكتب اسم العطر أو الماركة مثل: Dior، Chanel، Oud، Jasmine',
      skipButton: '💡 تخطي هذه الخطوة',
      skipDescription: 'يمكنك تخطي هذه الخطوة إذا لم تكن هناك عطور تكرهها',
      dataError: 'بيانات العطور غير متاحة'
    },
    step3: {
      title: '3',
      description: 'اختر الأعراض التي تعاني منها',
      level1Question: 'هل سبق وسبب لك عطر أي من هذه الأعراض؟',
      level2Question: 'من أي نوع عطور تزعجك؟',
      level3Question: 'ما هي المكونات التي تسبب لك حساسية؟',
      level3Description: 'اختر المكونات التي تعرف أنها تزعجك',
      level1Title: '1. الأعراض',
      level2Title: '2. العائلات',
      level3Title: '3. المكونات',
      saveButton: 'حفظ بصمتي',
      transitioning: 'جاري الانتقال...'
    }
  },
  results: {
    title: 'نتائج التوافق',
    noResults: 'لا توجد نتائج',
    loading: 'جاري حساب التوافق...',
    loadingDescription: 'نحلل تفضيلاتك للحصول على أفضل النتائج',
    customResults: 'عطور مخصصة لك بناءً على تفضيلاتك',
    allResults: 'جميع العطور المتاحة',
    refresh: 'تحديث',
    shareTitle: 'نتائج بحث صبا',
    shareText: 'اكتشفت',
    sortMatch: 'الأعلى تطابقاً',
    sortRating: 'الأعلى تقييماً',
    sortLabel: 'الترتيب',
    matchPercentageLabel: 'نسبة التطابق',
    familiesLabel: 'العائلة العطرية',
    scoreBreakdownTitle: 'كيف يُحسب التوافق؟',
    scoreBreakdownTaste: 'الذوق العطري',
    scoreBreakdownSafety: 'عامل الأمان',
    emptyStateTitle: 'لا توجد نتائج',
    emptyStateDescription: 'حاول تعديل الفلاتر أو كلمات البحث',
    searchPlaceholder: 'ابحث عن عطر...',
    paginationPrevious: 'السابق',
    paginationNext: 'التالي'
  },
  errors: {
    networkError: 'مشكلة في الاتصال بالإنترنت',
    serverError: 'خطأ في الخادم',
    validationError: 'بيانات غير صحيحة',
    dataError: 'بيانات العطور غير متاحة',
    loadError: 'حدث خطأ أثناء تحميل النتائج',
    invalidResponse: 'استجابة غير صحيحة من الخادم'
  }
}

export default content
