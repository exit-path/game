export interface MPServer {
  name: string;
  address: string;
}

export const mpServers: MPServer[] = [
  {
    name: "Primary server",
    address: "https://exit-path.kiootic.xyz",
  },
];

if (process.env.NODE_ENV === "development") {
  mpServers.splice(0, 0, {
    name: "Dev server",
    address: "http://localhost:5000",
  });
}

export const versions: string[][] = [
  [
    "v0.1.0",
    "Supports spectators",
    "Allow changing username in 'Modify' menu",
    "Support quitting to menu while in Multiplayer game",
  ],
];
