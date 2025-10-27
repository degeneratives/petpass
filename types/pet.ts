export interface Vaccination {
  name: string;
  date: string;
  expiry: string;
  certificate?: string;
}

export interface Health {
  vet: string;
  clinic: string;
  contact: string;
  allergies: string[];
  medications: string[];
  vaccinations: Vaccination[];
  chronicIssues?: string[];
  foodBrand?: string;
  treatBrand?: string;
  vitaminBrand?: string;
  feedingSchedule?: string;
  healthIssues?: string[];
  vaccinationImages?: string[];
  prescriptions?: string[];
  certifications?: string[];
}

export interface Favorites {
  food?: string;
  toy?: string;
}

export interface Fun {
  nicknames: string[];
  bio: string;
  favorites: Favorites;
  quirks?: string;
  instagram?: string;
  tiktok?: string;
}

export interface Travel {
  passportNumber?: string;
  countryOfOrigin: string;
  travelHistory: string[];
  rabiesCertificate?: string;
  healthCertificate?: string;
}

export interface Profile {
  name: string;
  species: string;
  breed: string;
  dob: string;
  color: string;
  weight: string;
  microchip?: string;
  photoUrl?: string;
  photos?: string[]; // Array of up to 3 photos
  qrUrl?: string;
}

export interface Owner {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photoUrl?: string;
}

export type PrivacySetting = 'public' | 'private' | 'invite-only';

export interface Pet {
  petId: string;
  ownerId: string;
  owner: Owner;
  profile: Profile;
  health: Health;
  fun: Fun;
  travel: Travel;
  privacy: PrivacySetting;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
