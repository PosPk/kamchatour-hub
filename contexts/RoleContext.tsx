import React, { createContext, useContext, useMemo, useState } from 'react';

export type AppRole = 'traveler' | 'operator' | 'guide' | 'transfer' | 'agent' | 'admin';

interface RoleState {
	roles: AppRole[];
	hasRole: (r: AppRole) => boolean;
	setRoles: (r: AppRole[]) => void;
}

const RoleContext = createContext<RoleState | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [roles, setRoles] = useState<AppRole[]>(['traveler']);
	const hasRole = (r: AppRole) => roles.includes(r) || roles.includes('admin');
	const value = useMemo(() => ({ roles, hasRole, setRoles }), [roles]);
	return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRoles = () => {
	const ctx = useContext(RoleContext);
	if (!ctx) throw new Error('useRoles must be used within RoleProvider');
	return ctx;
};

