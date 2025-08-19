export type UUID = string;

export type Device = {
  id: UUID;
  name: string;
  type: "SENSOR" | "CAMERA" | "LIGHT" | "OTHER";
  serialNumber: string;
  createdAt: string;   // ISO
  userId?: UUID;       // backend döndürebilir
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-based)
};

export const DEVICE_TYPES = ["SENSOR", "CAMERA", "LIGHT", "OTHER"] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

export type LoginReq = { email: string; password: string };
export type LoginRes = { token: string };
