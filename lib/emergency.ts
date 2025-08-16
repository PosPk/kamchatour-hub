import { Coordinates } from '../contexts/LocationContext';
import { EmergencyContact } from '../contexts/EmergencyContext';

export interface EmergencySignal {
  coordinates: Coordinates;
  note?: string;
  type?: 'medical' | 'accident' | 'weather' | 'wildlife' | 'other';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  userId?: string;
}

export interface EmergencyResponse {
  success: boolean;
  message: string;
  emergencyId?: string;
  estimatedResponseTime?: number;
  contactInfo?: {
    phone: string;
    name: string;
  };
}

// Mock emergency contacts database
const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Служба спасения',
    phone: '112',
    relationship: 'Экстренная служба',
    isPrimary: true,
  },
  {
    id: '2',
    name: 'МЧС Камчатка',
    phone: '+7 (415) 200-00-00',
    relationship: 'Региональная служба',
    isPrimary: false,
  },
  {
    id: '3',
    name: 'Спасательная служба',
    phone: '+7 (415) 200-01-01',
    relationship: 'Спасатели',
    isPrimary: false,
  },
];

// Mock emergency reports database
const mockEmergencyReports: any[] = [];

export const sendEmergencySignal = async (signal: EmergencySignal): Promise<EmergencyResponse> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validate coordinates
    if (!signal.coordinates || 
        typeof signal.coordinates.latitude !== 'number' || 
        typeof signal.coordinates.longitude !== 'number') {
      throw new Error('Неверные координаты');
    }

    // Create emergency report
    const emergencyReport = {
      id: Date.now().toString(),
      ...signal,
      timestamp: signal.timestamp || Date.now(),
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    // Add to mock database
    mockEmergencyReports.push(emergencyReport);

    // Simulate emergency service response
    const response: EmergencyResponse = {
      success: true,
      message: 'SOS сигнал успешно отправлен',
      emergencyId: emergencyReport.id,
      estimatedResponseTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      contactInfo: {
        phone: '112',
        name: 'Служба спасения',
      },
    };

    // Log emergency signal
    console.log('Emergency signal sent:', {
      coordinates: signal.coordinates,
      note: signal.note,
      type: signal.type,
      severity: signal.severity,
      timestamp: new Date(signal.timestamp).toLocaleString('ru-RU'),
    });

    return response;
  } catch (error) {
    console.error('Error sending emergency signal:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
};

export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return [...mockEmergencyContacts];
  } catch (error) {
    console.error('Error getting emergency contacts:', error);
    return [];
  }
};

export const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    };

    mockEmergencyContacts.push(newContact);

    return newContact;
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    throw error;
  }
};

export const removeEmergencyContact = async (contactId: string): Promise<boolean> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockEmergencyContacts.findIndex(c => c.id === contactId);
    if (index === -1) {
      throw new Error('Контакт не найден');
    }

    mockEmergencyContacts.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error removing emergency contact:', error);
    throw error;
  }
};

export const getEmergencyReport = async (reportId: string): Promise<any> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const report = mockEmergencyReports.find(r => r.id === reportId);
    if (!report) {
      throw new Error('Отчет не найден');
    }

    return report;
  } catch (error) {
    console.error('Error getting emergency report:', error);
    throw error;
  }
};

export const updateEmergencyReport = async (reportId: string, updates: any): Promise<any> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const reportIndex = mockEmergencyReports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
      throw new Error('Отчет не найден');
    }

    mockEmergencyReports[reportIndex] = { ...mockEmergencyReports[reportIndex], ...updates };
    return mockEmergencyReports[reportIndex];
  } catch (error) {
    console.error('Error updating emergency report:', error);
    throw error;
  }
};

export const getNearbyEmergencyServices = async (coordinates: Coordinates, radius: number = 50000): Promise<any[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock emergency services data
    const emergencyServices = [
      {
        id: '1',
        name: 'Служба спасения Петропавловск-Камчатский',
        type: 'rescue',
        coordinates: { latitude: 53.0375, longitude: 158.6559 },
        phone: '+7 (415) 200-00-00',
        distance: Math.floor(Math.random() * 50) + 5, // 5-55 km
        responseTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      },
      {
        id: '2',
        name: 'МЧС Елизово',
        type: 'emergency',
        coordinates: { latitude: 53.1833, longitude: 158.3833 },
        phone: '+7 (415) 200-01-01',
        distance: Math.floor(Math.random() * 50) + 5,
        responseTime: Math.floor(Math.random() * 30) + 15,
      },
      {
        id: '3',
        name: 'Спасательная служба Вилючинск',
        type: 'rescue',
        coordinates: { latitude: 52.9333, longitude: 158.4000 },
        phone: '+7 (415) 200-02-02',
        distance: Math.floor(Math.random() * 50) + 5,
        responseTime: Math.floor(Math.random() * 30) + 15,
      },
    ];

    return emergencyServices;
  } catch (error) {
    console.error('Error getting nearby emergency services:', error);
    return [];
  }
};

export const sendEmergencyAlert = async (
  coordinates: Coordinates,
  alertType: 'weather' | 'wildlife' | 'geological' | 'other',
  message: string
): Promise<boolean> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log emergency alert
    console.log('Emergency alert sent:', {
      type: alertType,
      message,
      coordinates,
      timestamp: new Date().toLocaleString('ru-RU'),
    });

    return true;
  } catch (error) {
    console.error('Error sending emergency alert:', error);
    return false;
  }
};