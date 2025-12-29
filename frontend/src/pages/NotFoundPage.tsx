import { Home, Search } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full mb-4">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              leftIcon={<Home size={18} />}
              size="lg"
            >
              Go Home
            </Button>
            <Button
              onClick={() => navigate('/products')}
              variant="outline"
              size="lg"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};