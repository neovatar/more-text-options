import { MODULE_ID } from "./const.js";
import { cleanData } from "./utils.js";

import "./config.js";
import "./text.js";

function preProcess(data) {
    const fill = foundry.utils.getProperty(data, `flags.${MODULE_ID}.textStyle.fill`);

    if (fill != null && !Array.isArray(fill)) {
        foundry.utils.setProperty(data, `flags.${MODULE_ID}.textStyle.fill`, [fill]);
    }

    return data;
}

Hooks.on("preCreateDrawing", (document) => {
    document.updateSource(cleanData(preProcess(document.toObject()), { deletionKeys: true }));
});

Hooks.on("preUpdateDrawing", (document, data) => {
    cleanData(preProcess(data), { inplace: true, deletionKeys: true, partial: true });
});

Hooks.once("init", () => {

    Hooks.on("updateDrawing", (document, changes) => {
        if (!document.rendered) {
            return;
        }

        // Refresh when module flags change
        if (changes.flags && (changes.flags[MODULE_ID] !== undefined
            || changes.flags[`-=${MODULE_ID}`] !== undefined)) {
            document.object.refresh();
        }
        
        // Also refresh when text changes (to ensure text rendering updates)
        if (changes.text !== undefined) {
            document.object.refresh();
        }
    });
    
});
