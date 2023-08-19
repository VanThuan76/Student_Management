import { getCookie } from 'cookies-next';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { APP_SAVE_KEYS } from '../constant/AppConstant';
interface Props{
  children: React.ReactElement
}

export const ProtectedRouteDashboardAdmin = ({ children }: Props) => {
  const key = getCookie(APP_SAVE_KEYS.KEYS)

  if (key !== true) {
      return <Navigate to='/login' replace />;
    }
  return children;
};

