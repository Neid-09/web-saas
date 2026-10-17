export const USER_ROLES = [
	"OWNER",
	"ADMIN",
	"ACCOUNTANT",
	"WAREHOUSE_MANAGER",
	"CASHIER",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(role: unknown): role is UserRole {
	return (
		typeof role === "string" && (USER_ROLES as readonly string[]).includes(role)
	);
}
