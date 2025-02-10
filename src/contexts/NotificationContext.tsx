'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  userId: string;
  type: 'SMS' | 'EMAIL' | 'SYSTEM';
  message: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: Date;
  sentAt?: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  sendSMS: (userId: string, message: string) => Promise<void>;
  getNotificationsByUser: (userId: string) => Notification[];
  markAsSent: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  sendSMS: async () => {},
  getNotificationsByUser: () => [],
  markAsSent: async () => {},
});

// Demo notifications
const demoNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'SMS',
    message: 'Your product "Fresh Tomatoes" has been approved',
    status: 'SENT',
    createdAt: new Date('2024-02-10'),
    sentAt: new Date('2024-02-10'),
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);

  const sendSMS = async (userId: string, message: string) => {
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newNotification: Notification = {
      id: (notifications.length + 1).toString(),
      userId,
      type: 'SMS',
      message,
      status: 'SENT', // In real app, this would initially be 'PENDING'
      createdAt: new Date(),
      sentAt: new Date(),
    };

    setNotifications([...notifications, newNotification]);
  };

  const getNotificationsByUser = (userId: string) => {
    return notifications.filter(n => n.userId === userId);
  };

  const markAsSent = async (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId 
        ? { ...n, status: 'SENT', sentAt: new Date() }
        : n
    ));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        sendSMS,
        getNotificationsByUser,
        markAsSent,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext); 