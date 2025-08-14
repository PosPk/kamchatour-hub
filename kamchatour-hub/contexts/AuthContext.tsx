import React from 'react';
import { signIn as doSignIn, signOut as doSignOut, AuthUser } from '@lib/auth';

type AuthContextValue = {
	user: AuthUser | null;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: any) {
	const [user, setUser] = React.useState<AuthUser | null>(null);

	async function signIn(email: string, password: string) {
		const u = await doSignIn(email, password);
		setUser(u);
	}

	async function signOut() {
		await doSignOut();
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const ctx = React.useContext(AuthContext);
	if (!ctx) throw new Error('AuthContext not found');
	return ctx;
}