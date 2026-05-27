import { DEFAULT_FLAGS, MODULE_ID } from "./const.js";

export function parseValue(value) {
    if (value == null) {
        return null;
    }

    let unit;

    if (typeof value === "string") {
        value = value.match(/^\s*([+-]?\d*\.?\d+)\s*(px|%)?\s*$/i);

        if (!value) {
            return null;
        }

        unit = value[2] || "px";
        value = parseFloat(value[1]);
    } else if (typeof value === "number") {
        unit = "px";
    }

    if (value == null || unit == null) {
        return null;
    }

    return { value, unit };
}

export function calculateValue(value, base) {
    value = parseValue(value);

    if (!value) {
        return null;
    }

    const unit = value.unit;

    value = value.value;

    if (unit === "%") {
        return base * (value / 100);
    }

    return value;
}

export function hexToRgba(hex, opacity = 1) {
    let c = hex.replace(/^#/, "");

    if (c.length === 3) {
        c = c.split("").map(ch => ch + ch).join("");
    }

    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function stringifyValue(value) {
    value = parseValue(value);

    if (!value) {
        return null;
    }

    const unit = value.unit;

    value = value.value;

    if (unit === "%") {
        return `${value}%`;
    }

    return `${value}px`;
}

export function saveValue(value) {
    value = parseValue(value);

    if (!value) {
        return null;
    }

    const unit = value.unit;

    value = value.value;

    if (unit === "%") {
        return `${value}%`;
    }

    return value;
}

export function cleanData(data, { inplace = false, deletionKeys = false, keepOthers = true, partial = false }) {
    let newData = {};

    function walk(obj, path = []) {
        for (const [key, value] of Object.entries(obj)) {
            const fullPath = [...path, key].join(".");

            if (!(fullPath.startsWith(`flags.${MODULE_ID}.`) && !fullPath.includes(".-="))) {
                if (keepOthers && !inplace) {
                    setPath(newData, [...path, key], value);
                }
                continue;
            }

            if (!(fullPath in DEFAULT_FLAGS)) {
                continue;
            }

            const defaultValue = DEFAULT_FLAGS[fullPath];
            const normalizeValue = v => {
                v = v ?? null;

                if (parseValue(defaultValue)) {
                    v = saveValue(v);
                } else if (typeof v === "string") {
                    if (!v) {
                        v = null;
                    } else {
                        v = v.trim().toLowerCase();
                    }
                }
                return v;
            };

            let finalValue;
            if (Array.isArray(value)) {
                finalValue = value.map(normalizeValue);
            } else {
                finalValue = normalizeValue(value);
            }

            if (finalValue != null && finalValue !== defaultValue && !finalValue.equals?.(defaultValue)) {
                setPath(newData, [...path, key], finalValue);

                if (deletionKeys || inplace) {
                    for (let i = 1; i < fullPath.split(".").length; i++) {
                        deletePath(newData, fullPath.split(".").slice(0, i).concat([`-=${fullPath.split(".")[i]}`]));
                    }
                }
            } else if (!deletionKeys) {
                setPath(newData, [...path, key], foundry.utils.deepClone(defaultValue));
            }
        }
    }

    function setPath(obj, pathArr, val) {
        let target = obj;
        for (let i = 0; i < pathArr.length - 1; i++) {
            if (!(pathArr[i] in target)) target[pathArr[i]] = {};
            target = target[pathArr[i]];
        }
        target[pathArr[pathArr.length - 1]] = val;
    }

    function deletePath(obj, pathArr) {
        let target = obj;
        for (let i = 0; i < pathArr.length - 1; i++) {
            if (!(pathArr[i] in target)) return;
            target = target[pathArr[i]];
        }
        delete target[pathArr[pathArr.length - 1]];
    }

    walk(data);

    if (deletionKeys || inplace) {
        for (const key in newData) {
            if (!key.startsWith(`flags.${MODULE_ID}.`) && !key.startsWith(`flags.-=${MODULE_ID}`)) {
                continue;
            }
            const split = key.split(".");
            if (!split[split.length - 1].startsWith("-=")) continue;

            const prefix = `${split.slice(0, -1).join(".")}.${split[split.length - 1].slice(2)}.`;
            delete newData[prefix.slice(0, -1)];

            for (const otherKey in newData) {
                if (otherKey.startsWith(prefix)) {
                    delete newData[otherKey];
                }
            }
        }
    }

    if (!inplace) {
        return newData;
    }

    foundry.utils.mergeObject(data, newData, { performDeletions: true });

    if (deletionKeys) {
        foundry.utils.mergeObject(data, newData);
    }

    if (!keepOthers) {
        foundry.utils.filterObject(data, foundry.utils.expandObject(DEFAULT_FLAGS));
    }

    return data;
}

