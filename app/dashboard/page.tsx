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
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="text-left sm:text-right flex-1 sm:flex-none">
              <p className="font-mono text-xs uppercase text-muted-foreground">User</p>
              <p className="text-sm font-sans truncate max-w-[200px]">{user.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-primary font-mono whitespace-nowrap"
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
            {pets.map((pet) => (
              <Link key={pet.petId} href={`/pets/${pet.petId}`}>
                <Card className="border-2 border-primary hover:shadow-[8px_8px_0px_0px_rgba(0,109,119,1)] transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Avatar className="w-20 h-20 border-2 border-primary">
                        <AvatarImage src={pet.profile.photoUrl} alt={pet.profile.name} />
                        <AvatarFallback className="bg-secondary font-serif text-2xl">
                          {pet.profile.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Badge
                        variant={pet.privacy === 'public' ? 'default' : 'secondary'}
                        className="font-mono text-xs"
                      >
                        {pet.privacy}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="font-serif text-2xl text-primary mb-2">
                      {pet.profile.name}
                    </CardTitle>
                    <div className="space-y-1">
                      <p className="font-mono text-xs uppercase text-muted-foreground">
                        {pet.profile.species} • {pet.profile.breed}
                      </p>
                      <p className="font-sans text-sm text-foreground/80">
                        {pet.profile.color}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
