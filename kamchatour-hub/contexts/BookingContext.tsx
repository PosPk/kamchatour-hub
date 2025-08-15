import React from 'react';

export type Booking = { id: string; itemId: string; date: string };

type BookingContextValue = {
	bookings: Booking[];
	addBooking: (b: Booking) => void;
};

const BookingContext = React.createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
	const [bookings, setBookings] = React.useState<Booking[]>([]);

	function addBooking(b: Booking) {
		setBookings(prev => [...prev, b]);
	}

	return (
		<BookingContext.Provider value={{ bookings, addBooking }}>
			{children}
		</BookingContext.Provider>
	);
}

export function useBookingContext() {
	const ctx = React.useContext(BookingContext);
	if (!ctx) throw new Error('BookingContext not found');
	return ctx;
}