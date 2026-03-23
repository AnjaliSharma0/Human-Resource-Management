'use client';

import { useEffect, useState } from 'react';

export default function useAuth() {
  const [user, setUser] = useState<{
    id: number;
    role: string;
  } | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (id && role) {
      setUser({ id: Number(id), role });
    }
  }, []);

  return user;
}