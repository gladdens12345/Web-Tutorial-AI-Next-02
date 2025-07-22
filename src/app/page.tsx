'use client';

import GoogleSignInTab from '@/components/GoogleSignInTab';
import AuthModal from '@/components/AuthModal';
import { signInWithGoogle } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [intendedAction, setIntendedAction] = useState<'daily' | 'premium'>('daily');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'anonymous' | 'limited' | 'premium'>('anonymous');
  const [loading, setLoading] = useState(false);
  
  // Updated with bright green pain relief points matching checkmarks
  const checkmarkGreen = '#008200'; // Darker green for pain relief points and Scale Your Compute title
  const brightRed = '#ff0000';       // Pure bright red for pain points

  // Check user subscription status
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user) {
        setSubscriptionStatus('anonymous');
        return;
      }

      try {
        setLoading(true);
        
        // Validate user data before sending
        if (!user.uid || !user.email) {
          console.warn('⚠️ User data incomplete:', { uid: !!user.uid, email: !!user.email });
          setSubscriptionStatus('limited');
          return;
        }
        
        const response = await fetch('/api/extension/auth-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: user.email
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Convert trial status to limited since we're removing trials
          let status = data.subscriptionStatus || 'limited';
          if (status === 'trial') {
            status = 'limited';
          }
          setSubscriptionStatus(status);
        } else {
          console.error('Failed to get subscription status');
          setSubscriptionStatus('limited');
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setSubscriptionStatus('limited');
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-green-50">
      {/* Google Sign-In Floating Tab */}
      <GoogleSignInTab />
      
      {/* Navigation */}
      <nav className="px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="sm" className="justify-start" />
          <div className="flex gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user.email?.split('@')[0]}</span>
                <button 
                  onClick={() => {
                    import('@/lib/firebase').then(({ logOut }) => {
                      logOut().then(() => window.location.reload());
                    });
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setIntendedAction('daily');
                    setAuthModalOpen(true);
                  }}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 transition"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    setIntendedAction('daily');
                    setAuthModalOpen(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-lg hover:shadow-lg transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Logo size="lg" className="justify-center scale-150" />
          </div>
          
          <p className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Make It Easy
          </p>

          {/* Spacing before pricing cards */}
          <div className="mb-24"></div>
          
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Daily Use Card - Always shown unless premium */}
            {subscriptionStatus !== 'premium' && (
              <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">Free Daily Use</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">1 Hour</span>
                  <span className="text-gray-400">/day</span>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    1 hour of free daily usage
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    All features included
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Resets daily at midnight
                  </div>
                </div>
                <button 
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  Start 1 Hour Free
                </button>
              </div>
            )}

            {/* Premium Card */}
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$5.00</span>
                <span className="text-gray-400">/month</span>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Unlimited AI assistance
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Advanced Knowledge Base
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Priority support
                </div>
              </div>
              <button 
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 Web Tutorial AI. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        intendedAction={intendedAction}
        onSuccess={() => {
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}