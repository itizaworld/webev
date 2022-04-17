import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, VFC } from 'react';

type Props = {
  children: ReactNode;
};

export const LoginRequiredWrapper: VFC<Props> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?isRedirect=true');
    }
  }, [router, status]);

  if (typeof window !== 'undefined' && status === 'loading')
    return (
      <div className="pt-5 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return (
    <div className="pt-5 d-flex align-items-center justify-content-center">
      <div className="spinner-border text-info" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
