export interface Symptom {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

export const SYMPTOMS: Symptom[] = [
  {
    id: "dry-skin",
    name: "بشرة جافة",
    icon: "🌿",
    description: "تشعر بالجفاف والشد، تحتاج ترطيب عميق",
    color: "#FED7AA"
  },
  {
    id: "oily-skin",
    name: "بشرة دهنية",
    icon: "💧",
    description: "تفرز الزيوت بكثرة، تحتاج توازن",
    color: "#BFDBFE"
  },
  {
    id: "sensitive-skin",
    name: "بشرة حساسة",
    icon: "🛡️",
    description: "تتهيج بسهولة من المكونات القوية",
    color: "#FDE68A"
  },
  {
    id: "combination-skin",
    name: "بشرة مختلطة",
    icon: "⚖️",
    description: "جافة في بعض المناطق ودهنية في أخرى",
    color: "#C7D2FE"
  },
  {
    id: "acne-prone",
    name: "عرضة لحب الشباب",
    icon: "🔴",
    description: "تظهر البثور بسهولة مع بعض المكونات",
    color: "#FECACA"
  },
  {
    id: "mature-skin",
    name: "بشرة ناضجة",
    icon: "✨",
    description: "تحتاج عناية خاصة ومكونات مغذية",
    color: "#E9D5FF"
  },
  {
    id: "normal-skin",
    name: "بشرة عادية",
    icon: "✅",
    description: "متوازنة ولا تعاني من مشاكل خاصة",
    color: "var(--color-safe-green)"
  },
  {
    id: "eczema",
    name: "إكزيما",
    icon: "🔴",
    description: "حالة جلدية تحتاج عناية طبية خاصة",
    color: "var(--color-danger-red)"
  }
]
