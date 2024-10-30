// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/@capacitor/core/dist/index.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPlatform = exports.registerWebPlugin = exports.registerPlugin = exports.buildRequestInit = exports.addPlatform = exports.WebView = exports.WebPlugin = exports.Plugins = exports.ExceptionCode = exports.CapacitorPlatforms = exports.CapacitorHttp = exports.CapacitorException = exports.CapacitorCookies = exports.Capacitor = void 0;
/*! Capacitor: https://capacitorjs.com/ - MIT License */
const createCapacitorPlatforms = win => {
  const defaultPlatformMap = new Map();
  defaultPlatformMap.set('web', {
    name: 'web'
  });
  const capPlatforms = win.CapacitorPlatforms || {
    currentPlatform: {
      name: 'web'
    },
    platforms: defaultPlatformMap
  };
  const addPlatform = (name, platform) => {
    capPlatforms.platforms.set(name, platform);
  };
  const setPlatform = name => {
    if (capPlatforms.platforms.has(name)) {
      capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
    }
  };
  capPlatforms.addPlatform = addPlatform;
  capPlatforms.setPlatform = setPlatform;
  return capPlatforms;
};
const initPlatforms = win => win.CapacitorPlatforms = createCapacitorPlatforms(win);
/**
 * @deprecated Set `CapacitorCustomPlatform` on the window object prior to runtime executing in the web app instead
 */
const CapacitorPlatforms = exports.CapacitorPlatforms = /*#__PURE__*/initPlatforms(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
/**
 * @deprecated Set `CapacitorCustomPlatform` on the window object prior to runtime executing in the web app instead
 */
const addPlatform = exports.addPlatform = CapacitorPlatforms.addPlatform;
/**
 * @deprecated Set `CapacitorCustomPlatform` on the window object prior to runtime executing in the web app instead
 */
const setPlatform = exports.setPlatform = CapacitorPlatforms.setPlatform;
const legacyRegisterWebPlugin = (cap, webPlugin) => {
  var _a;
  const config = webPlugin.config;
  const Plugins = cap.Plugins;
  if (!(config === null || config === void 0 ? void 0 : config.name)) {
    // TODO: add link to upgrade guide
    throw new Error(`Capacitor WebPlugin is using the deprecated "registerWebPlugin()" function, but without the config. Please use "registerPlugin()" instead to register this web plugin."`);
  }
  // TODO: add link to upgrade guide
  console.warn(`Capacitor plugin "${config.name}" is using the deprecated "registerWebPlugin()" function`);
  if (!Plugins[config.name] || ((_a = config === null || config === void 0 ? void 0 : config.platforms) === null || _a === void 0 ? void 0 : _a.includes(cap.getPlatform()))) {
    // Add the web plugin into the plugins registry if there already isn't
    // an existing one. If it doesn't already exist, that means
    // there's no existing native implementation for it.
    // - OR -
    // If we already have a plugin registered (meaning it was defined in the native layer),
    // then we should only overwrite it if the corresponding web plugin activates on
    // a certain platform. For example: Geolocation uses the WebPlugin on Android but not iOS
    Plugins[config.name] = webPlugin;
  }
};
var ExceptionCode;
(function (ExceptionCode) {
  /**
   * API is not implemented.
   *
   * This usually means the API can't be used because it is not implemented for
   * the current platform.
   */
  ExceptionCode["Unimplemented"] = "UNIMPLEMENTED";
  /**
   * API is not available.
   *
   * This means the API can't be used right now because:
   *   - it is currently missing a prerequisite, such as network connectivity
   *   - it requires a particular platform or browser version
   */
  ExceptionCode["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (exports.ExceptionCode = ExceptionCode = {}));
class CapacitorException extends Error {
  constructor(message, code, data) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
exports.CapacitorException = CapacitorException;
const getPlatformId = win => {
  var _a, _b;
  if (win === null || win === void 0 ? void 0 : win.androidBridge) {
    return 'android';
  } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
    return 'ios';
  } else {
    return 'web';
  }
};
const createCapacitor = win => {
  var _a, _b, _c, _d, _e;
  const capCustomPlatform = win.CapacitorCustomPlatform || null;
  const cap = win.Capacitor || {};
  const Plugins = cap.Plugins = cap.Plugins || {};
  /**
   * @deprecated Use `capCustomPlatform` instead, default functions like registerPlugin will function with the new object.
   */
  const capPlatforms = win.CapacitorPlatforms;
  const defaultGetPlatform = () => {
    return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
  };
  const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
  const defaultIsNativePlatform = () => getPlatform() !== 'web';
  const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
  const defaultIsPluginAvailable = pluginName => {
    const plugin = registeredPlugins.get(pluginName);
    if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
      // JS implementation available for the current platform.
      return true;
    }
    if (getPluginHeader(pluginName)) {
      // Native implementation available.
      return true;
    }
    return false;
  };
  const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) || defaultIsPluginAvailable;
  const defaultGetPluginHeader = pluginName => {
    var _a;
    return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find(h => h.name === pluginName);
  };
  const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
  const handleError = err => win.console.error(err);
  const pluginMethodNoop = (_target, prop, pluginName) => {
    return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
  };
  const registeredPlugins = new Map();
  const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
    const registeredPlugin = registeredPlugins.get(pluginName);
    if (registeredPlugin) {
      console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
      return registeredPlugin.proxy;
    }
    const platform = getPlatform();
    const pluginHeader = getPluginHeader(pluginName);
    let jsImplementation;
    const loadPluginImplementation = async () => {
      if (!jsImplementation && platform in jsImplementations) {
        jsImplementation = typeof jsImplementations[platform] === 'function' ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
      } else if (capCustomPlatform !== null && !jsImplementation && 'web' in jsImplementations) {
        jsImplementation = typeof jsImplementations['web'] === 'function' ? jsImplementation = await jsImplementations['web']() : jsImplementation = jsImplementations['web'];
      }
      return jsImplementation;
    };
    const createPluginMethod = (impl, prop) => {
      var _a, _b;
      if (pluginHeader) {
        const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find(m => prop === m.name);
        if (methodHeader) {
          if (methodHeader.rtype === 'promise') {
            return options => cap.nativePromise(pluginName, prop.toString(), options);
          } else {
            return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
          }
        } else if (impl) {
          return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
        }
      } else if (impl) {
        return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
      } else {
        throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
      }
    };
    const createPluginMethodWrapper = prop => {
      let remove;
      const wrapper = (...args) => {
        const p = loadPluginImplementation().then(impl => {
          const fn = createPluginMethod(impl, prop);
          if (fn) {
            const p = fn(...args);
            remove = p === null || p === void 0 ? void 0 : p.remove;
            return p;
          } else {
            throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        });
        if (prop === 'addListener') {
          p.remove = async () => remove();
        }
        return p;
      };
      // Some flair ✨
      wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
      Object.defineProperty(wrapper, 'name', {
        value: prop,
        writable: false,
        configurable: false
      });
      return wrapper;
    };
    const addListener = createPluginMethodWrapper('addListener');
    const removeListener = createPluginMethodWrapper('removeListener');
    const addListenerNative = (eventName, callback) => {
      const call = addListener({
        eventName
      }, callback);
      const remove = async () => {
        const callbackId = await call;
        removeListener({
          eventName,
          callbackId
        }, callback);
      };
      const p = new Promise(resolve => call.then(() => resolve({
        remove
      })));
      p.remove = async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      };
      return p;
    };
    const proxy = new Proxy({}, {
      get(_, prop) {
        switch (prop) {
          // https://github.com/facebook/react/issues/20030
          case '$$typeof':
            return undefined;
          case 'toJSON':
            return () => ({});
          case 'addListener':
            return pluginHeader ? addListenerNative : addListener;
          case 'removeListener':
            return removeListener;
          default:
            return createPluginMethodWrapper(prop);
        }
      }
    });
    Plugins[pluginName] = proxy;
    registeredPlugins.set(pluginName, {
      name: pluginName,
      proxy,
      platforms: new Set([...Object.keys(jsImplementations), ...(pluginHeader ? [platform] : [])])
    });
    return proxy;
  };
  const registerPlugin = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
  // Add in convertFileSrc for web, it will already be available in native context
  if (!cap.convertFileSrc) {
    cap.convertFileSrc = filePath => filePath;
  }
  cap.getPlatform = getPlatform;
  cap.handleError = handleError;
  cap.isNativePlatform = isNativePlatform;
  cap.isPluginAvailable = isPluginAvailable;
  cap.pluginMethodNoop = pluginMethodNoop;
  cap.registerPlugin = registerPlugin;
  cap.Exception = CapacitorException;
  cap.DEBUG = !!cap.DEBUG;
  cap.isLoggingEnabled = !!cap.isLoggingEnabled;
  // Deprecated props
  cap.platform = cap.getPlatform();
  cap.isNative = cap.isNativePlatform();
  return cap;
};
const initCapacitorGlobal = win => win.Capacitor = createCapacitor(win);
const Capacitor = exports.Capacitor = /*#__PURE__*/initCapacitorGlobal(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
const registerPlugin = exports.registerPlugin = Capacitor.registerPlugin;
/**
 * @deprecated Provided for backwards compatibility for Capacitor v2 plugins.
 * Capacitor v3 plugins should import the plugin directly. This "Plugins"
 * export is deprecated in v3, and will be removed in v4.
 */
const Plugins = exports.Plugins = Capacitor.Plugins;
/**
 * Provided for backwards compatibility. Use the registerPlugin() API
 * instead, and provide the web plugin as the "web" implmenetation.
 * For example
 *
 * export const Example = registerPlugin('Example', {
 *   web: () => import('./web').then(m => new m.Example())
 * })
 *
 * @deprecated Deprecated in v3, will be removed from v4.
 */
const registerWebPlugin = plugin => legacyRegisterWebPlugin(Capacitor, plugin);

/**
 * Base class web plugins should extend.
 */
exports.registerWebPlugin = registerWebPlugin;
class WebPlugin {
  constructor(config) {
    this.listeners = {};
    this.retainedEventArguments = {};
    this.windowListeners = {};
    if (config) {
      // TODO: add link to upgrade guide
      console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
      this.config = config;
    }
  }
  addListener(eventName, listenerFunc) {
    let firstListener = false;
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
      firstListener = true;
    }
    this.listeners[eventName].push(listenerFunc);
    // If we haven't added a window listener for this event and it requires one,
    // go ahead and add it
    const windowListener = this.windowListeners[eventName];
    if (windowListener && !windowListener.registered) {
      this.addWindowListener(windowListener);
    }
    if (firstListener) {
      this.sendRetainedArgumentsForEvent(eventName);
    }
    const remove = async () => this.removeListener(eventName, listenerFunc);
    const p = Promise.resolve({
      remove
    });
    return p;
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const listener in this.windowListeners) {
      this.removeWindowListener(this.windowListeners[listener]);
    }
    this.windowListeners = {};
  }
  notifyListeners(eventName, data, retainUntilConsumed) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      if (retainUntilConsumed) {
        let args = this.retainedEventArguments[eventName];
        if (!args) {
          args = [];
        }
        args.push(data);
        this.retainedEventArguments[eventName] = args;
      }
      return;
    }
    listeners.forEach(listener => listener(data));
  }
  hasListeners(eventName) {
    return !!this.listeners[eventName].length;
  }
  registerWindowListener(windowEventName, pluginEventName) {
    this.windowListeners[pluginEventName] = {
      registered: false,
      windowEventName,
      pluginEventName,
      handler: event => {
        this.notifyListeners(pluginEventName, event);
      }
    };
  }
  unimplemented(msg = 'not implemented') {
    return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
  }
  unavailable(msg = 'not available') {
    return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
  }
  async removeListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index, 1);
    // If there are no more listeners for this type of event,
    // remove the window listener
    if (!this.listeners[eventName].length) {
      this.removeWindowListener(this.windowListeners[eventName]);
    }
  }
  addWindowListener(handle) {
    window.addEventListener(handle.windowEventName, handle.handler);
    handle.registered = true;
  }
  removeWindowListener(handle) {
    if (!handle) {
      return;
    }
    window.removeEventListener(handle.windowEventName, handle.handler);
    handle.registered = false;
  }
  sendRetainedArgumentsForEvent(eventName) {
    const args = this.retainedEventArguments[eventName];
    if (!args) {
      return;
    }
    delete this.retainedEventArguments[eventName];
    args.forEach(arg => {
      this.notifyListeners(eventName, arg);
    });
  }
}
exports.WebPlugin = WebPlugin;
const WebView = exports.WebView = /*#__PURE__*/registerPlugin('WebView');
/******** END WEB VIEW PLUGIN ********/
/******** COOKIES PLUGIN ********/
/**
 * Safely web encode a string value (inspired by js-cookie)
 * @param str The string value to encode
 */
const encode = str => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
/**
 * Safely web decode a string value (inspired by js-cookie)
 * @param str The string value to decode
 */
const decode = str => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class CapacitorCookiesPluginWeb extends WebPlugin {
  async getCookies() {
    const cookies = document.cookie;
    const cookieMap = {};
    cookies.split(';').forEach(cookie => {
      if (cookie.length <= 0) return;
      // Replace first "=" with CAP_COOKIE to prevent splitting on additional "="
      let [key, value] = cookie.replace(/=/, 'CAP_COOKIE').split('CAP_COOKIE');
      key = decode(key).trim();
      value = decode(value).trim();
      cookieMap[key] = value;
    });
    return cookieMap;
  }
  async setCookie(options) {
    try {
      // Safely Encoded Key/Value
      const encodedKey = encode(options.key);
      const encodedValue = encode(options.value);
      // Clean & sanitize options
      const expires = `; expires=${(options.expires || '').replace('expires=', '')}`; // Default is "; expires="
      const path = (options.path || '/').replace('path=', ''); // Default is "path=/"
      const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : '';
      document.cookie = `${encodedKey}=${encodedValue || ''}${expires}; path=${path}; ${domain};`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async deleteCookie(options) {
    try {
      document.cookie = `${options.key}=; Max-Age=0`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearCookies() {
    try {
      const cookies = document.cookie.split(';') || [];
      for (const cookie of cookies) {
        document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
const CapacitorCookies = exports.CapacitorCookies = registerPlugin('CapacitorCookies', {
  web: () => new CapacitorCookiesPluginWeb()
});
// UTILITY FUNCTIONS
/**
 * Read in a Blob value and return it as a base64 string
 * @param blob The blob value to convert to a base64 string
 */
const readBlobAsBase64 = async blob => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result;
    // remove prefix "data:application/pdf;base64,"
    resolve(base64String.indexOf(',') >= 0 ? base64String.split(',')[1] : base64String);
  };
  reader.onerror = error => reject(error);
  reader.readAsDataURL(blob);
});
/**
 * Normalize an HttpHeaders map by lowercasing all of the values
 * @param headers The HttpHeaders object to normalize
 */
const normalizeHttpHeaders = (headers = {}) => {
  const originalKeys = Object.keys(headers);
  const loweredKeys = Object.keys(headers).map(k => k.toLocaleLowerCase());
  const normalized = loweredKeys.reduce((acc, key, index) => {
    acc[key] = headers[originalKeys[index]];
    return acc;
  }, {});
  return normalized;
};
/**
 * Builds a string of url parameters that
 * @param params A map of url parameters
 * @param shouldEncode true if you should encodeURIComponent() the values (true by default)
 */
const buildUrlParams = (params, shouldEncode = true) => {
  if (!params) return null;
  const output = Object.entries(params).reduce((accumulator, entry) => {
    const [key, value] = entry;
    let encodedValue;
    let item;
    if (Array.isArray(value)) {
      item = '';
      value.forEach(str => {
        encodedValue = shouldEncode ? encodeURIComponent(str) : str;
        item += `${key}=${encodedValue}&`;
      });
      // last character will always be "&" so slice it off
      item.slice(0, -1);
    } else {
      encodedValue = shouldEncode ? encodeURIComponent(value) : value;
      item = `${key}=${encodedValue}`;
    }
    return `${accumulator}&${item}`;
  }, '');
  // Remove initial "&" from the reduce
  return output.substr(1);
};
/**
 * Build the RequestInit object based on the options passed into the initial request
 * @param options The Http plugin options
 * @param extra Any extra RequestInit values
 */
const buildRequestInit = (options, extra = {}) => {
  const output = Object.assign({
    method: options.method || 'GET',
    headers: options.headers
  }, extra);
  // Get the content-type
  const headers = normalizeHttpHeaders(options.headers);
  const type = headers['content-type'] || '';
  // If body is already a string, then pass it through as-is.
  if (typeof options.data === 'string') {
    output.body = options.data;
  }
  // Build request initializers based off of content-type
  else if (type.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.data || {})) {
      params.set(key, value);
    }
    output.body = params.toString();
  } else if (type.includes('multipart/form-data') || options.data instanceof FormData) {
    const form = new FormData();
    if (options.data instanceof FormData) {
      options.data.forEach((value, key) => {
        form.append(key, value);
      });
    } else {
      for (const key of Object.keys(options.data)) {
        form.append(key, options.data[key]);
      }
    }
    output.body = form;
    const headers = new Headers(output.headers);
    headers.delete('content-type'); // content-type will be set by `window.fetch` to includy boundary
    output.headers = headers;
  } else if (type.includes('application/json') || typeof options.data === 'object') {
    output.body = JSON.stringify(options.data);
  }
  return output;
};
// WEB IMPLEMENTATION
exports.buildRequestInit = buildRequestInit;
class CapacitorHttpPluginWeb extends WebPlugin {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(options) {
    const requestInit = buildRequestInit(options, options.webFetchExtra);
    const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
    const url = urlParams ? `${options.url}?${urlParams}` : options.url;
    const response = await fetch(url, requestInit);
    const contentType = response.headers.get('content-type') || '';
    // Default to 'text' responseType so no parsing happens
    let {
      responseType = 'text'
    } = response.ok ? options : {};
    // If the response content-type is json, force the response to be json
    if (contentType.includes('application/json')) {
      responseType = 'json';
    }
    let data;
    let blob;
    switch (responseType) {
      case 'arraybuffer':
      case 'blob':
        blob = await response.blob();
        data = await readBlobAsBase64(blob);
        break;
      case 'json':
        data = await response.json();
        break;
      case 'document':
      case 'text':
      default:
        data = await response.text();
    }
    // Convert fetch headers to Capacitor HttpHeaders
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return {
      data,
      headers,
      status: response.status,
      url: response.url
    };
  }
  /**
   * Perform an Http GET request given a set of options
   * @param options Options to build the HTTP request
   */
  async get(options) {
    return this.request(Object.assign(Object.assign({}, options), {
      method: 'GET'
    }));
  }
  /**
   * Perform an Http POST request given a set of options
   * @param options Options to build the HTTP request
   */
  async post(options) {
    return this.request(Object.assign(Object.assign({}, options), {
      method: 'POST'
    }));
  }
  /**
   * Perform an Http PUT request given a set of options
   * @param options Options to build the HTTP request
   */
  async put(options) {
    return this.request(Object.assign(Object.assign({}, options), {
      method: 'PUT'
    }));
  }
  /**
   * Perform an Http PATCH request given a set of options
   * @param options Options to build the HTTP request
   */
  async patch(options) {
    return this.request(Object.assign(Object.assign({}, options), {
      method: 'PATCH'
    }));
  }
  /**
   * Perform an Http DELETE request given a set of options
   * @param options Options to build the HTTP request
   */
  async delete(options) {
    return this.request(Object.assign(Object.assign({}, options), {
      method: 'DELETE'
    }));
  }
}
const CapacitorHttp = exports.CapacitorHttp = registerPlugin('CapacitorHttp', {
  web: () => new CapacitorHttpPluginWeb()
});
/******** END HTTP PLUGIN ********/
},{}],"../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }
  return bundleURL;
}
function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }
  return '/';
}
function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;
function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }
  var id = bundles[bundles.length - 1];
  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }
    throw err;
  }
}
function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}
var bundleLoaders = {};
function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}
module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};
function loadBundle(bundle) {
  var id;
  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }
  if (bundles[bundle]) {
    return bundles[bundle];
  }
  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];
  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }
      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}
function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}
LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};
LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../node_modules/@capacitor/local-notifications/dist/esm/definitions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Weekday = void 0;
/// <reference types="@capacitor/cli" />
/**
 * Day of the week. Used for scheduling notifications on a particular weekday.
 */
var Weekday;
(function (Weekday) {
  Weekday[Weekday["Sunday"] = 1] = "Sunday";
  Weekday[Weekday["Monday"] = 2] = "Monday";
  Weekday[Weekday["Tuesday"] = 3] = "Tuesday";
  Weekday[Weekday["Wednesday"] = 4] = "Wednesday";
  Weekday[Weekday["Thursday"] = 5] = "Thursday";
  Weekday[Weekday["Friday"] = 6] = "Friday";
  Weekday[Weekday["Saturday"] = 7] = "Saturday";
})(Weekday || (exports.Weekday = Weekday = {}));
},{}],"../node_modules/@capacitor/local-notifications/dist/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LocalNotifications: true
};
exports.LocalNotifications = void 0;
var _core = require("@capacitor/core");
var _definitions = require("./definitions");
Object.keys(_definitions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _definitions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _definitions[key];
    }
  });
});
const LocalNotifications = exports.LocalNotifications = (0, _core.registerPlugin)('LocalNotifications', {
  web: () => require("_bundle_loader")(require.resolve('./web')).then(m => new m.LocalNotificationsWeb())
});
},{"@capacitor/core":"../node_modules/@capacitor/core/dist/index.js","_bundle_loader":"../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/bundle-loader.js","./web":[["web.19f43c55.js","../node_modules/@capacitor/local-notifications/dist/esm/web.js"],"web.19f43c55.js.map","../node_modules/@capacitor/local-notifications/dist/esm/web.js"],"./definitions":"../node_modules/@capacitor/local-notifications/dist/esm/definitions.js"}],"main.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = createUser;
exports.fetchMessage = fetchMessage;
exports.parseMessageUserID = parseMessageUserID;
var _localNotifications = require("@capacitor/local-notifications");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var supabase2 = null;
try {
  var _supabase = supabase,
    createClient = _supabase.createClient;
  supabase2 = createClient('https://dvlfunioxoupyyaxipnj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bGZ1bmlveG91cHl5YXhpcG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczODE2MzIsImV4cCI6MjA0Mjk1NzYzMn0.Tyqzm6kKzVZqnBDYN69Pb3fcwkSRcA4zUb6QSO0I6gY'); // Replace with your actual anon key
  console.log("passed");
} catch (_unused) {
  alert("No Internet Connection");
  throw new Error("No Internet");
}
function getQueryParams(pram) {
  var params = new URLSearchParams(window.location.search);
  var temp = params.get(pram); // Gets the value of 'name'
  console.log(temp);
  return temp;
}
var Base64 = /*#__PURE__*/function () {
  function Base64() {
    _classCallCheck(this, Base64);
  }
  return _createClass(Base64, [{
    key: "toBase64",
    value: function toBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      for (var i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
  }, {
    key: "toArrayBuffer",
    value: function toArrayBuffer(base64) {
      var binaryString = window.atob(base64);
      var len = binaryString.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
  }]);
}();
var MessagingService = /*#__PURE__*/function () {
  function MessagingService() {
    _classCallCheck(this, MessagingService);
    this.Preferences = Capacitor.Plugins.Preferences;
  }
  return _createClass(MessagingService, [{
    key: "submitMessage",
    value: function () {
      var _submitMessage = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(Table, MessageEncrypted, sender_id, Public_Key, sendingto) {
        var _yield$supabase2$from, error;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return supabase2.from(Table) // Replace with your table name
              .insert({
                created_at: Date.now,
                sender_id: sender_id,
                SendingTo: sendingto,
                encrypted_message: MessageEncrypted,
                public_key: Public_Key
              });
            case 2:
              _yield$supabase2$from = _context.sent;
              error = _yield$supabase2$from.error;
              // Replace with your column names and values;
              if (error) {
                console.error('Error submitting message:', error);
              }
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function submitMessage(_x, _x2, _x3, _x4, _x5) {
        return _submitMessage.apply(this, arguments);
      }
      return submitMessage;
    }()
  }, {
    key: "createMessage",
    value: function () {
      var _createMessage = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(msg, userSendingTo, public_key) {
        var userID, publicKeys, i, encryptedMessage;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = parseMessageUserID;
              _context2.next = 3;
              return fetchMessage("Users", "User_id");
            case 3:
              _context2.t1 = _context2.sent;
              userID = (0, _context2.t0)(_context2.t1);
              _context2.next = 7;
              return fetchMessage("Users", "Public_Key");
            case 7:
              publicKeys = _context2.sent;
              _context2.prev = 8;
              i = 0;
            case 10:
              if (!(i < userID.length)) {
                _context2.next = 23;
                break;
              }
              if (!(userID[i] === userSendingTo)) {
                _context2.next = 20;
                break;
              }
              console.log(msg, publicKeys[i].Public_Key);
              _context2.next = 15;
              return encryption.encryptData(publicKeys[i].Public_Key, msg);
            case 15:
              encryptedMessage = _context2.sent;
              console.log("Got to here", encryptedMessage);
              _context2.next = 19;
              return this.submitMessage('Messages', base64.toBase64(encryptedMessage), user.userid, base64.toBase64(public_key), userSendingTo);
            case 19:
              console.log("Message Sent", true);
            case 20:
              i++;
              _context2.next = 10;
              break;
            case 23:
              _context2.next = 28;
              break;
            case 25:
              _context2.prev = 25;
              _context2.t2 = _context2["catch"](8);
              throw new Error("Something wrong");
            case 28:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[8, 25]]);
      }));
      function createMessage(_x6, _x7, _x8) {
        return _createMessage.apply(this, arguments);
      }
      return createMessage;
    }()
  }, {
    key: "createMessageDiv",
    value: function createMessageDiv(msg, user) {
      console.log(user);
      var messageDIV = document.createElement("div");
      var p2 = document.createElement("p");
      p2.innerHTML = "" + user;
      messageDIV.appendChild(p2);
      var p = document.createElement("p");
      p.innerHTML = msg;
      messageDIV.className = "card";
      messageDIV.appendChild(p);
      document.getElementById("messages").appendChild(messageDIV);
    }
  }]);
}();
var Encryption = /*#__PURE__*/function () {
  function Encryption() {
    _classCallCheck(this, Encryption);
  }
  return _createClass(Encryption, [{
    key: "generateAndExportKeyPair",
    value: function () {
      var _generateAndExportKeyPair = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var _yield$window$crypto$, publicKey, privateKey, exportedPublicKey, exportedPrivateKey;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return window.crypto.subtle.generateKey({
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
              }, true, ["encrypt", "decrypt"]);
            case 2:
              _yield$window$crypto$ = _context3.sent;
              publicKey = _yield$window$crypto$.publicKey;
              privateKey = _yield$window$crypto$.privateKey;
              _context3.prev = 5;
              _context3.next = 8;
              return window.crypto.subtle.exportKey("spki", publicKey);
            case 8:
              exportedPublicKey = _context3.sent;
              _context3.next = 11;
              return window.crypto.subtle.exportKey("pkcs8", privateKey);
            case 11:
              exportedPrivateKey = _context3.sent;
              return _context3.abrupt("return", {
                publicKey: exportedPublicKey,
                privateKey: exportedPrivateKey
              });
            case 15:
              _context3.prev = 15;
              _context3.t0 = _context3["catch"](5);
              console.error("Key export failed:", _context3.t0);
              throw new Error("Failed to export the keys.");
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[5, 15]]);
      }));
      function generateAndExportKeyPair() {
        return _generateAndExportKeyPair.apply(this, arguments);
      }
      return generateAndExportKeyPair;
    }()
  }, {
    key: "generateRandomString",
    value: function generateRandomString(length) {
      if (length < 1) return '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var randomString = '';
      for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
      }
      return randomString;
    }
  }, {
    key: "importPublicKey",
    value: function () {
      var _importPublicKey = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(exportedKey) {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return window.crypto.subtle.importKey("spki",
              // Format
              exportedKey,
              // The exported key data
              {
                name: "RSA-OAEP",
                hash: "SHA-256" // Hash function used
              }, true,
              // Whether the key is extractable
              ["encrypt"] // Usages
              );
            case 2:
              return _context4.abrupt("return", _context4.sent);
            case 3:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function importPublicKey(_x9) {
        return _importPublicKey.apply(this, arguments);
      }
      return importPublicKey;
    }()
  }, {
    key: "encryptData",
    value: function () {
      var _encryptData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(publicKeyBase64, tempData) {
        var publicKeyBuffer, publicKey, encodedData, encryptedData;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              console.log("Trying to encrypt");
              publicKeyBuffer = base64.toArrayBuffer(publicKeyBase64); // Convert base64 to ArrayBuffer
              console.log("Trying to encrypt2");
              _context5.next = 5;
              return this.importPublicKey(publicKeyBuffer);
            case 5:
              publicKey = _context5.sent;
              // Import the key properly
              encodedData = new TextEncoder().encode(tempData); // Encode the data
              console.log("Got to here 2");
              _context5.next = 10;
              return window.crypto.subtle.encrypt({
                name: "RSA-OAEP"
              }, publicKey,
              // The public key
              encodedData // Data to encrypt
              );
            case 10:
              encryptedData = _context5.sent;
              return _context5.abrupt("return", encryptedData);
            case 12:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function encryptData(_x10, _x11) {
        return _encryptData.apply(this, arguments);
      }
      return encryptData;
    }()
  }, {
    key: "decryptData",
    value: function () {
      var _decryptData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(privateKeyBase64, encryptedMessage) {
        var privateKeyBuffer, privateKey, decryptedMessage;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              privateKeyBuffer = base64.toArrayBuffer(privateKeyBase64);
              _context6.next = 4;
              return window.crypto.subtle.importKey("pkcs8", privateKeyBuffer, {
                name: "RSA-OAEP",
                hash: "SHA-256"
              }, true, ["decrypt"]);
            case 4:
              privateKey = _context6.sent;
              _context6.next = 7;
              return window.crypto.subtle.decrypt({
                name: "RSA-OAEP"
              }, privateKey, encryptedMessage);
            case 7:
              decryptedMessage = _context6.sent;
              return _context6.abrupt("return", new TextDecoder().decode(decryptedMessage));
            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6["catch"](0);
              throw new Error("Decryption failed: " + _context6.t0.message);
            case 14:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[0, 11]]);
      }));
      function decryptData(_x12, _x13) {
        return _decryptData.apply(this, arguments);
      }
      return decryptData;
    }()
  }]);
}();
var base64 = new Base64();
var messagingService = new MessagingService();
var encryption = new Encryption();
var contacts = [];
var user2_ID = getQueryParams("username");
console.log(user2_ID);
var GlobalDIV = /*#__PURE__*/function () {
  function GlobalDIV() {
    _classCallCheck(this, GlobalDIV);
    this.send_button = document.getElementById("send");
    this.clearButton = document.getElementById("clear");
  }
  return _createClass(GlobalDIV, [{
    key: "eventListeners",
    value: function eventListeners() {
      this.clearButton.addEventListener("click", /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(e) {
          return _regeneratorRuntime().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return messagingService.Preferences.clear();
              case 2:
                location.reload();
              case 3:
              case "end":
                return _context7.stop();
            }
          }, _callee7);
        }));
        return function (_x14) {
          return _ref.apply(this, arguments);
        };
      }());
      document.getElementById("messageForm").addEventListener("submit", /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(e) {
          var message;
          return _regeneratorRuntime().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                e.preventDefault();
                message = document.getElementById("messageInput").value;
                if (user2_ID === null) {
                  console.log("true");
                  user2_ID = prompt("Enter the user ID you want to send the message to");
                }
                document.getElementById("messageInput").value = "";
                _context8.next = 6;
                return messagingService.createMessage(message, user2_ID, user.publickey);
              case 6:
              case "end":
                return _context8.stop();
            }
          }, _callee8);
        }));
        return function (_x15) {
          return _ref2.apply(this, arguments);
        };
      }());
      this.send_button.addEventListener("click", /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(e) {
          var message;
          return _regeneratorRuntime().wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                e.preventDefault();
                message = document.getElementById("messageInput").value;
                if (user2_ID === null) {
                  user2_ID = prompt("Enter the user ID you want to send the message to");
                }
                document.getElementById("messageInput").value = "";
                if (!(user2_ID === null || user2_ID === undefined || user2_ID === "" || user2_ID === "null")) {
                  _context9.next = 8;
                  break;
                }
                console.log("Not submited");
                _context9.next = 10;
                break;
              case 8:
                _context9.next = 10;
                return messagingService.createMessage(message, user2_ID, user.publickey);
              case 10:
              case "end":
                return _context9.stop();
            }
          }, _callee9);
        }));
        return function (_x16) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }]);
}();
function parseMessageUserID(data) {
  var temp = [];
  for (var i = 0; i < data.length; i++) {
    var newData = data[i];
    if (newData.User_id === null || newData.User_id === undefined || newData.User_id === "" || newData.User_id === "null") {} else {
      temp.push(newData.User_id);
    }
  }
  return temp;
}
function fetchMessage(_x17, _x18) {
  return _fetchMessage.apply(this, arguments);
}
function _fetchMessage() {
  _fetchMessage = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(Table, column) {
    var _yield$supabase2$from2, data, error;
    return _regeneratorRuntime().wrap(function _callee12$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return supabase2.from(Table) // Replace with your table name
          .select(column);
        case 2:
          _yield$supabase2$from2 = _context13.sent;
          data = _yield$supabase2$from2.data;
          error = _yield$supabase2$from2.error;
          if (!error) {
            _context13.next = 8;
            break;
          }
          console.error('Error fetching messages:', error);
          return _context13.abrupt("return");
        case 8:
          return _context13.abrupt("return", data);
        case 9:
        case "end":
          return _context13.stop();
      }
    }, _callee12);
  }));
  return _fetchMessage.apply(this, arguments);
}
function createUser(_x19, _x20, _x21, _x22) {
  return _createUser.apply(this, arguments);
}
function _createUser() {
  _createUser = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(UserId, publicKey, email, supabase) {
    var _yield$supabase$from$, error2;
    return _regeneratorRuntime().wrap(function _callee13$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return supabase.from("Users").insert({
            Public_Key: base64.toBase64(publicKey),
            User_id: UserId,
            email: "user"
          });
        case 2:
          _yield$supabase$from$ = _context14.sent;
          error2 = _yield$supabase$from$.error2;
        case 4:
        case "end":
          return _context14.stop();
      }
    }, _callee13);
  }));
  return _createUser.apply(this, arguments);
}
var globals = new GlobalDIV();
globals.eventListeners();
var UserInfo = /*#__PURE__*/function () {
  function UserInfo(keys) {
    _classCallCheck(this, UserInfo);
    _defineProperty(this, "init", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return encryption.generateAndExportKeyPair();
          case 2:
            this.keys = _context10.sent;
            this.publickey = this.keys.publicKey;
            this.privatekey = this.keys.privateKey;
            _context10.next = 7;
            return createUser(this.userid, this.publickey, "User", supabase2);
          case 7:
          case "end":
            return _context10.stop();
        }
      }, _callee10, this);
    })));
    this.keys = keys;
    this.userid = encryption.generateRandomString(10);
    this.publickey = null;
    this.privatekey = null;
    this.username = null;
    this.current_messages = [];
  }
  return _createClass(UserInfo, [{
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
        var _this = this;
        var userid, messages, sender, _loop, i;
        return _regeneratorRuntime().wrap(function _callee11$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return fetchMessage("Messages", "SendingTo");
            case 2:
              userid = _context12.sent;
              _context12.next = 5;
              return fetchMessage("Messages", "encrypted_message");
            case 5:
              messages = _context12.sent;
              _context12.next = 8;
              return fetchMessage("Messages", "sender_id");
            case 8:
              sender = _context12.sent;
              console.log("Ran1");
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                var decryptedMessage, messageExists, message;
                return _regeneratorRuntime().wrap(function _loop$(_context11) {
                  while (1) switch (_context11.prev = _context11.next) {
                    case 0:
                      if (!(userid[i].SendingTo === user.userid)) {
                        _context11.next = 16;
                        break;
                      }
                      _context11.next = 3;
                      return encryption.decryptData(base64.toBase64(user.privatekey), base64.toArrayBuffer(messages[i].encrypted_message));
                    case 3:
                      decryptedMessage = _context11.sent;
                      // Check if the decrypted message already exists
                      messageExists = _this.current_messages.some(function (msg) {
                        return msg.message === decryptedMessage;
                      });
                      if (!messageExists) {
                        _context11.next = 8;
                        break;
                      }
                      console.log("Message already exists");
                      // You can choose to update any necessary state here instead of returning
                      return _context11.abrupt("return", 1);
                    case 8:
                      // If the message does not exist, proceed to create it
                      messagingService.createMessageDiv(decryptedMessage, sender[i].sender_id);
                      message = {
                        sender: sender[i],
                        message: decryptedMessage,
                        timestamp: Date.now()
                      };
                      _this.current_messages.push(message);
                      _this.publickey = base64.toBase64(_this.publickey);
                      _this.privatekey = base64.toBase64(_this.privatekey);
                      if (_this.publickey && _this.privatekey) {
                        messagingService.Preferences.set({
                          key: "user",
                          value: JSON.stringify(user)
                        });
                      }
                      _this.publickey = base64.toArrayBuffer(_this.publickey);
                      _this.privatekey = base64.toArrayBuffer(_this.privatekey);
                    case 16:
                    case "end":
                      return _context11.stop();
                  }
                }, _loop);
              });
              i = 0;
            case 12:
              if (!(i < userid.length)) {
                _context12.next = 19;
                break;
              }
              return _context12.delegateYield(_loop(), "t0", 14);
            case 14:
              if (!_context12.t0) {
                _context12.next = 16;
                break;
              }
              return _context12.abrupt("continue", 16);
            case 16:
              i++;
              _context12.next = 12;
              break;
            case 19:
              console.log("Checking");
              setTimeout(function () {
                return _this.update();
              }, 2000);
            case 21:
            case "end":
              return _context12.stop();
          }
        }, _callee11);
      }));
      function update() {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }]);
}();
var user = null;
if ((await messagingService.Preferences.get({
  key: "user"
})).value !== undefined && (await messagingService.Preferences.get({
  key: "user"
})).value !== null) {
  var temp = JSON.parse((await messagingService.Preferences.get({
    key: "user"
  })).value);
  user = new UserInfo();
  user.userid = temp.userid;
  user.publickey = base64.toArrayBuffer(temp.publickey);
  user.privatekey = base64.toArrayBuffer(temp.privatekey);
  user.current_messages = temp.current_messages;
  console.log("New user is ", user);
} else {
  user = new UserInfo();
  await user.init();
  var tempPublic = base64.toBase64(user.publickey);
  var tempPrivate = base64.toBase64(user.privatekey);
  var user2 = user;
  user2.publickey = tempPublic;
  user2.privatekey = tempPrivate;
  await messagingService.Preferences.set({
    key: "user",
    value: JSON.stringify(user2)
  });
  user2.publickey = base64.toArrayBuffer(user2.publickey);
  user2.privatekey = base64.toArrayBuffer(user2.privatekey);
}
function loop() {
  if (document.activeElement === document.getElementById("messageInput")) {
    document.getElementById("bar").style.display = "none";
  } else {
    document.getElementById("bar").style.display = "flex";
  }
  requestAnimationFrame(loop);
}
document.getElementById("usernameIS").innerHTML = "Friend Code - " + user.userid;
function init() {
  return _init.apply(this, arguments);
}
function _init() {
  _init = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
    var _temp, i;
    return _regeneratorRuntime().wrap(function _callee14$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return user.update();
        case 2:
          loop();
          _context15.next = 5;
          return messagingService.Preferences.get({
            key: "user"
          });
        case 5:
          _context15.t1 = _context15.sent.value;
          _context15.t2 = undefined;
          _context15.t0 = _context15.t1 !== _context15.t2;
          if (!_context15.t0) {
            _context15.next = 13;
            break;
          }
          _context15.next = 11;
          return messagingService.Preferences.get({
            key: "user"
          });
        case 11:
          _context15.t3 = _context15.sent.value;
          _context15.t0 = _context15.t3 !== null;
        case 13:
          if (!_context15.t0) {
            _context15.next = 20;
            break;
          }
          _context15.t4 = JSON;
          _context15.next = 17;
          return messagingService.Preferences.get({
            key: "user"
          });
        case 17:
          _context15.t5 = _context15.sent.value;
          _temp = _context15.t4.parse.call(_context15.t4, _context15.t5);
          for (i = 0; i < _temp.current_messages.length; i++) {
            // messagingService.createMessageDiv(temp.current_messages[i].message,temp.current_messages[i].sender) 
            messagingService.createMessageDiv(_temp.current_messages[i].message, _temp.current_messages[i].sender.sender_id);
          }
        case 20:
        case "end":
          return _context15.stop();
      }
    }, _callee14);
  }));
  return _init.apply(this, arguments);
}
init();
},{"@capacitor/local-notifications":"../node_modules/@capacitor/local-notifications/dist/esm/index.js"}],"../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59550" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}],"../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js":[function(require,module,exports) {
module.exports = function loadJSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = bundle;
    script.onerror = function (e) {
      script.onerror = script.onload = null;
      reject(e);
    };
    script.onload = function () {
      script.onerror = script.onload = null;
      resolve();
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};
},{}],0:[function(require,module,exports) {
var b=require("../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("js",require("../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js"));
},{}]},{},["../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0,"main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map