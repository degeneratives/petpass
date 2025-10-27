'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { localStorageDB } from '@/lib/localStorage';
import { Pet } from '@/types/pet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import Image from 'next/image';

export default function PetProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const petId = params.id as string;
  const [pet, setPet] = useState<Pet | null>(null);
  const [loadingPet, setLoadingPet] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (petId) {
      fetchPet();
    }
  }, [petId]);

  const fetchPet = async () => {
    try {
      const petData = localStorageDB.getPetById(petId);
      if (petData) {
        setPet(petData);
      } else {
        alert('Pet not found');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching pet:', error);
    } finally {
      setLoadingPet(false);
    }
  };

  if (loading || loadingPet || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-mono text-primary">Loading...</p>
      </div>
    );
  }

  if (!pet) {
    return null;
  }

  const petUrl = `${window.location.origin}/pets/${petId}`;
  const age = pet.profile.dob ? Math.floor((new Date().getTime() - new Date(pet.profile.dob).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-primary bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline font-mono text-sm">
              ← Back to Dashboard
            </Link>
            <Link href={`/pets/${petId}/edit`}>
              <Button className="bg-primary hover:bg-primary/90 font-mono text-xs sm:text-sm">
                Edit Profile
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary">
                <AvatarImage src={pet.profile.photoUrl} alt={pet.profile.name} />
                <AvatarFallback className="bg-secondary font-serif text-4xl sm:text-5xl">
                  {pet.profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {pet.profile.name}
                </h1>
                <p className="font-mono text-xs uppercase text-muted-foreground mb-4">
                  {pet.profile.species} • {pet.profile.breed} • {age} {age === 1 ? 'year' : 'years'} old
                </p>
                <Badge variant={pet.privacy === 'public' ? 'default' : 'secondary'} className="font-mono">
                  {pet.privacy}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
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
                  onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                  className={`w-full p-4 text-left font-mono text-sm uppercase border-b-2 border-primary ${activeTab === 'overview' ? 'bg-white/65 text-primary' : 'text-primary'}`}
                >
                  Overview
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
                  onClick={() => { setActiveTab('qr'); setMobileMenuOpen(false); }}
                  className={`w-full p-4 text-left font-mono text-sm uppercase ${activeTab === 'qr' ? 'bg-white/65 text-primary' : 'text-primary'}`}
                >
                  QR Code
                </button>
              </div>
            )}
          </div>

          {/* Desktop Tabs */}
          <TabsList className="hidden sm:grid w-full grid-cols-4 gap-0 bg-secondary border-2 border-primary p-1">
            <TabsTrigger value="overview" className="font-mono text-xs sm:text-sm uppercase px-2 sm:px-4 -mt-1 data-[state=active]:bg-white/65 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm">Overview</TabsTrigger>
            <TabsTrigger value="health" className="font-mono text-xs sm:text-sm uppercase px-2 sm:px-4 -mt-1 data-[state=active]:bg-white/65 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm">Health</TabsTrigger>
            <TabsTrigger value="fun" className="font-mono text-xs sm:text-sm uppercase px-2 sm:px-4 -mt-1 data-[state=active]:bg-white/65 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm">Fun</TabsTrigger>
            <TabsTrigger value="qr" className="font-mono text-xs sm:text-sm uppercase px-2 sm:px-4 -mt-1 data-[state=active]:bg-white/65 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm">QR</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Pet Photos */}
            {pet.profile.photos && pet.profile.photos.length > 0 && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {pet.profile.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={photo}
                          alt={`${pet.profile.name} ${index + 1}`}
                          fill
                          className="rounded-lg border-4 border-primary object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Owner Info */}
            {pet.owner && (
              <Card className="border-2 border-primary bg-accent/10">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Owner Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {pet.owner.photoUrl && (
                      <Image
                        src={pet.owner.photoUrl}
                        alt={pet.owner.name}
                        width={100}
                        height={100}
                        className="rounded-full border-4 border-primary object-cover"
                      />
                    )}
                    <div className="space-y-3 flex-1 w-full">
                      <div>
                        <p className="font-mono text-xs uppercase text-muted-foreground">Name</p>
                        <p className="font-sans text-lg font-bold">{pet.owner.name}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-mono text-xs uppercase text-muted-foreground">Email</p>
                          <p className="font-sans">{pet.owner.email}</p>
                        </div>
                        {pet.owner.phone && (
                          <div>
                            <p className="font-mono text-xs uppercase text-muted-foreground">Phone</p>
                            <p className="font-sans">{pet.owner.phone}</p>
                          </div>
                        )}
                      </div>
                      {pet.owner.address && (
                        <div>
                          <p className="font-mono text-xs uppercase text-muted-foreground">Address</p>
                          <p className="font-sans">{pet.owner.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground">Color</p>
                    <p className="font-sans">{pet.profile.color}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground">Weight</p>
                    <p className="font-sans">{pet.profile.weight}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground">Date of Birth</p>
                    <p className="font-sans">{format(new Date(pet.profile.dob), 'MMMM dd, yyyy')}</p>
                  </div>
                  {pet.profile.microchip && (
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground">Microchip</p>
                      <p className="font-sans font-mono text-sm">{pet.profile.microchip}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Travel Info */}
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Travel & Legal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pet.travel.passportNumber && (
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground">Passport Number</p>
                      <p className="font-sans font-mono text-sm">{pet.travel.passportNumber}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground">Country of Origin</p>
                    <p className="font-sans">{pet.travel.countryOfOrigin || 'Not specified'}</p>
                  </div>
                  {pet.travel.travelHistory.length > 0 && (
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground">Travel History</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {pet.travel.travelHistory.map((country, idx) => (
                          <Badge key={idx} variant="secondary" className="font-mono text-xs">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">Veterinary Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground">Veterinarian</p>
                    <p className="font-sans">{pet.health.vet || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground">Clinic</p>
                    <p className="font-sans">{pet.health.clinic || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase text-muted-foreground">Contact</p>
                  <p className="font-sans">{pet.health.contact || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Allergies</CardTitle>
                </CardHeader>
                <CardContent>
                  {pet.health.allergies.length > 0 ? (
                    <ul className="space-y-2">
                      {pet.health.allergies.map((allergy, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-primary">→</span>
                          <span className="font-sans">{allergy}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground font-sans">No allergies recorded</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  {pet.health.medications.length > 0 ? (
                    <ul className="space-y-2">
                      {pet.health.medications.map((med, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-primary">→</span>
                          <span className="font-sans">{med}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground font-sans">No medications recorded</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">Vaccinations</CardTitle>
              </CardHeader>
              <CardContent>
                {pet.health.vaccinations.length > 0 ? (
                  <div className="space-y-4">
                    {pet.health.vaccinations.map((vax, idx) => (
                      <div key={idx} className="border-l-4 border-primary pl-4">
                        <p className="font-mono text-sm font-bold">{vax.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Given: {format(new Date(vax.date), 'MMM dd, yyyy')} |
                          Expires: {format(new Date(vax.expiry), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground font-sans">No vaccinations recorded</p>
                )}
              </CardContent>
            </Card>

            {/* Nutrition & Feeding */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">Nutrition & Feeding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pet.health.foodBrand && (
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground">Food Brand</p>
                      <p className="font-sans">{pet.health.foodBrand}</p>
                    </div>
                  )}
                  {pet.health.treatBrand && (
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground">Treat Brand</p>
                      <p className="font-sans">{pet.health.treatBrand}</p>
                    </div>
                  )}
                  {pet.health.vitaminBrand && (
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground">Vitamin Brand</p>
                      <p className="font-sans">{pet.health.vitaminBrand}</p>
                    </div>
                  )}
                </div>
                {pet.health.feedingSchedule && (
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground">Feeding Schedule</p>
                    <p className="font-sans">{pet.health.feedingSchedule}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Issues */}
            {pet.health.healthIssues && pet.health.healthIssues.length > 0 && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Health Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pet.health.healthIssues.map((issue, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-primary">→</span>
                        <span className="font-sans">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Vaccination Images */}
            {pet.health.vaccinationImages && pet.health.vaccinationImages.length > 0 && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Vaccination Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {pet.health.vaccinationImages.map((image, idx) => (
                      <div key={idx} className="relative aspect-square">
                        <Image
                          src={image}
                          alt={`Vaccination record ${idx + 1}`}
                          fill
                          className="rounded-lg border-4 border-primary object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prescriptions */}
            {pet.health.prescriptions && pet.health.prescriptions.length > 0 && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {pet.health.prescriptions.map((image, idx) => (
                      <div key={idx} className="relative aspect-square">
                        <Image
                          src={image}
                          alt={`Prescription ${idx + 1}`}
                          fill
                          className="rounded-lg border-4 border-primary object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {pet.health.certifications && pet.health.certifications.length > 0 && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {pet.health.certifications.map((image, idx) => (
                      <div key={idx} className="relative aspect-square">
                        <Image
                          src={image}
                          alt={`Certification ${idx + 1}`}
                          fill
                          className="rounded-lg border-4 border-primary object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Fun Tab */}
          <TabsContent value="fun" className="space-y-6">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">About {pet.profile.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pet.fun.bio && (
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground mb-2">Bio</p>
                    <p className="font-sans text-lg">{pet.fun.bio}</p>
                  </div>
                )}
                {pet.fun.nicknames.length > 0 && (
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground mb-2">Nicknames</p>
                    <div className="flex flex-wrap gap-2">
                      {pet.fun.nicknames.map((nickname, idx) => (
                        <Badge key={idx} variant="secondary" className="font-sans">
                          {nickname}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {pet.fun.quirks && (
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground mb-2">Quirks</p>
                    <p className="font-sans italic">"{pet.fun.quirks}"</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pet.fun.instagram && (
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground mb-2">Instagram</p>
                      <a
                        href={`https://instagram.com/${pet.fun.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-primary hover:underline"
                      >
                        {pet.fun.instagram}
                      </a>
                    </div>
                  )}
                  {pet.fun.tiktok && (
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground mb-2">TikTok</p>
                      <a
                        href={`https://tiktok.com/@${pet.fun.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-primary hover:underline"
                      >
                        {pet.fun.tiktok}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary bg-accent/20">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">Favorite Food</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-sans text-2xl">{pet.fun.favorites.food || '—'}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary bg-accent/20">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">Favorite Toy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-sans text-2xl">{pet.fun.favorites.toy || '—'}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">Share {pet.profile.name}'s Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-6">
                  <div className="bg-white p-8 border-4 border-primary">
                    <QRCode value={petUrl} size={256} />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-mono text-xs uppercase text-muted-foreground">
                      Scan to view profile
                    </p>
                    <p className="font-sans text-sm text-foreground/70 break-all max-w-md">
                      {petUrl}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(petUrl);
                      alert('Link copied to clipboard!');
                    }}
                    className="bg-primary hover:bg-primary/90 font-mono uppercase"
                  >
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
