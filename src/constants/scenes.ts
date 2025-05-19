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
    title: "Gran Pirámide",
    desc: "Explora los pasajes milenarios.",
    glbUrl: "https://raw.githubusercontent.com/3Tenebris3/EcuEduca-App/refs/heads/main/assets/models/bunker.glb",
    preview: require("../../assets/scenes/pyramid.png"),
    audio: null,
  },
  {
    id: "flower",
    title: "Flor",
    desc: "Mira una flor.",
    glbUrl: "https://raw.githubusercontent.com/3Tenebris3/EcuEduca-App/refs/heads/main/assets/models/blue_flower_animated.glb",
    preview: require("../../assets/scenes/pyramid.png"),
    audio: null,
  },
];
