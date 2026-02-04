// Symptom to Ingredient Mapping
// Maps common perfume-related symptoms to their potential ingredient triggers
// Based on clinical studies and IFRA safety data

export interface SymptomMapping {
  symptom: string
  symptomAr: string
  ingredients: string[]
  confidence: number // 0.0 to 1.0 (how confident we are about this mapping)
  description?: string
}

export const symptomMappings: SymptomMapping[] = [
  // Skin Reactions
  {
    symptom: "skin_allergy",
    symptomAr: "حساسية الجلد",
    ingredients: [
      "Limonene", "Linalool", "Geraniol", "Citronellol", "Eugenol",
      "Isoeugenol", "Cinnamal", "Coumarin", "Farnesol", "Citral",
      "Hexyl Cinnamal", "Benzyl Alcohol", "Benzyl Benzoate", "Benzyl Salicylate",
      "Oakmoss Extract", "Treemoss Extract"
    ],
    confidence: 0.9,
    description: "Most common allergens causing contact dermatitis"
  },
  {
    symptom: "redness",
    symptomAr: "احمرار الجلد",
    ingredients: [
      "Cinnamal", "Hydroxycitronellal", "Eugenol", "Amyl Cinnamal",
      "Hexyl Cinnamal", "Alpha-Isomethyl Ionone", "Benzyl Cinnamate"
    ],
    confidence: 0.8,
    description: "Ingredients known to cause skin redness"
  },
  {
    symptom: "itching",
    symptomAr: "حكة",
    ingredients: [
      "Limonene", "Linalool", "Hydroxycitronellal", "Amyl Cinnamal",
      "Hexyl Cinnamal", "Alpha-Isomethyl Ionone"
    ],
    confidence: 0.8,
    description: "Ingredients that may cause itching sensation"
  },
  {
    symptom: "burning_sensation",
    symptomAr: "إحساس بالحرقان",
    ingredients: [
      "Cinnamal", "Eugenol", "Cinnamyl Alcohol", "Methyl 2-Octynoate",
      "Clove Oil", "Cinnamon derivatives"
    ],
    confidence: 0.85,
    description: "Strong irritants causing burning sensation"
  },
  {
    symptom: "irritation",
    symptomAr: "تهيج",
    ingredients: [
      "Benzyl Alcohol", "Limonene", "Citronellol", "Anise Alcohol",
      "Alpha-Terpinene", "Terpinolene", "Cedarwood Oil"
    ],
    confidence: 0.75,
    description: "General skin irritants"
  },
  {
    symptom: "severe_irritation",
    symptomAr: "تهيج شديد",
    ingredients: [
      "Isoeugenol", "Methyl 2-Octynoate", "Clove Oil", "Turpentine Oil",
      "Atranol", "Chloroatranol", "Oakmoss Extract"
    ],
    confidence: 0.9,
    description: "Strong sensitizers causing severe reactions"
  },
  {
    symptom: "photosensitivity",
    symptomAr: "حساسية ضوئية",
    ingredients: [
      "Coumarin", "Bergamot Oil", "Citrus Oils", "Verbena Oil",
      "Citrus Aurantium Flower Oil"
    ],
    confidence: 0.85,
    description: "Ingredients that increase sun sensitivity"
  },
  {
    symptom: "swelling",
    symptomAr: "تورم",
    ingredients: [
      "Musk Xylol", "Oakmoss Extract", "Isoeugenol", "Atranol", "Chloroatranol"
    ],
    confidence: 0.8,
    description: "Ingredients that may cause swelling"
  },
  
  // Respiratory Symptoms
  {
    symptom: "breathing_difficulty",
    symptomAr: "صعوبة في التنفس",
    ingredients: [
      "Alpha-Pinene", "Beta-Pinene", "Eucalyptus Oil", "Peppermint Oil",
      "Camphor", "Juniper Oil", "Pine Oil"
    ],
    confidence: 0.85,
    description: "Strong volatile compounds affecting breathing"
  },
  {
    symptom: "sneeze",
    symptomAr: "عطس",
    ingredients: [
      "Black Pepper derivatives", "Spicy notes", "Alpha-Pinene", "Beta-Pinene",
      "Eucalyptus Oil", "Peppermint Oil"
    ],
    confidence: 0.7,
    description: "Irritants triggering sneezing"
  },
  {
    symptom: "cough",
    symptomAr: "سعال",
    ingredients: [
      "Eucalyptus Oil", "Peppermint Oil", "Camphor", "Alpha-Pinene", "Beta-Pinene"
    ],
    confidence: 0.7,
    description: "Ingredients that may irritate airways"
  },
  {
    symptom: "asthma_trigger",
    symptomAr: "محفز للربو",
    ingredients: [
      "Eucalyptus Oil", "Peppermint Oil", "Pine Oil", "Camphor",
      "Strong floral absolutes", "Oakmoss Extract"
    ],
    confidence: 0.8,
    description: "Known asthma triggers"
  },
  
  // Neurological Symptoms
  {
    symptom: "headache",
    symptomAr: "صداع",
    ingredients: [
      "Jasmine Oil", "Ylang Ylang Oil", "Patchouli Oil", "Rose Oil",
      "Lavender Oil", "Camphor", "Vanillin", "Cashmeran", "Oud notes"
    ],
    confidence: 0.75,
    description: "Strong scents known to trigger headaches"
  },
  {
    symptom: "migraine",
    symptomAr: "صداع نصفي",
    ingredients: [
      "Jasmine Oil", "Ylang Ylang Oil", "Rose Oil", "Strong musks",
      "Heavy floral absolutes"
    ],
    confidence: 0.7,
    description: "Intense scents triggering migraines"
  },
  {
    symptom: "dizziness",
    symptomAr: "دوار",
    ingredients: [
      "Lavender Oil", "Eucalyptus Oil", "Camphor", "Ylang Ylang Oil",
      "Strong synthetic musks"
    ],
    confidence: 0.7,
    description: "Ingredients causing lightheadedness"
  },
  {
    symptom: "nausea",
    symptomAr: "غثيان",
    ingredients: [
      "Jasmine Oil", "Ylang Ylang Oil", "Camphor", "Heavy musks",
      "Indolic florals"
    ],
    confidence: 0.75,
    description: "Overpowering scents causing nausea"
  },
  {
    symptom: "anxiety",
    symptomAr: "قلق",
    ingredients: [
      "Strong synthetic musks", "Heavy animalic notes", "Intense oud"
    ],
    confidence: 0.6,
    description: "Overwhelming scents triggering anxiety"
  },
  
  // Eye Symptoms
  {
    symptom: "eye_irritation",
    symptomAr: "تهيج العين",
    ingredients: [
      "Camphor", "Eucalyptus Oil", "Peppermint Oil", "Alpha-Pinene",
      "Volatile aldehydes"
    ],
    confidence: 0.75,
    description: "Volatile compounds irritating eyes"
  },
  {
    symptom: "watery_eyes",
    symptomAr: "دموع",
    ingredients: [
      "Aldehydes", "Eucalyptus Oil", "Peppermint Oil", "Camphor"
    ],
    confidence: 0.7,
    description: "Ingredients causing lacrimation"
  },
  
  // Digestive Symptoms
  {
    symptom: "stomach_upset",
    symptomAr: "اضطراب المعدة",
    ingredients: [
      "Camphor", "Eucalyptus Oil", "Strong spicy notes", "Heavy musks"
    ],
    confidence: 0.6,
    description: "Scents affecting digestive system"
  },
  
  // Specific Ingredient-Symptom Mappings
  {
    symptom: "limonene_allergy",
    symptomAr: "حساسية الليمونين",
    ingredients: ["Limonene"],
    confidence: 1.0,
    description: "Specific limonene sensitivity"
  },
  {
    symptom: "linalool_allergy",
    symptomAr: "حساسية الليناليل",
    ingredients: ["Linalool"],
    confidence: 1.0,
    description: "Specific linalool sensitivity"
  },
  {
    symptom: "oakmoss_allergy",
    symptomAr: "حساسية طحلب البلوط",
    ingredients: ["Oakmoss Extract", "Atranol", "Chloroatranol"],
    confidence: 1.0,
    description: "Severe oakmoss allergen"
  },
  {
    symptom: "citrus_allergy",
    symptomAr: "حساسية الحمضيات",
    ingredients: [
      "Limonene", "Citral", "Bergamot Oil", "Lemon Oil", "Orange Oil",
      "Grapefruit Oil", "Lime Oil"
    ],
    confidence: 0.85,
    description: "Citrus-related allergens"
  },
  {
    symptom: "floral_allergy",
    symptomAr: "حساسية الزهور",
    ingredients: [
      "Geraniol", "Linalool", "Citronellol", "Rose Oil", "Jasmine Oil",
      "Lavender Oil", "Ylang Ylang Oil"
    ],
    confidence: 0.8,
    description: "Common floral allergens"
  },
  {
    symptom: "woody_allergy",
    symptomAr: "حساسية الأخشاب",
    ingredients: [
      "Cedrol", "Santalol", "Iso E Super", "Cedarwood Oil", "Sandalwood Oil",
      "Vetiver Oil", "Patchouli Oil"
    ],
    confidence: 0.75,
    description: "Woody note allergens"
  },
  {
    symptom: "spicy_allergy",
    symptomAr: "حساسية التوابل",
    ingredients: [
      "Eugenol", "Cinnamal", "Isoeugenol", "Clove Oil", "Cinnamon derivatives",
      "Black Pepper derivatives"
    ],
    confidence: 0.8,
    description: "Spicy ingredient allergens"
  },
  
  // Musk Sensitivities
  {
    symptom: "musk_sensitivity",
    symptomAr: "حساسية المسك",
    ingredients: [
      "Galaxolide", "Ethylene Brassylate", "Habanolide", "Exaltolide",
      "Musk Ketone", "Cashmeran"
    ],
    confidence: 0.75,
    description: "Synthetic musk sensitivities"
  },
  
  // Vanilla & Gourmand
  {
    symptom: "vanilla_sensitivity",
    symptomAr: "حساسية الفانيليا",
    ingredients: ["Vanillin", "Ethyl Vanillin", "Piperonal"],
    confidence: 0.7,
    description: "Vanilla-related sensitivities"
  },
  {
    symptom: "coumarin_sensitivity",
    symptomAr: "حساسية الكومارين",
    ingredients: ["Coumarin", "Tonka Bean absolute"],
    confidence: 0.8,
    description: "Coumarin sensitivity"
  },
  
  // Essential Oil Sensitivities
  {
    symptom: "lavender_sensitivity",
    symptomAr: "حساسية الخزامى",
    ingredients: ["Lavender Oil", "Linalool", "Linalyl Acetate", "Camphor"],
    confidence: 0.75,
    description: "Lavender oil sensitivity"
  },
  {
    symptom: "rose_sensitivity",
    symptomAr: "حساسية الورد",
    ingredients: ["Rose Oil", "Geraniol", "Citronellol", "Phenethyl Alcohol"],
    confidence: 0.75,
    description: "Rose oil sensitivity"
  },
  {
    symptom: "jasmine_sensitivity",
    symptomAr: "حساسية الياسمين",
    ingredients: ["Jasmine Oil/Extract", "Benzyl Acetate", "Indole"],
    confidence: 0.75,
    description: "Jasmine absolute sensitivity"
  },
  {
    symptom: "sandalwood_sensitivity",
    symptomAr: "حساسية خشب الصندل",
    ingredients: ["Sandalwood Oil", "Santalol", "Ebanol", "Bacdanol", "Sandalore"],
    confidence: 0.7,
    description: "Sandalwood sensitivity"
  },
  {
    symptom: "patchouli_sensitivity",
    symptomAr: "حساسية الباتشولي",
    ingredients: ["Patchouli Oil", "Patchoulol"],
    confidence: 0.7,
    description: "Patchouli oil sensitivity"
  },
  {
    symptom: "vetiver_sensitivity",
    symptomAr: "حساسية الفيتيفر",
    ingredients: ["Vetiver Oil", "Vetiverol"],
    confidence: 0.7,
    description: "Vetiver oil sensitivity"
  },
  
  // Pine & Conifer
  {
    symptom: "pine_sensitivity",
    symptomAr: "حساسية الصنوبر",
    ingredients: [
      "Alpha-Pinene", "Beta-Pinene", "Pine Oil", "Cedarwood Oil",
      "Juniper Oil", "Cypress Oil"
    ],
    confidence: 0.75,
    description: "Pine and conifer sensitivity"
  },
  
  // Mint & Camphor
  {
    symptom: "mint_sensitivity",
    symptomAr: "حساسية النعناع",
    ingredients: [
      "Peppermint Oil", "Spearmint Oil", "Menthol", "Eucalyptus Oil"
    ],
    confidence: 0.8,
    description: "Mint family sensitivity"
  },
  {
    symptom: "camphor_sensitivity",
    symptomAr: "حساسية الكافور",
    ingredients: ["Camphor", "Eucalyptus Oil", "Rosemary Oil"],
    confidence: 0.8,
    description: "Camphor sensitivity"
  },
  
  // Citronella
  {
    symptom: "citronella_sensitivity",
    symptomAr: "حساسية السترونيلا",
    ingredients: ["Citronellol", "Geraniol", "Citronellal"],
    confidence: 0.75,
    description: "Citronella sensitivity"
  },
  
  // Aldehydic
  {
    symptom: "aldehydic_sensitivity",
    symptomAr: "حساسية الألدهيدات",
    ingredients: [
      "Aldehydes C10", "Aldehydes C11", "Aldehydes C12",
      "Benzaldehyde", "Cinnamal", "Cyclamen Aldehyde"
    ],
    confidence: 0.7,
    description: "Aldehydic compound sensitivity"
  },
  
  // Benzyl compounds
  {
    symptom: "benzyl_sensitivity",
    symptomAr: "حساسية مركبات البنزيل",
    ingredients: [
      "Benzyl Alcohol", "Benzyl Benzoate", "Benzyl Salicylate",
      "Benzyl Cinnamate", "Benzyl Acetate"
    ],
    confidence: 0.75,
    description: "Benzyl compound sensitivity"
  },
  
  // Ionones
  {
    symptom: "ionone_sensitivity",
    symptomAr: "حساسية الآيونون",
    ingredients: ["Alpha-Isomethyl Ionone", "Beta-Ionone", "Methyl Ionone"],
    confidence: 0.7,
    description: "Ionone sensitivity (violet/iris notes)"
  },
  
  // Lactones
  {
    symptom: "lactone_sensitivity",
    symptomAr: "حساسية اللاكتونات",
    ingredients: [
      "Gamma-Undecalactone", "Gamma-Decalactone", "Delta-Decalactone",
      "Delta-Dodecalactone", "Massoia Lactone"
    ],
    confidence: 0.65,
    description: "Lactone (peachy/creamy notes) sensitivity"
  },
  
  // Indolic
  {
    symptom: "indolic_sensitivity",
    symptomAr: "حساسية المركبات الإندولية",
    ingredients: ["Indole", "Skatole", "Methyl Anthranilate"],
    confidence: 0.7,
    description: "Animalic/indolic note sensitivity"
  },
  
  // Salicylates
  {
    symptom: "salicylate_sensitivity",
    symptomAr: "حساسية الساليسيلات",
    ingredients: [
      "Benzyl Salicylate", "Hexyl Salicylate", "Cis-3-Hexenyl Salicylate",
      "Methyl Salicylate"
    ],
    confidence: 0.75,
    description: "Salicylate sensitivity"
  },
  
  // Iso E Super & Woody Ambers
  {
    symptom: "iso_e_sensitivity",
    symptomAr: "حساسية إيزو إي سوبر",
    ingredients: ["Iso E Super", "Ambroxan", "Cashmeran"],
    confidence: 0.7,
    description: "Synthetic woody amber sensitivity"
  },
  
  // Hedione & Clean Musks
  {
    symptom: "hedione_sensitivity",
    symptomAr: "حساسية الهيديون",
    ingredients: ["Hedione", "Calone", "Dihydromyrcenol"],
    confidence: 0.65,
    description: "Clean/fresh molecule sensitivity"
  },
  
  // Pregnancy-Related
  {
    symptom: "pregnancy_unsafe",
    symptomAr: "غير آمن للحمل",
    ingredients: [
      "Clary Sage Oil", "Rosemary Oil", "Camphor", "Eucalyptus Oil",
      "Peppermint Oil", "Jasmine Oil", "Clove Oil"
    ],
    confidence: 0.8,
    description: "Ingredients to avoid during pregnancy"
  },
  
  // Children-Related
  {
    symptom: "child_unsafe",
    symptomAr: "غير آمن للأطفال",
    ingredients: [
      "Camphor", "Eucalyptus Oil", "Peppermint Oil", "Wintergreen Oil",
      "Strong spicy notes"
    ],
    confidence: 0.85,
    description: "Ingredients to avoid for young children"
  }
];

// Helper functions
export function getSymptomByName(symptom: string): SymptomMapping | undefined {
  return symptomMappings.find(s => s.symptom === symptom);
}

export function getIngredientsForSymptom(symptom: string, minConfidence = 0.7): string[] {
  const mapping = symptomMappings.find(s => s.symptom === symptom);
  if (!mapping || mapping.confidence < minConfidence) {
    return [];
  }
  return mapping.ingredients;
}

export function getSymptomsForIngredient(ingredient: string, minConfidence = 0.7): string[] {
  const symptoms: string[] = [];
  const normalizedIngredient = ingredient.toLowerCase();
  
  for (const mapping of symptomMappings) {
    if (mapping.confidence >= minConfidence) {
      const hasIngredient = mapping.ingredients.some(
        i => i.toLowerCase() === normalizedIngredient
      );
      if (hasIngredient) {
        symptoms.push(mapping.symptom);
      }
    }
  }
  
  return symptoms;
}

// Export count for validation
export const TOTAL_SYMPTOM_MAPPINGS = symptomMappings.length; // Should be 51
