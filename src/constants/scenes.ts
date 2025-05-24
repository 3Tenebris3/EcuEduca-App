// src/constants/scenes.ts
export type SceneMeta = {
  id: string;
  title: string;
  desc: string;
  glbUrl: string;     // remote!  https://...
  preview: any;       // local png for the list
  audio?: any;        // optional mp3 require(...)
};

export const SCENES: SceneMeta[] = [
  {
    id: "piramide",
    title: "Flor",
    desc: "Mira una flor.",
    glbUrl: "https://raw.githubusercontent.com/3Tenebris3/EcuEduca-App/refs/heads/main/assets/models/wwtwoBuilding.glb",
    preview: require("../../assets/scenes/pyramid.png"),
    audio: null,
  },
];
