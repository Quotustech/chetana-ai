// app/reset-password/[token]/page.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ResetPassword from '@/components/Authentication/Reset_Password';

const ResetPasswordPage = ({ params }: { params: { token: string } }) => {
  const { token } = params;

  if (!token) {
    return <div>Invalid or missing token</div>;
  }

  return <ResetPassword token={token} />;
};

export default ResetPasswordPage;
