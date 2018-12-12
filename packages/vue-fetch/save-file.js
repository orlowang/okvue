/*
 * FileSaver.js
 * A saveAs() FileSaver implementation.
 *
 * By Eli Grey, http://eligrey.com
 *
 * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
 * source  : http://purl.eligrey.com/github/FileSaver.js
 */

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999

// `a.click()` doesn't work for all browsers (#465)
function click(node) {
  try {
    node.dispatchEvent(new MouseEvent("click"));
  } catch (e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(
      "click",
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null
    );
    node.dispatchEvent(evt);
  }
}

export default function SaveAs(blob, name) {
  if ("download" in HTMLAnchorElement.prototype) {
    const URL = URL || webkitURL;
    const a = document.createElement("a");
    name = name || blob.name || "download";

    a.download = name;
    a.rel = "noopener"; // tabnabbing

    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'

    // Support blobs
    a.href = URL.createObjectURL(blob);
    setTimeout(function() {
      URL.revokeObjectURL(a.href);
    }, 4e4); // 40s
    setTimeout(function() {
      click(a);
    }, 0);
  } else {
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

    if (
      (isChromeIOS || (force && isSafari)) &&
      typeof FileReader === "object"
    ) {
      // Safari doesn't allow downloading of blob urls
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        url = isChromeIOS
          ? url
          : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        location = url;
      };
      reader.readAsDataURL(blob);
    } else {
      const URL = URL || webkitURL;
      const url = URL.createObjectURL(blob);
      location.href = url;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4); // 40s
    }
  }
}
