import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '@/store/atoms';   
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Protected({ children }) {
  const token = useAtomValue(tokenAtom);
  const user  = useAtomValue(userAtom);              
  const router = useRouter();
  const { restaurantUsername } = router.query;       

  useEffect(() => {
    if (!token) {
      router.replace('/login');                       
    } else if (
      restaurantUsername &&                           
      user?.restaurantUsername &&                    
      restaurantUsername !== user.restaurantUsername  
    ) {
      router.replace(`/${user.restaurantUsername}/dashboard`);
    }
  }, [token, restaurantUsername]);

  return token ? children : null;
}

export function ManagerOnly({ children }) {
  const user = useAtomValue(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'manager') {
      router.replace('/unauthorized'); // Redirect to unauthorized page if the user is not a manager
    }
  }, [user]);

  return user?.role === 'manager' ? children : null; // Render children only if user is a manager
}

