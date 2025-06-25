import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedModulePageProps {
  children: React.ReactNode;
  modulePath: string;
}

const ProtectedModulePage: React.FC<ProtectedModulePageProps> = ({ children, modulePath }) => {
  const { user, loading, checkModuleAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pest-green-700"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user has access to this module
  const hasAccess = checkModuleAccess(modulePath);
  
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedModulePage;