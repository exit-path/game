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

export const versions: string[][] = [
  ["v0.1.0", "Supports spectators", "Allow changing username in 'Modify' menu"],
];
