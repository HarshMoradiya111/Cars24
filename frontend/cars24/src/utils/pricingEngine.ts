export type CarType = "SUV" | "Sedan" | "Hatchback" | "MUV" | "Coupe" | "Wagon";
export type Region = "Metro" | "Hilly" | "Rural";
export type Season = "Monsoon" | "Winter" | "Summer";

interface PricingResult {
  basePrice: number;
  recommendedPrice: number;
  multiplier: number;
  explanation: string;
}

export const detectSeason = (date: Date = new Date()): Season => {
  const month = date.getMonth() + 1;

  if (month >= 6 && month <= 9) return "Monsoon";
  if ((month >= 11 && month <= 12) || (month >= 1 && month <= 2)) return "Winter";
  return "Summer";
};

const getCarTypeMultiplier = (carType: CarType): number => {
  switch (carType) {
    case "SUV":
    case "MUV":
      return 1.05;
    case "Sedan":
      return 1.02;
    case "Hatchback":
      return 1.01;
    default:
      return 1.0;
  }
};

const getSeasonMultiplier = (season: Season): number => {
  switch (season) {
    case "Monsoon":
      return 1.03;
    case "Winter":
      return 1.02;
    case "Summer":
      return 0.99;
    default:
      return 1.0;
  }
};

const getRegionMultiplier = (region: Region): number => {
  switch (region) {
    case "Hilly":
      return 1.04;
    case "Metro":
      return 0.98;
    case "Rural":
      return 1.0;
    default:
      return 1.0;
  }
};

const generateExplanation = (
  carType: CarType,
  season: Season,
  region: Region,
  carTypeMultiplier: number,
  seasonMultiplier: number,
  regionMultiplier: number
): string => {
  const explanations: string[] = [];

  if (carType === "SUV" || carType === "MUV") {
    explanations.push("SUV demand increases during monsoon in hilly regions");
  } else if (carType === "Sedan") {
    explanations.push("Sedan offers stability and comfort, steady value retention");
  } else if (carType === "Hatchback") {
    explanations.push("Hatchback is practical for city commutes");
  }

  if (region === "Hilly") {
    explanations.push("Higher demand in hilly regions for better traction");
  } else if (region === "Metro") {
    explanations.push("Metro fuel costs slightly adjust resale value");
  } else if (region === "Rural") {
    explanations.push("Rural market stability maintains standard pricing");
  }

  if (season === "Monsoon") {
    explanations.push("Monsoon season increases demand for reliable vehicles");
  } else if (season === "Winter") {
    explanations.push("Winter conditions boost safe vehicle preference");
  } else if (season === "Summer") {
    explanations.push("Summer season shows moderate demand patterns");
  }

  return explanations.join(". ");
};

export const calculateRecommendedPrice = (
  basePrice: number,
  carType: CarType,
  region: Region,
  currentDate: Date = new Date()
): PricingResult => {
  const season = detectSeason(currentDate);

  const carTypeMultiplier = getCarTypeMultiplier(carType);
  const seasonMultiplier = getSeasonMultiplier(season);
  const regionMultiplier = getRegionMultiplier(region);

  const totalMultiplier = carTypeMultiplier * seasonMultiplier * regionMultiplier;
  const recommendedPrice = Math.round(basePrice * totalMultiplier);

  const explanation = generateExplanation(
    carType,
    season,
    region,
    carTypeMultiplier,
    seasonMultiplier,
    regionMultiplier
  );

  return {
    basePrice,
    recommendedPrice,
    multiplier: Math.round(totalMultiplier * 10000) / 10000,
    explanation,
  };
};

export const detectCarType = (carTitle: string): CarType => {
  const title = carTitle.toLowerCase();

  if (title.includes("suv") || title.includes("creta") || title.includes("nexon") || title.includes("xuv"))
    return "SUV";
  if (title.includes("sedan") || title.includes("city") || title.includes("verna")) return "Sedan";
  if (title.includes("hatchback") || title.includes("swift") || title.includes("baleno") || title.includes("alto"))
    return "Hatchback";
  if (title.includes("muv") || title.includes("ertiga")) return "MUV";

  return "Sedan";
};
