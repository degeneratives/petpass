'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPetById } from '@/lib/firestore';
import { Pet } from '@/types/pet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';

export default function PublicPetProfile() {
  const params = useParams();
  const router = useRouter();
  const petId = params.id as string;
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (petId) {
      fetchPet();
    }
  }, [petId]);

  const fetchPet = async () => {
    try {
      const petData = await getPetById(petId);
      if (petData) {
        // Only show public profiles
        if (petData.privacy !== 'public') {
          setLoading(false);
          return;
        }
        setPet(petData);
      }
    } catch (error) {
      console.error('Error fetching pet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-mono text-primary">Loading...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="border-2 border-primary max-w-md">
          <CardContent className="py-16 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🔒</div>
              <h3 className="font-serif text-2xl font-bold text-primary">
                Private Profile
              </h3>
              <p className="text-muted-foreground font-sans">
                This pet profile is private or doesn't exist.
              </p>
              <Link href={`/?returnTo=${petId}`}>
                <Button className="bg-primary hover:bg-primary/90 font-mono uppercase mt-4">
                  Create Your Pet Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-primary bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">PetPass</h1>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Digital Pet Identity
            </p>
          </div>
          <Link href={`/?returnTo=${petId}`}>
            <Button className="bg-primary hover:bg-primary/90 font-mono uppercase">
              Create Yours
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Pet Profile Card */}
        <Card className="border-2 border-primary shadow-[8px_8px_0px_0px_rgba(0,109,119,1)] mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="w-32 h-32 border-4 border-primary">
                <AvatarImage src={pet.profile.photoUrl} alt={pet.profile.name} />
                <AvatarFallback className="bg-secondary font-serif text-4xl">
                  {pet.profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle className="font-serif text-4xl text-primary mb-2">
                      {pet.profile.name}
                    </CardTitle>
                    <p className="font-mono text-sm uppercase text-muted-foreground">
                      {pet.profile.species} • {pet.profile.breed}
                    </p>
                  </div>
                  <Badge variant="default" className="font-mono">
                    {pet.privacy}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground">Color</p>
                <p className="font-sans text-lg">{pet.profile.color}</p>
              </div>
              {pet.profile.dob && (
                <div>
                  <p className="font-mono text-xs uppercase text-muted-foreground">Born</p>
                  <p className="font-sans text-lg">
                    {format(new Date(pet.profile.dob), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
              {pet.profile.weight && (
                <div>
                  <p className="font-mono text-xs uppercase text-muted-foreground">Weight</p>
                  <p className="font-sans text-lg">{pet.profile.weight}</p>
                </div>
              )}
            </div>

            {/* Bio Preview */}
            {pet.fun?.bio && (
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground mb-2">About</p>
                <p className="font-sans text-foreground/80">
                  {pet.fun.bio.substring(0, 150)}
                  {pet.fun.bio.length > 150 && '...'}
                </p>
              </div>
            )}

            {/* Sign Up CTA */}
            <Card className="border-2 border-primary bg-secondary/30">
              <CardContent className="py-8 text-center space-y-4">
                <div className="text-4xl">🔓</div>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Want to see more?
                </h3>
                <p className="text-muted-foreground font-sans max-w-md mx-auto">
                  Sign up to view full health records, vaccination history, veterinary contacts, travel documents, and more!
                </p>
                <Link href={`/?returnTo=${petId}`}>
                  <Button className="bg-primary hover:bg-primary/90 font-mono uppercase shadow-[4px_4px_0px_0px_rgba(0,109,119,1)]">
                    Sign Up Free →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Blurred Preview Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-primary relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/50 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase text-primary">🔒 Sign up to view</p>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">Health Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Veterinary info, vaccinations, medications...</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/50 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase text-primary">🔒 Sign up to view</p>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">Owner Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Emergency contacts, address, phone...</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* About PetPass */}
        <Card className="border-2 border-primary">
          <CardContent className="py-8 text-center space-y-4">
            <h3 className="font-serif text-3xl font-bold text-primary">
              Create Your Pet's Digital Passport
            </h3>
            <p className="text-lg text-foreground/80 font-sans max-w-2xl mx-auto">
              PetPass is a portable, digital identity for your pet. Consolidate vital info, medical records, and fun facts into one QR-shareable profile.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🏥</div>
                <p className="font-mono text-xs uppercase">Health Records</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="font-mono text-xs uppercase">QR Shareable</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌍</div>
                <p className="font-mono text-xs uppercase">Travel Ready</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">☁️</div>
                <p className="font-mono text-xs uppercase">Cloud Synced</p>
              </div>
            </div>
            <Link href={`/?returnTo=${petId}`}>
              <Button className="bg-primary hover:bg-primary/90 font-mono uppercase text-lg px-8 py-6 shadow-[6px_6px_0px_0px_rgba(0,109,119,1)]">
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
