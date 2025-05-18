export type Reward = {
  id: string;
  label: string;
  threshold: number;        // points needed
  icon: string;             // emoji for now
};

export const REWARDS: Reward[] = [
  { id: "badge1",  label: "Explorador Nubio",      threshold:  30, icon: "🏺" },
  { id: "badge2",  label: "Centurión Romano",      threshold:  80, icon: "🛡️" },
  { id: "badge3",  label: "Caballero Medieval",    threshold: 150, icon: "⚔️" },
  { id: "badge4",  label: "Inventor Renacentista", threshold: 220, icon: "⚙️" },
  { id: "badge5",  label: "Maestro de la Historia",threshold: 300, icon: "🏆" },
];
