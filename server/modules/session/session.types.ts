export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string; // Store refresh token hashes only for security

  ip: string;
  userAgent: string;

  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;

  revoked: boolean;

  deviceName?: string;
  browser?: string;
  os?: string;

  location?: string;
}

export interface UserSessionDto extends Session {
  userEmail?: string;
  userRole?: string;
  userNameEn?: string;
  userNameAr?: string;
}
