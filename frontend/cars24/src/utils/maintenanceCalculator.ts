const brandServiceCosts: { [key: string]: number } = {
  "maruti": 8000,
  "hyundai": 9500,
  "honda": 10000,
  "tata": 7500,
  "mahindra": 8500,
  "kia": 10000,
  "skoda": 12000,
  "volkswagen": 11500,
  "toyota": 10500,
  "bmw": 15000,
  "audi": 16000,
  "mercedes": 17000,
  "default": 9000,
};

const serviceIntervals = {
  minor: 5000,
  major: 40000,
  tireReplacement: 50000,
  batteryReplacement: 48000,
  brakeFluidChange: 40000,
  coolantChange: 50000,
};

export enum MaintenanceCondition {
  EXCELLENT = 0.7,
  GOOD = 0.9,
  AVERAGE = 1.0,
  POOR = 1.3,
}

interface MaintenanceEstimate {
  monthlyEstimate: number;
  status: "Good" | "Average" | "High Maintenance Expected";
  statusColor: string;
  insights: string[];
  nextServices: {
    service: string;
    kmRemaining: number;
    daysRemaining?: number;
  }[];
  estimatedAnnualCost: number;
}

export const calculateMaintenanceCost = (
  carAge: number, // in years
  kmDriven: number,
  brand: string,
  condition: MaintenanceCondition = MaintenanceCondition.AVERAGE
): MaintenanceEstimate => {
  const baseCost = brandServiceCosts[brand.toLowerCase()] || brandServiceCosts["default"];
  
  let ageMultiplier = 1.0;
  if (carAge <= 2) ageMultiplier = 0.8;
  else if (carAge <= 5) ageMultiplier = 1.0;
  else if (carAge <= 8) ageMultiplier = 1.3;
  else ageMultiplier = 1.6;

  let kmMultiplier = 1.0;
  if (kmDriven <= 40000) kmMultiplier = 0.9;
  else if (kmDriven <= 80000) kmMultiplier = 1.0;
  else if (kmDriven <= 120000) kmMultiplier = 1.2;
  else kmMultiplier = 1.4;

  const estimatedAnnualCost = Math.round(
    baseCost * ageMultiplier * kmMultiplier * condition
  );

  const monthlyEstimate = Math.round(estimatedAnnualCost / 12);

  let status: "Good" | "Average" | "High Maintenance Expected" = "Average";
  let statusColor = "bg-yellow-100 text-yellow-800";

  if (carAge > 7 && kmDriven > 80000) {
    status = "High Maintenance Expected";
    statusColor = "bg-red-100 text-red-800";
  } else if (carAge <= 3 && kmDriven <= 60000) {
    status = "Good";
    statusColor = "bg-green-100 text-green-800";
  }

  const nextServices: MaintenanceEstimate["nextServices"] = [];
  
  const nextMinorServiceKm = Math.ceil(kmDriven / 5000) * 5000 + 5000;
  const minorKmRemaining = nextMinorServiceKm - kmDriven;
  if (minorKmRemaining > 0) {
    nextServices.push({
      service: "Next Minor Service",
      kmRemaining: minorKmRemaining,
    });
  }

  const nextMajorServiceKm = Math.ceil(kmDriven / 40000) * 40000 + 40000;
  const majorKmRemaining = nextMajorServiceKm - kmDriven;
  if (majorKmRemaining > 0) {
    nextServices.push({
      service: "Next Major Service",
      kmRemaining: majorKmRemaining,
    });
  }

  const nextTireReplacementKm = Math.ceil(kmDriven / 50000) * 50000 + 50000;
  const tireKmRemaining = nextTireReplacementKm - kmDriven;
  if (tireKmRemaining > 0 && tireKmRemaining < 10000) {
    nextServices.push({
      service: "Tire Replacement Expected",
      kmRemaining: tireKmRemaining,
    });
  }

  if (carAge >= 3 || kmDriven >= 48000) {
    nextServices.push({
      service: "Battery Replacement May Be Due",
      kmRemaining: 0,
    });
  }

  const insights: string[] = [];

  if (carAge > 7) {
    insights.push(
      `🚗 Your ${carAge}-year-old car may need more frequent servicing.`
    );
  }

  if (kmDriven > 80000) {
    insights.push(
      `📊 High mileage (${kmDriven.toLocaleString()} km) detected. Consider checking engine and transmission health.`
    );
  }

  if (status === "High Maintenance Expected") {
    insights.push(
      "⚠️ Based on age and mileage, budget extra for unexpected repairs."
    );
  } else if (status === "Good") {
    insights.push(
      "✅ Your car is in good condition. Maintain regular service schedule."
    );
  }

  if (carAge <= 3) {
    insights.push("📅 Keep warranty documents safe during this period.");
  }

  return {
    monthlyEstimate,
    status,
    statusColor,
    insights,
    nextServices: nextServices.sort((a, b) => a.kmRemaining - b.kmRemaining).slice(0, 4),
    estimatedAnnualCost,
  };
};

export const getConditionFromString = (condition: string): MaintenanceCondition => {
  const conditionMap: { [key: string]: MaintenanceCondition } = {
    excellent: MaintenanceCondition.EXCELLENT,
    good: MaintenanceCondition.GOOD,
    average: MaintenanceCondition.AVERAGE,
    poor: MaintenanceCondition.POOR,
  };
  return conditionMap[condition.toLowerCase()] || MaintenanceCondition.AVERAGE;
};
