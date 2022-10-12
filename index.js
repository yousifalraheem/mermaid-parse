#!/usr/bin/env node
"use strict";

const path = require("path");
const puppeteer = require("puppeteer");

/**
 * decode HTML entities
 * @param {string} encodedString
 * @returns {string} The decoded string
 */
function decodeHTMLEntities(encodedString) {
  const translate_regex = /&(nbsp|amp|quot|lt|gt);/g;
  const translate_map = {
    nbsp: " ",
    amp: "&",
    quot: "\"",
    lt: "<",
    gt: ">",
  };
  return encodedString
    .replace(translate_regex, (_, entity) => translate_map[entity] || entity)
    .replace(/&#(\w+);/gi, (_, charCode) =>
      String.fromCharCode(parseInt(charCode))
    )
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  let info;
  let value;
  try {
    info = gen[key](arg);
    value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    const self = this, args = arguments;
    return new Promise(function (resolve, reject) {
      const gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

const parseMMD = /*#__PURE__*/function () {
  const ref2 = _asyncToGenerator(function* (browser, definition, config) {
    const page = yield browser.newPage();
    page.setViewport({
      width: 800, height: 600, deviceScaleFactor: 1
    }).catch(e => {
      throw new Error(e);
    });
    yield page.goto(`file://${path.join(__dirname, "index.html")}`);
    yield page.evaluate(`document.body.style.background = 'transparent'`);
    /* istanbul ignore next */
    yield page.$eval("#container", (container, definition) => {
      container.textContent = definition;
      window.mermaid.initialize({ theme: "default" });

      try {
        window.mermaid.init(undefined, container);
        return {
          status: "success"
        };
      } catch (error) {
        return {
          status: "error", error, message: error.message
        };
      }
    }, definition, config);
    let extension = (config && config.extension) || "svg";

    switch (extension) {
      case "png":
        /* istanbul ignore next */
        const clip = yield page.$eval("svg", svg => {
          const react = svg.getBoundingClientRect();
          return {
            x: Math.floor(react.left),
            y: Math.floor(react.top),
            width: Math.ceil(react.width),
            height: Math.ceil(react.height)
          };
        });
        yield page.setViewport({
          width: clip.x + clip.width,
          height: clip.y + clip.height,
          deviceScaleFactor: 1
        });
        /** @type {Buffer} buffer */
        const buffer = yield page.screenshot({
          clip,
          omitBackground: true
        });
        const base64Url = Buffer.from(buffer).toString("base64");
        return `<img style="max-width: 100%" alt="Diagram" src="data:image/png;base64,${base64Url}" />`;
      case "svg":
        /* istanbul ignore next */
        const svg = yield page.$eval("#container", (container) => {
          let _container$getElement, _container$getElement2;

          const svg = (_container$getElement = container.getElementsByTagName) === null || _container$getElement === void 0 ? void 0 : (_container$getElement2 = _container$getElement.call(container, "svg")) === null || _container$getElement2 === void 0 ? void 0 : _container$getElement2[0];

          if (svg.style) {
            svg.style.backgroundColor = "transparent";
          }

          return container.innerHTML;
        });
        const svg_xml = svg.replace(/<br>/gi, "<br/>");

        return svg_xml;
      default:
        throw new Error(`Unsupported extension: ${extension}`);
        break;
    }
  });

  return function parseMMD(_x2, _x3, _x4) {
    return ref2.apply(this, arguments);
  };
}();

module.exports = function mermaidParse(definition, config, puppeteerConfig = undefined) {
  return _asyncToGenerator(function* () {
    const browser = yield puppeteer.launch(puppeteerConfig)
    
    /** @type {string} */
    const output = yield parseMMD(browser, decodeHTMLEntities(definition), config);
    yield browser.close();

    if (typeof output === "string" && output.trim().startsWith("<div id=\"dmermaid-")) {
      const errorTextStart = `<text.*?class=".*?error-text.*?".*?>`;
      const errorTextEnd = `</text>`;
      const errorTextRegEx = new RegExp(`${errorTextStart}(.|\\n)*?${errorTextEnd}`);
      const errorBlock = output.match(errorTextRegEx)[0];
      const error = new Error(errorBlock
        .replace(new RegExp(errorTextStart), "")
        .replace(new RegExp(errorTextEnd), "")
        .trim());
      error.output = output;
      throw error;
    }

    return output;
  })();
}
