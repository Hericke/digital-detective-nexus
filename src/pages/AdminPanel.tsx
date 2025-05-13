
import React from 'react';
import { HostingerDeploy } from '@/components/HostingerDeploy';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Only admin users should access this page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HostingerDeploy />
        
        {/* Add more admin components here as needed */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-3">Site Information</h2>
          <p className="text-sm text-gray-600">
            Update site configuration and manage deployments to your Hostinger hosting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
