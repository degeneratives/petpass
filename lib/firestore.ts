import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Pet } from '@/types/pet';

/**
 * Firestore Database Functions for PetPass
 * Handles all CRUD operations for pets in Firestore
 */

// Upload base64 image to Firebase Storage
async function uploadImage(base64Data: string, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadString(storageRef, base64Data, 'data_url');
  return getDownloadURL(storageRef);
}

// Upload multiple images
async function uploadImages(base64Images: string[], basePath: string): Promise<string[]> {
  const uploadPromises = base64Images.map((img, index) =>
    uploadImage(img, `${basePath}/${Date.now()}_${index}.jpg`)
  );
  return Promise.all(uploadPromises);
}

// Create a new pet
export async function createPet(pet: Omit<Pet, 'createdAt' | 'updatedAt'>): Promise<Pet> {
  const petRef = doc(db, 'pets', pet.petId);

  // Upload images to Firebase Storage if they're base64
  const petData: any = { ...pet };

  // Upload profile photo
  if (pet.profile.photoUrl && pet.profile.photoUrl.startsWith('data:')) {
    petData.profile.photoUrl = await uploadImage(
      pet.profile.photoUrl,
      `pets/${pet.petId}/profile.jpg`
    );
  }

  // Upload owner photo
  if (pet.owner.photoUrl && pet.owner.photoUrl.startsWith('data:')) {
    petData.owner.photoUrl = await uploadImage(
      pet.owner.photoUrl,
      `pets/${pet.petId}/owner.jpg`
    );
  }

  // Upload health images
  if (pet.health.vaccinationImages?.length) {
    const base64Images = pet.health.vaccinationImages.filter(img => img.startsWith('data:'));
    if (base64Images.length > 0) {
      petData.health.vaccinationImages = await uploadImages(
        base64Images,
        `pets/${pet.petId}/vaccinations`
      );
    }
  }

  if (pet.health.prescriptions?.length) {
    const base64Images = pet.health.prescriptions.filter(img => img.startsWith('data:'));
    if (base64Images.length > 0) {
      petData.health.prescriptions = await uploadImages(
        base64Images,
        `pets/${pet.petId}/prescriptions`
      );
    }
  }

  if (pet.health.certifications?.length) {
    const base64Images = pet.health.certifications.filter(img => img.startsWith('data:'));
    if (base64Images.length > 0) {
      petData.health.certifications = await uploadImages(
        base64Images,
        `pets/${pet.petId}/certifications`
      );
    }
  }

  const newPet: Pet = {
    ...petData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(petRef, newPet);
  return newPet;
}

// Get a pet by ID
export async function getPetById(petId: string): Promise<Pet | null> {
  const petRef = doc(db, 'pets', petId);
  const petSnap = await getDoc(petRef);

  if (!petSnap.exists()) {
    return null;
  }

  return petSnap.data() as Pet;
}

// Get all pets for a specific owner
export async function getPetsByOwner(ownerId: string): Promise<Pet[]> {
  const petsRef = collection(db, 'pets');
  const q = query(petsRef, where('ownerId', '==', ownerId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => doc.data() as Pet);
}

// Update a pet
export async function updatePet(petId: string, updates: Partial<Pet>): Promise<void> {
  const petRef = doc(db, 'pets', petId);

  // Upload new images if they're base64
  const updatedData: any = { ...updates };

  if (updates.profile?.photoUrl && updates.profile.photoUrl.startsWith('data:')) {
    updatedData.profile.photoUrl = await uploadImage(
      updates.profile.photoUrl,
      `pets/${petId}/profile.jpg`
    );
  }

  if (updates.owner?.photoUrl && updates.owner.photoUrl.startsWith('data:')) {
    updatedData.owner.photoUrl = await uploadImage(
      updates.owner.photoUrl,
      `pets/${petId}/owner.jpg`
    );
  }

  if (updates.health?.vaccinationImages?.length) {
    const base64Images = updates.health.vaccinationImages.filter(img => img.startsWith('data:'));
    if (base64Images.length > 0) {
      const existingImages = updates.health.vaccinationImages.filter(img => !img.startsWith('data:'));
      const newImages = await uploadImages(base64Images, `pets/${petId}/vaccinations`);
      updatedData.health.vaccinationImages = [...existingImages, ...newImages];
    }
  }

  if (updates.health?.prescriptions?.length) {
    const base64Images = updates.health.prescriptions.filter(img => img.startsWith('data:'));
    if (base64Images.length > 0) {
      const existingImages = updates.health.prescriptions.filter(img => !img.startsWith('data:'));
      const newImages = await uploadImages(base64Images, `pets/${petId}/prescriptions`);
      updatedData.health.prescriptions = [...existingImages, ...newImages];
    }
  }

  if (updates.health?.certifications?.length) {
    const base64Images = updates.health.certifications.filter(img => img.startsWith('data:'));
    if (base64Images.length > 0) {
      const existingImages = updates.health.certifications.filter(img => !img.startsWith('data:'));
      const newImages = await uploadImages(base64Images, `pets/${petId}/certifications`);
      updatedData.health.certifications = [...existingImages, ...newImages];
    }
  }

  await updateDoc(petRef, {
    ...updatedData,
    updatedAt: serverTimestamp()
  });
}

// Delete a pet
export async function deletePet(petId: string): Promise<void> {
  const petRef = doc(db, 'pets', petId);
  await deleteDoc(petRef);
}
