import SaveFile from "./save-file";

export function toPrefixPath(path, prefix) {
  return prefix ? trim(prefix, "/") + "/" + trim(path, "/") : path;
}

export function setApi(name, prefix) {
  return (prefix ? prefix + "_" : "") + name + "_status";
}

export function parseStream(src, type, isStream) {
  if (isStream) {
    if (isStream.immediately) {
      // download
      return src.blob().then(blob => SaveFile(blob, isStream.filename));
    }
    // stream
  } else {
    switch (true) {
      case /application\/x-www-form-urlencoded/.test(type):
      case /multipart\/form-data/.test(type):
        return src.formData();
      case /application\/json/.test(type):
        return src.json();
      case /video|audio|image|message|x-token/.test(type):
      case /text\/plain/.test(type):
      default:
        return src.text();
    }
  }
}

export function trim(string, str) {
  if (!string) return "";
  if (!str) {
    return string.trim();
  } else if (/\//.test(str)) {
    return string.replace(new RegExp(`^\\${str}+|\\${str}+$`, "g"), "");
  } else {
    return string.replace(new RegExp(`^${str}+|${str}+$`, "g"), "");
  }
}

export function toLower(str) {
  return str ? str.toLowerCase() : "";
}

export function toUpper(str) {
  return str ? str.toUpperCase() : "";
}
