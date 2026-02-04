// EU Regulation 2023/1545 - IFRA 51st Amendment
// Complete list of fragrance allergens and restricted materials
// Reference: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1545

export interface EUAllergen {
  name: string
  nameAr: string
  casNumber: string
  maxConcentration: number // in percent
  category: 'allergen' | 'sensitizer' | 'restricted'
  symptoms: string[] // List of potential symptoms
  description?: string
}

// القائمة الكاملة لـ 81 مادة مسببة للحساسية
export const euAllergens: EUAllergen[] = [
  { name: "Linalool", nameAr: "لينالول", casNumber: "78-70-6", maxConcentration: 1.2, category: "allergen", symptoms: ["headache", "skin_allergy"] },
  { name: "Limonene", nameAr: "ليمونين", casNumber: "138-86-3", maxConcentration: 2.5, category: "allergen", symptoms: ["redness", "itching"] },
  { name: "Citral", nameAr: "سيترال", casNumber: "5392-40-5", maxConcentration: 0.6, category: "allergen", symptoms: ["irritation", "skin_allergy"] },
  { name: "Geraniol", nameAr: "جيرانيول", casNumber: "106-24-1", maxConcentration: 1.8, category: "allergen", symptoms: ["redness", "headache"] },
  { name: "Benzyl Alcohol", nameAr: "كحول بنزيلي", casNumber: "100-51-6", maxConcentration: 1.0, category: "allergen", symptoms: ["irritation"] },
  { name: "Cinnamal", nameAr: "سينامال", casNumber: "104-55-2", maxConcentration: 0.05, category: "sensitizer", symptoms: ["burning_sensation", "swelling"] },
  { name: "Eugenol", nameAr: "يوجينول", casNumber: "97-53-0", maxConcentration: 0.5, category: "allergen", symptoms: ["redness", "itching"] },
  { name: "Coumarin", nameAr: "كومارين", casNumber: "91-64-5", maxConcentration: 1.5, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Citronellol", nameAr: "سيترونيلول", casNumber: "106-22-9", maxConcentration: 1.2, category: "allergen", symptoms: ["itching"] },
  { name: "Alpha-Isomethyl Ionone", nameAr: "ألفا إيزوميثيل أيونون", casNumber: "127-51-5", maxConcentration: 0.8, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Hydroxycitronellal", nameAr: "هيدروكسي سيترونيلال", casNumber: "107-75-5", maxConcentration: 1.0, category: "sensitizer", symptoms: ["irritation"] },
  { name: "Isoeugenol", nameAr: "إيزويوجينول", casNumber: "97-54-1", maxConcentration: 0.02, category: "sensitizer", symptoms: ["severe_irritation"] },
  { name: "Amyl Cinnamal", nameAr: "أميل سينامال", casNumber: "122-40-7", maxConcentration: 0.5, category: "allergen", symptoms: ["redness"] },
  { name: "Benzyl Salicylate", nameAr: "بنزيل ساليسيلات", casNumber: "118-58-1", maxConcentration: 1.5, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Anise Alcohol", nameAr: "كحول اليانسون", casNumber: "105-13-5", maxConcentration: 0.2, category: "allergen", symptoms: ["irritation"] },
  { name: "Benzyl Benzoate", nameAr: "بنزيل بنزوات", casNumber: "120-51-4", maxConcentration: 2.0, category: "allergen", symptoms: ["redness"] },
  { name: "Benzyl Cinnamate", nameAr: "بنزيل سينامات", casNumber: "103-41-3", maxConcentration: 0.5, category: "allergen", symptoms: ["itching"] },
  { name: "Farnesol", nameAr: "فارنيسول", casNumber: "4602-84-0", maxConcentration: 0.5, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Hexyl Cinnamal", nameAr: "هيكسيل سينامال", casNumber: "101-86-0", maxConcentration: 1.0, category: "allergen", symptoms: ["redness"] },
  { name: "Butylphenyl Methylpropional", nameAr: "بوتيل فينيل ميثيل بروبيونال", casNumber: "80-54-6", maxConcentration: 0.0, category: "sensitizer", symptoms: ["banned"] },
  { name: "Evernia Prunastri Extract", nameAr: "مستخلص طحلب البلوط", casNumber: "90028-68-5", maxConcentration: 0.1, category: "sensitizer", symptoms: ["severe_allergy"] },
  { name: "Evernia Furfuracea Extract", nameAr: "مستخلص طحلب الشجر", casNumber: "90028-67-4", maxConcentration: 0.1, category: "sensitizer", symptoms: ["severe_allergy"] },
  { name: "Methyl 2-Octynoate", nameAr: "ميثيل 2-أوكتينوات", casNumber: "111-12-6", maxConcentration: 0.01, category: "sensitizer", symptoms: ["irritation"] },
  { name: "Amylcinnamyl Alcohol", nameAr: "كحول أميل سيناميل", casNumber: "101-85-9", maxConcentration: 0.2, category: "allergen", symptoms: ["redness"] },
  { name: "Cinnamyl Alcohol", nameAr: "كحول سيناميل", casNumber: "104-54-1", maxConcentration: 0.4, category: "allergen", symptoms: ["itching"] },
  { name: "Acetyl Cedrene", nameAr: "أسيتيل سيدرين", casNumber: "32388-55-9", maxConcentration: 1.0, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Amyl Salicylate", nameAr: "أميل ساليسيلات", casNumber: "2050-08-0", maxConcentration: 1.2, category: "allergen", symptoms: ["redness"] },
  { name: "Anethole", nameAr: "أنيثول", casNumber: "104-46-1", maxConcentration: 0.5, category: "allergen", symptoms: ["headache"] },
  { name: "Benzaldehyde", nameAr: "بنزالدهيد", casNumber: "100-52-7", maxConcentration: 0.25, category: "allergen", symptoms: ["irritation"] },
  { name: "Camphor", nameAr: "كافور", casNumber: "76-22-2", maxConcentration: 1.0, category: "allergen", symptoms: ["dizziness", "nausea"] },
  { name: "Beta-Caryophyllene", nameAr: "بيتا كاريوفيلين", casNumber: "87-44-5", maxConcentration: 1.5, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Carvone", nameAr: "كارفون", casNumber: "99-49-0", maxConcentration: 0.8, category: "allergen", symptoms: ["irritation"] },
  { name: "Cedrus Atlantica Oil", nameAr: "زيت أرز الأطلس", casNumber: "8023-85-6", maxConcentration: 1.0, category: "allergen", symptoms: ["redness"] },
  { name: "Citrus Aurantium Flower Oil", nameAr: "زيت زهر البرتقال", casNumber: "8016-38-4", maxConcentration: 1.2, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Citrus Limon Peel Oil", nameAr: "زيت قشر الليمون", casNumber: "8008-56-8", maxConcentration: 2.0, category: "allergen", symptoms: ["photosensitivity"] },
  { name: "Eucalyptus Globulus Oil", nameAr: "زيت الكافور", casNumber: "8000-48-4", maxConcentration: 1.5, category: "allergen", symptoms: ["breathing_difficulty"] },
  { name: "Eugenia Caryophyllus Oil", nameAr: "زيت القرنفل", casNumber: "8000-34-8", maxConcentration: 0.5, category: "allergen", symptoms: ["burning_sensation"] },
  { name: "Jasmine Oil/Extract", nameAr: "زيت/مستخلص الياسمين", casNumber: "8022-96-6", maxConcentration: 0.8, category: "allergen", symptoms: ["headache"] },
  { name: "Juniperus Virginiana Oil", nameAr: "زيت خشب الأرز الفيرجيني", casNumber: "8000-27-9", maxConcentration: 1.0, category: "allergen", symptoms: ["redness"] },
  { name: "Lavandula Oil/Extract", nameAr: "زيت/مستخلص اللافندر", casNumber: "8000-28-0", maxConcentration: 2.0, category: "allergen", symptoms: ["dizziness"] },
  { name: "Mentha Piperita Oil", nameAr: "زيت النعناع الفلفلي", casNumber: "8006-90-4", maxConcentration: 1.5, category: "allergen", symptoms: ["irritation"] },
  { name: "Menthol", nameAr: "منثول", casNumber: "89-78-1", maxConcentration: 2.0, category: "allergen", symptoms: ["burning_sensation"] },
  { name: "Pelargonium Graveolens Oil", nameAr: "زيت إبرة الراعي", casNumber: "8000-46-2", maxConcentration: 1.0, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Pinus Mugo/Pumila Oil", nameAr: "زيت الصنوبر", casNumber: "8000-26-8", maxConcentration: 1.2, category: "allergen", symptoms: ["breathing_difficulty"] },
  { name: "Rose Flower Oil/Extract", nameAr: "زيت/مستخلص الورد", casNumber: "8007-01-0", maxConcentration: 1.0, category: "allergen", symptoms: ["headache"] },
  { name: "Santalum Album Oil", nameAr: "زيت خشب الصندل", casNumber: "8006-87-9", maxConcentration: 1.5, category: "allergen", symptoms: ["redness"] },
  { name: "Turpentine Oil", nameAr: "زيت التربنتين", casNumber: "8006-64-2", maxConcentration: 0.5, category: "sensitizer", symptoms: ["severe_irritation"] },
  { name: "Verbena Oil/Extract", nameAr: "زيت/مستخلص الفيربينا", casNumber: "8024-41-9", maxConcentration: 0.2, category: "sensitizer", symptoms: ["photosensitivity"] },
  { name: "Ylang Ylang Oil", nameAr: "زيت اليلانغ يلانغ", casNumber: "8006-81-3", maxConcentration: 0.8, category: "allergen", symptoms: ["headache", "nausea"] },
  { name: "Alpha-Terpinene", nameAr: "ألفا تيربينين", casNumber: "99-86-5", maxConcentration: 0.5, category: "allergen", symptoms: ["irritation"] },
  { name: "Terpinolene", nameAr: "تيربينولين", casNumber: "586-62-9", maxConcentration: 0.5, category: "allergen", symptoms: ["skin_allergy"] },
  // المواد الـ30 المحدّثة
  { name: "Vanillin", nameAr: "فانيلين", casNumber: "121-33-5", maxConcentration: 1.5, category: "allergen", symptoms: ["skin_allergy", "headache"] },
  { name: "Ethyl Vanillin", nameAr: "إيثيل فانيلين", casNumber: "121-32-4", maxConcentration: 1.5, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Piperonal", nameAr: "بيبيرونال", casNumber: "120-57-0", maxConcentration: 1.0, category: "allergen", symptoms: ["redness", "itching"] },
  { name: "Methylcyclopentenolone", nameAr: "ميثيل سيكلوبنتينولون", casNumber: "80-71-7", maxConcentration: 0.5, category: "allergen", symptoms: ["irritation"] },
  { name: "Maltol", nameAr: "مالتول", casNumber: "118-71-8", maxConcentration: 1.0, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Ethyl Maltol", nameAr: "إيثيل مالتول", casNumber: "4940-11-8", maxConcentration: 1.0, category: "allergen", symptoms: ["redness"] },
  { name: "Gamma-Undecalactone", nameAr: "غاما أنديكالاكتون", casNumber: "104-67-6", maxConcentration: 1.5, category: "allergen", symptoms: ["itching"] },
  { name: "Gamma-Decalactone", nameAr: "غاما ديكالاكتون", casNumber: "706-14-9", maxConcentration: 1.5, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Delta-Decalactone", nameAr: "دلتا ديكالاكتون", casNumber: "705-86-2", maxConcentration: 1.5, category: "allergen", symptoms: ["redness"] },
  { name: "Delta-Dodecalactone", nameAr: "دلتا دوديكالاكتون", casNumber: "713-95-1", maxConcentration: 1.5, category: "allergen", symptoms: ["itching"] },
  { name: "Hexyl Salicylate", nameAr: "هيكسيل ساليسيلات", casNumber: "6259-76-3", maxConcentration: 2.0, category: "allergen", symptoms: ["skin_allergy", "redness"] },
  { name: "Cis-3-Hexenyl Salicylate", nameAr: "سيس-3-هيكسينيل ساليسيلات", casNumber: "65405-77-8", maxConcentration: 2.0, category: "allergen", symptoms: ["irritation"] },
  { name: "Cyclamen Aldehyde", nameAr: "سيكلامين ألدهيد", casNumber: "103-95-7", maxConcentration: 0.5, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Lilial Replacement", nameAr: "بديل الليليال", casNumber: "N/A", maxConcentration: 1.0, category: "allergen", symptoms: ["redness", "itching"] },
  { name: "Helional", nameAr: "هيليونال", casNumber: "1205-17-0", maxConcentration: 0.8, category: "allergen", symptoms: ["irritation"] },
  { name: "Florosa", nameAr: "فلوروزا", casNumber: "63500-71-0", maxConcentration: 1.5, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Lyral Replacement", nameAr: "بديل الليرال", casNumber: "N/A", maxConcentration: 1.0, category: "allergen", symptoms: ["redness"] },
  { name: "Ambroxan", nameAr: "أمبروكسان", casNumber: "6790-58-5", maxConcentration: 2.0, category: "allergen", symptoms: ["itching"] },
  { name: "Iso E Super", nameAr: "إيزو إي سوبر", casNumber: "54464-57-2", maxConcentration: 2.5, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Hedione", nameAr: "هيديون", casNumber: "24851-98-7", maxConcentration: 5.0, category: "allergen", symptoms: ["redness"] },
  { name: "Galaxolide", nameAr: "غالاكسوليد", casNumber: "1222-05-5", maxConcentration: 3.0, category: "allergen", symptoms: ["itching"] },
  { name: "Ethylene Brassylate", nameAr: "إيثيلين براسيلات", casNumber: "105-95-3", maxConcentration: 4.0, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Habanolide", nameAr: "هابانوليد", casNumber: "111879-80-2", maxConcentration: 2.0, category: "allergen", symptoms: ["redness"] },
  { name: "Exaltolide", nameAr: "إكسالتوليد", casNumber: "106-02-5", maxConcentration: 1.5, category: "allergen", symptoms: ["itching"] },
  { name: "Musk Ketone", nameAr: "مسك كيتون", casNumber: "81-14-1", maxConcentration: 0.1, category: "allergen", symptoms: ["skin_allergy"] },
  { name: "Musk Xylol", nameAr: "مسك زيلول", casNumber: "81-15-2", maxConcentration: 0.0, category: "sensitizer", symptoms: ["swelling", "burning_sensation"] },
  { name: "Cashmeran", nameAr: "كاشميران", casNumber: "33704-61-9", maxConcentration: 1.5, category: "allergen", symptoms: ["headache", "skin_allergy"] },
  { name: "Ebanol", nameAr: "إيبانول", casNumber: "67801-20-1", maxConcentration: 1.0, category: "allergen", symptoms: ["redness"] },
  { name: "Bacdanol", nameAr: "باكدانول", casNumber: "28219-61-6", maxConcentration: 1.0, category: "allergen", symptoms: ["itching"] },
  { name: "Sandalore", nameAr: "صندلور", casNumber: "65113-99-7", maxConcentration: 1.0, category: "allergen", symptoms: ["skin_allergy"] }
];
