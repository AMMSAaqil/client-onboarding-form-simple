export const SERVICES = ["UI/UX", "Branding", "Web Dev", "Mobile App"] as const;
export type Service = typeof SERVICES[number];