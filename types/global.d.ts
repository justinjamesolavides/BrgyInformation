declare global {
  var sessionStore: Map<string, {
    userId: number;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
  }> | undefined;
}

export {};