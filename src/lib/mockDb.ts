import { v4 as uuidv4 } from "uuid";

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
};

export type CarSummary = {
  id: string;
  title: string;
  km: string;
  fuel: string;
  transmission: string;
  owner: string;
  emi: string;
  price: string;
  location: string;
  image: string;
};

export type CarDetail = {
  id: string;
  title: string;
  images: string[];
  price: string;
  emi: string;
  location: string;
  specs: {
    year: number;
    km: string;
    fuel: string;
    transmission: string;
    owner: string;
    insurance: string;
  };
  features: string[];
  highlights: string[];
};

export type BookingRecord = {
  id: string;
  userId: string;
  carId: string;
  booking: {
    preferredDate: string;
    preferredTime: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    paymentMethod: string;
    loanRequired?: string;
    loanStatus?: string;
    downPayment?: string;
  };
};

export type AppointmentRecord = {
  id: string;
  userId: string;
  carId?: string;
  appointment: {
    scheduledDate: string;
    scheduledTime: string;
    location: string;
    appointmentType: "home_inspection" | "branch_visit";
    notes?: string;
    status: "upcoming" | "completed" | "cancelled";
  };
};

export const db = {
  users: [] as User[],
  carsSummaries: [] as CarSummary[],
  carDetails: {} as Record<string, CarDetail>,
  bookings: [] as BookingRecord[],
  appointments: [] as AppointmentRecord[],
};

// seed demo cars
const demoCars: CarSummary[] = [
  {
    id: "1",
    title: "2023 Maruti Suzuki Swift VXI",
    km: "15,000",
    fuel: "Petrol",
    transmission: "Manual",
    owner: "1st owner",
    emi: "₹8,245/m",
    price: "₹6.80 lakh",
    location: "Rohini, New Delhi",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  },
  {
    id: "2",
    title: "2021 Hyundai Creta SX",
    km: "25,000",
    fuel: "Diesel",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹18,999/m",
    price: "₹14.50 lakh",
    location: "Gurgaon, Haryana",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
];

if (db.carsSummaries.length === 0) {
  db.carsSummaries.push(...demoCars);
  demoCars.forEach((c) => {
    db.carDetails[c.id] = {
      id: c.id,
      title: c.title,
      images: [
        "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
        "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
      ],
      price: c.price,
      emi: c.emi.replace("/m", "/month"),
      location: c.location,
      specs: {
        year: 2021,
        km: c.km,
        fuel: c.fuel,
        transmission: c.transmission,
        owner: c.owner,
        insurance: "Comprehensive",
      },
      features: ["ABS", "Airbags"],
      highlights: ["Top Variant"],
    };
  });
}

export function ensureUser(email: string, fullName = "User", phone = ""): User {
  let user = db.users.find((u) => u.email === email);
  if (!user) {
    user = { id: uuidv4(), email, fullName, phone };
    db.users.push(user);
  }
  return user;
}

export function getUserById(userId: string): User | null {
  return db.users.find((u) => u.id === userId) || null;
}

export function createCar(details: Omit<CarDetail, "id">): CarDetail {
  const id = uuidv4();
  const car: CarDetail = { id, ...details };
  db.carDetails[id] = car;
  db.carsSummaries.push({
    id,
    title: details.title,
    km: details.specs.km,
    fuel: details.specs.fuel,
    transmission: details.specs.transmission,
    owner: details.specs.owner,
    emi: details.emi,
    price: details.price,
    location: details.location,
    image: (details.images && details.images[0]) || "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  });
  return car;
}

export function addBooking(userId: string, carId: string, booking: BookingRecord["booking"]): BookingRecord {
  const record: BookingRecord = { id: uuidv4(), userId, carId, booking };
  db.bookings.push(record);
  return record;
}

export function getBookingsByUser(userId: string) {
  return db.bookings
    .filter((b) => b.userId === userId)
    .map((b) => ({ booking: b.booking, car: db.carDetails[b.carId] || db.carDetails[Object.keys(db.carDetails)[0]] }));
}

export function addAppointment(userId: string, carId: string | undefined, appointment: AppointmentRecord["appointment"]): AppointmentRecord {
  const record: AppointmentRecord = { id: uuidv4(), userId, carId, appointment };
  db.appointments.push(record);
  return record;
}

export function getAppointmentsByUser(userId: string) {
  return db.appointments
    .filter((a) => a.userId === userId)
    .map((a) => ({ appointment: a.appointment, car: db.carDetails[a.carId || Object.keys(db.carDetails)[0]] }));
}
