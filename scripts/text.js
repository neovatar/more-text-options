import { MODULE_ID } from "./const.js";
import { calculateValue } from "./utils.js";
import { hexToRgba } from "./utils.js";

Hooks.on("refreshDrawing", drawing => {
    const text = drawing.text;

    if (!text) {
        if (drawing._warpedText) {
            if (!drawing._warpedText.destroyed) {
                drawing._warpedText.destroy();
            }

            drawing._warpedText = null;
        }

        return;
    }

    const document = drawing.document;
    const ts = document.getFlag(MODULE_ID, "textStyle");

    Object.assign(text.style, {
        align: ts?.align || "left",
        dropShadow: ts?.dropShadow ?? true,
        dropShadowAlpha: ts?.dropShadowAlpha ?? 1,
        dropShadowAngle: (ts?.dropShadowAngle ?? 0) / 180 * Math.PI,
        dropShadowBlur: ts?.dropShadowBlur ?? Math.max(Math.round(document.fontSize / 16), 2),
        dropShadowColor: ts?.dropShadowColor || "#000000",
        dropShadowDistance: ts?.dropShadowDistance ?? 0,
        fontStyle: ts?.fontStyle || "normal",
        fontVariant: ts?.fontVariant || "normal",
        fontWeight: ts?.fontWeight || "normal",
        leading: ts?.leading ?? 0,
        letterSpacing: ts?.letterSpacing ?? 0,
        lineHeight: ts?.lineHeight ?? Math.round((ts?.fontSize ?? document.fontSize ?? 16) * 1.2),
        lineJoin: "round",
        stroke: hexToRgba(ts?.stroke || (Color.from(document.textColor || "#ffffff").hsv[2] > 0.6 ? "#000000" : "#FFFFFF"), ts?.strokeOpacity ?? 1),
        strokeThickness: ts?.strokeThickness ?? Math.max(Math.round(document.fontSize / 32), 2),
        wordWrapWidth: calculateValue(ts?.wordWrapWidth, document.shape.width) ?? document.shape.width
    });

    if (ts?.align === "left" || ts?.align === "justify") {
        text.position.set(0, document.shape.height / 2);
        text.anchor.set(0, 0.5);
    } else if (ts?.align === "right") {
        text.anchor.set(1, 0.5);
        text.position.set(document.shape.width, document.shape.height / 2);
    } else {
        text.anchor.set(0.5, 0.5);
        text.position.set(document.shape.width / 2, document.shape.height / 2);
    }
});
