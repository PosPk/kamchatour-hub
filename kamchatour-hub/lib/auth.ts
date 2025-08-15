export type AuthUser = { id: string; email?: string };

export async function signIn(email: string, _password: string): Promise<AuthUser> {
	return { id: 'demo', email };
}

export async function signOut(): Promise<void> {
	return;
}