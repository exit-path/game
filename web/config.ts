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
  ["v0.2.0", "Fix always joining room as spectator"],
  ["v0.3.0", "Press 'F' toggle Focus mode"],
  [
    "v0.3.1",
    "Fix multiplayer game start countdown timing",
    "Fix activating focus mode while in chat",
    "Press K to die (return to start/last checkpoint)",
    "Press P to pause/unpause",
  ],
  ["v0.3.2", "Make game start countdown deterministic"],
  [
    "v0.3.3",
    "Fix message scrolling when page is zoomed",
    "Allow resizing the game area",
  ],
  ["v0.3.4", "Show spectators in separate list"],
];
