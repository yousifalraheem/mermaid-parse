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
  const translate_regex = /&(nbsp|amp|quot|lt|qt);/g;
  const translate_map = {
    nbsp: " ",
    amp: "&",
    quot: "\"",
    lt: "<",
    gt: ">",
  };
  return encodedString
    .replace(translate_regex, (_, entity) => translate_map[entity])
    .replace(/&#(\d+);/gi, (_, charCode) =>
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
  const ref2 = _asyncToGenerator(function* (browser, definition) {
    const page = yield browser.newPage();
    page.setViewport({
      width: 800, height: 600, deviceScaleFactor: 1
    }).catch(e => {
      throw new Error(e);
    });
    yield page.goto(`file://${path.join(__dirname, "index.html")}`);
    yield page.evaluate(`document.body.style.background = 'white'`);
    /* istanbul ignore next */
    yield page.$eval("#container", (container, definition) => {
      container.textContent = definition;
      window.mermaid.initialize({theme: "default"});

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
    }, definition);

    /* istanbul ignore next */
    const svg = yield page.$eval("#container", (container) => {
      let _container$getElement, _container$getElement2;

      const svg = (_container$getElement = container.getElementsByTagName) === null || _container$getElement === void 0 ? void 0 : (_container$getElement2 = _container$getElement.call(container, "svg")) === null || _container$getElement2 === void 0 ? void 0 : _container$getElement2[0];

      if (svg.style) {
        svg.style.backgroundColor = "white";
      }

      return container.innerHTML;
    });
    const svg_xml = svg.replace(/<br>/gi, "<br/>");

    return svg_xml;
  });

  return function parseMMD(_x2, _x3, _x4) {
    return ref2.apply(this, arguments);
  };
}();

/**
 * Parses Mermaid definition to SVG diagram
 * @param {string} definition
 * @return Promise<string>
 */
module.exports = function (definition) {
  return _asyncToGenerator(function* () {
    const browser = yield puppeteer.launch();

    /**
     * @type {string}
     */
    const output = yield parseMMD(browser, decodeHTMLEntities(definition));
    yield browser.close();

    if (output.trim().startsWith("<div id=\"dmermaid-")) {
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
