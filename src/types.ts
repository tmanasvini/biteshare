export type UserType = 'dining' | 'shelter' | 'volunteer';

export interface FoodDonation {
  id: string;
  diningHallName: string;
  foodDescription: string;
  foodType: string[];
  portionCount: number;
  imageUrl?: string;
  nutritionInfo?: Record<string, any>;
  dietaryTags: string[];
  allergens: string[];
  status: 'available' | 'matched' | 'completed';
  expiresAt?: Date;
  latitude?: number;
  longitude?: number;
}

export interface ShelterRequest {
  id: string;
  shelterName: string;
  requestText: string;
  parsedRequirements?: Record<string, any>;
  portionCount: number;
  dietaryPreferences: string[];
  status: 'open' | 'matched' | 'fulfilled';
  latitude?: number;
  longitude?: number;
}

export interface VolunteerAvailability {
  id: string;
  volunteerName: string;
  availableDays: string[];
  availableTimes: Record<string, string>;
  maxDeliveriesPerWeek: number;
  vehicleType: string;
  maxDistanceMiles: number;
  isActive: boolean;
}

export interface DeliveryMatch {
  id: string;
  donation: FoodDonation;
  shelter: ShelterRequest;
  volunteer?: VolunteerAvailability;
  distanceMiles: number;
  aiMessage: string;
  status: 'pending' | 'accepted' | 'declined' | 'in_progress' | 'completed';
}
