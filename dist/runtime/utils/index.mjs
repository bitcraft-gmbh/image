export default function imageFetch(url) {
  return fetch(cleanDoubleSlashes(url));
}
export function getInt(x) {
  if (typeof x === "number") {
    return x;
  }
  if (typeof x === "string") {
    return parseInt(x, 10);
  }
  return void 0;
}
export function getFileExtension(url = "") {
  const extension = url.split(/[?#]/).shift().split("/").pop().split(".").pop();
  return extension;
}
export function cleanDoubleSlashes(path = "") {
  return path.replace(/(https?:\/\/)|(\/)+/g, "$1$2");
}
export function createMapper(map) {
  return (key) => {
    return key ? map[key] || key : map.missingValue;
  };
}
export function createOperationsGenerator({ formatter, keyMap, joinWith = "/", valueMap } = {}) {
  if (!formatter) {
    formatter = (key, value) => `${key}=${value}`;
  }
  if (keyMap && typeof keyMap !== "function") {
    keyMap = createMapper(keyMap);
  }
  const map = valueMap || {};
  Object.keys(map).forEach((valueKey) => {
    if (typeof map[valueKey] !== "function") {
      map[valueKey] = createMapper(map[valueKey]);
    }
  });
  return (modifiers = {}) => {
    const operations = Object.entries(modifiers).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
      const mapper = map[key];
      if (typeof mapper === "function") {
        value = mapper(modifiers[key]);
      }
      key = typeof keyMap === "function" ? keyMap(key) : key;
      return formatter(key, value);
    });
    return operations.join(joinWith);
  };
}
export function renderAttributesToString(attributes = {}) {
  return Object.entries(attributes).map(([key, value]) => value ? `${key}="${value}"` : "").filter(Boolean).join(" ");
}
export function renderTag(tag, attrs, contents) {
  const html = `<${tag} ${renderAttributesToString(attrs)}>`;
  if (!contents) {
    return html;
  }
  return html + contents + `</${tag}>`;
}
export function generateAlt(src = "") {
  return src.split(/[?#]/).shift().split("/").pop().split(".").shift();
}
export function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return parseInt(input, 10);
    }
  }
}
export function parseDensities(input = "") {
  if (input === void 0 || !input.length) {
    return [];
  }
  const densities = /* @__PURE__ */ new Set();
  for (const density of input.split(" ")) {
    const d = parseInt(density.replace("x", ""));
    if (d) {
      densities.add(d);
    }
  }
  return Array.from(densities);
}
export function checkDensities(densities) {
  if (densities.length === 0) {
    throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
  }
  if (process.dev && Array.from(densities).some((d) => d > 2)) {
    console.warn("[nuxt] [image] Density values above `2` are not recommended. See https://observablehq.com/@eeeps/visual-acuity-and-device-pixel-ratio.");
  }
}
export function parseSizes(input) {
  const sizes = {};
  if (typeof input === "string") {
    for (const entry of input.split(/[\s,]+/).filter((e) => e)) {
      const s = entry.split(":");
      if (s.length !== 2) {
        sizes["1px"] = s[0].trim();
      } else {
        sizes[s[0].trim()] = s[1].trim();
      }
    }
  } else {
    Object.assign(sizes, input);
  }
  return sizes;
}
