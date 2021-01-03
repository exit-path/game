import { Level } from "./level";

export function validate(level: Level) {
    if (!level.objects.some(o => o.type === "start-point")) {
        throw new Error("Missing start point");
    }
     if (!level.objects.some(o => o.type === "end-point")) {
        throw new Error("Missing end point");
    }
}