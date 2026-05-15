export {};

declare global {
  interface ClerkAuthorization {
    permission: never;
    role: "admin" | "employee";
  }
}
