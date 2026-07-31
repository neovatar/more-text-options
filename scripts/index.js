import { MODULE_ID } from "./const.js";
import { cleanData } from "./utils.js";

import "./config.js";
import "./text.js";

Hooks.on("preCreateDrawing", (document) => {
    document.updateSource(cleanData(document.toObject(), { deletionKeys: true }));
});

Hooks.on("preUpdateDrawing", (document, data) => {
    cleanData(data, { inplace: true, deletionKeys: true, partial: true });
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
