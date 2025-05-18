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
    glbUrl: "https://rawcdn.githack.com/3Tenebris3/EcuEduca-App/main/assets/models/assets/models/bunker.glb",
    preview: require("../../assets/scenes/pyramid.png"),
    audio: null,
  },
];
