import { useEffect, useState } from 'react';
import { getUserFromToken } from '../utils/getUserFromToken';

type User = {
  id: string;
  username: string;
  email: string;
};

const useUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const decodedUser = getUserFromToken();
    if (decodedUser) {
      setUser({
        id: decodedUser.id,
        username: decodedUser.username,
        email: decodedUser.email,
      });
    }
  }, []);

  return user;
};

export default useUser;
