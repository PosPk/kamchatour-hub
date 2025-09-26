export type Role = 'traveler'|'operator'|'rental'|'transfer'|'agent';

let roleState: Role = 'traveler';

export function getRole(): Role {
  const g: any = globalThis as any;
  return (g.__roleState as Role) || roleState;
}

export function setRole(newRole: Role) {
  const g: any = globalThis as any;
  g.__roleState = newRole;
  roleState = newRole;
}

