
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LockKeyhole, User } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to admin panel
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First try Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase auth successful:', userCredential.user.email);
      
      // Firebase auth successful, update context
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: 'Login successful!',
          description: 'Welcome to the admin dashboard.',
        });
        navigate('/admin');
      } else {
        toast({
          title: 'Login failed',
          description: 'Authentication successful but session initialization failed.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // @ts-ignore - Firebase error types
      if (error.code === 'auth/invalid-credential') {
        toast({
          title: 'Invalid credentials',
          description: 'The email or password you entered is incorrect.',
          variant: 'destructive',
        });
      // @ts-ignore - Firebase error types
      } else if (error.code === 'auth/user-not-found') {
        toast({
          title: 'User not found',
          description: 'No user with this email exists.',
          variant: 'destructive',
        });
      // @ts-ignore - Firebase error types
      } else if (error.code === 'auth/wrong-password') {
        toast({
          title: 'Incorrect password',
          description: 'The password you entered is incorrect.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login error',
          description: 'An error occurred while trying to log in. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your credentials to access the admin dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Use "admin@example.com" for demo</p>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Use "password" for demo</p>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-university-red hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
