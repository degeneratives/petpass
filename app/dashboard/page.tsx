'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPetsByOwner } from '@/lib/firestore';
import { Pet } from '@/types/pet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    if (!user) return;
    try {
      const petsData = await getPetsByOwner(user.uid);
      setPets(petsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoadingPets(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || !user) {
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
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">PetPass</h1>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-left sm:text-right flex-1 sm:flex-none">
              <p className="font-mono text-xs uppercase text-muted-foreground">User</p>
              <p className="text-sm font-sans truncate max-w-[200px]">{user.email}</p>
            </div>
            <ThemeToggle />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-primary font-mono whitespace-nowrap hover:bg-primary/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-2">
              My Pets
            </h2>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}
            </p>
          </div>
          <Link href="/pets/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 font-mono uppercase shadow-[4px_4px_0px_0px_rgba(0,109,119,1)]">
              + Add Pet
            </Button>
          </Link>
        </div>

        {loadingPets ? (
          <p className="font-mono text-muted-foreground">Loading pets...</p>
        ) : pets.length === 0 ? (
          <Card className="border-2 border-primary">
            <CardContent className="py-16 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🐾</div>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  No pets yet
                </h3>
                <p className="text-muted-foreground font-sans">
                  Create your first pet profile to get started
                </p>
                <Link href="/pets/new">
                  <Button className="bg-primary hover:bg-primary/90 font-mono uppercase mt-4">
                    Create Pet Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet, index) => {
              const colors = ['from-[#83C5BE]/20 to-[#E0F2F4]/20', 'from-[#B2DFE3]/20 to-[#FEC5E5]/20', 'from-[#FEE1A5]/20 to-[#D4BAFF]/20'];
              const badgeColors = ['bg-[#83C5BE]', 'bg-[#FEC5E5]', 'bg-[#FEE1A5]'];
              const gradientClass = colors[index % colors.length];
              const badgeClass = badgeColors[index % badgeColors.length];

              return (
                <Link key={pet.petId} href={`/pets/${pet.petId}`}>
                  <Card className={`group border-0 bg-gradient-to-br ${gradientClass} backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <AvatarImage src={pet.profile.photoUrl} alt={pet.profile.name} />
                          <AvatarFallback className="bg-white font-serif text-3xl text-primary">
                            {pet.profile.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <Badge
                          className={`${pet.privacy === 'public' ? 'bg-[#83C5BE]' : badgeClass} text-white font-mono text-xs border-0 px-3 py-1`}
                        >
                          {pet.privacy}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardTitle className="font-serif text-3xl text-primary mb-2 group-hover:text-[#006D77] transition-colors">
                        {pet.profile.name}
                      </CardTitle>
                      <div className="space-y-2">
                        <p className="font-mono text-sm uppercase text-muted-foreground font-bold">
                          {pet.profile.species} • {pet.profile.breed}
                        </p>
                        <p className="font-sans text-base text-foreground/90 bg-white/50 inline-block px-3 py-1 rounded-full">
                          {pet.profile.color}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
