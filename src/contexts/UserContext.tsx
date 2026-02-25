import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { demoUsers } from '@/data/mockData';
import { tagIdentity } from '@/utils/clarityTracking';

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  availableUsers: User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(demoUsers[0]);

  useEffect(() => {
    tagIdentity(currentUser.id, currentUser.role, currentUser.name);
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    const user = demoUsers.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchRole,
      availableUsers: demoUsers
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Helper to get role display name
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    buyer: 'Buyer / QA Manager',
    supplier: 'Supplier User',
    lab_technician: 'Lab Technician',
    manager: 'Manager / Executive',
    admin: 'System Admin'
  };
  return names[role];
}

// Helper to get role-specific greeting
export function getRoleGreeting(role: UserRole): string {
  const now = new Date();
  const hour = now.getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  
  const roleContext: Record<UserRole, string> = {
    buyer: 'Here\'s your quality assurance command center.',
    supplier: 'Here\'s your submission and compliance dashboard.',
    lab_technician: 'Here\'s your testing queue and lab operations.',
    manager: 'Here\'s your executive overview and analytics.',
    admin: 'Here\'s your system administration panel.'
  };
  
  return `${timeGreeting}! ${roleContext[role]}`;
}
