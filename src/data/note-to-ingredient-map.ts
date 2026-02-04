// Fragrance Note to Chemical Ingredient Mapping
// Maps common perfume notes to their chemical components
// Based on IFRA materials and common industry knowledge

export const noteToIngredientMap: Record<string, string[]> = {
  // Citrus Notes
  "bergamot": ["Limonene", "Linalool", "Citral", "Linalyl Acetate"],
  "lemon": ["Limonene", "Citral", "Geraniol", "Terpinolene"],
  "orange": ["Limonene", "Citral", "Linalool"],
  "grapefruit": ["Limonene", "Citral", "Linalool"],
  "mandarin": ["Limonene", "Citral", "Linalool"],
  "lime": ["Limonene", "Citral", "Terpinolene"],
  "yuzu": ["Limonene", "Citral", "Linalool"],
  "petitgrain": ["Linalyl Acetate", "Linalool", "Geraniol"],
  
  // Floral Notes
  "rose": ["Geraniol", "Citronellol", "Phenethyl Alcohol", "Eugenol", "Rose Oil"],
  "jasmine": ["Benzyl Acetate", "Linalool", "Benzyl Alcohol", "Indole", "Jasmine Oil/Extract"],
  "lavender": ["Linalool", "Linalyl Acetate", "Lavandula Oil/Extract", "Camphor", "Limonene"],
  "ylang-ylang": ["Benzyl Acetate", "Benzyl Benzoate", "Linalool", "Ylang Ylang Oil"],
  "geranium": ["Geraniol", "Citronellol", "Linalool", "Pelargonium Graveolens Oil"],
  "neroli": ["Linalool", "Limonene", "Citrus Aurantium Flower Oil"],
  "lily of the valley": ["Hydroxycitronellal", "Lilial Replacement", "Florosa"],
  "lilac": ["Terpineol", "Hydroxycitronellal", "Phenethyl Alcohol"],
  "violet": ["Alpha-Isomethyl Ionone", "Methyl 2-Octynoate"],
  "iris": ["Irones", "Alpha-Isomethyl Ionone", "Benzyl Alcohol"],
  "tuberose": ["Methyl Anthranilate", "Benzyl Benzoate", "Eugenol"],
  "gardenia": ["Benzyl Acetate", "Linalool", "Styrallyl Acetate"],
  "magnolia": ["Linalool", "Geraniol", "Citronellol"],
  "honeysuckle": ["Linalool", "Geraniol", "Hydroxycitronellal"],
  "freesia": ["Linalool", "Terpineol", "Geraniol"],
  "lotus": ["Linalool", "Benzyl Alcohol", "Terpineol"],
  "peony": ["Geraniol", "Citronellol", "Rose Oil"],
  "mimosa": ["Farnesol", "Linalool", "Benzyl Alcohol"],
  "carnation": ["Eugenol", "Isoeugenol", "Cinnamal"],
  "orange blossom": ["Linalool", "Citrus Aurantium Flower Oil", "Benzyl Acetate"],
  
  // Woody Notes
  "sandalwood": ["Santalol", "Santalum Album Oil", "Ebanol", "Bacdanol"],
  "cedarwood": ["Cedrol", "Cedrene", "Acetyl Cedrene", "Juniperus Virginiana Oil", "Cedarwood Oil"],
  "oud": ["Iso E Super", "Cedrol", "Santalol"],
  "vetiver": ["Vetiverol", "Vetiveryl Acetate", "Khusimol", "Vetiver Oil"],
  "patchouli": ["Patchoulol", "Patchoulene", "Alpha-Bulnesene", "Patchouli Oil"],
  "pine": ["Alpha-Pinene", "Beta-Pinene", "Limonene", "Pinus Mugo/Pumila Oil"],
  "cypress": ["Alpha-Pinene", "Cedrol", "Juniperus Virginiana Oil"],
  "fir": ["Alpha-Pinene", "Beta-Pinene", "Limonene"],
  "juniper": ["Alpha-Pinene", "Beta-Pinene", "Juniperus Virginiana Oil"],
  "birch": ["Methyl Salicylate", "Benzyl Benzoate"],
  
  // Spicy Notes
  "clove": ["Eugenol", "Eugenia Caryophyllus Oil", "Beta-Caryophyllene"],
  "cinnamon": ["Cinnamal", "Cinnamyl Alcohol", "Eugenol", "Benzyl Benzoate"],
  "cardamom": ["Terpinyl Acetate", "Eucalyptol", "Linalool"],
  "black pepper": ["Limonene", "Beta-Caryophyllene", "Pinene"],
  "pink pepper": ["Limonene", "Beta-Caryophyllene"],
  "ginger": ["Zingiberene", "Citral", "Geraniol"],
  "nutmeg": ["Eugenol", "Linalool", "Limonene"],
  "star anise": ["Anethole", "Limonene", "Linalool"],
  "coriander": ["Linalool", "Limonene", "Geraniol"],
  "cumin": ["Eugenol", "Linalool", "Limonene"],
  "fennel": ["Anethole", "Limonene", "Linalool"],
  "saffron": ["Safranal", "Linalool", "Limonene"],
  
  // Herbal & Aromatic Notes
  "basil": ["Linalool", "Estragole", "Eugenol"],
  "thyme": ["Thymol", "Carvacrol", "Linalool"],
  "rosemary": ["Camphor", "Eucalyptol", "Alpha-Pinene"],
  "sage": ["Linalool", "Limonene", "Geraniol"],
  "clary sage": ["Linalyl Acetate", "Linalool", "Limonene"],
  "mint": ["Menthol", "Limonene", "Linalool"],
  "peppermint": ["Menthol", "Mentha Piperita Oil", "Menthone", "Limonene"],
  "spearmint": ["Carvone", "Limonene", "Menthol"],
  "eucalyptus": ["Eucalyptol", "Limonene", "Eucalyptus Globulus Oil"],
  "tea": ["Linalool", "Geraniol", "Limonene"],
  "anise": ["Anethole", "Anise Alcohol", "Estragole"],
  "tarragon": ["Estragole", "Linalool", "Limonene"],
  
  // Mossy & Green Notes
  "oakmoss": ["Evernia Prunastri Extract", "Atranol", "Chloroatranol"],
  "treemoss": ["Evernia Furfuracea Extract"],
  "moss": ["Evernia Prunastri Extract", "Linalool", "Limonene"],
  "grass": ["Cis-3-Hexenol", "Limonene", "Linalool"],
  "leaf": ["Linalool", "Geraniol", "Limonene"],
  "hay": ["Coumarin", "Linalool", "Limonene"],
  "bamboo": ["Linalool", "Geraniol", "Limonene"],
  "cactus": ["Linalool", "Limonene", "Geraniol"],
  "seaweed": ["Calone", "Limonene", "Linalool"],
  "water": ["Calone", "Dihydromyrcenol", "Linalool"],
  
  // Gourmand & Sweet Notes
  "vanilla": ["Vanillin", "Ethyl Vanillin", "Piperonal"],
  "tonka bean": ["Coumarin", "Linalool", "Limonene"],
  "caramel": ["Maltol", "Ethyl Maltol"],
  "honey": ["Phenylacetic Acid", "Phenethyl Alcohol"],
  "chocolate": ["Isoamyl Phenylacetate", "Vanillin"],
  "coffee": ["Furfuryl Mercaptan", "Guaiacol"],
  "almond": ["Benzaldehyde", "Limonene", "Linalool"],
  "hazelnut": ["Benzaldehyde", "Vanillin"],
  "coconut": ["Gamma-Nonalactone", "Coumarin", "Delta-Dodecalactone"],
  "milk": ["Ethyl Maltol", "Linalool", "Limonene"],
  "sugar": ["Ethyl Maltol", "Linalool", "Limonene"],
  "beeswax": ["Phenethyl Alcohol", "Linalool", "Limonene"],
  
  // Fruity Notes
  "apple": ["Hexyl Acetate", "Gamma-Undecalactone", "Ethyl 2-Methylbutyrate"],
  "peach": ["Gamma-Undecalactone", "Gamma-Decalactone", "Benzaldehyde"],
  "apricot": ["Gamma-Undecalactone", "Limonene", "Ethyl Acetate"],
  "pear": ["Ethyl Acetate", "Hexyl Acetate", "Limonene"],
  "plum": ["Gamma-Undecalactone", "Limonene", "Linalool"],
  "cherry": ["Benzaldehyde", "Ethyl Acetate", "Limonene"],
  "strawberry": ["Ethyl Methylphenylglycidate", "Limonene", "Linalool"],
  "raspberry": ["Raspberry Ketone", "Limonene", "Ethyl Acetate"],
  "blackberry": ["Gamma-Undecalactone", "Limonene"],
  "blackcurrant": ["Hexyl Acetate", "Limonene"],
  "redcurrant": ["Hexyl Acetate", "Limonene"],
  "banana": ["Isoamyl Acetate", "Limonene", "Linalool"],
  "pineapple": ["Allyl Caproate", "Limonene", "Ethyl Butyrate"],
  "mango": ["Limonene", "Ethyl Butyrate", "Linalool"],
  "passionfruit": ["Ethyl Butyrate", "Limonene", "Linalool"],
  "guava": ["Ethyl Butyrate", "Limonene", "Linalool"],
  "kiwi": ["Ethyl Acetate", "Hexyl Acetate", "Limonene"],
  "melon": ["Helional", "Limonene", "Linalool"],
  "watermelon": ["Calone", "Limonene", "Linalool"],
  
  // Musky & Animalic Notes
  "musk": ["Galaxolide", "Ethylene Brassylate", "Habanolide", "Exaltolide"],
  "amber": ["Ambroxan", "Iso E Super", "Benzyl Benzoate"],
  "ambergris": ["Ambroxan", "Iso E Super"],
  "leather": ["Isobutyl Quinoline", "Birch Tar Oil"],
  "tobacco": ["Damascenone", "Coumarin", "Eugenol"],
  "smoke": ["Iso E Super", "Eugenol", "Linalool"],
  "incense": ["Iso E Super", "Cedrol", "Linalool"],
  "myrrh": ["Iso E Super", "Santalol", "Linalool"],
  
  // Alcoholic & Beverage Notes
  "whiskey": ["Ethyl Acetate", "Linalool", "Limonene"],
  "wine": ["Ethyl Acetate", "Linalool", "Limonene"],
  "rum": ["Ethyl Acetate", "Vanillin", "Coumarin"],
  "champagne": ["Ethyl Acetate", "Linalool"],
  
  // Aquatic & Ozonic Notes
  "marine": ["Calone", "Dihydromyrcenol", "Linalool"],
  "ozonic": ["Calone", "Dihydromyrcenol", "Hedione"],
  "sea salt": ["Calone", "Linalool"],
  "rain": ["Calone", "Dihydromyrcenol"],
  
  // Abstract & Modern Notes
  "metallic": ["Rose Oxide", "Linalool", "Limonene"],
  "earthy": ["Geosmin", "Iso E Super", "Cedrol"],
  "smoky": ["Iso E Super", "Eugenol", "Linalool"],
  "powdery": ["Alpha-Isomethyl Ionone", "Linalool", "Limonene"],
  "soapy": ["Aldehydes", "Linalool", "Limonene"],
  "clean": ["Hedione", "Linalool", "Limonene"],
  "fresh": ["Hedione", "Linalool", "Limonene"],
  "spicy": ["Eugenol", "Cinnamal", "Beta-Caryophyllene"]
};

// Helper function to get ingredients for a note
export function getIngredientsForNote(note: string): string[] {
  const normalizedNote = note.toLowerCase().trim();
  return noteToIngredientMap[normalizedNote] || [];
}

// Helper function to get all notes that contain a specific ingredient
export function getNotesForIngredient(ingredient: string): string[] {
  const notes: string[] = [];
  const normalizedIngredient = ingredient.toLowerCase();
  
  for (const [note, ingredients] of Object.entries(noteToIngredientMap)) {
    if (ingredients.some(i => i.toLowerCase() === normalizedIngredient)) {
      notes.push(note);
    }
  }
  
  return notes;
}

// Export count for validation
export const TOTAL_NOTES = Object.keys(noteToIngredientMap).length; // Should be 100+
