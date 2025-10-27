'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function HomeContent() {
  const { user, signIn, signUp, signInWithGoogle, signInWithApple, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      // If user came from a pet profile, redirect there; otherwise go to dashboard
      const destination = returnTo ? `/pets/${returnTo}` : '/dashboard';
      router.push(destination);
    }
  }, [user, loading, router, returnTo]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      const destination = returnTo ? `/pets/${returnTo}` : '/dashboard';
      router.push(destination);
    } catch (err: unknown) {
      setError((err as Error).message || 'Authentication failed');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      const destination = returnTo ? `/pets/${returnTo}` : '/dashboard';
      router.push(destination);
    } catch (err: unknown) {
      setError((err as Error).message || 'Google sign-in failed');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      const destination = returnTo ? `/pets/${returnTo}` : '/dashboard';
      router.push(destination);
    } catch (err: unknown) {
      setError((err as Error).message || 'Apple sign-in failed');
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-mono text-primary">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'PetPass',
            description: 'Digital pet passport with QR code. Store health records, vaccinations, vet contacts, and medical history for dogs, cats, and all pets.',
            url: 'https://petpass-xyz.netlify.app',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'QR code pet profiles',
              'Health records storage',
              'Vaccination tracking',
              'Veterinary contact management',
              'Cloud synchronization',
              'Multi-device access',
              'Travel document storage',
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5.0',
              ratingCount: '1',
            },
          }),
        }}
      />
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8 px-4">
          {/* Hero Section */}
        <div className="text-center space-y-4 mb-8 sm:mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-primary">PetPass</h1>
          <p className="font-mono text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
            One passport for every paw.
          </p>
          <p className="text-base sm:text-lg text-foreground/80 font-sans px-4">
            Digital pet passport with QR code. Store health records, vaccinations, vet contacts, and medical history for dogs, cats, and all pets. Free, cloud-synced, and shareable.
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-2 border-primary shadow-[8px_8px_0px_0px_rgba(0,109,119,1)]">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-primary">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="font-mono text-xs uppercase">
              {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-xs uppercase">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-xs uppercase">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-primary"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-destructive font-mono">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-mono uppercase tracking-wider"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'} →
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-mono">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="border-2 border-primary font-mono text-xs sm:text-sm"
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleAppleSignIn}
                className="border-2 border-primary font-mono text-xs sm:text-sm"
              >
                Apple
              </Button>
            </div>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline font-mono"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-mono text-primary">Loading...</p>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
