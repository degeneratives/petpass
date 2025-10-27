'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPetById, updatePet } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import Image from 'next/image';
import { Pet } from '@/types/pet';

export default function EditPet() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const petId = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loadingPet, setLoadingPet] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Photos
  const [petPhotos, setPetPhotos] = useState<string[]>([]);
  const [ownerPhoto, setOwnerPhoto] = useState<string>('');

  // Owner Info
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');

  // Profile
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [dob, setDob] = useState('');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [microchip, setMicrochip] = useState('');

  // Health
  const [vet, setVet] = useState('');
  const [clinic, setClinic] = useState('');
  const [vetContact, setVetContact] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [foodBrand, setFoodBrand] = useState('');
  const [treatBrand, setTreatBrand] = useState('');
  const [vitaminBrand, setVitaminBrand] = useState('');
  const [feedingSchedule, setFeedingSchedule] = useState('');
  const [healthIssues, setHealthIssues] = useState('');
  const [vaccinationImages, setVaccinationImages] = useState<string[]>([]);
  const [prescriptions, setPrescriptions] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);

  // Fun
  const [nicknames, setNicknames] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [favoriteToy, setFavoriteToy] = useState('');
  const [quirks, setQuirks] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');

  // Travel
  const [passportNumber, setPassportNumber] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [travelHistory, setTravelHistory] = useState('');

  // Privacy
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'invite-only'>('public');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (petId) {
      loadPetData();
    }
  }, [petId]);

  const loadPetData = async () => {
    const pet = await getPetById(petId);
    if (!pet) {
      alert('Pet not found');
      router.push('/dashboard');
      return;
    }

    // Load photos
    setPetPhotos(pet.profile.photos || []);
    setOwnerPhoto(pet.owner?.photoUrl || '');

    // Load owner info
    setOwnerName(pet.owner?.name || '');
    setOwnerEmail(pet.owner?.email || '');
    setOwnerPhone(pet.owner?.phone || '');
    setOwnerAddress(pet.owner?.address || '');

    // Load profile
    setName(pet.profile.name);
    setSpecies(pet.profile.species);
    setBreed(pet.profile.breed);
    setDob(pet.profile.dob);
    setColor(pet.profile.color);
    setWeight(pet.profile.weight);
    setMicrochip(pet.profile.microchip || '');

    // Load health
    setVet(pet.health.vet);
    setClinic(pet.health.clinic);
    setVetContact(pet.health.contact);
    setAllergies(pet.health.allergies.join(', '));
    setMedications(pet.health.medications.join(', '));
    setFoodBrand(pet.health.foodBrand || '');
    setTreatBrand(pet.health.treatBrand || '');
    setVitaminBrand(pet.health.vitaminBrand || '');
    setFeedingSchedule(pet.health.feedingSchedule || '');
    setHealthIssues((pet.health.healthIssues || []).join(', '));
    setVaccinationImages(pet.health.vaccinationImages || []);
    setPrescriptions(pet.health.prescriptions || []);
    setCertifications(pet.health.certifications || []);

    // Load fun
    setNicknames(pet.fun.nicknames.join(', '));
    setBio(pet.fun.bio);
    setFavoriteFood(pet.fun.favorites.food || '');
    setFavoriteToy(pet.fun.favorites.toy || '');
    setQuirks(pet.fun.quirks || '');
    setInstagram(pet.fun.instagram || '');
    setTiktok(pet.fun.tiktok || '');

    // Load travel
    setPassportNumber(pet.travel.passportNumber || '');
    setCountryOfOrigin(pet.travel.countryOfOrigin);
    setTravelHistory(pet.travel.travelHistory.join(', '));

    // Load privacy
    setPrivacy(pet.privacy);

    setLoadingPet(false);
  };

  const compressImage = (file: File, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pet' | 'owner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      if (type === 'pet') {
        if (petPhotos.length < 3) {
          setPetPhotos([...petPhotos, compressed]);
        }
      } else {
        setOwnerPhoto(compressed);
      }
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to process image');
    }
  };

  const removePetPhoto = (index: number) => {
    setPetPhotos(petPhotos.filter((_, i) => i !== index));
  };

  const handleHealthImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'vaccination' | 'prescription' | 'certification') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const compressedImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i]);
        compressedImages.push(compressed);
      }

      if (type === 'vaccination') {
        setVaccinationImages([...vaccinationImages, ...compressedImages]);
      } else if (type === 'prescription') {
        setPrescriptions([...prescriptions, ...compressedImages]);
      } else if (type === 'certification') {
        setCertifications([...certifications, ...compressedImages]);
      }
    } catch (error) {
      console.error('Error compressing images:', error);
      alert('Failed to process images');
    }
  };

  const removeHealthImage = (index: number, type: 'vaccination' | 'prescription' | 'certification') => {
    if (type === 'vaccination') {
      setVaccinationImages(vaccinationImages.filter((_, i) => i !== index));
    } else if (type === 'prescription') {
      setPrescriptions(prescriptions.filter((_, i) => i !== index));
    } else if (type === 'certification') {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const updatedData = {
        owner: {
          name: ownerName,
          email: ownerEmail,
          phone: ownerPhone,
          address: ownerAddress,
          photoUrl: ownerPhoto,
        },
        profile: {
          name,
          species,
          breed,
          dob,
          color,
          weight,
          microchip,
          photoUrl: petPhotos[0] || '',
          photos: petPhotos,
          qrUrl: '',
        },
        health: {
          vet,
          clinic,
          contact: vetContact,
          allergies: allergies.split(',').map(a => a.trim()).filter(Boolean),
          medications: medications.split(',').map(m => m.trim()).filter(Boolean),
          vaccinations: [],
          foodBrand,
          treatBrand,
          vitaminBrand,
          feedingSchedule,
          healthIssues: healthIssues.split(',').map(h => h.trim()).filter(Boolean),
          vaccinationImages,
          prescriptions,
          certifications,
        },
        fun: {
          nicknames: nicknames.split(',').map(n => n.trim()).filter(Boolean),
          bio,
          favorites: {
            food: favoriteFood,
            toy: favoriteToy,
          },
          quirks,
          instagram,
          tiktok,
        },
        travel: {
          passportNumber,
          countryOfOrigin,
          travelHistory: travelHistory.split(',').map(t => t.trim()).filter(Boolean),
        },
        privacy,
      };

      await updatePet(petId, updatedData);
      router.push(`/pets/${petId}`);
    } catch (error) {
      console.error('Error updating pet:', error);
      if (error instanceof Error && error.message.includes('quota')) {
        alert('Storage quota exceeded. Please use smaller images or delete some pets to free up space.');
      } else {
        alert('Failed to update pet profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingPet || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-mono text-primary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-primary bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href={`/pets/${petId}`} className="inline-flex items-center gap-2 mb-4 text-primary hover:underline font-mono text-sm">
            ← Back to Profile
          </Link>
          <h1 className="font-serif text-4xl font-bold text-primary">Edit Pet Profile</h1>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Update your pet's information
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit}>
          {/* Owner Information */}
          <Card className="border-2 border-primary mb-8">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-primary">Owner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="space-y-2 w-full sm:w-auto flex flex-col items-center sm:items-start">
                  <Label className="font-mono text-xs uppercase">Owner Photo</Label>
                  <div className="flex flex-col items-center gap-2">
                    {ownerPhoto ? (
                      <div className="relative">
                        <Image
                          src={ownerPhoto}
                          alt="Owner"
                          width={120}
                          height={120}
                          className="rounded-full border-4 border-primary object-cover w-[120px] h-[120px]"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                          onClick={() => setOwnerPhoto('')}
                        >
                          ×
                        </Button>
                      </div>
                    ) : (
                      <div className="w-[120px] h-[120px] rounded-full border-4 border-dashed border-primary flex items-center justify-center bg-secondary">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'owner')}
                      className="border-2 border-primary text-sm"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName" className="font-mono text-xs uppercase">Name *</Label>
                      <Input
                        id="ownerName"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="border-2 border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerEmail" className="font-mono text-xs uppercase">Email *</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        className="border-2 border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerPhone" className="font-mono text-xs uppercase">Phone</Label>
                      <Input
                        id="ownerPhone"
                        type="tel"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        className="border-2 border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerAddress" className="font-mono text-xs uppercase">Address</Label>
                      <Input
                        id="ownerAddress"
                        value={ownerAddress}
                        onChange={(e) => setOwnerAddress(e.target.value)}
                        className="border-2 border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-full bg-secondary border-2 border-primary p-4 flex items-center justify-between font-mono text-sm uppercase text-primary"
              >
                <span>{activeTab}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {mobileMenuOpen && (
                <div className="mt-2 bg-secondary border-2 border-primary">
                  <button
                    onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                    className={`w-full p-4 text-left font-mono text-sm uppercase border-b-2 border-primary ${activeTab === 'profile' ? 'bg-white/65 text-primary' : 'text-primary'}`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { setActiveTab('health'); setMobileMenuOpen(false); }}
                    className={`w-full p-4 text-left font-mono text-sm uppercase border-b-2 border-primary ${activeTab === 'health' ? 'bg-white/65 text-primary' : 'text-primary'}`}
                  >
                    Health
                  </button>
                  <button
                    onClick={() => { setActiveTab('fun'); setMobileMenuOpen(false); }}
                    className={`w-full p-4 text-left font-mono text-sm uppercase border-b-2 border-primary ${activeTab === 'fun' ? 'bg-white/65 text-primary' : 'text-primary'}`}
                  >
                    Fun
                  </button>
                  <button
                    onClick={() => { setActiveTab('travel'); setMobileMenuOpen(false); }}
                    className={`w-full p-4 text-left font-mono text-sm uppercase ${activeTab === 'travel' ? 'bg-white/65 text-primary' : 'text-primary'}`}
                  >
                    Travel
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Tabs */}
            <TabsList className="hidden sm:grid w-full grid-cols-4 gap-0 bg-secondary border-2 border-primary p-1">
              <TabsTrigger value="profile" className="font-mono text-xs sm:text-sm uppercase px-2 sm:px-4 -mt-1 data-[state=active]:bg-white/65 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm">Profile</TabsTrigger>
              <TabsTrigger value="health" className="font-mono text-xs sm:text-sm uppercase px-2 sm:px-4 -mt-1 data-[state=active]:bg-white/65 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm">Health</TabsTrigger>
              <TabsTrigger value="fun" className="font-mono text-xs sm:text-sm uppercase px-2 sm:px-4 -mt-1 data-[state=active]:bg-white/65 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm">Fun</TabsTrigger>
              <TabsTrigger value="travel" className="font-mono text-xs sm:text-sm uppercase px-2 sm:px-4 -mt-1 data-[state=active]:bg-white/65 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm">Travel</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Pet Photos & Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo Upload Section */}
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase">Pet Photos (up to 3)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[0, 1, 2].map((index) => (
                        <div key={index}>
                          {petPhotos[index] ? (
                            <div className="relative aspect-square">
                              <Image
                                src={petPhotos[index]}
                                alt={`Pet ${index + 1}`}
                                fill
                                className="rounded-lg border-4 border-primary object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                                onClick={() => removePetPhoto(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            <label className="aspect-square border-4 border-dashed border-primary rounded-lg flex flex-col items-center justify-center cursor-pointer bg-secondary hover:bg-secondary/80 transition">
                              <span className="text-4xl mb-2">🐾</span>
                              <span className="font-mono text-xs text-muted-foreground">Upload</span>
                              <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'pet')}
                                disabled={petPhotos.length >= 3}
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-mono text-xs uppercase">Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-2 border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="species" className="font-mono text-xs uppercase">Species *</Label>
                      <Select value={species} onValueChange={setSpecies} required>
                        <SelectTrigger className="border-2 border-primary">
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Bird">Bird</SelectItem>
                          <SelectItem value="Rabbit">Rabbit</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="breed" className="font-mono text-xs uppercase">Breed *</Label>
                      <Input
                        id="breed"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        className="border-2 border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="font-mono text-xs uppercase">Date of Birth *</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="border-2 border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color" className="font-mono text-xs uppercase">Color *</Label>
                      <Input
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="border-2 border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="font-mono text-xs uppercase">Weight *</Label>
                      <Input
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="e.g., 12kg"
                        className="border-2 border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="microchip" className="font-mono text-xs uppercase">Microchip Number</Label>
                    <Input
                      id="microchip"
                      value={microchip}
                      onChange={(e) => setMicrochip(e.target.value)}
                      className="border-2 border-primary"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Health Tab */}
            <TabsContent value="health">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Health Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vet" className="font-mono text-xs uppercase">Veterinarian Name</Label>
                      <Input
                        id="vet"
                        value={vet}
                        onChange={(e) => setVet(e.target.value)}
                        className="border-2 border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic" className="font-mono text-xs uppercase">Clinic Name</Label>
                      <Input
                        id="clinic"
                        value={clinic}
                        onChange={(e) => setClinic(e.target.value)}
                        className="border-2 border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vetContact" className="font-mono text-xs uppercase">Vet Contact</Label>
                    <Input
                      id="vetContact"
                      value={vetContact}
                      onChange={(e) => setVetContact(e.target.value)}
                      placeholder="+63 912 333 1122"
                      className="border-2 border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="font-mono text-xs uppercase">Allergies (comma-separated)</Label>
                    <Input
                      id="allergies"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g., Chicken, Peanuts"
                      className="border-2 border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications" className="font-mono text-xs uppercase">Medications (comma-separated)</Label>
                    <Input
                      id="medications"
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      placeholder="e.g., Timolol drops"
                      className="border-2 border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="healthIssues" className="font-mono text-xs uppercase">Health Issues (comma-separated)</Label>
                    <Input
                      id="healthIssues"
                      value={healthIssues}
                      onChange={(e) => setHealthIssues(e.target.value)}
                      placeholder="e.g., Hip Dysplasia, Arthritis"
                      className="border-2 border-primary"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Nutrition & Feeding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="foodBrand" className="font-mono text-xs uppercase">Food Brand</Label>
                      <Input
                        id="foodBrand"
                        value={foodBrand}
                        onChange={(e) => setFoodBrand(e.target.value)}
                        placeholder="e.g., Royal Canin"
                        className="border-2 border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="treatBrand" className="font-mono text-xs uppercase">Treat Brand</Label>
                      <Input
                        id="treatBrand"
                        value={treatBrand}
                        onChange={(e) => setTreatBrand(e.target.value)}
                        placeholder="e.g., Blue Buffalo"
                        className="border-2 border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vitaminBrand" className="font-mono text-xs uppercase">Vitamin Brand</Label>
                      <Input
                        id="vitaminBrand"
                        value={vitaminBrand}
                        onChange={(e) => setVitaminBrand(e.target.value)}
                        placeholder="e.g., Nutramax"
                        className="border-2 border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedingSchedule" className="font-mono text-xs uppercase">Feeding Schedule</Label>
                    <Textarea
                      id="feedingSchedule"
                      value={feedingSchedule}
                      onChange={(e) => setFeedingSchedule(e.target.value)}
                      placeholder="e.g., 2 cups twice daily at 8am and 6pm"
                      className="border-2 border-primary"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Medical Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Vaccination Images */}
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase">Vaccination Records</Label>
                    {vaccinationImages.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {vaccinationImages.map((image, index) => (
                            <div key={index} className="relative flex-shrink-0 w-24 h-24">
                              <Image
                                src={image}
                                alt={`Vaccination ${index + 1}`}
                                fill
                                className="rounded-lg border-2 border-primary object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeHealthImage(index, 'vaccination')}
                                className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-primary/80 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary rounded-lg cursor-pointer hover:bg-secondary/50 font-mono text-sm uppercase">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleHealthImageUpload(e, 'vaccination')}
                            className="hidden"
                          />
                          <span className="text-primary">+</span>
                          <span>Add More</span>
                        </label>
                      </div>
                    ) : (
                      <label className="block aspect-video border-4 border-dashed border-primary rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleHealthImageUpload(e, 'vaccination')}
                          className="hidden"
                        />
                        <span className="text-4xl text-primary mb-2">+</span>
                        <span className="font-mono text-xs uppercase text-primary">Upload Records</span>
                      </label>
                    )}
                  </div>

                  {/* Prescriptions */}
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase">Prescriptions</Label>
                    {prescriptions.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {prescriptions.map((image, index) => (
                            <div key={index} className="relative flex-shrink-0 w-24 h-24">
                              <Image
                                src={image}
                                alt={`Prescription ${index + 1}`}
                                fill
                                className="rounded-lg border-2 border-primary object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeHealthImage(index, 'prescription')}
                                className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-primary/80 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary rounded-lg cursor-pointer hover:bg-secondary/50 font-mono text-sm uppercase">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleHealthImageUpload(e, 'prescription')}
                            className="hidden"
                          />
                          <span className="text-primary">+</span>
                          <span>Add More</span>
                        </label>
                      </div>
                    ) : (
                      <label className="block aspect-video border-4 border-dashed border-primary rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleHealthImageUpload(e, 'prescription')}
                          className="hidden"
                        />
                        <span className="text-4xl text-primary mb-2">+</span>
                        <span className="font-mono text-xs uppercase text-primary">Upload Prescriptions</span>
                      </label>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase">Certifications</Label>
                    {certifications.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {certifications.map((image, index) => (
                            <div key={index} className="relative flex-shrink-0 w-24 h-24">
                              <Image
                                src={image}
                                alt={`Certification ${index + 1}`}
                                fill
                                className="rounded-lg border-2 border-primary object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeHealthImage(index, 'certification')}
                                className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-primary/80 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary rounded-lg cursor-pointer hover:bg-secondary/50 font-mono text-sm uppercase">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleHealthImageUpload(e, 'certification')}
                            className="hidden"
                          />
                          <span className="text-primary">+</span>
                          <span>Add More</span>
                        </label>
                      </div>
                    ) : (
                      <label className="block aspect-video border-4 border-dashed border-primary rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleHealthImageUpload(e, 'certification')}
                          className="hidden"
                        />
                        <span className="text-4xl text-primary mb-2">+</span>
                        <span className="font-mono text-xs uppercase text-primary">Upload Certifications</span>
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fun Tab */}
            <TabsContent value="fun">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Personality & Fun</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nicknames" className="font-mono text-xs uppercase">Nicknames (comma-separated)</Label>
                    <Input
                      id="nicknames"
                      value={nicknames}
                      onChange={(e) => setNicknames(e.target.value)}
                      placeholder="e.g., Alfy, Sir Snorts-a-Lot"
                      className="border-2 border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="font-mono text-xs uppercase">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about your pet..."
                      className="border-2 border-primary min-h-24"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="favoriteFood" className="font-mono text-xs uppercase">Favorite Food</Label>
                      <Input
                        id="favoriteFood"
                        value={favoriteFood}
                        onChange={(e) => setFavoriteFood(e.target.value)}
                        className="border-2 border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="favoriteToy" className="font-mono text-xs uppercase">Favorite Toy</Label>
                      <Input
                        id="favoriteToy"
                        value={favoriteToy}
                        onChange={(e) => setFavoriteToy(e.target.value)}
                        className="border-2 border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quirks" className="font-mono text-xs uppercase">Quirks</Label>
                    <Input
                      id="quirks"
                      value={quirks}
                      onChange={(e) => setQuirks(e.target.value)}
                      placeholder="e.g., Snores like a freight train"
                      className="border-2 border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="font-mono text-xs uppercase">Instagram Handle</Label>
                      <Input
                        id="instagram"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@yourpet"
                        className="border-2 border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiktok" className="font-mono text-xs uppercase">TikTok Handle</Label>
                      <Input
                        id="tiktok"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        placeholder="@yourpet"
                        className="border-2 border-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Travel Tab */}
            <TabsContent value="travel">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Travel & Legal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passportNumber" className="font-mono text-xs uppercase">Pet Passport Number</Label>
                      <Input
                        id="passportNumber"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        className="border-2 border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countryOfOrigin" className="font-mono text-xs uppercase">Country of Origin</Label>
                      <Input
                        id="countryOfOrigin"
                        value={countryOfOrigin}
                        onChange={(e) => setCountryOfOrigin(e.target.value)}
                        className="border-2 border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelHistory" className="font-mono text-xs uppercase">Travel History (comma-separated)</Label>
                    <Input
                      id="travelHistory"
                      value={travelHistory}
                      onChange={(e) => setTravelHistory(e.target.value)}
                      placeholder="e.g., Japan, Thailand, Singapore"
                      className="border-2 border-primary"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Privacy & Submit */}
          <Card className="border-2 border-primary mt-8">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-primary">Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="privacy" className="font-mono text-xs uppercase">Profile Visibility</Label>
                <Select value={privacy} onValueChange={(value: any) => setPrivacy(value)}>
                  <SelectTrigger className="border-2 border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can view</SelectItem>
                    <SelectItem value="private">Private - Only you can view</SelectItem>
                    <SelectItem value="invite-only">Invite Only - Share via link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary/90 font-mono text-xs sm:text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,109,119,1)]"
                >
                  {saving ? 'Updating...' : 'Update Pet Profile →'}
                </Button>
                <Link href={`/pets/${petId}`} className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full border-2 border-primary font-mono text-xs sm:text-sm">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
