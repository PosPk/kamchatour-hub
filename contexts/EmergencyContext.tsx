import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Coordinates } from './LocationContext';
import { sendEmergencySignal, getEmergencyContacts } from '../lib/emergency';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface EmergencyReport {
  id: string;
  coordinates: Coordinates;
  note?: string;
  timestamp: number;
  status: 'pending' | 'sent' | 'confirmed' | 'resolved';
  emergencyType: 'medical' | 'accident' | 'weather' | 'wildlife' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface EmergencySettings {
  autoLocation: boolean;
  emergencyContacts: EmergencyContact[];
  sosMessage: string;
  autoCall: boolean;
  vibrationAlert: boolean;
}

interface EmergencyContextType {
  emergencyReports: EmergencyReport[];
  emergencyContacts: EmergencyContact[];
  settings: EmergencySettings;
  isLoading: boolean;
  sendSOS: (coordinates: Coordinates, note?: string, type?: EmergencyReport['emergencyType']) => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeEmergencyContact: (contactId: string) => Promise<void>;
  updateEmergencySettings: (settings: Partial<EmergencySettings>) => Promise<void>;
  getNearbyShelters: (coordinates: Coordinates) => Promise<any[]>;
  getEmergencyInfo: (type: EmergencyReport['emergencyType']) => Promise<any>;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emergencyReports, setEmergencyReports] = useState<EmergencyReport[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [settings, setSettings] = useState<EmergencySettings>({
    autoLocation: true,
    emergencyContacts: [],
    sosMessage: 'SOS: Мне нужна помощь!',
    autoCall: false,
    vibrationAlert: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEmergencyContacts();
    loadEmergencySettings();
  }, []);

  const loadEmergencyContacts = async () => {
    try {
      const contacts = await getEmergencyContacts();
      setEmergencyContacts(contacts);
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };

  const loadEmergencySettings = async () => {
    try {
      // Load from AsyncStorage or API
      // For now, using default settings
    } catch (error) {
      console.error('Error loading emergency settings:', error);
    }
  };

  const sendSOS = async (
    coordinates: Coordinates,
    note?: string,
    type: EmergencyReport['emergencyType'] = 'other'
  ) => {
    try {
      setIsLoading(true);

      const report: EmergencyReport = {
        id: Date.now().toString(),
        coordinates,
        note: note || settings.sosMessage,
        timestamp: Date.now(),
        status: 'pending',
        emergencyType: type,
        severity: 'critical',
      };

      // Add to local reports
      setEmergencyReports(prev => [report, ...prev]);

      // Send to emergency services
      const result = await sendEmergencySignal({
        coordinates,
        note: report.note,
        type: report.emergencyType,
        severity: report.severity,
      });

      if (result.success) {
        // Update status to sent
        setEmergencyReports(prev =>
          prev.map(r => r.id === report.id ? { ...r, status: 'sent' } : r)
        );

        // Show confirmation
        Alert.alert(
          'SOS Сигнал отправлен',
          'Службы спасения уведомлены о вашем местоположении',
          [{ text: 'OK' }]
        );

        // Auto-call primary contact if enabled
        if (settings.autoCall) {
          const primaryContact = emergencyContacts.find(c => c.isPrimary);
          if (primaryContact) {
            // Implement phone call functionality
            console.log('Auto-calling primary contact:', primaryContact.phone);
          }
        }
      } else {
        throw new Error('Failed to send emergency signal');
      }
    } catch (error) {
      console.error('Error sending SOS:', error);
      
      Alert.alert(
        'Ошибка отправки SOS',
        'Не удалось отправить сигнал бедствия. Попробуйте еще раз.',
        [{ text: 'OK' }]
      );

      // Update status to failed
      setEmergencyReports(prev =>
        prev.map(r => r.id === report?.id ? { ...r, status: 'pending' } : r)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    try {
      const newContact: EmergencyContact = {
        ...contact,
        id: Date.now().toString(),
      };

      const updatedContacts = [...emergencyContacts, newContact];
      setEmergencyContacts(updatedContacts);

      // Update settings
      const updatedSettings = {
        ...settings,
        emergencyContacts: updatedContacts,
      };
      setSettings(updatedSettings);

      // Save to storage/API
      // await saveEmergencyContacts(updatedContacts);
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      throw error;
    }
  };

  const removeEmergencyContact = async (contactId: string) => {
    try {
      const updatedContacts = emergencyContacts.filter(c => c.id !== contactId);
      setEmergencyContacts(updatedContacts);

      // Update settings
      const updatedSettings = {
        ...settings,
        emergencyContacts: updatedContacts,
      };
      setSettings(updatedSettings);

      // Save to storage/API
      // await saveEmergencyContacts(updatedContacts);
    } catch (error) {
      console.error('Error removing emergency contact:', error);
      throw error;
    }
  };

  const updateEmergencySettings = async (newSettings: Partial<EmergencySettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      // Save to storage/API
      // await saveEmergencySettings(updatedSettings);
    } catch (error) {
      console.error('Error updating emergency settings:', error);
      throw error;
    }
  };

  const getNearbyShelters = async (coordinates: Coordinates): Promise<any[]> => {
    try {
      // Implement shelter search logic
      // This would typically call an API or use local data
      return [];
    } catch (error) {
      console.error('Error getting nearby shelters:', error);
      return [];
    }
  };

  const getEmergencyInfo = async (type: EmergencyReport['emergencyType']): Promise<any> => {
    try {
      // Implement emergency info logic
      // This would provide guidance based on emergency type
      return {};
    } catch (error) {
      console.error('Error getting emergency info:', error);
      return {};
    }
  };

  const value: EmergencyContextType = {
    emergencyReports,
    emergencyContacts,
    settings,
    isLoading,
    sendSOS,
    addEmergencyContact,
    removeEmergencyContact,
    updateEmergencySettings,
    getNearbyShelters,
    getEmergencyInfo,
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};