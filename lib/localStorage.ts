import { Pet } from '@/types/pet';

const PETS_KEY = 'demo_pets';

export const localStorageDB = {
  // Get all pets for a user
  getPetsByOwner: (ownerId: string): Pet[] => {
    const pets = JSON.parse(localStorage.getItem(PETS_KEY) || '[]');
    return pets.filter((pet: Pet) => pet.ownerId === ownerId);
  },

  // Get a single pet by ID
  getPetById: (petId: string): Pet | null => {
    const pets = JSON.parse(localStorage.getItem(PETS_KEY) || '[]');
    return pets.find((pet: Pet) => pet.petId === petId) || null;
  },

  // Add a new pet
  addPet: (pet: Omit<Pet, 'petId'>): Pet => {
    const pets = JSON.parse(localStorage.getItem(PETS_KEY) || '[]');
    const newPet = {
      ...pet,
      petId: `pet_${Date.now()}`,
    };
    pets.push(newPet);
    try {
      localStorage.setItem(PETS_KEY, JSON.stringify(pets));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
      throw error;
    }
    return newPet;
  },

  // Update a pet
  updatePet: (petId: string, updates: Partial<Pet>): Pet | null => {
    const pets = JSON.parse(localStorage.getItem(PETS_KEY) || '[]');
    const index = pets.findIndex((pet: Pet) => pet.petId === petId);

    if (index === -1) return null;

    pets[index] = {
      ...pets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(PETS_KEY, JSON.stringify(pets));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
      throw error;
    }
    return pets[index];
  },

  // Delete a pet
  deletePet: (petId: string): boolean => {
    const pets = JSON.parse(localStorage.getItem(PETS_KEY) || '[]');
    const filtered = pets.filter((pet: Pet) => pet.petId !== petId);

    if (filtered.length === pets.length) return false;

    localStorage.setItem(PETS_KEY, JSON.stringify(filtered));
    return true;
  },
};
