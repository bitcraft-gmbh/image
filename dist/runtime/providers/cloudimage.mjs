import { joinURL, hasProtocol } from "ufo";
import { createOperationsGenerator } from "#image";
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: "func",
    quality: "q",
    format: "force_format"
  },
  valueMap: {
    fit: {
      cover: "crop",
      contain: "fit",
      fill: "cover",
      inside: "bound",
      outside: "boundmin"
    }
  },
  joinWith: "&",
  formatter: (key, value) => `${key}=${value}`
});
export const getImage = (src, {
  modifiers = {},
  baseURL = "",
  token = "",
  apiVersion = "",
  cdnURL = ""
} = {}) => {
  const operations = operationsGenerator(modifiers);
  const query = operations ? "?" + operations : "";
  if (process.dev) {
    const warning = [];
    if (!baseURL) {
      warning.push("<baseURL>");
    }
    if (!token && !cdnURL) {
      warning.push("<token> or <cdnURL>");
    }
    if (warning.length > 0) {
      console.warn(`[cloudimage] ${warning.join(", ")} is required to build image URL`);
      return {
        url: joinURL("<token>", "<baseURL>", src) + query
      };
    }
  }
  if (!cdnURL) {
    cdnURL = `https://${token}.cloudimg.io/${apiVersion}`;
  }
  if (hasProtocol(src)) {
    return {
      url: joinURL(src) + query
    };
  }
  return {
    url: joinURL(cdnURL, baseURL, src) + query
  };
};
