'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, Eye, EyeOff, Plus, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { mockUsers } from '@/lib/mock-data';

type LoginType = 'select' | 'new_building' | 'existing_building' | 'manager';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [loginType, setLoginType] = useState<LoginType>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For new building, redirect to onboarding
      if (loginType === 'new_building') {
        toast.success('Starting building setup...');
        router.push('/onboarding');
        return;
      }

      const success = await login(email, password);
      if (success) {
        toast.success('Welcome to StrataHQ!');
        router.push('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('[v0] Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLogin = (userEmail: string, type: LoginType) => {
    setLoginType(type);
    setEmail(userEmail);
    setPassword('demo123');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="flex-1 bg-primary text-primary-foreground p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-lg mx-auto w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">StrataHQ</h1>
              <p className="text-primary-foreground/80 text-sm">Property Management Platform</p>
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Empowering Strata Councils
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
            Modern tools for efficient property management, transparent communication, and engaged communities.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Streamlined Operations</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Manage maintenance requests, violations, and tasks all in one place
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Better Communication</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Keep residents informed with polls, announcements, and community forums
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Complete Transparency</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Track budgets, meetings, and decisions with full accountability
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 p-8 lg:p-12 flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          {loginType === 'select' ? (
            <Card>
              <CardHeader className="space-y-2 pb-8">
                <CardTitle className="text-2xl lg:text-3xl">Welcome to StrataHQ</CardTitle>
                <CardDescription className="text-base">
                  Choose how you'd like to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setLoginType('new_building')}
                  variant="outline"
                  className="w-full h-auto p-6 justify-start hover:bg-primary/5 hover:border-primary transition-all"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">New Building Setup</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Start fresh with guided bylaw creation and building configuration
                      </p>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => setLoginType('existing_building')}
                  variant="outline"
                  className="w-full h-auto p-6 justify-start hover:bg-primary/5 hover:border-primary transition-all"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Council Login</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Access your building with existing bylaws and council setup
                      </p>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => setLoginType('manager')}
                  variant="outline"
                  className="w-full h-auto p-6 justify-start hover:bg-primary/5 hover:border-primary transition-all"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Strata Manager</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Professional property manager access with multi-building support
                      </p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setLoginType('select')}
                  className="w-fit -ml-2 mb-2 text-muted-foreground"
                >
                  ← Back
                </Button>
                <CardTitle className="text-2xl lg:text-3xl">
                  {loginType === 'new_building' && 'New Building Setup'}
                  {loginType === 'existing_building' && 'Council Login'}
                  {loginType === 'manager' && 'Manager Login'}
                </CardTitle>
                <CardDescription className="text-base">
                  {loginType === 'new_building' && 'Create your building profile and bylaws'}
                  {loginType === 'existing_building' && 'Sign in to access your dashboard'}
                  {loginType === 'manager' && 'Manage multiple properties'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : loginType === 'new_building' ? 'Start Setup' : 'Sign In'}
                  </Button>
                </form>

                {loginType !== 'new_building' && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground mb-3">Quick demo login:</p>
                    <div className="space-y-2">
                      {mockUsers
                        .filter(user =>
                          loginType === 'manager'
                            ? user.role === 'property_manager'
                            : user.role === 'council_member' || user.role === 'resident'
                        )
                        .slice(0, 2)
                        .map((user) => (
                          <Button
                            key={user.id}
                            variant="outline"
                            className="w-full justify-start h-auto py-3 px-4"
                            onClick={() => quickLogin(user.email, loginType)}
                          >
                            <div className="text-left">
                              <div className="font-semibold text-base">{user.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {user.role === 'council_member' ? 'Council Member' :
                                 user.role === 'property_manager' ? 'Property Manager' :
                                 'Resident'}
                              </div>
                            </div>
                          </Button>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
