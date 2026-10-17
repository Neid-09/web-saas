import "server-only";

export interface JwtClaims {
	sub: string;
	jti?: string;
	tenantId?: string;
	branchId?: string;
	role?: string;
	iat?: number;
	exp?: number;
}

export function decodeJwtPayload(token: string): JwtClaims | null {
	try {
		const parts = token.split(".");
		if (parts.length < 2) return null;

		const base64Url = parts[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const padded = base64.padEnd(
			base64.length + ((4 - (base64.length % 4)) % 4),
			"=",
		);
		const jsonString = Buffer.from(padded, "base64").toString("utf-8");
		return JSON.parse(jsonString) as JwtClaims;
	} catch {
		return null;
	}
}
