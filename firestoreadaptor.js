// node_modules/@firebase/util/dist/index.esm2017.js
var getGlobal = function() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("Unable to locate global object.");
};
var isIndexedDBAvailable = function() {
  try {
    return typeof indexedDB === "object";
  } catch (e) {
    return false;
  }
};
var validateIndexedDBOpenable = function() {
  return new Promise((resolve, reject) => {
    try {
      let preExist = true;
      const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
      const request = self.indexedDB.open(DB_CHECK_NAME);
      request.onsuccess = () => {
        request.result.close();
        if (!preExist) {
          self.indexedDB.deleteDatabase(DB_CHECK_NAME);
        }
        resolve(true);
      };
      request.onupgradeneeded = () => {
        preExist = false;
      };
      request.onerror = () => {
        var _a;
        reject(((_a = request.error) === null || _a === undefined ? undefined : _a.message) || "");
      };
    } catch (error) {
      reject(error);
    }
  });
};
var replaceTemplate = function(template, data) {
  return template.replace(PATTERN, (_, key) => {
    const value = data[key];
    return value != null ? String(value) : `<${key}?>`;
  });
};
var deepEqual = function(a, b) {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  for (const k of aKeys) {
    if (!bKeys.includes(k)) {
      return false;
    }
    const aProp = a[k];
    const bProp = b[k];
    if (isObject(aProp) && isObject(bProp)) {
      if (!deepEqual(aProp, bProp)) {
        return false;
      }
    } else if (aProp !== bProp) {
      return false;
    }
  }
  for (const k of bKeys) {
    if (!aKeys.includes(k)) {
      return false;
    }
  }
  return true;
};
var isObject = function(thing) {
  return thing !== null && typeof thing === "object";
};
var getModularInstance = function(service) {
  if (service && service._delegate) {
    return service._delegate;
  } else {
    return service;
  }
};
var stringToByteArray$1 = function(str) {
  const out = [];
  let p = 0;
  for (let i = 0;i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
};
var byteArrayToString = function(bytes) {
  const out = [];
  let pos = 0, c = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      const c4 = bytes[pos++];
      const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
      out[c++] = String.fromCharCode(55296 + (u >> 10));
      out[c++] = String.fromCharCode(56320 + (u & 1023));
    } else {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join("");
};
var base64 = {
  byteToCharMap_: null,
  charToByteMap_: null,
  byteToCharMapWebSafe_: null,
  charToByteMapWebSafe_: null,
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  HAS_NATIVE_SUPPORT: typeof atob === "function",
  encodeByteArray(input, webSafe) {
    if (!Array.isArray(input)) {
      throw Error("encodeByteArray takes an array as a parameter");
    }
    this.init_();
    const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
    const output = [];
    for (let i = 0;i < input.length; i += 3) {
      const byte1 = input[i];
      const haveByte2 = i + 1 < input.length;
      const byte2 = haveByte2 ? input[i + 1] : 0;
      const haveByte3 = i + 2 < input.length;
      const byte3 = haveByte3 ? input[i + 2] : 0;
      const outByte1 = byte1 >> 2;
      const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
      let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
      let outByte4 = byte3 & 63;
      if (!haveByte3) {
        outByte4 = 64;
        if (!haveByte2) {
          outByte3 = 64;
        }
      }
      output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
    }
    return output.join("");
  },
  encodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return btoa(input);
    }
    return this.encodeByteArray(stringToByteArray$1(input), webSafe);
  },
  decodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return atob(input);
    }
    return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
  },
  decodeStringToByteArray(input, webSafe) {
    this.init_();
    const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
    const output = [];
    for (let i = 0;i < input.length; ) {
      const byte1 = charToByteMap[input.charAt(i++)];
      const haveByte2 = i < input.length;
      const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
      ++i;
      const haveByte3 = i < input.length;
      const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      const haveByte4 = i < input.length;
      const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
        throw new DecodeBase64StringError;
      }
      const outByte1 = byte1 << 2 | byte2 >> 4;
      output.push(outByte1);
      if (byte3 !== 64) {
        const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
        output.push(outByte2);
        if (byte4 !== 64) {
          const outByte3 = byte3 << 6 & 192 | byte4;
          output.push(outByte3);
        }
      }
    }
    return output;
  },
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {};
      this.charToByteMap_ = {};
      this.byteToCharMapWebSafe_ = {};
      this.charToByteMapWebSafe_ = {};
      for (let i = 0;i < this.ENCODED_VALS.length; i++) {
        this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
        this.charToByteMap_[this.byteToCharMap_[i]] = i;
        this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
        this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
        if (i >= this.ENCODED_VALS_BASE.length) {
          this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
          this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
        }
      }
    }
  }
};

class DecodeBase64StringError extends Error {
  constructor() {
    super(...arguments);
    this.name = "DecodeBase64StringError";
  }
}
var base64Encode = function(str) {
  const utf8Bytes = stringToByteArray$1(str);
  return base64.encodeByteArray(utf8Bytes, true);
};
var base64urlEncodeWithoutPadding = function(str) {
  return base64Encode(str).replace(/\./g, "");
};
var base64Decode = function(str) {
  try {
    return base64.decodeString(str, true);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
var getDefaultsFromEnvVariable = () => {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return;
  }
  const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
  if (defaultsJsonString) {
    return JSON.parse(defaultsJsonString);
  }
};
var getDefaultsFromCookie = () => {
  if (typeof document === "undefined") {
    return;
  }
  let match;
  try {
    match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch (e) {
    return;
  }
  const decoded = match && base64Decode(match[1]);
  return decoded && JSON.parse(decoded);
};
var getDefaults = () => {
  try {
    return getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
  } catch (e) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
    return;
  }
};
var getDefaultAppConfig = () => {
  var _a;
  return (_a = getDefaults()) === null || _a === undefined ? undefined : _a.config;
};
class Deferred {
  constructor() {
    this.reject = () => {
    };
    this.resolve = () => {
    };
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  wrapCallback(callback) {
    return (error, value) => {
      if (error) {
        this.reject(error);
      } else {
        this.resolve(value);
      }
      if (typeof callback === "function") {
        this.promise.catch(() => {
        });
        if (callback.length === 1) {
          callback(error);
        } else {
          callback(error, value);
        }
      }
    };
  }
}
var ERROR_NAME = "FirebaseError";

class FirebaseError extends Error {
  constructor(code, message, customData) {
    super(message);
    this.code = code;
    this.customData = customData;
    this.name = ERROR_NAME;
    Object.setPrototypeOf(this, FirebaseError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorFactory.prototype.create);
    }
  }
}

class ErrorFactory {
  constructor(service, serviceName, errors) {
    this.service = service;
    this.serviceName = serviceName;
    this.errors = errors;
  }
  create(code, ...data) {
    const customData = data[0] || {};
    const fullCode = `${this.service}/${code}`;
    const template = this.errors[code];
    const message = template ? replaceTemplate(template, customData) : "Error";
    const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
    const error = new FirebaseError(fullCode, fullMessage, customData);
    return error;
  }
}
var PATTERN = /\{\$([^}]+)}/g;
var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1000;

// node_modules/@firebase/component/dist/esm/index.esm2017.js
var normalizeIdentifierForFactory = function(identifier) {
  return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
};
var isComponentEager = function(component) {
  return component.instantiationMode === "EAGER";
};

class Component {
  constructor(name, instanceFactory, type) {
    this.name = name;
    this.instanceFactory = instanceFactory;
    this.type = type;
    this.multipleInstances = false;
    this.serviceProps = {};
    this.instantiationMode = "LAZY";
    this.onInstanceCreated = null;
  }
  setInstantiationMode(mode) {
    this.instantiationMode = mode;
    return this;
  }
  setMultipleInstances(multipleInstances) {
    this.multipleInstances = multipleInstances;
    return this;
  }
  setServiceProps(props) {
    this.serviceProps = props;
    return this;
  }
  setInstanceCreatedCallback(callback) {
    this.onInstanceCreated = callback;
    return this;
  }
}
var DEFAULT_ENTRY_NAME = "[DEFAULT]";

class Provider {
  constructor(name, container) {
    this.name = name;
    this.container = container;
    this.component = null;
    this.instances = new Map;
    this.instancesDeferred = new Map;
    this.instancesOptions = new Map;
    this.onInitCallbacks = new Map;
  }
  get(identifier) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      const deferred = new Deferred;
      this.instancesDeferred.set(normalizedIdentifier, deferred);
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          if (instance) {
            deferred.resolve(instance);
          }
        } catch (e) {
        }
      }
    }
    return this.instancesDeferred.get(normalizedIdentifier).promise;
  }
  getImmediate(options) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === undefined ? undefined : options.identifier);
    const optional = (_a = options === null || options === undefined ? undefined : options.optional) !== null && _a !== undefined ? _a : false;
    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
      try {
        return this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
      } catch (e) {
        if (optional) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      if (optional) {
        return null;
      } else {
        throw Error(`Service ${this.name} is not available`);
      }
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(component) {
    if (component.name !== this.name) {
      throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
    }
    if (this.component) {
      throw Error(`Component for ${this.name} has already been provided`);
    }
    this.component = component;
    if (!this.shouldAutoInitialize()) {
      return;
    }
    if (isComponentEager(component)) {
      try {
        this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
      } catch (e) {
      }
    }
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      try {
        const instance = this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
        instanceDeferred.resolve(instance);
      } catch (e) {
      }
    }
  }
  clearInstance(identifier = DEFAULT_ENTRY_NAME) {
    this.instancesDeferred.delete(identifier);
    this.instancesOptions.delete(identifier);
    this.instances.delete(identifier);
  }
  async delete() {
    const services = Array.from(this.instances.values());
    await Promise.all([
      ...services.filter((service) => ("INTERNAL" in service)).map((service) => service.INTERNAL.delete()),
      ...services.filter((service) => ("_delete" in service)).map((service) => service._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(identifier = DEFAULT_ENTRY_NAME) {
    return this.instances.has(identifier);
  }
  getOptions(identifier = DEFAULT_ENTRY_NAME) {
    return this.instancesOptions.get(identifier) || {};
  }
  initialize(opts = {}) {
    const { options = {} } = opts;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
    if (this.isInitialized(normalizedIdentifier)) {
      throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
    }
    if (!this.isComponentSet()) {
      throw Error(`Component ${this.name} has not been registered yet`);
    }
    const instance = this.getOrInitializeService({
      instanceIdentifier: normalizedIdentifier,
      options
    });
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      if (normalizedIdentifier === normalizedDeferredIdentifier) {
        instanceDeferred.resolve(instance);
      }
    }
    return instance;
  }
  onInit(callback, identifier) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== undefined ? _a : new Set;
    existingCallbacks.add(callback);
    this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
    const existingInstance = this.instances.get(normalizedIdentifier);
    if (existingInstance) {
      callback(existingInstance, normalizedIdentifier);
    }
    return () => {
      existingCallbacks.delete(callback);
    };
  }
  invokeOnInitCallbacks(instance, identifier) {
    const callbacks = this.onInitCallbacks.get(identifier);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      try {
        callback(instance, identifier);
      } catch (_a) {
      }
    }
  }
  getOrInitializeService({ instanceIdentifier, options = {} }) {
    let instance = this.instances.get(instanceIdentifier);
    if (!instance && this.component) {
      instance = this.component.instanceFactory(this.container, {
        instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
        options
      });
      this.instances.set(instanceIdentifier, instance);
      this.instancesOptions.set(instanceIdentifier, options);
      this.invokeOnInitCallbacks(instance, instanceIdentifier);
      if (this.component.onInstanceCreated) {
        try {
          this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
        } catch (_a) {
        }
      }
    }
    return instance || null;
  }
  normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
    if (this.component) {
      return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
    } else {
      return identifier;
    }
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}

class ComponentContainer {
  constructor(name) {
    this.name = name;
    this.providers = new Map;
  }
  addComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
    }
    provider.setComponent(component);
  }
  addOrOverwriteComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      this.providers.delete(component.name);
    }
    this.addComponent(component);
  }
  getProvider(name) {
    if (this.providers.has(name)) {
      return this.providers.get(name);
    }
    const provider = new Provider(name, this);
    this.providers.set(name, provider);
    return provider;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}

// node_modules/@firebase/logger/dist/esm/index.esm2017.js
var instances = [];
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
  LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
  LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
var levelStringToEnum = {
  debug: LogLevel.DEBUG,
  verbose: LogLevel.VERBOSE,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  silent: LogLevel.SILENT
};
var defaultLogLevel = LogLevel.INFO;
var ConsoleMethod = {
  [LogLevel.DEBUG]: "log",
  [LogLevel.VERBOSE]: "log",
  [LogLevel.INFO]: "info",
  [LogLevel.WARN]: "warn",
  [LogLevel.ERROR]: "error"
};
var defaultLogHandler = (instance, logType, ...args) => {
  if (logType < instance.logLevel) {
    return;
  }
  const now = new Date().toISOString();
  const method = ConsoleMethod[logType];
  if (method) {
    console[method](`[${now}]  ${instance.name}:`, ...args);
  } else {
    throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
  }
};

class Logger {
  constructor(name) {
    this.name = name;
    this._logLevel = defaultLogLevel;
    this._logHandler = defaultLogHandler;
    this._userLogHandler = null;
    instances.push(this);
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(val) {
    if (!(val in LogLevel)) {
      throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
    }
    this._logLevel = val;
  }
  setLogLevel(val) {
    this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(val) {
    if (typeof val !== "function") {
      throw new TypeError("Value assigned to `logHandler` must be a function");
    }
    this._logHandler = val;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(val) {
    this._userLogHandler = val;
  }
  debug(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
    this._logHandler(this, LogLevel.DEBUG, ...args);
  }
  log(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
    this._logHandler(this, LogLevel.VERBOSE, ...args);
  }
  info(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
    this._logHandler(this, LogLevel.INFO, ...args);
  }
  warn(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
    this._logHandler(this, LogLevel.WARN, ...args);
  }
  error(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
    this._logHandler(this, LogLevel.ERROR, ...args);
  }
}
// node_modules/idb/build/wrap-idb-value.js
var getIdbProxyableTypes = function() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
};
var getCursorAdvanceMethods = function() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
};
var promisifyRequest = function(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
};
var cacheDonePromiseForTransaction = function(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
};
var replaceTraps = function(callback) {
  idbProxyTraps = callback(idbProxyTraps);
};
var wrapFunction = function(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
};
var transformCachableValue = function(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
};
var wrap = function(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
};
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
var cursorRequestMap = new WeakMap;
var transactionDoneMap = new WeakMap;
var transactionStoreNamesMap = new WeakMap;
var transformCache = new WeakMap;
var reverseTransformCache = new WeakMap;
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
var unwrap = (value) => reverseTransformCache.get(value);

// node_modules/idb/build/index.js
var openDB = function(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
};
var getMethod = function(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
};
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = new Map;
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));

// node_modules/@firebase/app/dist/esm/index.esm2017.js
var isVersionServiceProvider = function(provider) {
  const component2 = provider.getComponent();
  return (component2 === null || component2 === undefined ? undefined : component2.type) === "VERSION";
};
var _addComponent = function(app, component2) {
  try {
    app.container.addComponent(component2);
  } catch (e) {
    logger2.debug(`Component ${component2.name} failed to register with FirebaseApp ${app.name}`, e);
  }
};
var _registerComponent = function(component2) {
  const componentName = component2.name;
  if (_components.has(componentName)) {
    logger2.debug(`There were multiple attempts to register component ${componentName}.`);
    return false;
  }
  _components.set(componentName, component2);
  for (const app of _apps.values()) {
    _addComponent(app, component2);
  }
  return true;
};
var _getProvider = function(app, name) {
  const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
  if (heartbeatController) {
    heartbeatController.triggerHeartbeat();
  }
  return app.container.getProvider(name);
};
var initializeApp = function(_options, rawConfig = {}) {
  let options = _options;
  if (typeof rawConfig !== "object") {
    const name2 = rawConfig;
    rawConfig = { name: name2 };
  }
  const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
  const name = config.name;
  if (typeof name !== "string" || !name) {
    throw ERROR_FACTORY.create("bad-app-name", {
      appName: String(name)
    });
  }
  options || (options = getDefaultAppConfig());
  if (!options) {
    throw ERROR_FACTORY.create("no-options");
  }
  const existingApp = _apps.get(name);
  if (existingApp) {
    if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
      return existingApp;
    } else {
      throw ERROR_FACTORY.create("duplicate-app", { appName: name });
    }
  }
  const container = new ComponentContainer(name);
  for (const component2 of _components.values()) {
    container.addComponent(component2);
  }
  const newApp = new FirebaseAppImpl(options, config, container);
  _apps.set(name, newApp);
  return newApp;
};
var registerVersion = function(libraryKeyOrName, version, variant) {
  var _a;
  let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== undefined ? _a : libraryKeyOrName;
  if (variant) {
    library += `-${variant}`;
  }
  const libraryMismatch = library.match(/\s|\//);
  const versionMismatch = version.match(/\s|\//);
  if (libraryMismatch || versionMismatch) {
    const warning = [
      `Unable to register library "${library}" with version "${version}":`
    ];
    if (libraryMismatch) {
      warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
    }
    if (libraryMismatch && versionMismatch) {
      warning.push("and");
    }
    if (versionMismatch) {
      warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
    }
    logger2.warn(warning.join(" "));
    return;
  }
  _registerComponent(new Component(`${library}-version`, () => ({ library, version }), "VERSION"));
};
var getDbPromise = function() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade: (db, oldVersion) => {
        switch (oldVersion) {
          case 0:
            db.createObjectStore(STORE_NAME);
        }
      }
    }).catch((e) => {
      throw ERROR_FACTORY.create("idb-open", {
        originalErrorMessage: e.message
      });
    });
  }
  return dbPromise;
};
async function readHeartbeatsFromIndexedDB(app) {
  try {
    const db = await getDbPromise();
    const result = await db.transaction(STORE_NAME).objectStore(STORE_NAME).get(computeKey(app));
    return result;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-get", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
  try {
    const db = await getDbPromise();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(STORE_NAME);
    await objectStore.put(heartbeatObject, computeKey(app));
    await tx.done;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-set", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
var computeKey = function(app) {
  return `${app.name}!${app.options.appId}`;
};
var getUTCDateString = function() {
  const today = new Date;
  return today.toISOString().substring(0, 10);
};
var extractHeartbeatsForHeader = function(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
  const heartbeatsToSend = [];
  let unsentEntries = heartbeatsCache.slice();
  for (const singleDateHeartbeat of heartbeatsCache) {
    const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
    if (!heartbeatEntry) {
      heartbeatsToSend.push({
        agent: singleDateHeartbeat.agent,
        dates: [singleDateHeartbeat.date]
      });
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatsToSend.pop();
        break;
      }
    } else {
      heartbeatEntry.dates.push(singleDateHeartbeat.date);
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatEntry.dates.pop();
        break;
      }
    }
    unsentEntries = unsentEntries.slice(1);
  }
  return {
    heartbeatsToSend,
    unsentEntries
  };
};
var countBytes = function(heartbeatsCache) {
  return base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
};
var registerCoreComponents = function(variant) {
  _registerComponent(new Component("platform-logger", (container) => new PlatformLoggerServiceImpl(container), "PRIVATE"));
  _registerComponent(new Component("heartbeat", (container) => new HeartbeatServiceImpl(container), "PRIVATE"));
  registerVersion(name$o, version$1, variant);
  registerVersion(name$o, version$1, "esm2017");
  registerVersion("fire-js", "");
};

class PlatformLoggerServiceImpl {
  constructor(container) {
    this.container = container;
  }
  getPlatformInfoString() {
    const providers = this.container.getProviders();
    return providers.map((provider) => {
      if (isVersionServiceProvider(provider)) {
        const service = provider.getImmediate();
        return `${service.library}/${service.version}`;
      } else {
        return null;
      }
    }).filter((logString) => logString).join(" ");
  }
}
var name$o = "@firebase/app";
var version$1 = "0.9.13";
var logger2 = new Logger("@firebase/app");
var name$n = "@firebase/app-compat";
var name$m = "@firebase/analytics-compat";
var name$l = "@firebase/analytics";
var name$k = "@firebase/app-check-compat";
var name$j = "@firebase/app-check";
var name$i = "@firebase/auth";
var name$h = "@firebase/auth-compat";
var name$g = "@firebase/database";
var name$f = "@firebase/database-compat";
var name$e = "@firebase/functions";
var name$d = "@firebase/functions-compat";
var name$c = "@firebase/installations";
var name$b = "@firebase/installations-compat";
var name$a = "@firebase/messaging";
var name$9 = "@firebase/messaging-compat";
var name$8 = "@firebase/performance";
var name$7 = "@firebase/performance-compat";
var name$6 = "@firebase/remote-config";
var name$5 = "@firebase/remote-config-compat";
var name$4 = "@firebase/storage";
var name$3 = "@firebase/storage-compat";
var name$2 = "@firebase/firestore";
var name$1 = "@firebase/firestore-compat";
var name = "firebase";
var version = "9.23.0";
var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
var PLATFORM_LOG_STRING = {
  [name$o]: "fire-core",
  [name$n]: "fire-core-compat",
  [name$l]: "fire-analytics",
  [name$m]: "fire-analytics-compat",
  [name$j]: "fire-app-check",
  [name$k]: "fire-app-check-compat",
  [name$i]: "fire-auth",
  [name$h]: "fire-auth-compat",
  [name$g]: "fire-rtdb",
  [name$f]: "fire-rtdb-compat",
  [name$e]: "fire-fn",
  [name$d]: "fire-fn-compat",
  [name$c]: "fire-iid",
  [name$b]: "fire-iid-compat",
  [name$a]: "fire-fcm",
  [name$9]: "fire-fcm-compat",
  [name$8]: "fire-perf",
  [name$7]: "fire-perf-compat",
  [name$6]: "fire-rc",
  [name$5]: "fire-rc-compat",
  [name$4]: "fire-gcs",
  [name$3]: "fire-gcs-compat",
  [name$2]: "fire-fst",
  [name$1]: "fire-fst-compat",
  "fire-js": "fire-js",
  [name]: "fire-js-all"
};
var _apps = new Map;
var _components = new Map;
var ERRORS = {
  ["no-app"]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
  ["bad-app-name"]: "Illegal App name: '{$appName}",
  ["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
  ["app-deleted"]: "Firebase App named '{$appName}' already deleted",
  ["no-options"]: "Need to provide options, when not being deployed to hosting via source.",
  ["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  ["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
  ["idb-open"]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-get"]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-set"]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-delete"]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."
};
var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);

class FirebaseAppImpl {
  constructor(options, config, container) {
    this._isDeleted = false;
    this._options = Object.assign({}, options);
    this._config = Object.assign({}, config);
    this._name = config.name;
    this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
    this._container = container;
    this.container.addComponent(new Component("app", () => this, "PUBLIC"));
  }
  get automaticDataCollectionEnabled() {
    this.checkDestroyed();
    return this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(val) {
    this.checkDestroyed();
    this._automaticDataCollectionEnabled = val;
  }
  get name() {
    this.checkDestroyed();
    return this._name;
  }
  get options() {
    this.checkDestroyed();
    return this._options;
  }
  get config() {
    this.checkDestroyed();
    return this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(val) {
    this._isDeleted = val;
  }
  checkDestroyed() {
    if (this.isDeleted) {
      throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
    }
  }
}
var SDK_VERSION = version;
var DB_NAME = "firebase-heartbeat-database";
var DB_VERSION = 1;
var STORE_NAME = "firebase-heartbeat-store";
var dbPromise = null;
var MAX_HEADER_BYTES = 1024;
var STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;

class HeartbeatServiceImpl {
  constructor(container) {
    this.container = container;
    this._heartbeatsCache = null;
    const app = this.container.getProvider("app").getImmediate();
    this._storage = new HeartbeatStorageImpl(app);
    this._heartbeatsCachePromise = this._storage.read().then((result) => {
      this._heartbeatsCache = result;
      return result;
    });
  }
  async triggerHeartbeat() {
    const platformLogger = this.container.getProvider("platform-logger").getImmediate();
    const agent = platformLogger.getPlatformInfoString();
    const date = getUTCDateString();
    if (this._heartbeatsCache === null) {
      this._heartbeatsCache = await this._heartbeatsCachePromise;
    }
    if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
      return;
    } else {
      this._heartbeatsCache.heartbeats.push({ date, agent });
    }
    this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
      const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
      const now = Date.now();
      return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
    });
    return this._storage.overwrite(this._heartbeatsCache);
  }
  async getHeartbeatsHeader() {
    if (this._heartbeatsCache === null) {
      await this._heartbeatsCachePromise;
    }
    if (this._heartbeatsCache === null || this._heartbeatsCache.heartbeats.length === 0) {
      return "";
    }
    const date = getUTCDateString();
    const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
    const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
    this._heartbeatsCache.lastSentHeartbeatDate = date;
    if (unsentEntries.length > 0) {
      this._heartbeatsCache.heartbeats = unsentEntries;
      await this._storage.overwrite(this._heartbeatsCache);
    } else {
      this._heartbeatsCache.heartbeats = [];
      this._storage.overwrite(this._heartbeatsCache);
    }
    return headerString;
  }
}

class HeartbeatStorageImpl {
  constructor(app) {
    this.app = app;
    this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    if (!isIndexedDBAvailable()) {
      return false;
    } else {
      return validateIndexedDBOpenable().then(() => true).catch(() => false);
    }
  }
  async read() {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return { heartbeats: [] };
    } else {
      const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
      return idbHeartbeatObject || { heartbeats: [] };
    }
  }
  async overwrite(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: heartbeatsObject.heartbeats
      });
    }
  }
  async add(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: [
          ...existingHeartbeatsObject.heartbeats,
          ...heartbeatsObject.heartbeats
        ]
      });
    }
  }
}
registerCoreComponents("");

// node_modules/firebase/app/dist/esm/index.esm.js
var name2 = "firebase";
var version2 = "9.23.0";
registerVersion(name2, version2, "app");

// node_modules/@firebase/webchannel-wrapper/dist/esm/index.esm2017.js
var aa = function(a) {
  var b = typeof a;
  b = b != "object" ? b : a ? Array.isArray(a) ? "array" : b : "null";
  return b == "array" || b == "object" && typeof a.length == "number";
};
var p = function(a) {
  var b = typeof a;
  return b == "object" && a != null || b == "function";
};
var ba = function(a) {
  return Object.prototype.hasOwnProperty.call(a, ca) && a[ca] || (a[ca] = ++da);
};
var ea = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
var fa = function(a, b, c) {
  if (!a)
    throw Error();
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var e = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(e, d);
      return a.apply(b, e);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
var q = function(a, b, c) {
  Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? q = ea : q = fa;
  return q.apply(null, arguments);
};
var ha = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var d = c.slice();
    d.push.apply(d, arguments);
    return a.apply(this, d);
  };
};
var r = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.$ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.ac = function(d, e, f) {
    for (var h = Array(arguments.length - 2), n = 2;n < arguments.length; n++)
      h[n - 2] = arguments[n];
    return b.prototype[e].apply(d, h);
  };
};
var v = function() {
  this.s = this.s;
  this.o = this.o;
};
var ma = function(a) {
  const b = a.length;
  if (0 < b) {
    const c = Array(b);
    for (let d = 0;d < b; d++)
      c[d] = a[d];
    return c;
  }
  return [];
};
var na = function(a, b) {
  for (let c = 1;c < arguments.length; c++) {
    const d = arguments[c];
    if (aa(d)) {
      const e = a.length || 0, f = d.length || 0;
      a.length = e + f;
      for (let h = 0;h < f; h++)
        a[e + h] = d[h];
    } else
      a.push(d);
  }
};
var w = function(a, b) {
  this.type = a;
  this.g = this.target = b;
  this.defaultPrevented = false;
};
var x = function(a) {
  return /^[\s\xa0]*$/.test(a);
};
var pa = function() {
  var a = l.navigator;
  return a && (a = a.userAgent) ? a : "";
};
var y = function(a) {
  return pa().indexOf(a) != -1;
};
var qa = function(a) {
  qa[" "](a);
  return a;
};
var ra = function(a, b) {
  var c = sa;
  return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a);
};
var ya = function() {
  var a = l.document;
  return a ? a.documentMode : undefined;
};
var A = function(a, b) {
  w.call(this, a ? a.type : "");
  this.relatedTarget = this.g = this.target = null;
  this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
  this.key = "";
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
  this.state = null;
  this.pointerId = 0;
  this.pointerType = "";
  this.i = null;
  if (a) {
    var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
    this.target = a.target || a.srcElement;
    this.g = b;
    if (b = a.relatedTarget) {
      if (wa) {
        a: {
          try {
            qa(b.nodeName);
            var e = true;
            break a;
          } catch (f) {
          }
          e = false;
        }
        e || (b = null);
      }
    } else
      c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement);
    this.relatedTarget = b;
    d ? (this.clientX = d.clientX !== undefined ? d.clientX : d.pageX, this.clientY = d.clientY !== undefined ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== undefined ? a.clientX : a.pageX, this.clientY = a.clientY !== undefined ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
    this.button = a.button;
    this.key = a.key || "";
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.pointerId = a.pointerId || 0;
    this.pointerType = typeof a.pointerType === "string" ? a.pointerType : Ga[a.pointerType] || "";
    this.state = a.state;
    this.i = a;
    a.defaultPrevented && A.$.h.call(this);
  }
};
var Ja = function(a, b, c, d, e) {
  this.listener = a;
  this.proxy = null;
  this.src = b;
  this.type = c;
  this.capture = !!d;
  this.la = e;
  this.key = ++Ia;
  this.fa = this.ia = false;
};
var Ka = function(a) {
  a.fa = true;
  a.listener = null;
  a.proxy = null;
  a.src = null;
  a.la = null;
};
var Na = function(a, b, c) {
  for (const d in a)
    b.call(c, a[d], d, a);
};
var Oa = function(a, b) {
  for (const c in a)
    b.call(undefined, a[c], c, a);
};
var Pa = function(a) {
  const b = {};
  for (const c in a)
    b[c] = a[c];
  return b;
};
var Ra = function(a, b) {
  let c, d;
  for (let e = 1;e < arguments.length; e++) {
    d = arguments[e];
    for (c in d)
      a[c] = d[c];
    for (let f = 0;f < Qa.length; f++)
      c = Qa[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
  }
};
var Sa = function(a) {
  this.src = a;
  this.g = {};
  this.h = 0;
};
var Ua = function(a, b) {
  var c = b.type;
  if (c in a.g) {
    var d = a.g[c], e = ka(d, b), f;
    (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
    f && (Ka(b), a.g[c].length == 0 && (delete a.g[c], a.h--));
  }
};
var Ta = function(a, b, c, d) {
  for (var e = 0;e < a.length; ++e) {
    var f = a[e];
    if (!f.fa && f.listener == b && f.capture == !!c && f.la == d)
      return e;
  }
  return -1;
};
var Ya = function(a, b, c, d, e) {
  if (d && d.once)
    return Za(a, b, c, d, e);
  if (Array.isArray(b)) {
    for (var f = 0;f < b.length; f++)
      Ya(a, b[f], c, d, e);
    return null;
  }
  c = $a(c);
  return a && a[Ha] ? a.O(b, c, p(d) ? !!d.capture : !!d, e) : ab(a, b, c, false, d, e);
};
var ab = function(a, b, c, d, e, f) {
  if (!b)
    throw Error("Invalid event type");
  var h = p(e) ? !!e.capture : !!e, n = bb(a);
  n || (a[Va] = n = new Sa(a));
  c = n.add(b, c, d, h, f);
  if (c.proxy)
    return c;
  d = cb();
  c.proxy = d;
  d.src = a;
  d.listener = c;
  if (a.addEventListener)
    oa || (e = h), e === undefined && (e = false), a.addEventListener(b.toString(), d, e);
  else if (a.attachEvent)
    a.attachEvent(db(b.toString()), d);
  else if (a.addListener && a.removeListener)
    a.addListener(d);
  else
    throw Error("addEventListener and attachEvent are unavailable.");
  return c;
};
var cb = function() {
  function a(c) {
    return b.call(a.src, a.listener, c);
  }
  const b = eb;
  return a;
};
var Za = function(a, b, c, d, e) {
  if (Array.isArray(b)) {
    for (var f = 0;f < b.length; f++)
      Za(a, b[f], c, d, e);
    return null;
  }
  c = $a(c);
  return a && a[Ha] ? a.P(b, c, p(d) ? !!d.capture : !!d, e) : ab(a, b, c, true, d, e);
};
var fb = function(a, b, c, d, e) {
  if (Array.isArray(b))
    for (var f = 0;f < b.length; f++)
      fb(a, b[f], c, d, e);
  else
    (d = p(d) ? !!d.capture : !!d, c = $a(c), a && a[Ha]) ? (a = a.i, b = String(b).toString(), (b in a.g) && (f = a.g[b], c = Ta(f, c, d, e), -1 < c && (Ka(f[c]), Array.prototype.splice.call(f, c, 1), f.length == 0 && (delete a.g[b], a.h--)))) : a && (a = bb(a)) && (b = a.g[b.toString()], a = -1, b && (a = Ta(b, c, d, e)), (c = -1 < a ? b[a] : null) && gb(c));
};
var gb = function(a) {
  if (typeof a !== "number" && a && !a.fa) {
    var b = a.src;
    if (b && b[Ha])
      Ua(b.i, a);
    else {
      var { type: c, proxy: d } = a;
      b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(db(c), d) : b.addListener && b.removeListener && b.removeListener(d);
      (c = bb(b)) ? (Ua(c, a), c.h == 0 && (c.src = null, b[Va] = null)) : Ka(a);
    }
  }
};
var db = function(a) {
  return a in Wa ? Wa[a] : Wa[a] = "on" + a;
};
var eb = function(a, b) {
  if (a.fa)
    a = true;
  else {
    b = new A(b, this);
    var c = a.listener, d = a.la || a.src;
    a.ia && gb(a);
    a = c.call(d, b);
  }
  return a;
};
var bb = function(a) {
  a = a[Va];
  return a instanceof Sa ? a : null;
};
var $a = function(a) {
  if (typeof a === "function")
    return a;
  a[hb] || (a[hb] = function(b) {
    return a.handleEvent(b);
  });
  return a[hb];
};
var B = function() {
  v.call(this);
  this.i = new Sa(this);
  this.S = this;
  this.J = null;
};
var C = function(a, b) {
  var c, d = a.J;
  if (d)
    for (c = [];d; d = d.J)
      c.push(d);
  a = a.S;
  d = b.type || b;
  if (typeof b === "string")
    b = new w(b, a);
  else if (b instanceof w)
    b.target = b.target || a;
  else {
    var e = b;
    b = new w(d, a);
    Ra(b, e);
  }
  e = true;
  if (c)
    for (var f = c.length - 1;0 <= f; f--) {
      var h = b.g = c[f];
      e = ib(h, d, true, b) && e;
    }
  h = b.g = a;
  e = ib(h, d, true, b) && e;
  e = ib(h, d, false, b) && e;
  if (c)
    for (f = 0;f < c.length; f++)
      h = b.g = c[f], e = ib(h, d, false, b) && e;
};
var ib = function(a, b, c, d) {
  b = a.i.g[String(b)];
  if (!b)
    return true;
  b = b.concat();
  for (var e = true, f = 0;f < b.length; ++f) {
    var h = b[f];
    if (h && !h.fa && h.capture == c) {
      var n = h.listener, t = h.la || h.src;
      h.ia && Ua(a.i, h);
      e = n.call(t, d) !== false && e;
    }
  }
  return e && !d.defaultPrevented;
};
var lb = function() {
  var a = mb;
  let b = null;
  a.g && (b = a.g, a.g = a.g.next, a.g || (a.h = null), b.next = null);
  return b;
};
var qb = function(a) {
  var b = 1;
  a = a.split(":");
  const c = [];
  for (;0 < b && a.length; )
    c.push(a.shift()), b--;
  a.length && c.push(a.join(":"));
  return c;
};
var rb = function(a) {
  l.setTimeout(() => {
    throw a;
  }, 0);
};
var wb = function(a, b) {
  B.call(this);
  this.h = a || 1;
  this.g = b || l;
  this.j = q(this.qb, this);
  this.l = Date.now();
};
var xb = function(a) {
  a.ga = false;
  a.T && (a.g.clearTimeout(a.T), a.T = null);
};
var yb = function(a, b, c) {
  if (typeof a === "function")
    c && (a = q(a, c));
  else if (a && typeof a.handleEvent == "function")
    a = q(a.handleEvent, a);
  else
    throw Error("Invalid listener argument");
  return 2147483647 < Number(b) ? -1 : l.setTimeout(a, b || 0);
};
var zb = function(a) {
  a.g = yb(() => {
    a.g = null;
    a.i && (a.i = false, zb(a));
  }, a.j);
  const b = a.h;
  a.h = null;
  a.m.apply(null, b);
};
var Bb = function(a) {
  v.call(this);
  this.h = a;
  this.g = {};
};
var Db = function(a, b, c, d) {
  Array.isArray(c) || (c && (Cb[0] = c.toString()), c = Cb);
  for (var e = 0;e < c.length; e++) {
    var f = Ya(b, c[e], d || a.handleEvent, false, a.h || a);
    if (!f)
      break;
    a.g[f.key] = f;
  }
};
var Fb = function(a) {
  Na(a.g, function(b, c) {
    this.g.hasOwnProperty(c) && gb(b);
  }, a);
  a.g = {};
};
var Gb = function() {
  this.g = true;
};
var Hb = function(a, b, c, d, e, f) {
  a.info(function() {
    if (a.g)
      if (f) {
        var h = "";
        for (var n = f.split("&"), t = 0;t < n.length; t++) {
          var m = n[t].split("=");
          if (1 < m.length) {
            var u = m[0];
            m = m[1];
            var L = u.split("_");
            h = 2 <= L.length && L[1] == "type" ? h + (u + "=" + m + "&") : h + (u + "=redacted&");
          }
        }
      } else
        h = null;
    else
      h = f;
    return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + h;
  });
};
var Ib = function(a, b, c, d, e, f, h) {
  a.info(function() {
    return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f + " " + h;
  });
};
var D = function(a, b, c, d) {
  a.info(function() {
    return "XMLHTTP TEXT (" + b + "): " + Jb(a, c) + (d ? " " + d : "");
  });
};
var Kb = function(a, b) {
  a.info(function() {
    return "TIMEOUT: " + b;
  });
};
var Jb = function(a, b) {
  if (!a.g)
    return b;
  if (!b)
    return null;
  try {
    var c = JSON.parse(b);
    if (c) {
      for (a = 0;a < c.length; a++)
        if (Array.isArray(c[a])) {
          var d = c[a];
          if (!(2 > d.length)) {
            var e = d[1];
            if (Array.isArray(e) && !(1 > e.length)) {
              var f = e[0];
              if (f != "noop" && f != "stop" && f != "close")
                for (var h = 1;h < e.length; h++)
                  e[h] = "";
            }
          }
        }
    }
    return jb(c);
  } catch (n) {
    return b;
  }
};
var Mb = function() {
  return Lb = Lb || new B;
};
var Nb = function(a) {
  w.call(this, E.Ta, a);
};
var Ob = function(a) {
  const b = Mb();
  C(b, new Nb(b));
};
var Pb = function(a, b) {
  w.call(this, E.STAT_EVENT, a);
  this.stat = b;
};
var F = function(a) {
  const b = Mb();
  C(b, new Pb(b, a));
};
var Qb = function(a, b) {
  w.call(this, E.Ua, a);
  this.size = b;
};
var Rb = function(a, b) {
  if (typeof a !== "function")
    throw Error("Fn must not be null and must be a function");
  return l.setTimeout(function() {
    a();
  }, b);
};
var Ub = function() {
};
var Vb = function(a) {
  return a.h || (a.h = a.i());
};
var Wb = function() {
};
var Yb = function() {
  w.call(this, "d");
};
var Zb = function() {
  w.call(this, "c");
};
var ac = function() {
};
var bc = function(a, b, c, d) {
  this.l = a;
  this.j = b;
  this.m = c;
  this.W = d || 1;
  this.U = new Bb(this);
  this.P = cc;
  a = va ? 125 : undefined;
  this.V = new wb(a);
  this.I = null;
  this.i = false;
  this.s = this.A = this.v = this.L = this.G = this.Y = this.B = null;
  this.F = [];
  this.g = null;
  this.C = 0;
  this.o = this.u = null;
  this.ca = -1;
  this.J = false;
  this.O = 0;
  this.M = null;
  this.ba = this.K = this.aa = this.S = false;
  this.h = new dc;
};
var dc = function() {
  this.i = null;
  this.g = "";
  this.h = false;
};
var gc = function(a, b, c) {
  a.L = 1;
  a.v = hc(G(b));
  a.s = c;
  a.S = true;
  ic(a, null);
};
var ic = function(a, b) {
  a.G = Date.now();
  jc(a);
  a.A = G(a.v);
  var { A: c, W: d } = a;
  Array.isArray(d) || (d = [String(d)]);
  kc(c.i, "t", d);
  a.C = 0;
  c = a.l.J;
  a.h = new dc;
  a.g = lc(a.l, c ? b : null, !a.s);
  0 < a.O && (a.M = new Ab(q(a.Pa, a, a.g), a.O));
  Db(a.U, a.g, "readystatechange", a.nb);
  b = a.I ? Pa(a.I) : {};
  a.s ? (a.u || (a.u = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.g.ha(a.A, a.u, a.s, b)) : (a.u = "GET", a.g.ha(a.A, a.u, null, b));
  Ob();
  Hb(a.j, a.u, a.A, a.m, a.W, a.s);
};
var oc = function(a) {
  return a.g ? a.u == "GET" && a.L != 2 && a.l.Ha : false;
};
var rc = function(a, b, c) {
  let d = true, e;
  for (;!a.J && a.C < c.length; )
    if (e = uc(a, c), e == fc) {
      b == 4 && (a.o = 4, F(14), d = false);
      D(a.j, a.m, null, "[Incomplete Response]");
      break;
    } else if (e == ec) {
      a.o = 4;
      F(15);
      D(a.j, a.m, c, "[Invalid Chunk]");
      d = false;
      break;
    } else
      D(a.j, a.m, e, null), qc(a, e);
  oc(a) && e != fc && e != ec && (a.h.g = "", a.C = 0);
  b != 4 || c.length != 0 || a.h.h || (a.o = 1, F(16), d = false);
  a.i = a.i && d;
  d ? 0 < c.length && !a.ba && (a.ba = true, b = a.l, b.g == a && b.ca && !b.M && (b.l.info("Great, no buffering proxy detected. Bytes received: " + c.length), vc(b), b.M = true, F(11))) : (D(a.j, a.m, c, "[Invalid Chunked Response]"), I(a), pc(a));
};
var uc = function(a, b) {
  var c = a.C, d = b.indexOf("\n", c);
  if (d == -1)
    return fc;
  c = Number(b.substring(c, d));
  if (isNaN(c))
    return ec;
  d += 1;
  if (d + c > b.length)
    return fc;
  b = b.slice(d, d + c);
  a.C = d + c;
  return b;
};
var jc = function(a) {
  a.Y = Date.now() + a.P;
  wc(a, a.P);
};
var wc = function(a, b) {
  if (a.B != null)
    throw Error("WatchDog timer not null");
  a.B = Rb(q(a.lb, a), b);
};
var nc = function(a) {
  a.B && (l.clearTimeout(a.B), a.B = null);
};
var pc = function(a) {
  a.l.H == 0 || a.J || sc(a.l, a);
};
var I = function(a) {
  nc(a);
  var b = a.M;
  b && typeof b.sa == "function" && b.sa();
  a.M = null;
  xb(a.V);
  Fb(a.U);
  a.g && (b = a.g, a.g = null, b.abort(), b.sa());
};
var qc = function(a, b) {
  try {
    var c = a.l;
    if (c.H != 0 && (c.g == a || xc(c.i, a))) {
      if (!a.K && xc(c.i, a) && c.H == 3) {
        try {
          var d = c.Ja.g.parse(b);
        } catch (m) {
          d = null;
        }
        if (Array.isArray(d) && d.length == 3) {
          var e = d;
          if (e[0] == 0)
            a: {
              if (!c.u) {
                if (c.g)
                  if (c.g.G + 3000 < a.G)
                    yc(c), zc(c);
                  else
                    break a;
                Ac(c);
                F(18);
              }
            }
          else
            c.Fa = e[1], 0 < c.Fa - c.V && 37500 > e[2] && c.G && c.A == 0 && !c.v && (c.v = Rb(q(c.ib, c), 6000));
          if (1 >= Bc(c.i) && c.oa) {
            try {
              c.oa();
            } catch (m) {
            }
            c.oa = undefined;
          }
        } else
          J(c, 11);
      } else if ((a.K || c.g == a) && yc(c), !x(b))
        for (e = c.Ja.g.parse(b), b = 0;b < e.length; b++) {
          let m = e[b];
          c.V = m[0];
          m = m[1];
          if (c.H == 2)
            if (m[0] == "c") {
              c.K = m[1];
              c.pa = m[2];
              const u = m[3];
              u != null && (c.ra = u, c.l.info("VER=" + c.ra));
              const L = m[4];
              L != null && (c.Ga = L, c.l.info("SVER=" + c.Ga));
              const La = m[5];
              La != null && typeof La === "number" && 0 < La && (d = 1.5 * La, c.L = d, c.l.info("backChannelRequestTimeoutMs_=" + d));
              d = c;
              const la = a.g;
              if (la) {
                const Ma = la.g ? la.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                if (Ma) {
                  var f = d.i;
                  f.g || Ma.indexOf("spdy") == -1 && Ma.indexOf("quic") == -1 && Ma.indexOf("h2") == -1 || (f.j = f.l, f.g = new Set, f.h && (Cc(f, f.h), f.h = null));
                }
                if (d.F) {
                  const Eb = la.g ? la.g.getResponseHeader("X-HTTP-Session-Id") : null;
                  Eb && (d.Da = Eb, K(d.I, d.F, Eb));
                }
              }
              c.H = 3;
              c.h && c.h.Ba();
              c.ca && (c.S = Date.now() - a.G, c.l.info("Handshake RTT: " + c.S + "ms"));
              d = c;
              var h = a;
              d.wa = Dc(d, d.J ? d.pa : null, d.Y);
              if (h.K) {
                Ec(d.i, h);
                var n = h, t = d.L;
                t && n.setTimeout(t);
                n.B && (nc(n), jc(n));
                d.g = h;
              } else
                Fc(d);
              0 < c.j.length && Gc(c);
            } else
              m[0] != "stop" && m[0] != "close" || J(c, 7);
          else
            c.H == 3 && (m[0] == "stop" || m[0] == "close" ? m[0] == "stop" ? J(c, 7) : Hc(c) : m[0] != "noop" && c.h && c.h.Aa(m), c.A = 0);
        }
    }
    Ob(4);
  } catch (m) {
  }
};
var Ic = function(a) {
  if (a.Z && typeof a.Z == "function")
    return a.Z();
  if (typeof Map !== "undefined" && a instanceof Map || typeof Set !== "undefined" && a instanceof Set)
    return Array.from(a.values());
  if (typeof a === "string")
    return a.split("");
  if (aa(a)) {
    for (var b = [], c = a.length, d = 0;d < c; d++)
      b.push(a[d]);
    return b;
  }
  b = [];
  c = 0;
  for (d in a)
    b[c++] = a[d];
  return b;
};
var Jc = function(a) {
  if (a.ta && typeof a.ta == "function")
    return a.ta();
  if (!a.Z || typeof a.Z != "function") {
    if (typeof Map !== "undefined" && a instanceof Map)
      return Array.from(a.keys());
    if (!(typeof Set !== "undefined" && a instanceof Set)) {
      if (aa(a) || typeof a === "string") {
        var b = [];
        a = a.length;
        for (var c = 0;c < a; c++)
          b.push(c);
        return b;
      }
      b = [];
      c = 0;
      for (const d in a)
        b[c++] = d;
      return b;
    }
  }
};
var Kc = function(a, b) {
  if (a.forEach && typeof a.forEach == "function")
    a.forEach(b, undefined);
  else if (aa(a) || typeof a === "string")
    Array.prototype.forEach.call(a, b, undefined);
  else
    for (var c = Jc(a), d = Ic(a), e = d.length, f = 0;f < e; f++)
      b.call(undefined, d[f], c && c[f], a);
};
var Mc = function(a, b) {
  if (a) {
    a = a.split("&");
    for (var c = 0;c < a.length; c++) {
      var d = a[c].indexOf("="), e = null;
      if (0 <= d) {
        var f = a[c].substring(0, d);
        e = a[c].substring(d + 1);
      } else
        f = a[c];
      b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
    }
  }
};
var M = function(a) {
  this.g = this.s = this.j = "";
  this.m = null;
  this.o = this.l = "";
  this.h = false;
  if (a instanceof M) {
    this.h = a.h;
    Nc(this, a.j);
    this.s = a.s;
    this.g = a.g;
    Oc(this, a.m);
    this.l = a.l;
    var b = a.i;
    var c = new Pc;
    c.i = b.i;
    b.g && (c.g = new Map(b.g), c.h = b.h);
    Qc(this, c);
    this.o = a.o;
  } else
    a && (b = String(a).match(Lc)) ? (this.h = false, Nc(this, b[1] || "", true), this.s = Rc(b[2] || ""), this.g = Rc(b[3] || "", true), Oc(this, b[4]), this.l = Rc(b[5] || "", true), Qc(this, b[6] || "", true), this.o = Rc(b[7] || "")) : (this.h = false, this.i = new Pc(null, this.h));
};
var G = function(a) {
  return new M(a);
};
var Nc = function(a, b, c) {
  a.j = c ? Rc(b, true) : b;
  a.j && (a.j = a.j.replace(/:$/, ""));
};
var Oc = function(a, b) {
  if (b) {
    b = Number(b);
    if (isNaN(b) || 0 > b)
      throw Error("Bad port number " + b);
    a.m = b;
  } else
    a.m = null;
};
var Qc = function(a, b, c) {
  b instanceof Pc ? (a.i = b, Xc(a.i, a.h)) : (c || (b = Sc(b, Yc)), a.i = new Pc(b, a.h));
};
var K = function(a, b, c) {
  a.i.set(b, c);
};
var hc = function(a) {
  K(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
  return a;
};
var Rc = function(a, b) {
  return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
};
var Sc = function(a, b, c) {
  return typeof a === "string" ? (a = encodeURI(a).replace(b, Zc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
};
var Zc = function(a) {
  a = a.charCodeAt(0);
  return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
};
var Pc = function(a, b) {
  this.h = this.g = null;
  this.i = a || null;
  this.j = !!b;
};
var N = function(a) {
  a.g || (a.g = new Map, a.h = 0, a.i && Mc(a.i, function(b, c) {
    a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
  }));
};
var $c = function(a, b) {
  N(a);
  b = O(a, b);
  a.g.has(b) && (a.i = null, a.h -= a.g.get(b).length, a.g.delete(b));
};
var ad = function(a, b) {
  N(a);
  b = O(a, b);
  return a.g.has(b);
};
var kc = function(a, b, c) {
  $c(a, b);
  0 < c.length && (a.i = null, a.g.set(O(a, b), ma(c)), a.h += c.length);
};
var O = function(a, b) {
  b = String(b);
  a.j && (b = b.toLowerCase());
  return b;
};
var Xc = function(a, b) {
  b && !a.j && (N(a), a.i = null, a.g.forEach(function(c, d) {
    var e = d.toLowerCase();
    d != e && ($c(this, d), kc(this, e, c));
  }, a));
  a.j = b;
};
var cd = function(a) {
  this.l = a || dd;
  l.PerformanceNavigationTiming ? (a = l.performance.getEntriesByType("navigation"), a = 0 < a.length && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(l.g && l.g.Ka && l.g.Ka() && l.g.Ka().ec);
  this.j = a ? this.l : 1;
  this.g = null;
  1 < this.j && (this.g = new Set);
  this.h = null;
  this.i = [];
};
var ed = function(a) {
  return a.h ? true : a.g ? a.g.size >= a.j : false;
};
var Bc = function(a) {
  return a.h ? 1 : a.g ? a.g.size : 0;
};
var xc = function(a, b) {
  return a.h ? a.h == b : a.g ? a.g.has(b) : false;
};
var Cc = function(a, b) {
  a.g ? a.g.add(b) : a.h = b;
};
var Ec = function(a, b) {
  a.h && a.h == b ? a.h = null : a.g && a.g.has(b) && a.g.delete(b);
};
var fd = function(a) {
  if (a.h != null)
    return a.i.concat(a.h.F);
  if (a.g != null && a.g.size !== 0) {
    let b = a.i;
    for (const c of a.g.values())
      b = b.concat(c.F);
    return b;
  }
  return ma(a.i);
};
var hd = function() {
  this.g = new gd;
};
var id = function(a, b, c) {
  const d = c || "";
  try {
    Kc(a, function(e, f) {
      let h = e;
      p(e) && (h = jb(e));
      b.push(d + f + "=" + encodeURIComponent(h));
    });
  } catch (e) {
    throw b.push(d + "type=" + encodeURIComponent("_badmap")), e;
  }
};
var jd = function(a, b) {
  const c = new Gb;
  if (l.Image) {
    const d = new Image;
    d.onload = ha(kd, c, d, "TestLoadImage: loaded", true, b);
    d.onerror = ha(kd, c, d, "TestLoadImage: error", false, b);
    d.onabort = ha(kd, c, d, "TestLoadImage: abort", false, b);
    d.ontimeout = ha(kd, c, d, "TestLoadImage: timeout", false, b);
    l.setTimeout(function() {
      if (d.ontimeout)
        d.ontimeout();
    }, 1e4);
    d.src = a;
  } else
    b(false);
};
var kd = function(a, b, c, d, e) {
  try {
    b.onload = null, b.onerror = null, b.onabort = null, b.ontimeout = null, e(d);
  } catch (f) {
  }
};
var ld = function(a) {
  this.l = a.fc || null;
  this.j = a.ob || false;
};
var md = function(a, b) {
  B.call(this);
  this.F = a;
  this.u = b;
  this.m = undefined;
  this.readyState = nd;
  this.status = 0;
  this.responseType = this.responseText = this.response = this.statusText = "";
  this.onreadystatechange = null;
  this.v = new Headers;
  this.h = null;
  this.C = "GET";
  this.B = "";
  this.g = false;
  this.A = this.j = this.l = null;
};
var qd = function(a) {
  a.j.read().then(a.Xa.bind(a)).catch(a.ka.bind(a));
};
var pd = function(a) {
  a.readyState = 4;
  a.l = null;
  a.j = null;
  a.A = null;
  od(a);
};
var od = function(a) {
  a.onreadystatechange && a.onreadystatechange.call(a);
};
var P = function(a) {
  B.call(this);
  this.headers = new Map;
  this.u = a || null;
  this.h = false;
  this.C = this.g = null;
  this.I = "";
  this.m = 0;
  this.j = "";
  this.l = this.G = this.v = this.F = false;
  this.B = 0;
  this.A = null;
  this.K = sd;
  this.L = this.M = false;
};
var xd = function(a) {
  return z && typeof a.timeout === "number" && a.ontimeout !== undefined;
};
var vd = function(a, b) {
  a.h = false;
  a.g && (a.l = true, a.g.abort(), a.l = false);
  a.j = b;
  a.m = 5;
  yd(a);
  zd(a);
};
var yd = function(a) {
  a.F || (a.F = true, C(a, "complete"), C(a, "error"));
};
var Ad = function(a) {
  if (a.h && typeof goog != "undefined" && (!a.C[1] || H(a) != 4 || a.da() != 2)) {
    if (a.v && H(a) == 4)
      yb(a.La, 0, a);
    else if (C(a, "readystatechange"), H(a) == 4) {
      a.h = false;
      try {
        const h = a.da();
        a:
          switch (h) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var b = true;
              break a;
            default:
              b = false;
          }
        var c;
        if (!(c = b)) {
          var d;
          if (d = h === 0) {
            var e = String(a.I).match(Lc)[1] || null;
            !e && l.self && l.self.location && (e = l.self.location.protocol.slice(0, -1));
            d = !td.test(e ? e.toLowerCase() : "");
          }
          c = d;
        }
        if (c)
          C(a, "complete"), C(a, "success");
        else {
          a.m = 6;
          try {
            var f = 2 < H(a) ? a.g.statusText : "";
          } catch (n) {
            f = "";
          }
          a.j = f + " [" + a.da() + "]";
          yd(a);
        }
      } finally {
        zd(a);
      }
    }
  }
};
var zd = function(a, b) {
  if (a.g) {
    wd(a);
    const c = a.g, d = a.C[0] ? () => {
    } : null;
    a.g = null;
    a.C = null;
    b || C(a, "ready");
    try {
      c.onreadystatechange = d;
    } catch (e) {
    }
  }
};
var wd = function(a) {
  a.g && a.L && (a.g.ontimeout = null);
  a.A && (l.clearTimeout(a.A), a.A = null);
};
var H = function(a) {
  return a.g ? a.g.readyState : 0;
};
var mc = function(a) {
  try {
    if (!a.g)
      return null;
    if ("response" in a.g)
      return a.g.response;
    switch (a.K) {
      case sd:
      case "text":
        return a.g.responseText;
      case "arraybuffer":
        if ("mozResponseArrayBuffer" in a.g)
          return a.g.mozResponseArrayBuffer;
    }
    return null;
  } catch (b) {
    return null;
  }
};
var tc = function(a) {
  const b = {};
  a = (a.g && 2 <= H(a) ? a.g.getAllResponseHeaders() || "" : "").split("\r\n");
  for (let d = 0;d < a.length; d++) {
    if (x(a[d]))
      continue;
    var c = qb(a[d]);
    const e = c[0];
    c = c[1];
    if (typeof c !== "string")
      continue;
    c = c.trim();
    const f = b[e] || [];
    b[e] = f;
    f.push(c);
  }
  Oa(b, function(d) {
    return d.join(", ");
  });
};
var Bd = function(a) {
  let b = "";
  Na(a, function(c, d) {
    b += d;
    b += ":";
    b += c;
    b += "\r\n";
  });
  return b;
};
var Cd = function(a, b, c) {
  a: {
    for (d in c) {
      var d = false;
      break a;
    }
    d = true;
  }
  d || (c = Bd(c), typeof a === "string" ? c != null && encodeURIComponent(String(c)) : K(a, b, c));
};
var Dd = function(a, b, c) {
  return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
};
var Ed = function(a) {
  this.Ga = 0;
  this.j = [];
  this.l = new Gb;
  this.pa = this.wa = this.I = this.Y = this.g = this.Da = this.F = this.na = this.o = this.U = this.s = null;
  this.fb = this.W = 0;
  this.cb = Dd("failFast", false, a);
  this.G = this.v = this.u = this.m = this.h = null;
  this.aa = true;
  this.Fa = this.V = -1;
  this.ba = this.A = this.C = 0;
  this.ab = Dd("baseRetryDelayMs", 5000, a);
  this.hb = Dd("retryDelaySeedMs", 1e4, a);
  this.eb = Dd("forwardChannelMaxRetries", 2, a);
  this.xa = Dd("forwardChannelRequestTimeoutMs", 20000, a);
  this.va = a && a.xmlHttpFactory || undefined;
  this.Ha = a && a.dc || false;
  this.L = undefined;
  this.J = a && a.supportsCrossDomainXhr || false;
  this.K = "";
  this.i = new cd(a && a.concurrentRequestLimit);
  this.Ja = new hd;
  this.P = a && a.fastHandshake || false;
  this.O = a && a.encodeInitMessageHeaders || false;
  this.P && this.O && (this.O = false);
  this.bb = a && a.bc || false;
  a && a.Ea && this.l.Ea();
  a && a.forceLongPolling && (this.aa = false);
  this.ca = !this.P && this.aa && a && a.detectBufferingProxy || false;
  this.qa = undefined;
  a && a.longPollingTimeout && 0 < a.longPollingTimeout && (this.qa = a.longPollingTimeout);
  this.oa = undefined;
  this.S = 0;
  this.M = false;
  this.ma = this.B = null;
};
var Hc = function(a) {
  Fd(a);
  if (a.H == 3) {
    var b = a.W++, c = G(a.I);
    K(c, "SID", a.K);
    K(c, "RID", b);
    K(c, "TYPE", "terminate");
    Gd(a, c);
    b = new bc(a, a.l, b);
    b.L = 2;
    b.v = hc(G(c));
    c = false;
    if (l.navigator && l.navigator.sendBeacon)
      try {
        c = l.navigator.sendBeacon(b.v.toString(), "");
      } catch (d) {
      }
    !c && l.Image && (new Image().src = b.v, c = true);
    c || (b.g = lc(b.l, null), b.g.ha(b.v));
    b.G = Date.now();
    jc(b);
  }
  Hd(a);
};
var zc = function(a) {
  a.g && (vc(a), a.g.cancel(), a.g = null);
};
var Fd = function(a) {
  zc(a);
  a.u && (l.clearTimeout(a.u), a.u = null);
  yc(a);
  a.i.cancel();
  a.m && (typeof a.m === "number" && l.clearTimeout(a.m), a.m = null);
};
var Gc = function(a) {
  if (!ed(a.i) && !a.m) {
    a.m = true;
    var b = a.Na;
    sb || vb();
    tb || (sb(), tb = true);
    mb.add(b, a);
    a.C = 0;
  }
};
var Id = function(a, b) {
  if (Bc(a.i) >= a.i.j - (a.m ? 1 : 0))
    return false;
  if (a.m)
    return a.j = b.F.concat(a.j), true;
  if (a.H == 1 || a.H == 2 || a.C >= (a.cb ? 0 : a.eb))
    return false;
  a.m = Rb(q(a.Na, a, b), Jd(a, a.C));
  a.C++;
  return true;
};
var Ld = function(a, b) {
  var c;
  b ? c = b.m : c = a.W++;
  const d = G(a.I);
  K(d, "SID", a.K);
  K(d, "RID", c);
  K(d, "AID", a.V);
  Gd(a, d);
  a.o && a.s && Cd(d, a.o, a.s);
  c = new bc(a, a.l, c, a.C + 1);
  a.o === null && (c.I = a.s);
  b && (a.j = b.F.concat(a.j));
  b = Kd(a, c, 1000);
  c.setTimeout(Math.round(0.5 * a.xa) + Math.round(0.5 * a.xa * Math.random()));
  Cc(a.i, c);
  gc(c, d, b);
};
var Gd = function(a, b) {
  a.na && Na(a.na, function(c, d) {
    K(b, d, c);
  });
  a.h && Kc({}, function(c, d) {
    K(b, d, c);
  });
};
var Kd = function(a, b, c) {
  c = Math.min(a.j.length, c);
  var d = a.h ? q(a.h.Va, a.h, a) : null;
  a: {
    var e = a.j;
    let f = -1;
    for (;; ) {
      const h = ["count=" + c];
      f == -1 ? 0 < c ? (f = e[0].g, h.push("ofs=" + f)) : f = 0 : h.push("ofs=" + f);
      let n = true;
      for (let t = 0;t < c; t++) {
        let m = e[t].g;
        const u = e[t].map;
        m -= f;
        if (0 > m)
          f = Math.max(0, e[t].g - 100), n = false;
        else
          try {
            id(u, h, "req" + m + "_");
          } catch (L) {
            d && d(u);
          }
      }
      if (n) {
        d = h.join("&");
        break a;
      }
    }
  }
  a = a.j.splice(0, c);
  b.F = a;
  return d;
};
var Fc = function(a) {
  if (!a.g && !a.u) {
    a.ba = 1;
    var b = a.Ma;
    sb || vb();
    tb || (sb(), tb = true);
    mb.add(b, a);
    a.A = 0;
  }
};
var Ac = function(a) {
  if (a.g || a.u || 3 <= a.A)
    return false;
  a.ba++;
  a.u = Rb(q(a.Ma, a), Jd(a, a.A));
  a.A++;
  return true;
};
var vc = function(a) {
  a.B != null && (l.clearTimeout(a.B), a.B = null);
};
var Md = function(a) {
  a.g = new bc(a, a.l, "rpc", a.ba);
  a.o === null && (a.g.I = a.s);
  a.g.O = 0;
  var b = G(a.wa);
  K(b, "RID", "rpc");
  K(b, "SID", a.K);
  K(b, "AID", a.V);
  K(b, "CI", a.G ? "0" : "1");
  !a.G && a.qa && K(b, "TO", a.qa);
  K(b, "TYPE", "xmlhttp");
  Gd(a, b);
  a.o && a.s && Cd(b, a.o, a.s);
  a.L && a.g.setTimeout(a.L);
  var c = a.g;
  a = a.pa;
  c.L = 1;
  c.v = hc(G(b));
  c.s = null;
  c.S = true;
  ic(c, a);
};
var yc = function(a) {
  a.v != null && (l.clearTimeout(a.v), a.v = null);
};
var sc = function(a, b) {
  var c = null;
  if (a.g == b) {
    yc(a);
    vc(a);
    a.g = null;
    var d = 2;
  } else if (xc(a.i, b))
    c = b.F, Ec(a.i, b), d = 1;
  else
    return;
  if (a.H != 0) {
    if (b.i)
      if (d == 1) {
        c = b.s ? b.s.length : 0;
        b = Date.now() - b.G;
        var e = a.C;
        d = Mb();
        C(d, new Qb(d, c));
        Gc(a);
      } else
        Fc(a);
    else if (e = b.o, e == 3 || e == 0 && 0 < b.ca || !(d == 1 && Id(a, b) || d == 2 && Ac(a)))
      switch (c && 0 < c.length && (b = a.i, b.i = b.i.concat(c)), e) {
        case 1:
          J(a, 5);
          break;
        case 4:
          J(a, 10);
          break;
        case 3:
          J(a, 6);
          break;
        default:
          J(a, 2);
      }
  }
};
var Jd = function(a, b) {
  let c = a.ab + Math.floor(Math.random() * a.hb);
  a.isActive() || (c *= 2);
  return c * b;
};
var J = function(a, b) {
  a.l.info("Error code " + b);
  if (b == 2) {
    var c = null;
    a.h && (c = null);
    var d = q(a.pb, a);
    c || (c = new M("//www.google.com/images/cleardot.gif"), l.location && l.location.protocol == "http" || Nc(c, "https"), hc(c));
    jd(c.toString(), d);
  } else
    F(2);
  a.H = 0;
  a.h && a.h.za(b);
  Hd(a);
  Fd(a);
};
var Hd = function(a) {
  a.H = 0;
  a.ma = [];
  if (a.h) {
    const b = fd(a.i);
    if (b.length != 0 || a.j.length != 0)
      na(a.ma, b), na(a.ma, a.j), a.i.i.length = 0, ma(a.j), a.j.length = 0;
    a.h.ya();
  }
};
var Dc = function(a, b, c) {
  var d = c instanceof M ? G(c) : new M(c);
  if (d.g != "")
    b && (d.g = b + "." + d.g), Oc(d, d.m);
  else {
    var e = l.location;
    d = e.protocol;
    b = b ? b + "." + e.hostname : e.hostname;
    e = +e.port;
    var f = new M(null);
    d && Nc(f, d);
    b && (f.g = b);
    e && Oc(f, e);
    c && (f.l = c);
    d = f;
  }
  c = a.F;
  b = a.Da;
  c && b && K(d, c, b);
  K(d, "VER", a.ra);
  Gd(a, d);
  return d;
};
var lc = function(a, b, c) {
  if (b && !a.J)
    throw Error("Can't create secondary domain capable XhrIo object.");
  b = c && a.Ha && !a.va ? new P(new ld({ ob: true })) : new P(a.va);
  b.Oa(a.J);
  return b;
};
var Nd = function() {
};
var Od = function() {
  if (z && !(10 <= Number(Fa)))
    throw Error("Environmental error: no available transport.");
};
var Q = function(a, b) {
  B.call(this);
  this.g = new Ed(b);
  this.l = a;
  this.h = b && b.messageUrlParams || null;
  a = b && b.messageHeaders || null;
  b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
  this.g.s = a;
  a = b && b.initMessageHeaders || null;
  b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = { "X-WebChannel-Content-Type": b.messageContentType });
  b && b.Ca && (a ? a["X-WebChannel-Client-Profile"] = b.Ca : a = { "X-WebChannel-Client-Profile": b.Ca });
  this.g.U = a;
  (a = b && b.cc) && !x(a) && (this.g.o = a);
  this.A = b && b.supportsCrossDomainXhr || false;
  this.v = b && b.sendRawJson || false;
  (b = b && b.httpSessionIdParam) && !x(b) && (this.g.F = b, a = this.h, a !== null && (b in a) && (a = this.h, (b in a) && delete a[b]));
  this.j = new R(this);
};
var Pd = function(a) {
  Yb.call(this);
  a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
  var b = a.__sm__;
  if (b) {
    a: {
      for (const c in b) {
        a = c;
        break a;
      }
      a = undefined;
    }
    if (this.i = a)
      a = this.i, b = b !== null && (a in b) ? b[a] : undefined;
    this.data = b;
  } else
    this.data = a;
};
var Qd = function() {
  Zb.call(this);
  this.status = 1;
};
var R = function(a) {
  this.g = a;
};
var Rd = function() {
  this.blockSize = -1;
};
var S = function() {
  this.blockSize = -1;
  this.blockSize = 64;
  this.g = Array(4);
  this.m = Array(this.blockSize);
  this.i = this.h = 0;
  this.reset();
};
var Sd = function(a, b, c) {
  c || (c = 0);
  var d = Array(16);
  if (typeof b === "string")
    for (var e = 0;16 > e; ++e)
      d[e] = b.charCodeAt(c++) | b.charCodeAt(c++) << 8 | b.charCodeAt(c++) << 16 | b.charCodeAt(c++) << 24;
  else
    for (e = 0;16 > e; ++e)
      d[e] = b[c++] | b[c++] << 8 | b[c++] << 16 | b[c++] << 24;
  b = a.g[0];
  c = a.g[1];
  e = a.g[2];
  var f = a.g[3];
  var h = b + (f ^ c & (e ^ f)) + d[0] + 3614090360 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[1] + 3905402710 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[2] + 606105819 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[3] + 3250441966 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (f ^ c & (e ^ f)) + d[4] + 4118548399 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[5] + 1200080426 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[6] + 2821735955 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[7] + 4249261313 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (f ^ c & (e ^ f)) + d[8] + 1770035416 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[9] + 2336552879 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[10] + 4294925233 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[11] + 2304563134 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (f ^ c & (e ^ f)) + d[12] + 1804603682 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[13] + 4254626195 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[14] + 2792965006 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[15] + 1236535329 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (e ^ f & (c ^ e)) + d[1] + 4129170786 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[6] + 3225465664 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[11] + 643717713 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[0] + 3921069994 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (e ^ f & (c ^ e)) + d[5] + 3593408605 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[10] + 38016083 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[15] + 3634488961 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[4] + 3889429448 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (e ^ f & (c ^ e)) + d[9] + 568446438 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[14] + 3275163606 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[3] + 4107603335 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[8] + 1163531501 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (e ^ f & (c ^ e)) + d[13] + 2850285829 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[2] + 4243563512 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[7] + 1735328473 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[12] + 2368359562 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (c ^ e ^ f) + d[5] + 4294588738 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[8] + 2272392833 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[11] + 1839030562 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[14] + 4259657740 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (c ^ e ^ f) + d[1] + 2763975236 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[4] + 1272893353 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[7] + 4139469664 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[10] + 3200236656 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (c ^ e ^ f) + d[13] + 681279174 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[0] + 3936430074 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[3] + 3572445317 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[6] + 76029189 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (c ^ e ^ f) + d[9] + 3654602809 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[12] + 3873151461 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[15] + 530742520 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[2] + 3299628645 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (e ^ (c | ~f)) + d[0] + 4096336452 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[7] + 1126891415 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[14] + 2878612391 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[5] + 4237533241 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b + (e ^ (c | ~f)) + d[12] + 1700485571 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[3] + 2399980690 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[10] + 4293915773 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[1] + 2240044497 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b + (e ^ (c | ~f)) + d[8] + 1873313359 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[15] + 4264355552 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[6] + 2734768916 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[13] + 1309151649 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b + (e ^ (c | ~f)) + d[4] + 4149444226 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[11] + 3174756917 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[2] + 718787259 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[9] + 3951481745 & 4294967295;
  a.g[0] = a.g[0] + b & 4294967295;
  a.g[1] = a.g[1] + (e + (h << 21 & 4294967295 | h >>> 11)) & 4294967295;
  a.g[2] = a.g[2] + e & 4294967295;
  a.g[3] = a.g[3] + f & 4294967295;
};
var T = function(a, b) {
  this.h = b;
  for (var c = [], d = true, e = a.length - 1;0 <= e; e--) {
    var f = a[e] | 0;
    d && f == b || (c[e] = f, d = false);
  }
  this.g = c;
};
var Td = function(a) {
  return -128 <= a && 128 > a ? ra(a, function(b) {
    return new T([b | 0], 0 > b ? -1 : 0);
  }) : new T([a | 0], 0 > a ? -1 : 0);
};
var U = function(a) {
  if (isNaN(a) || !isFinite(a))
    return V;
  if (0 > a)
    return W(U(-a));
  for (var b = [], c = 1, d = 0;a >= c; d++)
    b[d] = a / c | 0, c *= Ud;
  return new T(b, 0);
};
var Vd = function(a, b) {
  if (a.length == 0)
    throw Error("number format error: empty string");
  b = b || 10;
  if (2 > b || 36 < b)
    throw Error("radix out of range: " + b);
  if (a.charAt(0) == "-")
    return W(Vd(a.substring(1), b));
  if (0 <= a.indexOf("-"))
    throw Error('number format error: interior "-" character');
  for (var c = U(Math.pow(b, 8)), d = V, e = 0;e < a.length; e += 8) {
    var f = Math.min(8, a.length - e), h = parseInt(a.substring(e, e + f), b);
    8 > f ? (f = U(Math.pow(b, f)), d = d.R(f).add(U(h))) : (d = d.R(c), d = d.add(U(h)));
  }
  return d;
};
var Y = function(a) {
  if (a.h != 0)
    return false;
  for (var b = 0;b < a.g.length; b++)
    if (a.g[b] != 0)
      return false;
  return true;
};
var X = function(a) {
  return a.h == -1;
};
var W = function(a) {
  for (var b = a.g.length, c = [], d = 0;d < b; d++)
    c[d] = ~a.g[d];
  return new T(c, ~a.h).add(Wd);
};
var Zd = function(a, b) {
  return a.add(W(b));
};
var $d = function(a, b) {
  for (;(a[b] & 65535) != a[b]; )
    a[b + 1] += a[b] >>> 16, a[b] &= 65535, b++;
};
var ae = function(a, b) {
  this.g = a;
  this.h = b;
};
var Yd = function(a, b) {
  if (Y(b))
    throw Error("division by zero");
  if (Y(a))
    return new ae(V, V);
  if (X(a))
    return b = Yd(W(a), b), new ae(W(b.g), W(b.h));
  if (X(b))
    return b = Yd(a, W(b)), new ae(W(b.g), b.h);
  if (30 < a.g.length) {
    if (X(a) || X(b))
      throw Error("slowDivide_ only works with positive integers.");
    for (var c = Wd, d = b;0 >= d.X(a); )
      c = be(c), d = be(d);
    var e = Z(c, 1), f = Z(d, 1);
    d = Z(d, 2);
    for (c = Z(c, 2);!Y(d); ) {
      var h = f.add(d);
      0 >= h.X(a) && (e = e.add(c), f = h);
      d = Z(d, 1);
      c = Z(c, 1);
    }
    b = Zd(a, e.R(b));
    return new ae(e, b);
  }
  for (e = V;0 <= a.X(b); ) {
    c = Math.max(1, Math.floor(a.ea() / b.ea()));
    d = Math.ceil(Math.log(c) / Math.LN2);
    d = 48 >= d ? 1 : Math.pow(2, d - 48);
    f = U(c);
    for (h = f.R(b);X(h) || 0 < h.X(a); )
      c -= d, f = U(c), h = f.R(b);
    Y(f) && (f = Wd);
    e = e.add(f);
    a = Zd(a, h);
  }
  return new ae(e, a);
};
var be = function(a) {
  for (var b = a.g.length + 1, c = [], d = 0;d < b; d++)
    c[d] = a.D(d) << 1 | a.D(d - 1) >>> 31;
  return new T(c, a.h);
};
var Z = function(a, b) {
  var c = b >> 5;
  b %= 32;
  for (var d = a.g.length - c, e = [], f = 0;f < d; f++)
    e[f] = 0 < b ? a.D(f + c) >>> b | a.D(f + c + 1) << 32 - b : a.D(f + c);
  return new T(e, a.h);
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var esm = {};
var k;
var goog = goog || {};
var l = commonjsGlobal || self;
var ca = "closure_uid_" + (1e9 * Math.random() >>> 0);
var da = 0;
var ia = 0;
v.prototype.s = false;
v.prototype.sa = function() {
  if (!this.s && (this.s = true, this.N(), ia != 0)) {
    ba(this);
  }
};
v.prototype.N = function() {
  if (this.o)
    for (;this.o.length; )
      this.o.shift()();
};
var ka = Array.prototype.indexOf ? function(a, b) {
  return Array.prototype.indexOf.call(a, b, undefined);
} : function(a, b) {
  if (typeof a === "string")
    return typeof b !== "string" || b.length != 1 ? -1 : a.indexOf(b, 0);
  for (let c = 0;c < a.length; c++)
    if ((c in a) && a[c] === b)
      return c;
  return -1;
};
w.prototype.h = function() {
  this.defaultPrevented = true;
};
var oa = function() {
  if (!l.addEventListener || !Object.defineProperty)
    return false;
  var a = false, b = Object.defineProperty({}, "passive", { get: function() {
    a = true;
  } });
  try {
    l.addEventListener("test", () => {
    }, b), l.removeEventListener("test", () => {
    }, b);
  } catch (c) {
  }
  return a;
}();
qa[" "] = function() {
};
var ta = y("Opera");
var z = y("Trident") || y("MSIE");
var ua = y("Edge");
var va = ua || z;
var wa = y("Gecko") && !(pa().toLowerCase().indexOf("webkit") != -1 && !y("Edge")) && !(y("Trident") || y("MSIE")) && !y("Edge");
var xa = pa().toLowerCase().indexOf("webkit") != -1 && !y("Edge");
var za;
a: {
  Aa = "", Ba = function() {
    var a = pa();
    if (wa)
      return /rv:([^\);]+)(\)|;)/.exec(a);
    if (ua)
      return /Edge\/([\d\.]+)/.exec(a);
    if (z)
      return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
    if (xa)
      return /WebKit\/(\S+)/.exec(a);
    if (ta)
      return /(?:Version)[ \/]?(\S+)/.exec(a);
  }();
  Ba && (Aa = Ba ? Ba[1] : "");
  if (z) {
    Ca = ya();
    if (Ca != null && Ca > parseFloat(Aa)) {
      za = String(Ca);
      break a;
    }
  }
  za = Aa;
}
var Aa;
var Ba;
var Ca;
var Da;
if (l.document && z) {
  Ea = ya();
  Da = Ea ? Ea : parseInt(za, 10) || undefined;
} else
  Da = undefined;
var Fa = Da;
r(A, w);
var Ga = { 2: "touch", 3: "pen", 4: "mouse" };
A.prototype.h = function() {
  A.$.h.call(this);
  var a = this.i;
  a.preventDefault ? a.preventDefault() : a.returnValue = false;
};
var Ha = "closure_listenable_" + (1e6 * Math.random() | 0);
var Ia = 0;
var Qa = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
Sa.prototype.add = function(a, b, c, d, e) {
  var f = a.toString();
  a = this.g[f];
  a || (a = this.g[f] = [], this.h++);
  var h = Ta(a, b, d, e);
  -1 < h ? (b = a[h], c || (b.ia = false)) : (b = new Ja(b, this.src, f, !!d, e), b.ia = c, a.push(b));
  return b;
};
var Va = "closure_lm_" + (1e6 * Math.random() | 0);
var Wa = {};
var hb = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
r(B, v);
B.prototype[Ha] = true;
B.prototype.removeEventListener = function(a, b, c, d) {
  fb(this, a, b, c, d);
};
B.prototype.N = function() {
  B.$.N.call(this);
  if (this.i) {
    var a = this.i, c;
    for (c in a.g) {
      for (var d = a.g[c], e = 0;e < d.length; e++)
        Ka(d[e]);
      delete a.g[c];
      a.h--;
    }
  }
  this.J = null;
};
B.prototype.O = function(a, b, c, d) {
  return this.i.add(String(a), b, false, c, d);
};
B.prototype.P = function(a, b, c, d) {
  return this.i.add(String(a), b, true, c, d);
};
var jb = l.JSON.stringify;

class kb {
  constructor(a, b) {
    this.i = a;
    this.j = b;
    this.h = 0;
    this.g = null;
  }
  get() {
    let a;
    0 < this.h ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
    return a;
  }
}

class nb {
  constructor() {
    this.h = this.g = null;
  }
  add(a, b) {
    const c = ob.get();
    c.set(a, b);
    this.h ? this.h.next = c : this.g = c;
    this.h = c;
  }
}
var ob = new kb(() => new pb, (a) => a.reset());

class pb {
  constructor() {
    this.next = this.g = this.h = null;
  }
  set(a, b) {
    this.h = a;
    this.g = b;
    this.next = null;
  }
  reset() {
    this.next = this.g = this.h = null;
  }
}
var sb;
var tb = false;
var mb = new nb;
var vb = () => {
  const a = l.Promise.resolve(undefined);
  sb = () => {
    a.then(ub);
  };
};
var ub = () => {
  for (var a;a = lb(); ) {
    try {
      a.h.call(a.g);
    } catch (c) {
      rb(c);
    }
    var b = ob;
    b.j(a);
    100 > b.h && (b.h++, a.next = b.g, b.g = a);
  }
  tb = false;
};
r(wb, B);
k = wb.prototype;
k.ga = false;
k.T = null;
k.qb = function() {
  if (this.ga) {
    var a = Date.now() - this.l;
    0 < a && a < 0.8 * this.h ? this.T = this.g.setTimeout(this.j, this.h - a) : (this.T && (this.g.clearTimeout(this.T), this.T = null), C(this, "tick"), this.ga && (xb(this), this.start()));
  }
};
k.start = function() {
  this.ga = true;
  this.T || (this.T = this.g.setTimeout(this.j, this.h), this.l = Date.now());
};
k.N = function() {
  wb.$.N.call(this);
  xb(this);
  delete this.g;
};

class Ab extends v {
  constructor(a, b) {
    super();
    this.m = a;
    this.j = b;
    this.h = null;
    this.i = false;
    this.g = null;
  }
  l(a) {
    this.h = arguments;
    this.g ? this.i = true : zb(this);
  }
  N() {
    super.N();
    this.g && (l.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
  }
}
r(Bb, v);
var Cb = [];
Bb.prototype.N = function() {
  Bb.$.N.call(this);
  Fb(this);
};
Bb.prototype.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
Gb.prototype.Ea = function() {
  this.g = false;
};
Gb.prototype.info = function() {
};
var E = {};
var Lb = null;
E.Ta = "serverreachability";
r(Nb, w);
E.STAT_EVENT = "statevent";
r(Pb, w);
E.Ua = "timingevent";
r(Qb, w);
var Sb = { NO_ERROR: 0, rb: 1, Eb: 2, Db: 3, yb: 4, Cb: 5, Fb: 6, Qa: 7, TIMEOUT: 8, Ib: 9 };
var Tb = { wb: "complete", Sb: "success", Ra: "error", Qa: "abort", Kb: "ready", Lb: "readystatechange", TIMEOUT: "timeout", Gb: "incrementaldata", Jb: "progress", zb: "downloadprogress", $b: "uploadprogress" };
Ub.prototype.h = null;
var Xb = { OPEN: "a", vb: "b", Ra: "c", Hb: "d" };
r(Yb, w);
r(Zb, w);
var $b;
r(ac, Ub);
ac.prototype.g = function() {
  return new XMLHttpRequest;
};
ac.prototype.i = function() {
  return {};
};
$b = new ac;
var cc = 45000;
var ec = {};
var fc = {};
k = bc.prototype;
k.setTimeout = function(a) {
  this.P = a;
};
k.nb = function(a) {
  a = a.target;
  const b = this.M;
  b && H(a) == 3 ? b.l() : this.Pa(a);
};
k.Pa = function(a) {
  try {
    if (a == this.g)
      a: {
        const u = H(this.g);
        var b = this.g.Ia();
        const L = this.g.da();
        if (!(3 > u) && (u != 3 || va || this.g && (this.h.h || this.g.ja() || mc(this.g)))) {
          this.J || u != 4 || b == 7 || (b == 8 || 0 >= L ? Ob(3) : Ob(2));
          nc(this);
          var c = this.g.da();
          this.ca = c;
          b:
            if (oc(this)) {
              var d = mc(this.g);
              a = "";
              var e = d.length, f = H(this.g) == 4;
              if (!this.h.i) {
                if (typeof TextDecoder === "undefined") {
                  I(this);
                  pc(this);
                  var h = "";
                  break b;
                }
                this.h.i = new l.TextDecoder;
              }
              for (b = 0;b < e; b++)
                this.h.h = true, a += this.h.i.decode(d[b], { stream: f && b == e - 1 });
              d.splice(0, e);
              this.h.g += a;
              this.C = 0;
              h = this.h.g;
            } else
              h = this.g.ja();
          this.i = c == 200;
          Ib(this.j, this.u, this.A, this.m, this.W, u, c);
          if (this.i) {
            if (this.aa && !this.K) {
              b: {
                if (this.g) {
                  var n, t = this.g;
                  if ((n = t.g ? t.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !x(n)) {
                    var m = n;
                    break b;
                  }
                }
                m = null;
              }
              if (c = m)
                D(this.j, this.m, c, "Initial handshake response via X-HTTP-Initial-Response"), this.K = true, qc(this, c);
              else {
                this.i = false;
                this.o = 3;
                F(12);
                I(this);
                pc(this);
                break a;
              }
            }
            this.S ? (rc(this, u, h), va && this.i && u == 3 && (Db(this.U, this.V, "tick", this.mb), this.V.start())) : (D(this.j, this.m, h, null), qc(this, h));
            u == 4 && I(this);
            this.i && !this.J && (u == 4 ? sc(this.l, this) : (this.i = false, jc(this)));
          } else
            tc(this.g), c == 400 && 0 < h.indexOf("Unknown SID") ? (this.o = 3, F(12)) : (this.o = 0, F(13)), I(this), pc(this);
        }
      }
  } catch (u) {
  } finally {
  }
};
k.mb = function() {
  if (this.g) {
    var a = H(this.g), b = this.g.ja();
    this.C < b.length && (nc(this), rc(this, a, b), this.i && a != 4 && jc(this));
  }
};
k.cancel = function() {
  this.J = true;
  I(this);
};
k.lb = function() {
  this.B = null;
  const a = Date.now();
  0 <= a - this.Y ? (Kb(this.j, this.A), this.L != 2 && (Ob(), F(17)), I(this), this.o = 2, pc(this)) : wc(this, this.Y - a);
};
var Lc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
M.prototype.toString = function() {
  var a = [], b = this.j;
  b && a.push(Sc(b, Tc, true), ":");
  var c = this.g;
  if (c || b == "file")
    a.push("//"), (b = this.s) && a.push(Sc(b, Tc, true), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.m, c != null && a.push(":", String(c));
  if (c = this.l)
    this.g && c.charAt(0) != "/" && a.push("/"), a.push(Sc(c, c.charAt(0) == "/" ? Uc : Vc, true));
  (c = this.i.toString()) && a.push("?", c);
  (c = this.o) && a.push("#", Sc(c, Wc));
  return a.join("");
};
var Tc = /[#\/\?@]/g;
var Vc = /[#\?:]/g;
var Uc = /[#\?]/g;
var Yc = /[#\?@]/g;
var Wc = /#/g;
k = Pc.prototype;
k.add = function(a, b) {
  N(this);
  this.i = null;
  a = O(this, a);
  var c = this.g.get(a);
  c || this.g.set(a, c = []);
  c.push(b);
  this.h += 1;
  return this;
};
k.forEach = function(a, b) {
  N(this);
  this.g.forEach(function(c, d) {
    c.forEach(function(e) {
      a.call(b, e, d, this);
    }, this);
  }, this);
};
k.ta = function() {
  N(this);
  const a = Array.from(this.g.values()), b = Array.from(this.g.keys()), c = [];
  for (let d = 0;d < b.length; d++) {
    const e = a[d];
    for (let f = 0;f < e.length; f++)
      c.push(b[d]);
  }
  return c;
};
k.Z = function(a) {
  N(this);
  let b = [];
  if (typeof a === "string")
    ad(this, a) && (b = b.concat(this.g.get(O(this, a))));
  else {
    a = Array.from(this.g.values());
    for (let c = 0;c < a.length; c++)
      b = b.concat(a[c]);
  }
  return b;
};
k.set = function(a, b) {
  N(this);
  this.i = null;
  a = O(this, a);
  ad(this, a) && (this.h -= this.g.get(a).length);
  this.g.set(a, [b]);
  this.h += 1;
  return this;
};
k.get = function(a, b) {
  if (!a)
    return b;
  a = this.Z(a);
  return 0 < a.length ? String(a[0]) : b;
};
k.toString = function() {
  if (this.i)
    return this.i;
  if (!this.g)
    return "";
  const a = [], b = Array.from(this.g.keys());
  for (var c = 0;c < b.length; c++) {
    var d = b[c];
    const f = encodeURIComponent(String(d)), h = this.Z(d);
    for (d = 0;d < h.length; d++) {
      var e = f;
      h[d] !== "" && (e += "=" + encodeURIComponent(String(h[d])));
      a.push(e);
    }
  }
  return this.i = a.join("&");
};
var bd = class {
  constructor(a, b) {
    this.g = a;
    this.map = b;
  }
};
var dd = 10;
cd.prototype.cancel = function() {
  this.i = fd(this);
  if (this.h)
    this.h.cancel(), this.h = null;
  else if (this.g && this.g.size !== 0) {
    for (const a of this.g.values())
      a.cancel();
    this.g.clear();
  }
};
var gd = class {
  stringify(a) {
    return l.JSON.stringify(a, undefined);
  }
  parse(a) {
    return l.JSON.parse(a, undefined);
  }
};
r(ld, Ub);
ld.prototype.g = function() {
  return new md(this.l, this.j);
};
ld.prototype.i = function(a) {
  return function() {
    return a;
  };
}({});
r(md, B);
var nd = 0;
k = md.prototype;
k.open = function(a, b) {
  if (this.readyState != nd)
    throw this.abort(), Error("Error reopening a connection");
  this.C = a;
  this.B = b;
  this.readyState = 1;
  od(this);
};
k.send = function(a) {
  if (this.readyState != 1)
    throw this.abort(), Error("need to call open() first. ");
  this.g = true;
  const b = { headers: this.v, method: this.C, credentials: this.m, cache: undefined };
  a && (b.body = a);
  (this.F || l).fetch(new Request(this.B, b)).then(this.$a.bind(this), this.ka.bind(this));
};
k.abort = function() {
  this.response = this.responseText = "";
  this.v = new Headers;
  this.status = 0;
  this.j && this.j.cancel("Request was aborted.").catch(() => {
  });
  1 <= this.readyState && this.g && this.readyState != 4 && (this.g = false, pd(this));
  this.readyState = nd;
};
k.$a = function(a) {
  if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, od(this)), this.g && (this.readyState = 3, od(this), this.g)))
    if (this.responseType === "arraybuffer")
      a.arrayBuffer().then(this.Ya.bind(this), this.ka.bind(this));
    else if (typeof l.ReadableStream !== "undefined" && ("body" in a)) {
      this.j = a.body.getReader();
      if (this.u) {
        if (this.responseType)
          throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        this.response = [];
      } else
        this.response = this.responseText = "", this.A = new TextDecoder;
      qd(this);
    } else
      a.text().then(this.Za.bind(this), this.ka.bind(this));
};
k.Xa = function(a) {
  if (this.g) {
    if (this.u && a.value)
      this.response.push(a.value);
    else if (!this.u) {
      var b = a.value ? a.value : new Uint8Array(0);
      if (b = this.A.decode(b, { stream: !a.done }))
        this.response = this.responseText += b;
    }
    a.done ? pd(this) : od(this);
    this.readyState == 3 && qd(this);
  }
};
k.Za = function(a) {
  this.g && (this.response = this.responseText = a, pd(this));
};
k.Ya = function(a) {
  this.g && (this.response = a, pd(this));
};
k.ka = function() {
  this.g && pd(this);
};
k.setRequestHeader = function(a, b) {
  this.v.append(a, b);
};
k.getResponseHeader = function(a) {
  return this.h ? this.h.get(a.toLowerCase()) || "" : "";
};
k.getAllResponseHeaders = function() {
  if (!this.h)
    return "";
  const a = [], b = this.h.entries();
  for (var c = b.next();!c.done; )
    c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
  return a.join("\r\n");
};
Object.defineProperty(md.prototype, "withCredentials", { get: function() {
  return this.m === "include";
}, set: function(a) {
  this.m = a ? "include" : "same-origin";
} });
var rd = l.JSON.parse;
r(P, B);
var sd = "";
var td = /^https?$/i;
var ud = ["POST", "PUT"];
k = P.prototype;
k.Oa = function(a) {
  this.M = a;
};
k.ha = function(a, b, c, d) {
  if (this.g)
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.I + "; newUri=" + a);
  b = b ? b.toUpperCase() : "GET";
  this.I = a;
  this.j = "";
  this.m = 0;
  this.F = false;
  this.h = true;
  this.g = this.u ? this.u.g() : $b.g();
  this.C = this.u ? Vb(this.u) : Vb($b);
  this.g.onreadystatechange = q(this.La, this);
  try {
    this.G = true, this.g.open(b, String(a), true), this.G = false;
  } catch (f) {
    vd(this, f);
    return;
  }
  a = c || "";
  c = new Map(this.headers);
  if (d)
    if (Object.getPrototypeOf(d) === Object.prototype)
      for (var e in d)
        c.set(e, d[e]);
    else if (typeof d.keys === "function" && typeof d.get === "function")
      for (const f of d.keys())
        c.set(f, d.get(f));
    else
      throw Error("Unknown input type for opt_headers: " + String(d));
  d = Array.from(c.keys()).find((f) => f.toLowerCase() == "content-type");
  e = l.FormData && a instanceof l.FormData;
  !(0 <= ka(ud, b)) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  for (const [f, h] of c)
    this.g.setRequestHeader(f, h);
  this.K && (this.g.responseType = this.K);
  ("withCredentials" in this.g) && this.g.withCredentials !== this.M && (this.g.withCredentials = this.M);
  try {
    wd(this), 0 < this.B && ((this.L = xd(this.g)) ? (this.g.timeout = this.B, this.g.ontimeout = q(this.ua, this)) : this.A = yb(this.ua, this.B, this)), this.v = true, this.g.send(a), this.v = false;
  } catch (f) {
    vd(this, f);
  }
};
k.ua = function() {
  typeof goog != "undefined" && this.g && (this.j = "Timed out after " + this.B + "ms, aborting", this.m = 8, C(this, "timeout"), this.abort(8));
};
k.abort = function(a) {
  this.g && this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false, this.m = a || 7, C(this, "complete"), C(this, "abort"), zd(this));
};
k.N = function() {
  this.g && (this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false), zd(this, true));
  P.$.N.call(this);
};
k.La = function() {
  this.s || (this.G || this.v || this.l ? Ad(this) : this.kb());
};
k.kb = function() {
  Ad(this);
};
k.isActive = function() {
  return !!this.g;
};
k.da = function() {
  try {
    return 2 < H(this) ? this.g.status : -1;
  } catch (a) {
    return -1;
  }
};
k.ja = function() {
  try {
    return this.g ? this.g.responseText : "";
  } catch (a) {
    return "";
  }
};
k.Wa = function(a) {
  if (this.g) {
    var b = this.g.responseText;
    a && b.indexOf(a) == 0 && (b = b.substring(a.length));
    return rd(b);
  }
};
k.Ia = function() {
  return this.m;
};
k.Sa = function() {
  return typeof this.j === "string" ? this.j : String(this.j);
};
k = Ed.prototype;
k.ra = 8;
k.H = 1;
k.Na = function(a) {
  if (this.m)
    if (this.m = null, this.H == 1) {
      if (!a) {
        this.W = Math.floor(1e5 * Math.random());
        a = this.W++;
        const e = new bc(this, this.l, a);
        let f = this.s;
        this.U && (f ? (f = Pa(f), Ra(f, this.U)) : f = this.U);
        this.o !== null || this.O || (e.I = f, f = null);
        if (this.P)
          a: {
            var b = 0;
            for (var c = 0;c < this.j.length; c++) {
              b: {
                var d = this.j[c];
                if (("__data__" in d.map) && (d = d.map.__data__, typeof d === "string")) {
                  d = d.length;
                  break b;
                }
                d = undefined;
              }
              if (d === undefined)
                break;
              b += d;
              if (4096 < b) {
                b = c;
                break a;
              }
              if (b === 4096 || c === this.j.length - 1) {
                b = c + 1;
                break a;
              }
            }
            b = 1000;
          }
        else
          b = 1000;
        b = Kd(this, e, b);
        c = G(this.I);
        K(c, "RID", a);
        K(c, "CVER", 22);
        this.F && K(c, "X-HTTP-Session-Id", this.F);
        Gd(this, c);
        f && (this.O ? b = "headers=" + encodeURIComponent(String(Bd(f))) + "&" + b : this.o && Cd(c, this.o, f));
        Cc(this.i, e);
        this.bb && K(c, "TYPE", "init");
        this.P ? (K(c, "$req", b), K(c, "SID", "null"), e.aa = true, gc(e, c, null)) : gc(e, c, b);
        this.H = 2;
      }
    } else
      this.H == 3 && (a ? Ld(this, a) : this.j.length == 0 || ed(this.i) || Ld(this));
};
k.Ma = function() {
  this.u = null;
  Md(this);
  if (this.ca && !(this.M || this.g == null || 0 >= this.S)) {
    var a = 2 * this.S;
    this.l.info("BP detection timer enabled: " + a);
    this.B = Rb(q(this.jb, this), a);
  }
};
k.jb = function() {
  this.B && (this.B = null, this.l.info("BP detection timeout reached."), this.l.info("Buffering proxy detected and switch to long-polling!"), this.G = false, this.M = true, F(10), zc(this), Md(this));
};
k.ib = function() {
  this.v != null && (this.v = null, zc(this), Ac(this), F(19));
};
k.pb = function(a) {
  a ? (this.l.info("Successfully pinged google.com"), F(2)) : (this.l.info("Failed to ping google.com"), F(1));
};
k.isActive = function() {
  return !!this.h && this.h.isActive(this);
};
k = Nd.prototype;
k.Ba = function() {
};
k.Aa = function() {
};
k.za = function() {
};
k.ya = function() {
};
k.isActive = function() {
  return true;
};
k.Va = function() {
};
Od.prototype.g = function(a, b) {
  return new Q(a, b);
};
r(Q, B);
Q.prototype.m = function() {
  this.g.h = this.j;
  this.A && (this.g.J = true);
  var a = this.g, b = this.l, c = this.h || undefined;
  F(0);
  a.Y = b;
  a.na = c || {};
  a.G = a.aa;
  a.I = Dc(a, null, a.Y);
  Gc(a);
};
Q.prototype.close = function() {
  Hc(this.g);
};
Q.prototype.u = function(a) {
  var b = this.g;
  if (typeof a === "string") {
    var c = {};
    c.__data__ = a;
    a = c;
  } else
    this.v && (c = {}, c.__data__ = jb(a), a = c);
  b.j.push(new bd(b.fb++, a));
  b.H == 3 && Gc(b);
};
Q.prototype.N = function() {
  this.g.h = null;
  delete this.j;
  Hc(this.g);
  delete this.g;
  Q.$.N.call(this);
};
r(Pd, Yb);
r(Qd, Zb);
r(R, Nd);
R.prototype.Ba = function() {
  C(this.g, "a");
};
R.prototype.Aa = function(a) {
  C(this.g, new Pd(a));
};
R.prototype.za = function(a) {
  C(this.g, new Qd);
};
R.prototype.ya = function() {
  C(this.g, "b");
};
r(S, Rd);
S.prototype.reset = function() {
  this.g[0] = 1732584193;
  this.g[1] = 4023233417;
  this.g[2] = 2562383102;
  this.g[3] = 271733878;
  this.i = this.h = 0;
};
S.prototype.j = function(a, b) {
  b === undefined && (b = a.length);
  for (var c = b - this.blockSize, d = this.m, e = this.h, f = 0;f < b; ) {
    if (e == 0)
      for (;f <= c; )
        Sd(this, a, f), f += this.blockSize;
    if (typeof a === "string")
      for (;f < b; ) {
        if (d[e++] = a.charCodeAt(f++), e == this.blockSize) {
          Sd(this, d);
          e = 0;
          break;
        }
      }
    else
      for (;f < b; )
        if (d[e++] = a[f++], e == this.blockSize) {
          Sd(this, d);
          e = 0;
          break;
        }
  }
  this.h = e;
  this.i += b;
};
S.prototype.l = function() {
  var a = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
  a[0] = 128;
  for (var b = 1;b < a.length - 8; ++b)
    a[b] = 0;
  var c = 8 * this.i;
  for (b = a.length - 8;b < a.length; ++b)
    a[b] = c & 255, c /= 256;
  this.j(a);
  a = Array(16);
  for (b = c = 0;4 > b; ++b)
    for (var d = 0;32 > d; d += 8)
      a[c++] = this.g[b] >>> d & 255;
  return a;
};
var sa = {};
var Ud = 4294967296;
var V = Td(0);
var Wd = Td(1);
var Xd = Td(16777216);
k = T.prototype;
k.ea = function() {
  if (X(this))
    return -W(this).ea();
  for (var a = 0, b = 1, c = 0;c < this.g.length; c++) {
    var d = this.D(c);
    a += (0 <= d ? d : Ud + d) * b;
    b *= Ud;
  }
  return a;
};
k.toString = function(a) {
  a = a || 10;
  if (2 > a || 36 < a)
    throw Error("radix out of range: " + a);
  if (Y(this))
    return "0";
  if (X(this))
    return "-" + W(this).toString(a);
  for (var b = U(Math.pow(a, 6)), c = this, d = "";; ) {
    var e = Yd(c, b).g;
    c = Zd(c, e.R(b));
    var f = ((0 < c.g.length ? c.g[0] : c.h) >>> 0).toString(a);
    c = e;
    if (Y(c))
      return f + d;
    for (;6 > f.length; )
      f = "0" + f;
    d = f + d;
  }
};
k.D = function(a) {
  return 0 > a ? 0 : a < this.g.length ? this.g[a] : this.h;
};
k.X = function(a) {
  a = Zd(this, a);
  return X(a) ? -1 : Y(a) ? 0 : 1;
};
k.abs = function() {
  return X(this) ? W(this) : this;
};
k.add = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0, e = 0;e <= b; e++) {
    var f = d + (this.D(e) & 65535) + (a.D(e) & 65535), h = (f >>> 16) + (this.D(e) >>> 16) + (a.D(e) >>> 16);
    d = h >>> 16;
    f &= 65535;
    h &= 65535;
    c[e] = h << 16 | f;
  }
  return new T(c, c[c.length - 1] & -2147483648 ? -1 : 0);
};
k.R = function(a) {
  if (Y(this) || Y(a))
    return V;
  if (X(this))
    return X(a) ? W(this).R(W(a)) : W(W(this).R(a));
  if (X(a))
    return W(this.R(W(a)));
  if (0 > this.X(Xd) && 0 > a.X(Xd))
    return U(this.ea() * a.ea());
  for (var b = this.g.length + a.g.length, c = [], d = 0;d < 2 * b; d++)
    c[d] = 0;
  for (d = 0;d < this.g.length; d++)
    for (var e = 0;e < a.g.length; e++) {
      var f = this.D(d) >>> 16, h = this.D(d) & 65535, n = a.D(e) >>> 16, t = a.D(e) & 65535;
      c[2 * d + 2 * e] += h * t;
      $d(c, 2 * d + 2 * e);
      c[2 * d + 2 * e + 1] += f * t;
      $d(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 1] += h * n;
      $d(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 2] += f * n;
      $d(c, 2 * d + 2 * e + 2);
    }
  for (d = 0;d < b; d++)
    c[d] = c[2 * d + 1] << 16 | c[2 * d];
  for (d = b;d < 2 * b; d++)
    c[d] = 0;
  return new T(c, 0);
};
k.gb = function(a) {
  return Yd(this, a).h;
};
k.and = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0;d < b; d++)
    c[d] = this.D(d) & a.D(d);
  return new T(c, this.h & a.h);
};
k.or = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0;d < b; d++)
    c[d] = this.D(d) | a.D(d);
  return new T(c, this.h | a.h);
};
k.xor = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0;d < b; d++)
    c[d] = this.D(d) ^ a.D(d);
  return new T(c, this.h ^ a.h);
};
Od.prototype.createWebChannel = Od.prototype.g;
Q.prototype.send = Q.prototype.u;
Q.prototype.open = Q.prototype.m;
Q.prototype.close = Q.prototype.close;
Sb.NO_ERROR = 0;
Sb.TIMEOUT = 8;
Sb.HTTP_ERROR = 6;
Tb.COMPLETE = "complete";
Wb.EventType = Xb;
Xb.OPEN = "a";
Xb.CLOSE = "b";
Xb.ERROR = "c";
Xb.MESSAGE = "d";
B.prototype.listen = B.prototype.O;
P.prototype.listenOnce = P.prototype.P;
P.prototype.getLastError = P.prototype.Sa;
P.prototype.getLastErrorCode = P.prototype.Ia;
P.prototype.getStatus = P.prototype.da;
P.prototype.getResponseJson = P.prototype.Wa;
P.prototype.getResponseText = P.prototype.ja;
P.prototype.send = P.prototype.ha;
P.prototype.setWithCredentials = P.prototype.Oa;
S.prototype.digest = S.prototype.l;
S.prototype.reset = S.prototype.reset;
S.prototype.update = S.prototype.j;
T.prototype.add = T.prototype.add;
T.prototype.multiply = T.prototype.R;
T.prototype.modulo = T.prototype.gb;
T.prototype.compare = T.prototype.X;
T.prototype.toNumber = T.prototype.ea;
T.prototype.toString = T.prototype.toString;
T.prototype.getBits = T.prototype.D;
T.fromNumber = U;
T.fromString = Vd;
var createWebChannelTransport = esm.createWebChannelTransport = function() {
  return new Od;
};
var getStatEventTarget = esm.getStatEventTarget = function() {
  return Mb();
};
var ErrorCode = esm.ErrorCode = Sb;
var EventType = esm.EventType = Tb;
var Event = esm.Event = E;
var Stat = esm.Stat = { xb: 0, Ab: 1, Bb: 2, Ub: 3, Zb: 4, Wb: 5, Xb: 6, Vb: 7, Tb: 8, Yb: 9, PROXY: 10, NOPROXY: 11, Rb: 12, Nb: 13, Ob: 14, Mb: 15, Pb: 16, Qb: 17, tb: 18, sb: 19, ub: 20 };
var FetchXmlHttpFactory = esm.FetchXmlHttpFactory = ld;
var WebChannel = esm.WebChannel = Wb;
var XhrIo = esm.XhrIo = P;
var Md5 = esm.Md5 = S;
var Integer = esm.Integer = T;

// node_modules/@firebase/firestore/dist/index.esm2017.js
var C2 = function() {
  return D2.logLevel;
};
var N2 = function(t, ...e) {
  if (D2.logLevel <= LogLevel.DEBUG) {
    const n = e.map($);
    D2.debug(`Firestore (${S2}): ${t}`, ...n);
  }
};
var k2 = function(t, ...e) {
  if (D2.logLevel <= LogLevel.ERROR) {
    const n = e.map($);
    D2.error(`Firestore (${S2}): ${t}`, ...n);
  }
};
var M2 = function(t, ...e) {
  if (D2.logLevel <= LogLevel.WARN) {
    const n = e.map($);
    D2.warn(`Firestore (${S2}): ${t}`, ...n);
  }
};
var $ = function(t) {
  if (typeof t == "string")
    return t;
  try {
    return e = t, JSON.stringify(e);
  } catch (e2) {
    return t;
  }
  var e;
};
var O2 = function(t = "Unexpected state") {
  const e = `FIRESTORE (${S2}) INTERNAL ASSERTION FAILED: ` + t;
  throw k2(e), new Error(e);
};
var F2 = function(t, e) {
  t || O2();
};
var L = function(t, e) {
  return t;
};
var Z2 = function(t) {
  const e = typeof self != "undefined" && (self.crypto || self.msCrypto), n = new Uint8Array(t);
  if (e && typeof e.getRandomValues == "function")
    e.getRandomValues(n);
  else
    for (let e2 = 0;e2 < t; e2++)
      n[e2] = Math.floor(256 * Math.random());
  return n;
};
var et = function(t, e) {
  return t < e ? -1 : t > e ? 1 : 0;
};
var nt = function(t, e, n) {
  return t.length === e.length && t.every((t2, s) => n(t2, e[s]));
};
var yt = function(t, e) {
  const n = t.toTimestamp().seconds, s = t.toTimestamp().nanoseconds + 1, i = rt.fromTimestamp(s === 1e9 ? new it(n + 1, 0) : new it(n, s));
  return new It(i, ht.empty(), e);
};
var pt = function(t) {
  return new It(t.readTime, t.key, -1);
};
var Tt = function(t, e) {
  let n = t.readTime.compareTo(e.readTime);
  return n !== 0 ? n : (n = ht.comparator(t.documentKey, e.documentKey), n !== 0 ? n : et(t.largestBatchId, e.largestBatchId));
};
async function vt(t) {
  if (t.code !== q2.FAILED_PRECONDITION || t.message !== Et)
    throw t;
  N2("LocalStore", "Unexpectedly lost primary lease");
}
var Dt = function(t) {
  return t.name === "IndexedDbTransactionError";
};
var Ft = function(t) {
  return t == null;
};
var Bt = function(t) {
  return t === 0 && 1 / t == -1 / 0;
};
var Lt = function(t) {
  return typeof t == "number" && Number.isInteger(t) && !Bt(t) && t <= Number.MAX_SAFE_INTEGER && t >= Number.MIN_SAFE_INTEGER;
};
var me = function(t) {
  let e = 0;
  for (const n in t)
    Object.prototype.hasOwnProperty.call(t, n) && e++;
  return e;
};
var ge = function(t, e) {
  for (const n in t)
    Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
};
var ye = function(t) {
  for (const e in t)
    if (Object.prototype.hasOwnProperty.call(t, e))
      return false;
  return true;
};
var De = function(t) {
  if (F2(!!t), typeof t == "string") {
    let e = 0;
    const n = Se.exec(t);
    if (F2(!!n), n[1]) {
      let t2 = n[1];
      t2 = (t2 + "000000000").substr(0, 9), e = Number(t2);
    }
    const s = new Date(t);
    return {
      seconds: Math.floor(s.getTime() / 1000),
      nanos: e
    };
  }
  return {
    seconds: Ce(t.seconds),
    nanos: Ce(t.nanos)
  };
};
var Ce = function(t) {
  return typeof t == "number" ? t : typeof t == "string" ? Number(t) : 0;
};
var xe = function(t) {
  return typeof t == "string" ? Ve.fromBase64String(t) : Ve.fromUint8Array(t);
};
var Ne = function(t) {
  var e, n;
  return ((n = (((e = t == null ? undefined : t.mapValue) === null || e === undefined ? undefined : e.fields) || {}).__type__) === null || n === undefined ? undefined : n.stringValue) === "server_timestamp";
};
var ke = function(t) {
  const e = t.mapValue.fields.__previous_value__;
  return Ne(e) ? ke(e) : e;
};
var Me = function(t) {
  const e = De(t.mapValue.fields.__local_write_time__.timestampValue);
  return new it(e.seconds, e.nanos);
};
var Le = function(t) {
  return "nullValue" in t ? 0 : ("booleanValue" in t) ? 1 : ("integerValue" in t) || ("doubleValue" in t) ? 2 : ("timestampValue" in t) ? 3 : ("stringValue" in t) ? 5 : ("bytesValue" in t) ? 6 : ("referenceValue" in t) ? 7 : ("geoPointValue" in t) ? 8 : ("arrayValue" in t) ? 9 : ("mapValue" in t) ? Ne(t) ? 4 : en(t) ? 9007199254740991 : 10 : O2();
};
var qe = function(t, e) {
  if (t === e)
    return true;
  const n = Le(t);
  if (n !== Le(e))
    return false;
  switch (n) {
    case 0:
    case 9007199254740991:
      return true;
    case 1:
      return t.booleanValue === e.booleanValue;
    case 4:
      return Me(t).isEqual(Me(e));
    case 3:
      return function(t2, e2) {
        if (typeof t2.timestampValue == "string" && typeof e2.timestampValue == "string" && t2.timestampValue.length === e2.timestampValue.length)
          return t2.timestampValue === e2.timestampValue;
        const n2 = De(t2.timestampValue), s = De(e2.timestampValue);
        return n2.seconds === s.seconds && n2.nanos === s.nanos;
      }(t, e);
    case 5:
      return t.stringValue === e.stringValue;
    case 6:
      return function(t2, e2) {
        return xe(t2.bytesValue).isEqual(xe(e2.bytesValue));
      }(t, e);
    case 7:
      return t.referenceValue === e.referenceValue;
    case 8:
      return function(t2, e2) {
        return Ce(t2.geoPointValue.latitude) === Ce(e2.geoPointValue.latitude) && Ce(t2.geoPointValue.longitude) === Ce(e2.geoPointValue.longitude);
      }(t, e);
    case 2:
      return function(t2, e2) {
        if (("integerValue" in t2) && ("integerValue" in e2))
          return Ce(t2.integerValue) === Ce(e2.integerValue);
        if (("doubleValue" in t2) && ("doubleValue" in e2)) {
          const n2 = Ce(t2.doubleValue), s = Ce(e2.doubleValue);
          return n2 === s ? Bt(n2) === Bt(s) : isNaN(n2) && isNaN(s);
        }
        return false;
      }(t, e);
    case 9:
      return nt(t.arrayValue.values || [], e.arrayValue.values || [], qe);
    case 10:
      return function(t2, e2) {
        const n2 = t2.mapValue.fields || {}, s = e2.mapValue.fields || {};
        if (me(n2) !== me(s))
          return false;
        for (const t3 in n2)
          if (n2.hasOwnProperty(t3) && (s[t3] === undefined || !qe(n2[t3], s[t3])))
            return false;
        return true;
      }(t, e);
    default:
      return O2();
  }
};
var Ue = function(t, e) {
  return (t.values || []).find((t2) => qe(t2, e)) !== undefined;
};
var Ke = function(t, e) {
  if (t === e)
    return 0;
  const n = Le(t), s = Le(e);
  if (n !== s)
    return et(n, s);
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return et(t.booleanValue, e.booleanValue);
    case 2:
      return function(t2, e2) {
        const n2 = Ce(t2.integerValue || t2.doubleValue), s2 = Ce(e2.integerValue || e2.doubleValue);
        return n2 < s2 ? -1 : n2 > s2 ? 1 : n2 === s2 ? 0 : isNaN(n2) ? isNaN(s2) ? 0 : -1 : 1;
      }(t, e);
    case 3:
      return Ge(t.timestampValue, e.timestampValue);
    case 4:
      return Ge(Me(t), Me(e));
    case 5:
      return et(t.stringValue, e.stringValue);
    case 6:
      return function(t2, e2) {
        const n2 = xe(t2), s2 = xe(e2);
        return n2.compareTo(s2);
      }(t.bytesValue, e.bytesValue);
    case 7:
      return function(t2, e2) {
        const n2 = t2.split("/"), s2 = e2.split("/");
        for (let t3 = 0;t3 < n2.length && t3 < s2.length; t3++) {
          const e3 = et(n2[t3], s2[t3]);
          if (e3 !== 0)
            return e3;
        }
        return et(n2.length, s2.length);
      }(t.referenceValue, e.referenceValue);
    case 8:
      return function(t2, e2) {
        const n2 = et(Ce(t2.latitude), Ce(e2.latitude));
        if (n2 !== 0)
          return n2;
        return et(Ce(t2.longitude), Ce(e2.longitude));
      }(t.geoPointValue, e.geoPointValue);
    case 9:
      return function(t2, e2) {
        const n2 = t2.values || [], s2 = e2.values || [];
        for (let t3 = 0;t3 < n2.length && t3 < s2.length; ++t3) {
          const e3 = Ke(n2[t3], s2[t3]);
          if (e3)
            return e3;
        }
        return et(n2.length, s2.length);
      }(t.arrayValue, e.arrayValue);
    case 10:
      return function(t2, e2) {
        if (t2 === Fe.mapValue && e2 === Fe.mapValue)
          return 0;
        if (t2 === Fe.mapValue)
          return 1;
        if (e2 === Fe.mapValue)
          return -1;
        const n2 = t2.fields || {}, s2 = Object.keys(n2), i = e2.fields || {}, r2 = Object.keys(i);
        s2.sort(), r2.sort();
        for (let t3 = 0;t3 < s2.length && t3 < r2.length; ++t3) {
          const e3 = et(s2[t3], r2[t3]);
          if (e3 !== 0)
            return e3;
          const o = Ke(n2[s2[t3]], i[r2[t3]]);
          if (o !== 0)
            return o;
        }
        return et(s2.length, r2.length);
      }(t.mapValue, e.mapValue);
    default:
      throw O2();
  }
};
var Ge = function(t, e) {
  if (typeof t == "string" && typeof e == "string" && t.length === e.length)
    return et(t, e);
  const n = De(t), s = De(e), i = et(n.seconds, s.seconds);
  return i !== 0 ? i : et(n.nanos, s.nanos);
};
var Qe = function(t) {
  return je(t);
};
var je = function(t) {
  return "nullValue" in t ? "null" : ("booleanValue" in t) ? "" + t.booleanValue : ("integerValue" in t) ? "" + t.integerValue : ("doubleValue" in t) ? "" + t.doubleValue : ("timestampValue" in t) ? function(t2) {
    const e2 = De(t2);
    return `time(${e2.seconds},${e2.nanos})`;
  }(t.timestampValue) : ("stringValue" in t) ? t.stringValue : ("bytesValue" in t) ? xe(t.bytesValue).toBase64() : ("referenceValue" in t) ? (n = t.referenceValue, ht.fromName(n).toString()) : ("geoPointValue" in t) ? `geo(${(e = t.geoPointValue).latitude},${e.longitude})` : ("arrayValue" in t) ? function(t2) {
    let e2 = "[", n2 = true;
    for (const s of t2.values || [])
      n2 ? n2 = false : e2 += ",", e2 += je(s);
    return e2 + "]";
  }(t.arrayValue) : ("mapValue" in t) ? function(t2) {
    const e2 = Object.keys(t2.fields || {}).sort();
    let n2 = "{", s = true;
    for (const i of e2)
      s ? s = false : n2 += ",", n2 += `${i}:${je(t2.fields[i])}`;
    return n2 + "}";
  }(t.mapValue) : O2();
  var e, n;
};
var We = function(t, e) {
  return {
    referenceValue: `projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`
  };
};
var He = function(t) {
  return !!t && ("integerValue" in t);
};
var Je = function(t) {
  return !!t && ("arrayValue" in t);
};
var Ye = function(t) {
  return !!t && ("nullValue" in t);
};
var Xe = function(t) {
  return !!t && ("doubleValue" in t) && isNaN(Number(t.doubleValue));
};
var Ze = function(t) {
  return !!t && ("mapValue" in t);
};
var tn = function(t) {
  if (t.geoPointValue)
    return {
      geoPointValue: Object.assign({}, t.geoPointValue)
    };
  if (t.timestampValue && typeof t.timestampValue == "object")
    return {
      timestampValue: Object.assign({}, t.timestampValue)
    };
  if (t.mapValue) {
    const e = {
      mapValue: {
        fields: {}
      }
    };
    return ge(t.mapValue.fields, (t2, n) => e.mapValue.fields[t2] = tn(n)), e;
  }
  if (t.arrayValue) {
    const e = {
      arrayValue: {
        values: []
      }
    };
    for (let n = 0;n < (t.arrayValue.values || []).length; ++n)
      e.arrayValue.values[n] = tn(t.arrayValue.values[n]);
    return e;
  }
  return Object.assign({}, t);
};
var en = function(t) {
  return (((t.mapValue || {}).fields || {}).__type__ || {}).stringValue === "__max__";
};
var cn = function(t) {
  const e = [];
  return ge(t.fields, (t2, n) => {
    const s = new at([t2]);
    if (Ze(n)) {
      const t3 = cn(n.mapValue).fields;
      if (t3.length === 0)
        e.push(s);
      else
        for (const n2 of t3)
          e.push(s.child(n2));
    } else
      e.push(s);
  }), new Re(e);
};
var ln = function(t, e, n) {
  let s = 0;
  for (let i = 0;i < t.position.length; i++) {
    const r2 = e[i], o = t.position[i];
    if (r2.field.isKeyField())
      s = ht.comparator(ht.fromName(o.referenceValue), n.key);
    else {
      s = Ke(o, n.data.field(r2.field));
    }
    if (r2.dir === "desc" && (s *= -1), s !== 0)
      break;
  }
  return s;
};
var fn = function(t, e) {
  if (t === null)
    return e === null;
  if (e === null)
    return false;
  if (t.inclusive !== e.inclusive || t.position.length !== e.position.length)
    return false;
  for (let n = 0;n < t.position.length; n++) {
    if (!qe(t.position[n], e.position[n]))
      return false;
  }
  return true;
};
var wn = function(t, e) {
  return t.dir === e.dir && t.field.isEqual(e.field);
};
var yn = function(t) {
  return t.op === "and";
};
var In = function(t) {
  return Tn(t) && yn(t);
};
var Tn = function(t) {
  for (const e of t.filters)
    if (e instanceof gn)
      return false;
  return true;
};
var En = function(t) {
  if (t instanceof mn)
    return t.field.canonicalString() + t.op.toString() + Qe(t.value);
  if (In(t))
    return t.filters.map((t2) => En(t2)).join(",");
  {
    const e = t.filters.map((t2) => En(t2)).join(",");
    return `${t.op}(${e})`;
  }
};
var An = function(t, e) {
  return t instanceof mn ? function(t2, e2) {
    return e2 instanceof mn && t2.op === e2.op && t2.field.isEqual(e2.field) && qe(t2.value, e2.value);
  }(t, e) : t instanceof gn ? function(t2, e2) {
    if (e2 instanceof gn && t2.op === e2.op && t2.filters.length === e2.filters.length) {
      return t2.filters.reduce((t3, n, s) => t3 && An(n, e2.filters[s]), true);
    }
    return false;
  }(t, e) : void O2();
};
var Rn = function(t) {
  return t instanceof mn ? function(t2) {
    return `${t2.field.canonicalString()} ${t2.op} ${Qe(t2.value)}`;
  }(t) : t instanceof gn ? function(t2) {
    return t2.op.toString() + " {" + t2.getFilters().map(Rn).join(" ,") + "}";
  }(t) : "Filter";
};
var Sn = function(t, e) {
  var n;
  return (((n = e.arrayValue) === null || n === undefined ? undefined : n.values) || []).map((t2) => ht.fromName(t2.referenceValue));
};
var Mn = function(t, e = null, n = [], s = [], i = null, r2 = null, o = null) {
  return new kn(t, e, n, s, i, r2, o);
};
var $n = function(t) {
  const e = L(t);
  if (e.dt === null) {
    let t2 = e.path.canonicalString();
    e.collectionGroup !== null && (t2 += "|cg:" + e.collectionGroup), t2 += "|f:", t2 += e.filters.map((t3) => En(t3)).join(","), t2 += "|ob:", t2 += e.orderBy.map((t3) => function(t4) {
      return t4.field.canonicalString() + t4.dir;
    }(t3)).join(","), Ft(e.limit) || (t2 += "|l:", t2 += e.limit), e.startAt && (t2 += "|lb:", t2 += e.startAt.inclusive ? "b:" : "a:", t2 += e.startAt.position.map((t3) => Qe(t3)).join(",")), e.endAt && (t2 += "|ub:", t2 += e.endAt.inclusive ? "a:" : "b:", t2 += e.endAt.position.map((t3) => Qe(t3)).join(",")), e.dt = t2;
  }
  return e.dt;
};
var On = function(t, e) {
  if (t.limit !== e.limit)
    return false;
  if (t.orderBy.length !== e.orderBy.length)
    return false;
  for (let n = 0;n < t.orderBy.length; n++)
    if (!wn(t.orderBy[n], e.orderBy[n]))
      return false;
  if (t.filters.length !== e.filters.length)
    return false;
  for (let n = 0;n < t.filters.length; n++)
    if (!An(t.filters[n], e.filters[n]))
      return false;
  return t.collectionGroup === e.collectionGroup && (!!t.path.isEqual(e.path) && (!!fn(t.startAt, e.startAt) && fn(t.endAt, e.endAt)));
};
var Fn = function(t) {
  return ht.isDocumentKey(t.path) && t.collectionGroup === null && t.filters.length === 0;
};
var Kn = function(t, e, n, s, i, r2, o, u) {
  return new Un(t, e, n, s, i, r2, o, u);
};
var Gn = function(t) {
  return new Un(t);
};
var Qn = function(t) {
  return t.filters.length === 0 && t.limit === null && t.startAt == null && t.endAt == null && (t.explicitOrderBy.length === 0 || t.explicitOrderBy.length === 1 && t.explicitOrderBy[0].field.isKeyField());
};
var jn = function(t) {
  return t.explicitOrderBy.length > 0 ? t.explicitOrderBy[0].field : null;
};
var zn = function(t) {
  for (const e of t.filters) {
    const t2 = e.getFirstInequalityField();
    if (t2 !== null)
      return t2;
  }
  return null;
};
var Wn = function(t) {
  return t.collectionGroup !== null;
};
var Hn = function(t) {
  const e = L(t);
  if (e.wt === null) {
    e.wt = [];
    const t2 = zn(e), n = jn(e);
    if (t2 !== null && n === null)
      t2.isKeyField() || e.wt.push(new dn(t2)), e.wt.push(new dn(at.keyField(), "asc"));
    else {
      let t3 = false;
      for (const n2 of e.explicitOrderBy)
        e.wt.push(n2), n2.field.isKeyField() && (t3 = true);
      if (!t3) {
        const t4 = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc";
        e.wt.push(new dn(at.keyField(), t4));
      }
    }
  }
  return e.wt;
};
var Jn = function(t) {
  const e = L(t);
  if (!e._t)
    if (e.limitType === "F")
      e._t = Mn(e.path, e.collectionGroup, Hn(e), e.filters, e.limit, e.startAt, e.endAt);
    else {
      const t2 = [];
      for (const n2 of Hn(e)) {
        const e2 = n2.dir === "desc" ? "asc" : "desc";
        t2.push(new dn(n2.field, e2));
      }
      const n = e.endAt ? new hn(e.endAt.position, e.endAt.inclusive) : null, s = e.startAt ? new hn(e.startAt.position, e.startAt.inclusive) : null;
      e._t = Mn(e.path, e.collectionGroup, t2, e.filters, e.limit, n, s);
    }
  return e._t;
};
var Yn = function(t, e) {
  e.getFirstInequalityField(), zn(t);
  const n = t.filters.concat([e]);
  return new Un(t.path, t.collectionGroup, t.explicitOrderBy.slice(), n, t.limit, t.limitType, t.startAt, t.endAt);
};
var Xn = function(t, e, n) {
  return new Un(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), e, n, t.startAt, t.endAt);
};
var Zn = function(t, e) {
  return On(Jn(t), Jn(e)) && t.limitType === e.limitType;
};
var ts = function(t) {
  return `${$n(Jn(t))}|lt:${t.limitType}`;
};
var es = function(t) {
  return `Query(target=${function(t2) {
    let e = t2.path.canonicalString();
    return t2.collectionGroup !== null && (e += " collectionGroup=" + t2.collectionGroup), t2.filters.length > 0 && (e += `, filters: [${t2.filters.map((t3) => Rn(t3)).join(", ")}]`), Ft(t2.limit) || (e += ", limit: " + t2.limit), t2.orderBy.length > 0 && (e += `, orderBy: [${t2.orderBy.map((t3) => function(t4) {
      return `${t4.field.canonicalString()} (${t4.dir})`;
    }(t3)).join(", ")}]`), t2.startAt && (e += ", startAt: ", e += t2.startAt.inclusive ? "b:" : "a:", e += t2.startAt.position.map((t3) => Qe(t3)).join(",")), t2.endAt && (e += ", endAt: ", e += t2.endAt.inclusive ? "a:" : "b:", e += t2.endAt.position.map((t3) => Qe(t3)).join(",")), `Target(${e})`;
  }(Jn(t))}; limitType=${t.limitType})`;
};
var ns = function(t, e) {
  return e.isFoundDocument() && function(t2, e2) {
    const n = e2.key.path;
    return t2.collectionGroup !== null ? e2.key.hasCollectionId(t2.collectionGroup) && t2.path.isPrefixOf(n) : ht.isDocumentKey(t2.path) ? t2.path.isEqual(n) : t2.path.isImmediateParentOf(n);
  }(t, e) && function(t2, e2) {
    for (const n of Hn(t2))
      if (!n.field.isKeyField() && e2.data.field(n.field) === null)
        return false;
    return true;
  }(t, e) && function(t2, e2) {
    for (const n of t2.filters)
      if (!n.matches(e2))
        return false;
    return true;
  }(t, e) && function(t2, e2) {
    if (t2.startAt && !function(t3, e3, n) {
      const s = ln(t3, e3, n);
      return t3.inclusive ? s <= 0 : s < 0;
    }(t2.startAt, Hn(t2), e2))
      return false;
    if (t2.endAt && !function(t3, e3, n) {
      const s = ln(t3, e3, n);
      return t3.inclusive ? s >= 0 : s > 0;
    }(t2.endAt, Hn(t2), e2))
      return false;
    return true;
  }(t, e);
};
var ss = function(t) {
  return t.collectionGroup || (t.path.length % 2 == 1 ? t.path.lastSegment() : t.path.get(t.path.length - 2));
};
var is = function(t) {
  return (e, n) => {
    let s = false;
    for (const i of Hn(t)) {
      const t2 = rs(i, e, n);
      if (t2 !== 0)
        return t2;
      s = s || i.field.isKeyField();
    }
    return 0;
  };
};
var rs = function(t, e, n) {
  const s = t.field.isKeyField() ? ht.comparator(e.key, n.key) : function(t2, e2, n2) {
    const s2 = e2.data.field(t2), i = n2.data.field(t2);
    return s2 !== null && i !== null ? Ke(s2, i) : O2();
  }(t.field, e, n);
  switch (t.dir) {
    case "asc":
      return s;
    case "desc":
      return -1 * s;
    default:
      return O2();
  }
};
var cs = function() {
  return us;
};
var hs = function(...t) {
  let e = as;
  for (const n of t)
    e = e.insert(n.key, n);
  return e;
};
var ls = function(t) {
  let e = as;
  return t.forEach((t2, n) => e = e.insert(t2, n.overlayedDocument)), e;
};
var fs = function() {
  return ws();
};
var ds = function() {
  return ws();
};
var ws = function() {
  return new os((t) => t.toString(), (t, e) => t.isEqual(e));
};
var gs = function(...t) {
  let e = ms;
  for (const n of t)
    e = e.add(n);
  return e;
};
var ps = function() {
  return ys;
};
var Is = function(t, e) {
  if (t.useProto3Json) {
    if (isNaN(e))
      return {
        doubleValue: "NaN"
      };
    if (e === 1 / 0)
      return {
        doubleValue: "Infinity"
      };
    if (e === -1 / 0)
      return {
        doubleValue: "-Infinity"
      };
  }
  return {
    doubleValue: Bt(e) ? "-0" : e
  };
};
var Ts = function(t) {
  return {
    integerValue: "" + t
  };
};
var Es = function(t, e) {
  return Lt(e) ? Ts(e) : Is(t, e);
};
var vs = function(t, e, n) {
  return t instanceof bs ? function(t2, e2) {
    const n2 = {
      fields: {
        __type__: {
          stringValue: "server_timestamp"
        },
        __local_write_time__: {
          timestampValue: {
            seconds: t2.seconds,
            nanos: t2.nanoseconds
          }
        }
      }
    };
    return e2 && Ne(e2) && (e2 = ke(e2)), e2 && (n2.fields.__previous_value__ = e2), {
      mapValue: n2
    };
  }(n, e) : t instanceof Vs ? Ss(t, e) : t instanceof Ds ? Cs(t, e) : function(t2, e2) {
    const n2 = Ps(t2, e2), s = Ns(n2) + Ns(t2.gt);
    return He(n2) && He(t2.gt) ? Ts(s) : Is(t2.serializer, s);
  }(t, e);
};
var Rs = function(t, e, n) {
  return t instanceof Vs ? Ss(t, e) : t instanceof Ds ? Cs(t, e) : n;
};
var Ps = function(t, e) {
  return t instanceof xs ? He(n = e) || function(t2) {
    return !!t2 && ("doubleValue" in t2);
  }(n) ? e : {
    integerValue: 0
  } : null;
  var n;
};
var Ss = function(t, e) {
  const n = ks(e);
  for (const e2 of t.elements)
    n.some((t2) => qe(t2, e2)) || n.push(e2);
  return {
    arrayValue: {
      values: n
    }
  };
};
var Cs = function(t, e) {
  let n = ks(e);
  for (const e2 of t.elements)
    n = n.filter((t2) => !qe(t2, e2));
  return {
    arrayValue: {
      values: n
    }
  };
};
var Ns = function(t) {
  return Ce(t.integerValue || t.doubleValue);
};
var ks = function(t) {
  return Je(t) && t.arrayValue.values ? t.arrayValue.values.slice() : [];
};
var $s = function(t, e) {
  return t.field.isEqual(e.field) && function(t2, e2) {
    return t2 instanceof Vs && e2 instanceof Vs || t2 instanceof Ds && e2 instanceof Ds ? nt(t2.elements, e2.elements, qe) : t2 instanceof xs && e2 instanceof xs ? qe(t2.gt, e2.gt) : t2 instanceof bs && e2 instanceof bs;
  }(t.transform, e.transform);
};
var Bs = function(t, e) {
  return t.updateTime !== undefined ? e.isFoundDocument() && e.version.isEqual(t.updateTime) : t.exists === undefined || t.exists === e.isFoundDocument();
};
var qs = function(t, e) {
  if (!t.hasLocalMutations || e && e.fields.length === 0)
    return null;
  if (e === null)
    return t.isNoDocument() ? new Ys(t.key, Fs.none()) : new js(t.key, t.data, Fs.none());
  {
    const n = t.data, s = un.empty();
    let i = new Ee(at.comparator);
    for (let t2 of e.fields)
      if (!i.has(t2)) {
        let e2 = n.field(t2);
        e2 === null && t2.length > 1 && (t2 = t2.popLast(), e2 = n.field(t2)), e2 === null ? s.delete(t2) : s.set(t2, e2), i = i.add(t2);
      }
    return new zs(t.key, s, new Re(i.toArray()), Fs.none());
  }
};
var Us = function(t, e, n) {
  t instanceof js ? function(t2, e2, n2) {
    const s = t2.value.clone(), i = Hs(t2.fieldTransforms, e2, n2.transformResults);
    s.setAll(i), e2.convertToFoundDocument(n2.version, s).setHasCommittedMutations();
  }(t, e, n) : t instanceof zs ? function(t2, e2, n2) {
    if (!Bs(t2.precondition, e2))
      return void e2.convertToUnknownDocument(n2.version);
    const s = Hs(t2.fieldTransforms, e2, n2.transformResults), i = e2.data;
    i.setAll(Ws(t2)), i.setAll(s), e2.convertToFoundDocument(n2.version, i).setHasCommittedMutations();
  }(t, e, n) : function(t2, e2, n2) {
    e2.convertToNoDocument(n2.version).setHasCommittedMutations();
  }(0, e, n);
};
var Ks = function(t, e, n, s) {
  return t instanceof js ? function(t2, e2, n2, s2) {
    if (!Bs(t2.precondition, e2))
      return n2;
    const i = t2.value.clone(), r2 = Js(t2.fieldTransforms, s2, e2);
    return i.setAll(r2), e2.convertToFoundDocument(e2.version, i).setHasLocalMutations(), null;
  }(t, e, n, s) : t instanceof zs ? function(t2, e2, n2, s2) {
    if (!Bs(t2.precondition, e2))
      return n2;
    const i = Js(t2.fieldTransforms, s2, e2), r2 = e2.data;
    if (r2.setAll(Ws(t2)), r2.setAll(i), e2.convertToFoundDocument(e2.version, r2).setHasLocalMutations(), n2 === null)
      return null;
    return n2.unionWith(t2.fieldMask.fields).unionWith(t2.fieldTransforms.map((t3) => t3.field));
  }(t, e, n, s) : function(t2, e2, n2) {
    if (Bs(t2.precondition, e2))
      return e2.convertToNoDocument(e2.version).setHasLocalMutations(), null;
    return n2;
  }(t, e, n);
};
var Gs = function(t, e) {
  let n = null;
  for (const s of t.fieldTransforms) {
    const t2 = e.data.field(s.field), i = Ps(s.transform, t2 || null);
    i != null && (n === null && (n = un.empty()), n.set(s.field, i));
  }
  return n || null;
};
var Qs = function(t, e) {
  return t.type === e.type && (!!t.key.isEqual(e.key) && (!!t.precondition.isEqual(e.precondition) && (!!function(t2, e2) {
    return t2 === undefined && e2 === undefined || !(!t2 || !e2) && nt(t2, e2, (t3, e3) => $s(t3, e3));
  }(t.fieldTransforms, e.fieldTransforms) && (t.type === 0 ? t.value.isEqual(e.value) : t.type !== 1 || t.data.isEqual(e.data) && t.fieldMask.isEqual(e.fieldMask)))));
};
var Ws = function(t) {
  const e = new Map;
  return t.fieldMask.fields.forEach((n) => {
    if (!n.isEmpty()) {
      const s = t.data.field(n);
      e.set(n, s);
    }
  }), e;
};
var Hs = function(t, e, n) {
  const s = new Map;
  F2(t.length === n.length);
  for (let i = 0;i < n.length; i++) {
    const r2 = t[i], o = r2.transform, u = e.data.field(r2.field);
    s.set(r2.field, Rs(o, u, n[i]));
  }
  return s;
};
var Js = function(t, e, n) {
  const s = new Map;
  for (const i of t) {
    const t2 = i.transform, r2 = n.data.field(i.field);
    s.set(i.field, vs(t2, r2, e));
  }
  return s;
};
var oi = function(t) {
  switch (t) {
    default:
      return O2();
    case q2.CANCELLED:
    case q2.UNKNOWN:
    case q2.DEADLINE_EXCEEDED:
    case q2.RESOURCE_EXHAUSTED:
    case q2.INTERNAL:
    case q2.UNAVAILABLE:
    case q2.UNAUTHENTICATED:
      return false;
    case q2.INVALID_ARGUMENT:
    case q2.NOT_FOUND:
    case q2.ALREADY_EXISTS:
    case q2.PERMISSION_DENIED:
    case q2.FAILED_PRECONDITION:
    case q2.ABORTED:
    case q2.OUT_OF_RANGE:
    case q2.UNIMPLEMENTED:
    case q2.DATA_LOSS:
      return true;
  }
};
var ui = function(t) {
  if (t === undefined)
    return k2("GRPC error has no .code"), q2.UNKNOWN;
  switch (t) {
    case ii.OK:
      return q2.OK;
    case ii.CANCELLED:
      return q2.CANCELLED;
    case ii.UNKNOWN:
      return q2.UNKNOWN;
    case ii.DEADLINE_EXCEEDED:
      return q2.DEADLINE_EXCEEDED;
    case ii.RESOURCE_EXHAUSTED:
      return q2.RESOURCE_EXHAUSTED;
    case ii.INTERNAL:
      return q2.INTERNAL;
    case ii.UNAVAILABLE:
      return q2.UNAVAILABLE;
    case ii.UNAUTHENTICATED:
      return q2.UNAUTHENTICATED;
    case ii.INVALID_ARGUMENT:
      return q2.INVALID_ARGUMENT;
    case ii.NOT_FOUND:
      return q2.NOT_FOUND;
    case ii.ALREADY_EXISTS:
      return q2.ALREADY_EXISTS;
    case ii.PERMISSION_DENIED:
      return q2.PERMISSION_DENIED;
    case ii.FAILED_PRECONDITION:
      return q2.FAILED_PRECONDITION;
    case ii.ABORTED:
      return q2.ABORTED;
    case ii.OUT_OF_RANGE:
      return q2.OUT_OF_RANGE;
    case ii.UNIMPLEMENTED:
      return q2.UNIMPLEMENTED;
    case ii.DATA_LOSS:
      return q2.DATA_LOSS;
    default:
      return O2();
  }
};
var hi = function() {
  return new TextEncoder;
};
var fi = function(t) {
  const e = hi().encode(t), n = new Md5;
  return n.update(e), new Uint8Array(n.digest());
};
var di = function(t) {
  const e = new DataView(t.buffer), n = e.getUint32(0, true), s = e.getUint32(4, true), i = e.getUint32(8, true), r2 = e.getUint32(12, true);
  return [new Integer([n, s], 0), new Integer([i, r2], 0)];
};
var Ai = function() {
  return new pe(ht.comparator);
};
var vi = function() {
  return new pe(ht.comparator);
};
var Si = function(t, e) {
  return t.useProto3Json || Ft(e) ? e : {
    value: e
  };
};
var Di = function(t, e) {
  if (t.useProto3Json) {
    return `${new Date(1000 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z`;
  }
  return {
    seconds: "" + e.seconds,
    nanos: e.nanoseconds
  };
};
var Ci = function(t, e) {
  return t.useProto3Json ? e.toBase64() : e.toUint8Array();
};
var xi = function(t, e) {
  return Di(t, e.toTimestamp());
};
var Ni = function(t) {
  return F2(!!t), rt.fromTimestamp(function(t2) {
    const e = De(t2);
    return new it(e.seconds, e.nanos);
  }(t));
};
var ki = function(t, e) {
  return function(t2) {
    return new ut(["projects", t2.projectId, "databases", t2.database]);
  }(t).child("documents").child(e).canonicalString();
};
var Mi = function(t) {
  const e = ut.fromString(t);
  return F2(ur(e)), e;
};
var $i = function(t, e) {
  return ki(t.databaseId, e.path);
};
var Oi = function(t, e) {
  const n = Mi(e);
  if (n.get(1) !== t.databaseId.projectId)
    throw new U2(q2.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t.databaseId.projectId);
  if (n.get(3) !== t.databaseId.database)
    throw new U2(q2.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t.databaseId.database);
  return new ht(qi(n));
};
var Fi = function(t, e) {
  return ki(t.databaseId, e);
};
var Bi = function(t) {
  const e = Mi(t);
  return e.length === 4 ? ut.emptyPath() : qi(e);
};
var Li = function(t) {
  return new ut(["projects", t.databaseId.projectId, "databases", t.databaseId.database]).canonicalString();
};
var qi = function(t) {
  return F2(t.length > 4 && t.get(4) === "documents"), t.popFirst(5);
};
var Ui = function(t, e, n) {
  return {
    name: $i(t, e),
    fields: n.value.mapValue.fields
  };
};
var Qi = function(t, e) {
  let n;
  if ("targetChange" in e) {
    e.targetChange;
    const s = function(t2) {
      return t2 === "NO_CHANGE" ? 0 : t2 === "ADD" ? 1 : t2 === "REMOVE" ? 2 : t2 === "CURRENT" ? 3 : t2 === "RESET" ? 4 : O2();
    }(e.targetChange.targetChangeType || "NO_CHANGE"), i = e.targetChange.targetIds || [], r2 = function(t2, e2) {
      return t2.useProto3Json ? (F2(e2 === undefined || typeof e2 == "string"), Ve.fromBase64String(e2 || "")) : (F2(e2 === undefined || e2 instanceof Uint8Array), Ve.fromUint8Array(e2 || new Uint8Array));
    }(t, e.targetChange.resumeToken), o = e.targetChange.cause, u = o && function(t2) {
      const e2 = t2.code === undefined ? q2.UNKNOWN : ui(t2.code);
      return new U2(e2, t2.message || "");
    }(o);
    n = new Ii(s, i, r2, u || null);
  } else if ("documentChange" in e) {
    e.documentChange;
    const s = e.documentChange;
    s.document, s.document.name, s.document.updateTime;
    const i = Oi(t, s.document.name), r2 = Ni(s.document.updateTime), o = s.document.createTime ? Ni(s.document.createTime) : rt.min(), u = new un({
      mapValue: {
        fields: s.document.fields
      }
    }), c = an.newFoundDocument(i, r2, o, u), a = s.targetIds || [], h = s.removedTargetIds || [];
    n = new yi(a, h, c.key, c);
  } else if ("documentDelete" in e) {
    e.documentDelete;
    const s = e.documentDelete;
    s.document;
    const i = Oi(t, s.document), r2 = s.readTime ? Ni(s.readTime) : rt.min(), o = an.newNoDocument(i, r2), u = s.removedTargetIds || [];
    n = new yi([], u, o.key, o);
  } else if ("documentRemove" in e) {
    e.documentRemove;
    const s = e.documentRemove;
    s.document;
    const i = Oi(t, s.document), r2 = s.removedTargetIds || [];
    n = new yi([], r2, i, null);
  } else {
    if (!("filter" in e))
      return O2();
    {
      e.filter;
      const t2 = e.filter;
      t2.targetId;
      const { count: s = 0, unchangedNames: i } = t2, r2 = new si(s, i), o = t2.targetId;
      n = new pi(o, r2);
    }
  }
  return n;
};
var ji = function(t, e) {
  let n;
  if (e instanceof js)
    n = {
      update: Ui(t, e.key, e.value)
    };
  else if (e instanceof Ys)
    n = {
      delete: $i(t, e.key)
    };
  else if (e instanceof zs)
    n = {
      update: Ui(t, e.key, e.data),
      updateMask: or(e.fieldMask)
    };
  else {
    if (!(e instanceof Xs))
      return O2();
    n = {
      verify: $i(t, e.key)
    };
  }
  return e.fieldTransforms.length > 0 && (n.updateTransforms = e.fieldTransforms.map((t2) => function(t3, e2) {
    const n2 = e2.transform;
    if (n2 instanceof bs)
      return {
        fieldPath: e2.field.canonicalString(),
        setToServerValue: "REQUEST_TIME"
      };
    if (n2 instanceof Vs)
      return {
        fieldPath: e2.field.canonicalString(),
        appendMissingElements: {
          values: n2.elements
        }
      };
    if (n2 instanceof Ds)
      return {
        fieldPath: e2.field.canonicalString(),
        removeAllFromArray: {
          values: n2.elements
        }
      };
    if (n2 instanceof xs)
      return {
        fieldPath: e2.field.canonicalString(),
        increment: n2.gt
      };
    throw O2();
  }(0, t2))), e.precondition.isNone || (n.currentDocument = function(t2, e2) {
    return e2.updateTime !== undefined ? {
      updateTime: xi(t2, e2.updateTime)
    } : e2.exists !== undefined ? {
      exists: e2.exists
    } : O2();
  }(t, e.precondition)), n;
};
var Wi = function(t, e) {
  return t && t.length > 0 ? (F2(e !== undefined), t.map((t2) => function(t3, e2) {
    let n = t3.updateTime ? Ni(t3.updateTime) : Ni(e2);
    return n.isEqual(rt.min()) && (n = Ni(e2)), new Os(n, t3.transformResults || []);
  }(t2, e))) : [];
};
var Hi = function(t, e) {
  return {
    documents: [Fi(t, e.path)]
  };
};
var Ji = function(t, e) {
  const n = {
    structuredQuery: {}
  }, s = e.path;
  e.collectionGroup !== null ? (n.parent = Fi(t, s), n.structuredQuery.from = [{
    collectionId: e.collectionGroup,
    allDescendants: true
  }]) : (n.parent = Fi(t, s.popLast()), n.structuredQuery.from = [{
    collectionId: s.lastSegment()
  }]);
  const i = function(t2) {
    if (t2.length === 0)
      return;
    return rr(gn.create(t2, "and"));
  }(e.filters);
  i && (n.structuredQuery.where = i);
  const r2 = function(t2) {
    if (t2.length === 0)
      return;
    return t2.map((t3) => function(t4) {
      return {
        field: sr(t4.field),
        direction: tr(t4.dir)
      };
    }(t3));
  }(e.orderBy);
  r2 && (n.structuredQuery.orderBy = r2);
  const o = Si(t, e.limit);
  var u;
  return o !== null && (n.structuredQuery.limit = o), e.startAt && (n.structuredQuery.startAt = {
    before: (u = e.startAt).inclusive,
    values: u.position
  }), e.endAt && (n.structuredQuery.endAt = function(t2) {
    return {
      before: !t2.inclusive,
      values: t2.position
    };
  }(e.endAt)), n;
};
var Yi = function(t) {
  let e = Bi(t.parent);
  const n = t.structuredQuery, s = n.from ? n.from.length : 0;
  let i = null;
  if (s > 0) {
    F2(s === 1);
    const t2 = n.from[0];
    t2.allDescendants ? i = t2.collectionId : e = e.child(t2.collectionId);
  }
  let r2 = [];
  n.where && (r2 = function(t2) {
    const e2 = Zi(t2);
    if (e2 instanceof gn && In(e2))
      return e2.getFilters();
    return [e2];
  }(n.where));
  let o = [];
  n.orderBy && (o = n.orderBy.map((t2) => function(t3) {
    return new dn(ir(t3.field), function(t4) {
      switch (t4) {
        case "ASCENDING":
          return "asc";
        case "DESCENDING":
          return "desc";
        default:
          return;
      }
    }(t3.direction));
  }(t2)));
  let u = null;
  n.limit && (u = function(t2) {
    let e2;
    return e2 = typeof t2 == "object" ? t2.value : t2, Ft(e2) ? null : e2;
  }(n.limit));
  let c = null;
  n.startAt && (c = function(t2) {
    const e2 = !!t2.before, n2 = t2.values || [];
    return new hn(n2, e2);
  }(n.startAt));
  let a = null;
  return n.endAt && (a = function(t2) {
    const e2 = !t2.before, n2 = t2.values || [];
    return new hn(n2, e2);
  }(n.endAt)), Kn(e, i, o, r2, u, "F", c, a);
};
var Xi = function(t, e) {
  const n = function(t2) {
    switch (t2) {
      case "TargetPurposeListen":
        return null;
      case "TargetPurposeExistenceFilterMismatch":
        return "existence-filter-mismatch";
      case "TargetPurposeExistenceFilterMismatchBloom":
        return "existence-filter-mismatch-bloom";
      case "TargetPurposeLimboResolution":
        return "limbo-document";
      default:
        return O2();
    }
  }(e.purpose);
  return n == null ? null : {
    "goog-listen-tags": n
  };
};
var Zi = function(t) {
  return t.unaryFilter !== undefined ? function(t2) {
    switch (t2.unaryFilter.op) {
      case "IS_NAN":
        const e = ir(t2.unaryFilter.field);
        return mn.create(e, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const n = ir(t2.unaryFilter.field);
        return mn.create(n, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const s = ir(t2.unaryFilter.field);
        return mn.create(s, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const i = ir(t2.unaryFilter.field);
        return mn.create(i, "!=", {
          nullValue: "NULL_VALUE"
        });
      default:
        return O2();
    }
  }(t) : t.fieldFilter !== undefined ? function(t2) {
    return mn.create(ir(t2.fieldFilter.field), function(t3) {
      switch (t3) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        default:
          return O2();
      }
    }(t2.fieldFilter.op), t2.fieldFilter.value);
  }(t) : t.compositeFilter !== undefined ? function(t2) {
    return gn.create(t2.compositeFilter.filters.map((t3) => Zi(t3)), function(t3) {
      switch (t3) {
        case "AND":
          return "and";
        case "OR":
          return "or";
        default:
          return O2();
      }
    }(t2.compositeFilter.op));
  }(t) : O2();
};
var tr = function(t) {
  return Ri[t];
};
var er = function(t) {
  return Pi[t];
};
var nr = function(t) {
  return bi[t];
};
var sr = function(t) {
  return {
    fieldPath: t.canonicalString()
  };
};
var ir = function(t) {
  return at.fromServerFormat(t.fieldPath);
};
var rr = function(t) {
  return t instanceof mn ? function(t2) {
    if (t2.op === "==") {
      if (Xe(t2.value))
        return {
          unaryFilter: {
            field: sr(t2.field),
            op: "IS_NAN"
          }
        };
      if (Ye(t2.value))
        return {
          unaryFilter: {
            field: sr(t2.field),
            op: "IS_NULL"
          }
        };
    } else if (t2.op === "!=") {
      if (Xe(t2.value))
        return {
          unaryFilter: {
            field: sr(t2.field),
            op: "IS_NOT_NAN"
          }
        };
      if (Ye(t2.value))
        return {
          unaryFilter: {
            field: sr(t2.field),
            op: "IS_NOT_NULL"
          }
        };
    }
    return {
      fieldFilter: {
        field: sr(t2.field),
        op: er(t2.op),
        value: t2.value
      }
    };
  }(t) : t instanceof gn ? function(t2) {
    const e = t2.getFilters().map((t3) => rr(t3));
    if (e.length === 1)
      return e[0];
    return {
      compositeFilter: {
        op: nr(t2.op),
        filters: e
      }
    };
  }(t) : O2();
};
var or = function(t) {
  const e = [];
  return t.fields.forEach((t2) => e.push(t2.canonicalString())), {
    fieldPaths: e
  };
};
var ur = function(t) {
  return t.length >= 4 && t.get(0) === "projects" && t.get(2) === "databases";
};
var yr = function(t) {
  const e = Yi({
    parent: t.parent,
    structuredQuery: t.structuredQuery
  });
  return t.limitType === "LAST" ? Xn(e, e.limit, "L") : e;
};
var su = function(t, e, n, s) {
  return new nu(t, e, n, s);
};
async function iu(t, e) {
  const n = L(t);
  return await n.persistence.runTransaction("Handle user change", "readonly", (t2) => {
    let s;
    return n.mutationQueue.getAllMutationBatches(t2).next((i) => (s = i, n.tr(e), n.mutationQueue.getAllMutationBatches(t2))).next((e2) => {
      const i = [], r2 = [];
      let o = gs();
      for (const t3 of s) {
        i.push(t3.batchId);
        for (const e3 of t3.mutations)
          o = o.add(e3.key);
      }
      for (const t3 of e2) {
        r2.push(t3.batchId);
        for (const e3 of t3.mutations)
          o = o.add(e3.key);
      }
      return n.localDocuments.getDocuments(t2, o).next((t3) => ({
        er: t3,
        removedBatchIds: i,
        addedBatchIds: r2
      }));
    });
  });
}
var ru = function(t, e) {
  const n = L(t);
  return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (t2) => {
    const s = e.batch.keys(), i = n.Zi.newChangeBuffer({
      trackRemovals: true
    });
    return function(t3, e2, n2, s2) {
      const i2 = n2.batch, r2 = i2.keys();
      let o = Rt.resolve();
      return r2.forEach((t4) => {
        o = o.next(() => s2.getEntry(e2, t4)).next((e3) => {
          const r3 = n2.docVersions.get(t4);
          F2(r3 !== null), e3.version.compareTo(r3) < 0 && (i2.applyToRemoteDocument(e3, n2), e3.isValidDocument() && (e3.setReadTime(n2.commitVersion), s2.addEntry(e3)));
        });
      }), o.next(() => t3.mutationQueue.removeMutationBatch(e2, i2));
    }(n, t2, e, i).next(() => i.apply(t2)).next(() => n.mutationQueue.performConsistencyCheck(t2)).next(() => n.documentOverlayCache.removeOverlaysForBatchId(t2, s, e.batch.batchId)).next(() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(t2, function(t3) {
      let e2 = gs();
      for (let n2 = 0;n2 < t3.mutationResults.length; ++n2) {
        t3.mutationResults[n2].transformResults.length > 0 && (e2 = e2.add(t3.batch.mutations[n2].key));
      }
      return e2;
    }(e))).next(() => n.localDocuments.getDocuments(t2, s));
  });
};
var ou = function(t) {
  const e = L(t);
  return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t2) => e.Bs.getLastRemoteSnapshotVersion(t2));
};
var uu = function(t, e) {
  const n = L(t), s = e.snapshotVersion;
  let i = n.Ji;
  return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (t2) => {
    const r2 = n.Zi.newChangeBuffer({
      trackRemovals: true
    });
    i = n.Ji;
    const o = [];
    e.targetChanges.forEach((r3, u2) => {
      const c2 = i.get(u2);
      if (!c2)
        return;
      o.push(n.Bs.removeMatchingKeys(t2, r3.removedDocuments, u2).next(() => n.Bs.addMatchingKeys(t2, r3.addedDocuments, u2)));
      let a = c2.withSequenceNumber(t2.currentSequenceNumber);
      e.targetMismatches.get(u2) !== null ? a = a.withResumeToken(Ve.EMPTY_BYTE_STRING, rt.min()).withLastLimboFreeSnapshotVersion(rt.min()) : r3.resumeToken.approximateByteSize() > 0 && (a = a.withResumeToken(r3.resumeToken, s)), i = i.insert(u2, a), function(t3, e2, n2) {
        if (t3.resumeToken.approximateByteSize() === 0)
          return true;
        if (e2.snapshotVersion.toMicroseconds() - t3.snapshotVersion.toMicroseconds() >= 300000000)
          return true;
        return n2.addedDocuments.size + n2.modifiedDocuments.size + n2.removedDocuments.size > 0;
      }(c2, a, r3) && o.push(n.Bs.updateTargetData(t2, a));
    });
    let u = cs(), c = gs();
    if (e.documentUpdates.forEach((s2) => {
      e.resolvedLimboDocuments.has(s2) && o.push(n.persistence.referenceDelegate.updateLimboDocument(t2, s2));
    }), o.push(cu(t2, r2, e.documentUpdates).next((t3) => {
      u = t3.nr, c = t3.sr;
    })), !s.isEqual(rt.min())) {
      const e2 = n.Bs.getLastRemoteSnapshotVersion(t2).next((e3) => n.Bs.setTargetsMetadata(t2, t2.currentSequenceNumber, s));
      o.push(e2);
    }
    return Rt.waitFor(o).next(() => r2.apply(t2)).next(() => n.localDocuments.getLocalViewOfDocuments(t2, u, c)).next(() => u);
  }).then((t2) => (n.Ji = i, t2));
};
var cu = function(t, e, n) {
  let s = gs(), i = gs();
  return n.forEach((t2) => s = s.add(t2)), e.getEntries(t, s).next((t2) => {
    let s2 = cs();
    return n.forEach((n2, r2) => {
      const o = t2.get(n2);
      r2.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n2)), r2.isNoDocument() && r2.version.isEqual(rt.min()) ? (e.removeEntry(n2, r2.readTime), s2 = s2.insert(n2, r2)) : !o.isValidDocument() || r2.version.compareTo(o.version) > 0 || r2.version.compareTo(o.version) === 0 && o.hasPendingWrites ? (e.addEntry(r2), s2 = s2.insert(n2, r2)) : N2("LocalStore", "Ignoring outdated watch update for ", n2, ". Current version:", o.version, " Watch version:", r2.version);
    }), {
      nr: s2,
      sr: i
    };
  });
};
var au = function(t, e) {
  const n = L(t);
  return n.persistence.runTransaction("Get next mutation batch", "readonly", (t2) => (e === undefined && (e = -1), n.mutationQueue.getNextMutationBatchAfterBatchId(t2, e)));
};
var hu = function(t, e) {
  const n = L(t);
  return n.persistence.runTransaction("Allocate target", "readwrite", (t2) => {
    let s;
    return n.Bs.getTargetData(t2, e).next((i) => i ? (s = i, Rt.resolve(s)) : n.Bs.allocateTargetId(t2).next((i2) => (s = new cr(e, i2, "TargetPurposeListen", t2.currentSequenceNumber), n.Bs.addTargetData(t2, s).next(() => s))));
  }).then((t2) => {
    const s = n.Ji.get(t2.targetId);
    return (s === null || t2.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (n.Ji = n.Ji.insert(t2.targetId, t2), n.Yi.set(e, t2.targetId)), t2;
  });
};
async function lu(t, e, n) {
  const s = L(t), i = s.Ji.get(e), r2 = n ? "readwrite" : "readwrite-primary";
  try {
    n || await s.persistence.runTransaction("Release target", r2, (t2) => s.persistence.referenceDelegate.removeTarget(t2, i));
  } catch (t2) {
    if (!Dt(t2))
      throw t2;
    N2("LocalStore", `Failed to update sequence numbers for target ${e}: ${t2}`);
  }
  s.Ji = s.Ji.remove(e), s.Yi.delete(i.target);
}
var fu = function(t, e, n) {
  const s = L(t);
  let i = rt.min(), r2 = gs();
  return s.persistence.runTransaction("Execute query", "readonly", (t2) => function(t3, e2, n2) {
    const s2 = L(t3), i2 = s2.Yi.get(n2);
    return i2 !== undefined ? Rt.resolve(s2.Ji.get(i2)) : s2.Bs.getTargetData(e2, n2);
  }(s, t2, Jn(e)).next((e2) => {
    if (e2)
      return i = e2.lastLimboFreeSnapshotVersion, s.Bs.getMatchingKeysForTargetId(t2, e2.targetId).next((t3) => {
        r2 = t3;
      });
  }).next(() => s.Hi.getDocumentsMatchingQuery(t2, e, n ? i : rt.min(), n ? r2 : gs())).next((t3) => (_u(s, ss(e), t3), {
    documents: t3,
    ir: r2
  })));
};
var _u = function(t, e, n) {
  let s = t.Xi.get(e) || rt.min();
  n.forEach((t2, e2) => {
    e2.readTime.compareTo(s) > 0 && (s = e2.readTime);
  }), t.Xi.set(e, s);
};
var Cu = function() {
  return Du === null ? Du = 268435456 + Math.round(2147483648 * Math.random()) : Du++, "0x" + Du.toString(16);
};
var Ou = function() {
  return typeof document != "undefined" ? document : null;
};
var Fu = function(t) {
  return new Vi(t, true);
};
async function zu(t) {
  if (ec2(t))
    for (const e of t.Ru)
      await e(true);
}
async function Wu(t) {
  for (const e of t.Ru)
    await e(false);
}
var Hu = function(t, e) {
  const n = L(t);
  n.Au.has(e.targetId) || (n.Au.set(e.targetId, e), tc2(n) ? Zu(n) : pc2(n).Ko() && Yu(n, e));
};
var Ju = function(t, e) {
  const n = L(t), s = pc2(n);
  n.Au.delete(e), s.Ko() && Xu(n, e), n.Au.size === 0 && (s.Ko() ? s.jo() : ec2(n) && n.bu.set("Unknown"));
};
var Yu = function(t, e) {
  if (t.Vu.qt(e.targetId), e.resumeToken.approximateByteSize() > 0 || e.snapshotVersion.compareTo(rt.min()) > 0) {
    const n = t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;
    e = e.withExpectedCount(n);
  }
  pc2(t).su(e);
};
var Xu = function(t, e) {
  t.Vu.qt(e), pc2(t).iu(e);
};
var Zu = function(t) {
  t.Vu = new Ei({
    getRemoteKeysForTarget: (e) => t.remoteSyncer.getRemoteKeysForTarget(e),
    le: (e) => t.Au.get(e) || null,
    ue: () => t.datastore.serializer.databaseId
  }), pc2(t).start(), t.bu.gu();
};
var tc2 = function(t) {
  return ec2(t) && !pc2(t).Uo() && t.Au.size > 0;
};
var ec2 = function(t) {
  return L(t).vu.size === 0;
};
var nc2 = function(t) {
  t.Vu = undefined;
};
async function sc2(t) {
  t.Au.forEach((e, n) => {
    Yu(t, e);
  });
}
async function ic2(t, e) {
  nc2(t), tc2(t) ? (t.bu.Iu(e), Zu(t)) : t.bu.set("Unknown");
}
async function rc2(t, e, n) {
  if (t.bu.set("Online"), e instanceof Ii && e.state === 2 && e.cause)
    try {
      await async function(t2, e2) {
        const n2 = e2.cause;
        for (const s of e2.targetIds)
          t2.Au.has(s) && (await t2.remoteSyncer.rejectListen(s, n2), t2.Au.delete(s), t2.Vu.removeTarget(s));
      }(t, e);
    } catch (n2) {
      N2("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), n2), await oc2(t, n2);
    }
  else if (e instanceof yi ? t.Vu.Ht(e) : e instanceof pi ? t.Vu.ne(e) : t.Vu.Xt(e), !n.isEqual(rt.min()))
    try {
      const e2 = await ou(t.localStore);
      n.compareTo(e2) >= 0 && await function(t2, e3) {
        const n2 = t2.Vu.ce(e3);
        return n2.targetChanges.forEach((n3, s) => {
          if (n3.resumeToken.approximateByteSize() > 0) {
            const i = t2.Au.get(s);
            i && t2.Au.set(s, i.withResumeToken(n3.resumeToken, e3));
          }
        }), n2.targetMismatches.forEach((e4, n3) => {
          const s = t2.Au.get(e4);
          if (!s)
            return;
          t2.Au.set(e4, s.withResumeToken(Ve.EMPTY_BYTE_STRING, s.snapshotVersion)), Xu(t2, e4);
          const i = new cr(s.target, e4, n3, s.sequenceNumber);
          Yu(t2, i);
        }), t2.remoteSyncer.applyRemoteEvent(n2);
      }(t, n);
    } catch (e2) {
      N2("RemoteStore", "Failed to raise snapshot:", e2), await oc2(t, e2);
    }
}
async function oc2(t, e, n) {
  if (!Dt(e))
    throw e;
  t.vu.add(1), await Wu(t), t.bu.set("Offline"), n || (n = () => ou(t.localStore)), t.asyncQueue.enqueueRetryable(async () => {
    N2("RemoteStore", "Retrying IndexedDB access"), await n(), t.vu.delete(1), await zu(t);
  });
}
var uc2 = function(t, e) {
  return e().catch((n) => oc2(t, n, e));
};
async function cc2(t) {
  const e = L(t), n = Ic2(e);
  let s = e.Eu.length > 0 ? e.Eu[e.Eu.length - 1].batchId : -1;
  for (;ac2(e); )
    try {
      const t2 = await au(e.localStore, s);
      if (t2 === null) {
        e.Eu.length === 0 && n.jo();
        break;
      }
      s = t2.batchId, hc2(e, t2);
    } catch (t2) {
      await oc2(e, t2);
    }
  lc2(e) && fc2(e);
}
var ac2 = function(t) {
  return ec2(t) && t.Eu.length < 10;
};
var hc2 = function(t, e) {
  t.Eu.push(e);
  const n = Ic2(t);
  n.Ko() && n.ou && n.uu(e.mutations);
};
var lc2 = function(t) {
  return ec2(t) && !Ic2(t).Uo() && t.Eu.length > 0;
};
var fc2 = function(t) {
  Ic2(t).start();
};
async function dc2(t) {
  Ic2(t).hu();
}
async function wc2(t) {
  const e = Ic2(t);
  for (const n of t.Eu)
    e.uu(n.mutations);
}
async function _c(t, e, n) {
  const s = t.Eu.shift(), i = ti.from(s, e, n);
  await uc2(t, () => t.remoteSyncer.applySuccessfulWrite(i)), await cc2(t);
}
async function mc2(t, e) {
  e && Ic2(t).ou && await async function(t2, e2) {
    if (n = e2.code, oi(n) && n !== q2.ABORTED) {
      const n2 = t2.Eu.shift();
      Ic2(t2).Qo(), await uc2(t2, () => t2.remoteSyncer.rejectFailedWrite(n2.batchId, e2)), await cc2(t2);
    }
    var n;
  }(t, e), lc2(t) && fc2(t);
}
async function gc2(t, e) {
  const n = L(t);
  n.asyncQueue.verifyOperationInProgress(), N2("RemoteStore", "RemoteStore received new credentials");
  const s = ec2(n);
  n.vu.add(3), await Wu(n), s && n.bu.set("Unknown"), await n.remoteSyncer.handleCredentialChange(e), n.vu.delete(3), await zu(n);
}
async function yc2(t, e) {
  const n = L(t);
  e ? (n.vu.delete(2), await zu(n)) : e || (n.vu.add(2), await Wu(n), n.bu.set("Unknown"));
}
var pc2 = function(t) {
  return t.Su || (t.Su = function(t2, e, n) {
    const s = L(t2);
    return s.fu(), new qu(e, s.connection, s.authCredentials, s.appCheckCredentials, s.serializer, n);
  }(t.datastore, t.asyncQueue, {
    uo: sc2.bind(null, t),
    ao: ic2.bind(null, t),
    nu: rc2.bind(null, t)
  }), t.Ru.push(async (e) => {
    e ? (t.Su.Qo(), tc2(t) ? Zu(t) : t.bu.set("Unknown")) : (await t.Su.stop(), nc2(t));
  })), t.Su;
};
var Ic2 = function(t) {
  return t.Du || (t.Du = function(t2, e, n) {
    const s = L(t2);
    return s.fu(), new Uu(e, s.connection, s.authCredentials, s.appCheckCredentials, s.serializer, n);
  }(t.datastore, t.asyncQueue, {
    uo: dc2.bind(null, t),
    ao: mc2.bind(null, t),
    au: wc2.bind(null, t),
    cu: _c.bind(null, t)
  }), t.Ru.push(async (e) => {
    e ? (t.Du.Qo(), await cc2(t)) : (await t.Du.stop(), t.Eu.length > 0 && (N2("RemoteStore", `Stopping write stream with ${t.Eu.length} pending writes`), t.Eu = []));
  })), t.Du;
};
var Ec2 = function(t, e) {
  if (k2("AsyncQueue", `${e}: ${t}`), Dt(t))
    return new U2(q2.UNAVAILABLE, `${e}: ${t}`);
  throw t;
};
async function Vc2(t, e) {
  const n = L(t), s = e.query;
  let i = false, r2 = n.queries.get(s);
  if (r2 || (i = true, r2 = new Pc2), i)
    try {
      r2.Nu = await n.onListen(s);
    } catch (t2) {
      const n2 = Ec2(t2, `Initialization of query '${es(e.query)}' failed`);
      return void e.onError(n2);
    }
  if (n.queries.set(s, r2), r2.listeners.push(e), e.Mu(n.onlineState), r2.Nu) {
    e.$u(r2.Nu) && xc2(n);
  }
}
async function Sc2(t, e) {
  const n = L(t), s = e.query;
  let i = false;
  const r2 = n.queries.get(s);
  if (r2) {
    const t2 = r2.listeners.indexOf(e);
    t2 >= 0 && (r2.listeners.splice(t2, 1), i = r2.listeners.length === 0);
  }
  if (i)
    return n.queries.delete(s), n.onUnlisten(s);
}
var Dc2 = function(t, e) {
  const n = L(t);
  let s = false;
  for (const t2 of e) {
    const e2 = t2.query, i = n.queries.get(e2);
    if (i) {
      for (const e3 of i.listeners)
        e3.$u(t2) && (s = true);
      i.Nu = t2;
    }
  }
  s && xc2(n);
};
var Cc2 = function(t, e, n) {
  const s = L(t), i = s.queries.get(e);
  if (i)
    for (const t2 of i.listeners)
      t2.onError(n);
  s.queries.delete(e);
};
var xc2 = function(t) {
  t.ku.forEach((t2) => {
    t2.next();
  });
};
async function Gc2(t, e) {
  const n = pa2(t);
  let s, i;
  const r2 = n.wc.get(e);
  if (r2)
    s = r2.targetId, n.sharedClientState.addLocalQueryTarget(s), i = r2.view.lc();
  else {
    const t2 = await hu(n.localStore, Jn(e)), r3 = n.sharedClientState.addLocalQueryTarget(t2.targetId);
    s = t2.targetId, i = await Qc2(n, e, s, r3 === "current", t2.resumeToken), n.isPrimaryClient && Hu(n.remoteStore, t2);
  }
  return i;
}
async function Qc2(t, e, n, s, i) {
  t.Rc = (e2, n2, s2) => async function(t2, e3, n3, s3) {
    let i2 = e3.view.sc(n3);
    i2.zi && (i2 = await fu(t2.localStore, e3.query, false).then(({ documents: t3 }) => e3.view.sc(t3, i2)));
    const r3 = s3 && s3.targetChanges.get(e3.targetId), o2 = e3.view.applyChanges(i2, t2.isPrimaryClient, r3);
    return ia2(t2, e3.targetId, o2.cc), o2.snapshot;
  }(t, e2, n2, s2);
  const r2 = await fu(t.localStore, e, true), o = new Lc2(e, r2.ir), u = o.sc(r2.documents), c = gi.createSynthesizedTargetChangeForCurrentChange(n, s && t.onlineState !== "Offline", i), a = o.applyChanges(u, t.isPrimaryClient, c);
  ia2(t, n, a.cc);
  const h = new qc2(e, n, o);
  return t.wc.set(e, h), t._c.has(n) ? t._c.get(n).push(e) : t._c.set(n, [e]), a.snapshot;
}
async function jc2(t, e) {
  const n = L(t), s = n.wc.get(e), i = n._c.get(s.targetId);
  if (i.length > 1)
    return n._c.set(s.targetId, i.filter((t2) => !Zn(t2, e))), void n.wc.delete(e);
  if (n.isPrimaryClient) {
    n.sharedClientState.removeLocalQueryTarget(s.targetId);
    n.sharedClientState.isActiveQueryTarget(s.targetId) || await lu(n.localStore, s.targetId, false).then(() => {
      n.sharedClientState.clearQueryState(s.targetId), Ju(n.remoteStore, s.targetId), na2(n, s.targetId);
    }).catch(vt);
  } else
    na2(n, s.targetId), await lu(n.localStore, s.targetId, true);
}
async function zc2(t, e, n) {
  const s = Ia2(t);
  try {
    const t2 = await function(t3, e2) {
      const n2 = L(t3), s2 = it.now(), i = e2.reduce((t4, e3) => t4.add(e3.key), gs());
      let r2, o;
      return n2.persistence.runTransaction("Locally write mutations", "readwrite", (t4) => {
        let u = cs(), c = gs();
        return n2.Zi.getEntries(t4, i).next((t5) => {
          u = t5, u.forEach((t6, e3) => {
            e3.isValidDocument() || (c = c.add(t6));
          });
        }).next(() => n2.localDocuments.getOverlayedDocuments(t4, u)).next((i2) => {
          r2 = i2;
          const o2 = [];
          for (const t5 of e2) {
            const e3 = Gs(t5, r2.get(t5.key).overlayedDocument);
            e3 != null && o2.push(new zs(t5.key, e3, cn(e3.value.mapValue), Fs.exists(true)));
          }
          return n2.mutationQueue.addMutationBatch(t4, s2, o2, e2);
        }).next((e3) => {
          o = e3;
          const s3 = e3.applyToLocalDocumentSet(r2, c);
          return n2.documentOverlayCache.saveOverlays(t4, e3.batchId, s3);
        });
      }).then(() => ({
        batchId: o.batchId,
        changes: ls(r2)
      }));
    }(s.localStore, e);
    s.sharedClientState.addPendingMutation(t2.batchId), function(t3, e2, n2) {
      let s2 = t3.Tc[t3.currentUser.toKey()];
      s2 || (s2 = new pe(et));
      s2 = s2.insert(e2, n2), t3.Tc[t3.currentUser.toKey()] = s2;
    }(s, t2.batchId, n), await ua2(s, t2.changes), await cc2(s.remoteStore);
  } catch (t2) {
    const e2 = Ec2(t2, "Failed to persist write");
    n.reject(e2);
  }
}
async function Wc2(t, e) {
  const n = L(t);
  try {
    const t2 = await uu(n.localStore, e);
    e.targetChanges.forEach((t3, e2) => {
      const s = n.yc.get(e2);
      s && (F2(t3.addedDocuments.size + t3.modifiedDocuments.size + t3.removedDocuments.size <= 1), t3.addedDocuments.size > 0 ? s.fc = true : t3.modifiedDocuments.size > 0 ? F2(s.fc) : t3.removedDocuments.size > 0 && (F2(s.fc), s.fc = false));
    }), await ua2(n, t2, e);
  } catch (t2) {
    await vt(t2);
  }
}
var Hc2 = function(t, e, n) {
  const s = L(t);
  if (s.isPrimaryClient && n === 0 || !s.isPrimaryClient && n === 1) {
    const t2 = [];
    s.wc.forEach((n2, s2) => {
      const i = s2.view.Mu(e);
      i.snapshot && t2.push(i.snapshot);
    }), function(t3, e2) {
      const n2 = L(t3);
      n2.onlineState = e2;
      let s2 = false;
      n2.queries.forEach((t4, n3) => {
        for (const t5 of n3.listeners)
          t5.Mu(e2) && (s2 = true);
      }), s2 && xc2(n2);
    }(s.eventManager, e), t2.length && s.dc.nu(t2), s.onlineState = e, s.isPrimaryClient && s.sharedClientState.setOnlineState(e);
  }
};
async function Jc2(t, e, n) {
  const s = L(t);
  s.sharedClientState.updateQueryState(e, "rejected", n);
  const i = s.yc.get(e), r2 = i && i.key;
  if (r2) {
    let t2 = new pe(ht.comparator);
    t2 = t2.insert(r2, an.newNoDocument(r2, rt.min()));
    const n2 = gs().add(r2), i2 = new mi(rt.min(), new Map, new pe(et), t2, n2);
    await Wc2(s, i2), s.gc = s.gc.remove(r2), s.yc.delete(e), oa2(s);
  } else
    await lu(s.localStore, e, false).then(() => na2(s, e, n)).catch(vt);
}
async function Yc2(t, e) {
  const n = L(t), s = e.batch.batchId;
  try {
    const t2 = await ru(n.localStore, e);
    ea2(n, s, null), ta2(n, s), n.sharedClientState.updateMutationState(s, "acknowledged"), await ua2(n, t2);
  } catch (t2) {
    await vt(t2);
  }
}
async function Xc2(t, e, n) {
  const s = L(t);
  try {
    const t2 = await function(t3, e2) {
      const n2 = L(t3);
      return n2.persistence.runTransaction("Reject batch", "readwrite-primary", (t4) => {
        let s2;
        return n2.mutationQueue.lookupMutationBatch(t4, e2).next((e3) => (F2(e3 !== null), s2 = e3.keys(), n2.mutationQueue.removeMutationBatch(t4, e3))).next(() => n2.mutationQueue.performConsistencyCheck(t4)).next(() => n2.documentOverlayCache.removeOverlaysForBatchId(t4, s2, e2)).next(() => n2.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(t4, s2)).next(() => n2.localDocuments.getDocuments(t4, s2));
      });
    }(s.localStore, e);
    ea2(s, e, n), ta2(s, e), s.sharedClientState.updateMutationState(e, "rejected", n), await ua2(s, t2);
  } catch (n2) {
    await vt(n2);
  }
}
var ta2 = function(t, e) {
  (t.Ec.get(e) || []).forEach((t2) => {
    t2.resolve();
  }), t.Ec.delete(e);
};
var ea2 = function(t, e, n) {
  const s = L(t);
  let i = s.Tc[s.currentUser.toKey()];
  if (i) {
    const t2 = i.get(e);
    t2 && (n ? t2.reject(n) : t2.resolve(), i = i.remove(e)), s.Tc[s.currentUser.toKey()] = i;
  }
};
var na2 = function(t, e, n = null) {
  t.sharedClientState.removeLocalQueryTarget(e);
  for (const s of t._c.get(e))
    t.wc.delete(s), n && t.dc.Pc(s, n);
  if (t._c.delete(e), t.isPrimaryClient) {
    t.Ic.Is(e).forEach((e2) => {
      t.Ic.containsKey(e2) || sa2(t, e2);
    });
  }
};
var sa2 = function(t, e) {
  t.mc.delete(e.path.canonicalString());
  const n = t.gc.get(e);
  n !== null && (Ju(t.remoteStore, n), t.gc = t.gc.remove(e), t.yc.delete(n), oa2(t));
};
var ia2 = function(t, e, n) {
  for (const s of n)
    if (s instanceof Fc2)
      t.Ic.addReference(s.key, e), ra2(t, s);
    else if (s instanceof Bc2) {
      N2("SyncEngine", "Document no longer in limbo: " + s.key), t.Ic.removeReference(s.key, e);
      t.Ic.containsKey(s.key) || sa2(t, s.key);
    } else
      O2();
};
var ra2 = function(t, e) {
  const n = e.key, s = n.path.canonicalString();
  t.gc.get(n) || t.mc.has(s) || (N2("SyncEngine", "New document in limbo: " + n), t.mc.add(s), oa2(t));
};
var oa2 = function(t) {
  for (;t.mc.size > 0 && t.gc.size < t.maxConcurrentLimboResolutions; ) {
    const e = t.mc.values().next().value;
    t.mc.delete(e);
    const n = new ht(ut.fromString(e)), s = t.Ac.next();
    t.yc.set(s, new Uc2(n)), t.gc = t.gc.insert(n, s), Hu(t.remoteStore, new cr(Jn(Gn(n.path)), s, "TargetPurposeLimboResolution", Ot.ct));
  }
};
async function ua2(t, e, n) {
  const s = L(t), i = [], r2 = [], o = [];
  s.wc.isEmpty() || (s.wc.forEach((t2, u) => {
    o.push(s.Rc(u, e, n).then((t3) => {
      if ((t3 || n) && s.isPrimaryClient && s.sharedClientState.updateQueryState(u.targetId, (t3 == null ? undefined : t3.fromCache) ? "not-current" : "current"), t3) {
        i.push(t3);
        const e2 = tu.Li(u.targetId, t3);
        r2.push(e2);
      }
    }));
  }), await Promise.all(o), s.dc.nu(i), await async function(t2, e2) {
    const n2 = L(t2);
    try {
      await n2.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t3) => Rt.forEach(e2, (e3) => Rt.forEach(e3.Fi, (s2) => n2.persistence.referenceDelegate.addReference(t3, e3.targetId, s2)).next(() => Rt.forEach(e3.Bi, (s2) => n2.persistence.referenceDelegate.removeReference(t3, e3.targetId, s2)))));
    } catch (t3) {
      if (!Dt(t3))
        throw t3;
      N2("LocalStore", "Failed to update sequence numbers: " + t3);
    }
    for (const t3 of e2) {
      const e3 = t3.targetId;
      if (!t3.fromCache) {
        const t4 = n2.Ji.get(e3), s2 = t4.snapshotVersion, i2 = t4.withLastLimboFreeSnapshotVersion(s2);
        n2.Ji = n2.Ji.insert(e3, i2);
      }
    }
  }(s.localStore, r2));
}
async function ca2(t, e) {
  const n = L(t);
  if (!n.currentUser.isEqual(e)) {
    N2("SyncEngine", "User change. New user:", e.toKey());
    const t2 = await iu(n.localStore, e);
    n.currentUser = e, function(t3, e2) {
      t3.Ec.forEach((t4) => {
        t4.forEach((t5) => {
          t5.reject(new U2(q2.CANCELLED, e2));
        });
      }), t3.Ec.clear();
    }(n, "'waitForPendingWrites' promise is rejected due to a user change."), n.sharedClientState.handleUserChange(e, t2.removedBatchIds, t2.addedBatchIds), await ua2(n, t2.er);
  }
}
var aa2 = function(t, e) {
  const n = L(t), s = n.yc.get(e);
  if (s && s.fc)
    return gs().add(s.key);
  {
    let t2 = gs();
    const s2 = n._c.get(e);
    if (!s2)
      return t2;
    for (const e2 of s2) {
      const s3 = n.wc.get(e2);
      t2 = t2.unionWith(s3.view.nc);
    }
    return t2;
  }
};
var pa2 = function(t) {
  const e = L(t);
  return e.remoteStore.remoteSyncer.applyRemoteEvent = Wc2.bind(null, e), e.remoteStore.remoteSyncer.getRemoteKeysForTarget = aa2.bind(null, e), e.remoteStore.remoteSyncer.rejectListen = Jc2.bind(null, e), e.dc.nu = Dc2.bind(null, e.eventManager), e.dc.Pc = Cc2.bind(null, e.eventManager), e;
};
var Ia2 = function(t) {
  const e = L(t);
  return e.remoteStore.remoteSyncer.applySuccessfulWrite = Yc2.bind(null, e), e.remoteStore.remoteSyncer.rejectFailedWrite = Xc2.bind(null, e), e;
};
async function Na2(t, e) {
  t.asyncQueue.verifyOperationInProgress(), N2("FirestoreClient", "Initializing OfflineComponentProvider");
  const n = await t.getConfiguration();
  await e.initialize(n);
  let s = n.initialUser;
  t.setCredentialChangeListener(async (t2) => {
    s.isEqual(t2) || (await iu(e.localStore, t2), s = t2);
  }), e.persistence.setDatabaseDeletedListener(() => t.terminate()), t._offlineComponents = e;
}
async function ka2(t, e) {
  t.asyncQueue.verifyOperationInProgress();
  const n = await $a2(t);
  N2("FirestoreClient", "Initializing OnlineComponentProvider");
  const s = await t.getConfiguration();
  await e.initialize(n, s), t.setCredentialChangeListener((t2) => gc2(e.remoteStore, t2)), t.setAppCheckTokenChangeListener((t2, n2) => gc2(e.remoteStore, n2)), t._onlineComponents = e;
}
var Ma = function(t) {
  return t.name === "FirebaseError" ? t.code === q2.FAILED_PRECONDITION || t.code === q2.UNIMPLEMENTED : !(typeof DOMException != "undefined" && t instanceof DOMException) || (t.code === 22 || t.code === 20 || t.code === 11);
};
async function $a2(t) {
  if (!t._offlineComponents)
    if (t._uninitializedComponentsProvider) {
      N2("FirestoreClient", "Using user provided OfflineComponentProvider");
      try {
        await Na2(t, t._uninitializedComponentsProvider._offline);
      } catch (e) {
        const n = e;
        if (!Ma(n))
          throw n;
        M2("Error using user provided cache. Falling back to memory cache: " + n), await Na2(t, new Ea);
      }
    } else
      N2("FirestoreClient", "Using default OfflineComponentProvider"), await Na2(t, new Ea);
  return t._offlineComponents;
}
async function Oa2(t) {
  return t._onlineComponents || (t._uninitializedComponentsProvider ? (N2("FirestoreClient", "Using user provided OnlineComponentProvider"), await ka2(t, t._uninitializedComponentsProvider._online)) : (N2("FirestoreClient", "Using default OnlineComponentProvider"), await ka2(t, new Pa2))), t._onlineComponents;
}
var qa2 = function(t) {
  return Oa2(t).then((t2) => t2.syncEngine);
};
async function Ka2(t) {
  const e = await Oa2(t), n = e.eventManager;
  return n.onListen = Gc2.bind(null, e.syncEngine), n.onUnlisten = jc2.bind(null, e.syncEngine), n;
}
var za2 = function(t, e, n = {}) {
  const s = new K2;
  return t.asyncQueue.enqueueAndForget(async () => function(t2, e2, n2, s2, i) {
    const r2 = new Va2({
      next: (r3) => {
        e2.enqueueAndForget(() => Sc2(t2, o));
        const u = r3.docs.has(n2);
        !u && r3.fromCache ? i.reject(new U2(q2.UNAVAILABLE, "Failed to get document because the client is offline.")) : u && r3.fromCache && s2 && s2.source === "server" ? i.reject(new U2(q2.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : i.resolve(r3);
      },
      error: (t3) => i.reject(t3)
    }), o = new Nc2(Gn(n2.path), r2, {
      includeMetadataChanges: true,
      Ku: true
    });
    return Vc2(t2, o);
  }(await Ka2(t), t.asyncQueue, e, n, s)), s.promise;
};
var th = function(t) {
  const e = {};
  return t.timeoutSeconds !== undefined && (e.timeoutSeconds = t.timeoutSeconds), e;
};
var nh = function(t, e, n) {
  if (!n)
    throw new U2(q2.INVALID_ARGUMENT, `Function ${t}() cannot be called with an empty ${e}.`);
};
var sh = function(t, e, n, s) {
  if (e === true && s === true)
    throw new U2(q2.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`);
};
var ih = function(t) {
  if (!ht.isDocumentKey(t))
    throw new U2(q2.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`);
};
var rh = function(t) {
  if (ht.isDocumentKey(t))
    throw new U2(q2.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`);
};
var oh = function(t) {
  if (t === undefined)
    return "undefined";
  if (t === null)
    return "null";
  if (typeof t == "string")
    return t.length > 20 && (t = `${t.substring(0, 20)}...`), JSON.stringify(t);
  if (typeof t == "number" || typeof t == "boolean")
    return "" + t;
  if (typeof t == "object") {
    if (t instanceof Array)
      return "an array";
    {
      const e = function(t2) {
        if (t2.constructor)
          return t2.constructor.name;
        return null;
      }(t);
      return e ? `a custom ${e} object` : "an object";
    }
  }
  return typeof t == "function" ? "a function" : O2();
};
var uh = function(t, e) {
  if (("_delegate" in t) && (t = t._delegate), !(t instanceof e)) {
    if (e.name === t.constructor.name)
      throw new U2(q2.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const n = oh(t);
      throw new U2(q2.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${n}`);
    }
  }
  return t;
};
var _h = function(t, e, ...n) {
  if (t = getModularInstance(t), nh("collection", "path", e), t instanceof hh) {
    const s = ut.fromString(e, ...n);
    return rh(s), new wh(t, null, s);
  }
  {
    if (!(t instanceof fh || t instanceof wh))
      throw new U2(q2.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const s = t._path.child(ut.fromString(e, ...n));
    return rh(s), new wh(t.firestore, null, s);
  }
};
var gh = function(t, e, ...n) {
  if (t = getModularInstance(t), arguments.length === 1 && (e = tt.A()), nh("doc", "path", e), t instanceof hh) {
    const s = ut.fromString(e, ...n);
    return ih(s), new fh(t, null, new ht(s));
  }
  {
    if (!(t instanceof fh || t instanceof wh))
      throw new U2(q2.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const s = t._path.child(ut.fromString(e, ...n));
    return ih(s), new fh(t.firestore, t instanceof wh ? t.converter : null, new ht(s));
  }
};
var Th = function(t) {
  return function(t2, e) {
    if (typeof t2 != "object" || t2 === null)
      return false;
    const n = t2;
    for (const t3 of e)
      if ((t3 in n) && typeof n[t3] == "function")
        return true;
    return false;
  }(t, ["next", "error", "complete"]);
};
var Rh = function(t, e, n) {
  n || (n = "(default)");
  const s = _getProvider(t, "firestore");
  if (s.isInitialized(n)) {
    const t2 = s.getImmediate({
      identifier: n
    }), i = s.getOptions(n);
    if (deepEqual(i, e))
      return t2;
    throw new U2(q2.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
  }
  if (e.cacheSizeBytes !== undefined && e.localCache !== undefined)
    throw new U2(q2.INVALID_ARGUMENT, "cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");
  if (e.cacheSizeBytes !== undefined && e.cacheSizeBytes !== -1 && e.cacheSizeBytes < 1048576)
    throw new U2(q2.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
  return s.initialize({
    options: e,
    instanceIdentifier: n
  });
};
var bh = function(t) {
  return t._firestoreClient || Vh(t), t._firestoreClient.verifyNotTerminated(), t._firestoreClient;
};
var Vh = function(t) {
  var e, n, s;
  const i = t._freezeSettings(), r2 = function(t2, e2, n2, s2) {
    return new $e(t2, e2, n2, s2.host, s2.ssl, s2.experimentalForceLongPolling, s2.experimentalAutoDetectLongPolling, th(s2.experimentalLongPollingOptions), s2.useFetchStreams);
  }(t._databaseId, ((e = t._app) === null || e === undefined ? undefined : e.options.appId) || "", t._persistenceKey, i);
  t._firestoreClient = new xa2(t._authCredentials, t._appCheckCredentials, t._queue, r2), ((n = i.cache) === null || n === undefined ? undefined : n._offlineComponentProvider) && ((s = i.cache) === null || s === undefined ? undefined : s._onlineComponentProvider) && (t._firestoreClient._uninitializedComponentsProvider = {
    _offlineKind: i.cache.kind,
    _offline: i.cache._offlineComponentProvider,
    _online: i.cache._onlineComponentProvider
  });
};
var Jh = function(t) {
  switch (t) {
    case 0:
    case 2:
    case 1:
      return true;
    case 3:
    case 4:
      return false;
    default:
      throw O2();
  }
};
var Zh = function(t) {
  const e = t._freezeSettings(), n = Fu(t._databaseId);
  return new Xh(t._databaseId, !!e.ignoreUndefinedProperties, n);
};
var tl = function(t, e, n, s, i, r2 = {}) {
  const o = t.ya(r2.merge || r2.mergeFields ? 2 : 0, e, n, i);
  dl("Data must be an object, but it was:", o, s);
  const u = ll(s, o);
  let c, a;
  if (r2.merge)
    c = new Re(o.fieldMask), a = o.fieldTransforms;
  else if (r2.mergeFields) {
    const t2 = [];
    for (const s2 of r2.mergeFields) {
      const i2 = wl(e, s2, n);
      if (!o.contains(i2))
        throw new U2(q2.INVALID_ARGUMENT, `Field '${i2}' is specified in your field mask but missing from your input data.`);
      yl(t2, i2) || t2.push(i2);
    }
    c = new Re(t2), a = o.fieldTransforms.filter((t3) => c.covers(t3.field));
  } else
    c = null, a = o.fieldTransforms;
  return new Wh(new un(u), c, a);
};
var al = function(t, e, n, s = false) {
  return hl(n, t.ya(s ? 4 : 3, e));
};
var hl = function(t, e) {
  if (fl(t = getModularInstance(t)))
    return dl("Unsupported field value:", e, t), ll(t, e);
  if (t instanceof Qh)
    return function(t2, e2) {
      if (!Jh(e2.ca))
        throw e2._a(`${t2._methodName}() can only be used with update() and set()`);
      if (!e2.path)
        throw e2._a(`${t2._methodName}() is not currently supported inside arrays`);
      const n = t2._toFieldTransform(e2);
      n && e2.fieldTransforms.push(n);
    }(t, e), null;
  if (t === undefined && e.ignoreUndefinedProperties)
    return null;
  if (e.path && e.fieldMask.push(e.path), t instanceof Array) {
    if (e.settings.la && e.ca !== 4)
      throw e._a("Nested arrays are not supported");
    return function(t2, e2) {
      const n = [];
      let s = 0;
      for (const i of t2) {
        let t3 = hl(i, e2.wa(s));
        t3 == null && (t3 = {
          nullValue: "NULL_VALUE"
        }), n.push(t3), s++;
      }
      return {
        arrayValue: {
          values: n
        }
      };
    }(t, e);
  }
  return function(t2, e2) {
    if ((t2 = getModularInstance(t2)) === null)
      return {
        nullValue: "NULL_VALUE"
      };
    if (typeof t2 == "number")
      return Es(e2.serializer, t2);
    if (typeof t2 == "boolean")
      return {
        booleanValue: t2
      };
    if (typeof t2 == "string")
      return {
        stringValue: t2
      };
    if (t2 instanceof Date) {
      const n = it.fromDate(t2);
      return {
        timestampValue: Di(e2.serializer, n)
      };
    }
    if (t2 instanceof it) {
      const n = new it(t2.seconds, 1000 * Math.floor(t2.nanoseconds / 1000));
      return {
        timestampValue: Di(e2.serializer, n)
      };
    }
    if (t2 instanceof jh)
      return {
        geoPointValue: {
          latitude: t2.latitude,
          longitude: t2.longitude
        }
      };
    if (t2 instanceof Uh)
      return {
        bytesValue: Ci(e2.serializer, t2._byteString)
      };
    if (t2 instanceof fh) {
      const n = e2.databaseId, s = t2.firestore._databaseId;
      if (!s.isEqual(n))
        throw e2._a(`Document reference is for database ${s.projectId}/${s.database} but should be for database ${n.projectId}/${n.database}`);
      return {
        referenceValue: ki(t2.firestore._databaseId || e2.databaseId, t2._key.path)
      };
    }
    throw e2._a(`Unsupported field value: ${oh(t2)}`);
  }(t, e);
};
var ll = function(t, e) {
  const n = {};
  return ye(t) ? e.path && e.path.length > 0 && e.fieldMask.push(e.path) : ge(t, (t2, s) => {
    const i = hl(s, e.ha(t2));
    i != null && (n[t2] = i);
  }), {
    mapValue: {
      fields: n
    }
  };
};
var fl = function(t) {
  return !(typeof t != "object" || t === null || t instanceof Array || t instanceof Date || t instanceof it || t instanceof jh || t instanceof Uh || t instanceof fh || t instanceof Qh);
};
var dl = function(t, e, n) {
  if (!fl(n) || !function(t2) {
    return typeof t2 == "object" && t2 !== null && (Object.getPrototypeOf(t2) === Object.prototype || Object.getPrototypeOf(t2) === null);
  }(n)) {
    const s = oh(n);
    throw s === "an object" ? e._a(t + " a custom object") : e._a(t + " " + s);
  }
};
var wl = function(t, e, n) {
  if ((e = getModularInstance(e)) instanceof Kh)
    return e._internalPath;
  if (typeof e == "string")
    return ml(t, e);
  throw gl("Field path arguments must be of type string or ", t, false, undefined, n);
};
var ml = function(t, e, n) {
  if (e.search(_l) >= 0)
    throw gl(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, false, undefined, n);
  try {
    return new Kh(...e.split("."))._internalPath;
  } catch (s) {
    throw gl(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, false, undefined, n);
  }
};
var gl = function(t, e, n, s, i) {
  const r2 = s && !s.isEmpty(), o = i !== undefined;
  let u = `Function ${e}() called with invalid data`;
  n && (u += " (via `toFirestore()`)"), u += ". ";
  let c = "";
  return (r2 || o) && (c += " (found", r2 && (c += ` in field ${s}`), o && (c += ` in document ${i}`), c += ")"), new U2(q2.INVALID_ARGUMENT, u + t + c);
};
var yl = function(t, e) {
  return t.some((t2) => t2.isEqual(e));
};
var Tl = function(t, e) {
  return typeof e == "string" ? ml(t, e) : e instanceof Kh ? e._internalPath : e._delegate._internalPath;
};
var El = function(t) {
  if (t.limitType === "L" && t.explicitOrderBy.length === 0)
    throw new U2(q2.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
};
var Rl = function(t, e, ...n) {
  let s = [];
  e instanceof Al && s.push(e), s = s.concat(n), function(t2) {
    const e2 = t2.filter((t3) => t3 instanceof Vl).length, n2 = t2.filter((t3) => t3 instanceof Pl).length;
    if (e2 > 1 || e2 > 0 && n2 > 0)
      throw new U2(q2.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
  }(s);
  for (const e2 of s)
    t = e2._apply(t);
  return t;
};
var Kl = function(t, e, n) {
  if (typeof (n = getModularInstance(n)) == "string") {
    if (n === "")
      throw new U2(q2.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
    if (!Wn(e) && n.indexOf("/") !== -1)
      throw new U2(q2.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
    const s = e.path.child(ut.fromString(n));
    if (!ht.isDocumentKey(s))
      throw new U2(q2.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);
    return We(t, new ht(s));
  }
  if (n instanceof fh)
    return We(t, n._key);
  throw new U2(q2.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${oh(n)}.`);
};
var Gl = function(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    throw new U2(q2.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);
};
var Ql = function(t, e) {
  if (e.isInequality()) {
    const n2 = zn(t), s = e.field;
    if (n2 !== null && !n2.isEqual(s))
      throw new U2(q2.INVALID_ARGUMENT, `Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${n2.toString()}' and '${s.toString()}'`);
    const i = jn(t);
    i !== null && jl(t, s, i);
  }
  const n = function(t2, e2) {
    for (const n2 of t2)
      for (const t3 of n2.getFlattenedFilters())
        if (e2.indexOf(t3.op) >= 0)
          return t3.op;
    return null;
  }(t.filters, function(t2) {
    switch (t2) {
      case "!=":
        return ["!=", "not-in"];
      case "array-contains-any":
      case "in":
        return ["not-in"];
      case "not-in":
        return ["array-contains-any", "in", "not-in", "!="];
      default:
        return [];
    }
  }(e.op));
  if (n !== null)
    throw n === e.op ? new U2(q2.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new U2(q2.INVALID_ARGUMENT, `Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`);
};
var jl = function(t, e, n) {
  if (!n.isEqual(e))
    throw new U2(q2.INVALID_ARGUMENT, `Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${e.toString()}' and so you must also use '${e.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${n.toString()}' instead.`);
};
var Hl = function(t, e, n) {
  let s;
  return s = t ? n && (n.merge || n.mergeFields) ? t.toFirestore(e, n) : t.toFirestore(e) : e, s;
};
var uf = function(t) {
  switch (t) {
    case 0:
      return "added";
    case 2:
    case 3:
      return "modified";
    case 1:
      return "removed";
    default:
      return O2();
  }
};
var af = function(t) {
  t = uh(t, fh);
  const e = uh(t.firestore, vh);
  return za2(bh(e), t._key).then((n) => Af(e, t, n));
};
var mf = function(t, e, n) {
  t = uh(t, fh);
  const s = uh(t.firestore, vh), i = Hl(t.converter, e, n);
  return Ef(s, [tl(Zh(s), "setDoc", t._key, i, t.converter !== null, n).toMutation(t._key, Fs.none())]);
};
var yf = function(t) {
  return Ef(uh(t.firestore, vh), [new Ys(t._key, Fs.none())]);
};
var If = function(t, ...e) {
  var n, s, i;
  t = getModularInstance(t);
  let r2 = {
    includeMetadataChanges: false
  }, o = 0;
  typeof e[o] != "object" || Th(e[o]) || (r2 = e[o], o++);
  const u = {
    includeMetadataChanges: r2.includeMetadataChanges
  };
  if (Th(e[o])) {
    const t2 = e[o];
    e[o] = (n = t2.next) === null || n === undefined ? undefined : n.bind(t2), e[o + 1] = (s = t2.error) === null || s === undefined ? undefined : s.bind(t2), e[o + 2] = (i = t2.complete) === null || i === undefined ? undefined : i.bind(t2);
  }
  let c, a, h;
  if (t instanceof fh)
    a = uh(t.firestore, vh), h = Gn(t._key.path), c = {
      next: (n2) => {
        e[o] && e[o](Af(a, t, n2));
      },
      error: e[o + 1],
      complete: e[o + 2]
    };
  else {
    const n2 = uh(t, dh);
    a = uh(n2.firestore, vh), h = n2._query;
    const s2 = new hf(a);
    c = {
      next: (t2) => {
        e[o] && e[o](new of(a, s2, n2, t2));
      },
      error: e[o + 1],
      complete: e[o + 2]
    }, El(t._query);
  }
  return function(t2, e2, n2, s2) {
    const i2 = new Va2(s2), r3 = new Nc2(e2, i2, n2);
    return t2.asyncQueue.enqueueAndForget(async () => Vc2(await Ka2(t2), r3)), () => {
      i2.Dc(), t2.asyncQueue.enqueueAndForget(async () => Sc2(await Ka2(t2), r3));
    };
  }(bh(a), h, u, c);
};
var Ef = function(t, e) {
  return function(t2, e2) {
    const n = new K2;
    return t2.asyncQueue.enqueueAndForget(async () => zc2(await qa2(t2), e2, n)), n.promise;
  }(bh(t), e);
};
var Af = function(t, e, n) {
  const s = n.docs.get(e._key), i = new hf(t);
  return new sf(t, i, e._key, s, new nf(n.hasPendingWrites, n.fromCache), e.converter);
};
var b = "@firebase/firestore";

class V2 {
  constructor(t) {
    this.uid = t;
  }
  isAuthenticated() {
    return this.uid != null;
  }
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(t) {
    return t.uid === this.uid;
  }
}
V2.UNAUTHENTICATED = new V2(null), V2.GOOGLE_CREDENTIALS = new V2("google-credentials-uid"), V2.FIRST_PARTY = new V2("first-party-uid"), V2.MOCK_USER = new V2("mock-user");
var S2 = "9.23.0";
var D2 = new Logger("@firebase/firestore");
var q2 = {
  OK: "ok",
  CANCELLED: "cancelled",
  UNKNOWN: "unknown",
  INVALID_ARGUMENT: "invalid-argument",
  DEADLINE_EXCEEDED: "deadline-exceeded",
  NOT_FOUND: "not-found",
  ALREADY_EXISTS: "already-exists",
  PERMISSION_DENIED: "permission-denied",
  UNAUTHENTICATED: "unauthenticated",
  RESOURCE_EXHAUSTED: "resource-exhausted",
  FAILED_PRECONDITION: "failed-precondition",
  ABORTED: "aborted",
  OUT_OF_RANGE: "out-of-range",
  UNIMPLEMENTED: "unimplemented",
  INTERNAL: "internal",
  UNAVAILABLE: "unavailable",
  DATA_LOSS: "data-loss"
};

class U2 extends FirebaseError {
  constructor(t, e) {
    super(t, e), this.code = t, this.message = e, this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
}

class K2 {
  constructor() {
    this.promise = new Promise((t, e) => {
      this.resolve = t, this.reject = e;
    });
  }
}

class G2 {
  constructor(t, e) {
    this.user = e, this.type = "OAuth", this.headers = new Map, this.headers.set("Authorization", `Bearer ${t}`);
  }
}

class Q2 {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {
  }
  start(t, e) {
    t.enqueueRetryable(() => e(V2.UNAUTHENTICATED));
  }
  shutdown() {
  }
}
class z2 {
  constructor(t) {
    this.t = t, this.currentUser = V2.UNAUTHENTICATED, this.i = 0, this.forceRefresh = false, this.auth = null;
  }
  start(t, e) {
    let n = this.i;
    const s = (t2) => this.i !== n ? (n = this.i, e(t2)) : Promise.resolve();
    let i = new K2;
    this.o = () => {
      this.i++, this.currentUser = this.u(), i.resolve(), i = new K2, t.enqueueRetryable(() => s(this.currentUser));
    };
    const r2 = () => {
      const e2 = i;
      t.enqueueRetryable(async () => {
        await e2.promise, await s(this.currentUser);
      });
    }, o = (t2) => {
      N2("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = t2, this.auth.addAuthTokenListener(this.o), r2();
    };
    this.t.onInit((t2) => o(t2)), setTimeout(() => {
      if (!this.auth) {
        const t2 = this.t.getImmediate({
          optional: true
        });
        t2 ? o(t2) : (N2("FirebaseAuthCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new K2);
      }
    }, 0), r2();
  }
  getToken() {
    const t = this.i, e = this.forceRefresh;
    return this.forceRefresh = false, this.auth ? this.auth.getToken(e).then((e2) => this.i !== t ? (N2("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e2 ? (F2(typeof e2.accessToken == "string"), new G2(e2.accessToken, this.currentUser)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.auth && this.auth.removeAuthTokenListener(this.o);
  }
  u() {
    const t = this.auth && this.auth.getUid();
    return F2(t === null || typeof t == "string"), new V2(t);
  }
}

class W2 {
  constructor(t, e, n) {
    this.h = t, this.l = e, this.m = n, this.type = "FirstParty", this.user = V2.FIRST_PARTY, this.g = new Map;
  }
  p() {
    return this.m ? this.m() : null;
  }
  get headers() {
    this.g.set("X-Goog-AuthUser", this.h);
    const t = this.p();
    return t && this.g.set("Authorization", t), this.l && this.g.set("X-Goog-Iam-Authorization-Token", this.l), this.g;
  }
}

class H2 {
  constructor(t, e, n) {
    this.h = t, this.l = e, this.m = n;
  }
  getToken() {
    return Promise.resolve(new W2(this.h, this.l, this.m));
  }
  start(t, e) {
    t.enqueueRetryable(() => e(V2.FIRST_PARTY));
  }
  shutdown() {
  }
  invalidateToken() {
  }
}

class J2 {
  constructor(t) {
    this.value = t, this.type = "AppCheck", this.headers = new Map, t && t.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
}

class Y2 {
  constructor(t) {
    this.I = t, this.forceRefresh = false, this.appCheck = null, this.T = null;
  }
  start(t, e) {
    const n = (t2) => {
      t2.error != null && N2("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${t2.error.message}`);
      const n2 = t2.token !== this.T;
      return this.T = t2.token, N2("FirebaseAppCheckTokenProvider", `Received ${n2 ? "new" : "existing"} token.`), n2 ? e(t2.token) : Promise.resolve();
    };
    this.o = (e2) => {
      t.enqueueRetryable(() => n(e2));
    };
    const s = (t2) => {
      N2("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = t2, this.appCheck.addTokenListener(this.o);
    };
    this.I.onInit((t2) => s(t2)), setTimeout(() => {
      if (!this.appCheck) {
        const t2 = this.I.getImmediate({
          optional: true
        });
        t2 ? s(t2) : N2("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
      }
    }, 0);
  }
  getToken() {
    const t = this.forceRefresh;
    return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(t).then((t2) => t2 ? (F2(typeof t2.token == "string"), this.T = t2.token, new J2(t2.token)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.appCheck && this.appCheck.removeTokenListener(this.o);
  }
}
class tt {
  static A() {
    const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length;
    let n = "";
    for (;n.length < 20; ) {
      const s = Z2(40);
      for (let i = 0;i < s.length; ++i)
        n.length < 20 && s[i] < e && (n += t.charAt(s[i] % t.length));
    }
    return n;
  }
}

class it {
  constructor(t, e) {
    if (this.seconds = t, this.nanoseconds = e, e < 0)
      throw new U2(q2.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
    if (e >= 1e9)
      throw new U2(q2.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
    if (t < -62135596800)
      throw new U2(q2.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
    if (t >= 253402300800)
      throw new U2(q2.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
  }
  static now() {
    return it.fromMillis(Date.now());
  }
  static fromDate(t) {
    return it.fromMillis(t.getTime());
  }
  static fromMillis(t) {
    const e = Math.floor(t / 1000), n = Math.floor(1e6 * (t - 1000 * e));
    return new it(e, n);
  }
  toDate() {
    return new Date(this.toMillis());
  }
  toMillis() {
    return 1000 * this.seconds + this.nanoseconds / 1e6;
  }
  _compareTo(t) {
    return this.seconds === t.seconds ? et(this.nanoseconds, t.nanoseconds) : et(this.seconds, t.seconds);
  }
  isEqual(t) {
    return t.seconds === this.seconds && t.nanoseconds === this.nanoseconds;
  }
  toString() {
    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
  }
  toJSON() {
    return {
      seconds: this.seconds,
      nanoseconds: this.nanoseconds
    };
  }
  valueOf() {
    const t = this.seconds - -62135596800;
    return String(t).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
  }
}

class rt {
  constructor(t) {
    this.timestamp = t;
  }
  static fromTimestamp(t) {
    return new rt(t);
  }
  static min() {
    return new rt(new it(0, 0));
  }
  static max() {
    return new rt(new it(253402300799, 999999999));
  }
  compareTo(t) {
    return this.timestamp._compareTo(t.timestamp);
  }
  isEqual(t) {
    return this.timestamp.isEqual(t.timestamp);
  }
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1000;
  }
  toString() {
    return "SnapshotVersion(" + this.timestamp.toString() + ")";
  }
  toTimestamp() {
    return this.timestamp;
  }
}

class ot {
  constructor(t, e, n) {
    e === undefined ? e = 0 : e > t.length && O2(), n === undefined ? n = t.length - e : n > t.length - e && O2(), this.segments = t, this.offset = e, this.len = n;
  }
  get length() {
    return this.len;
  }
  isEqual(t) {
    return ot.comparator(this, t) === 0;
  }
  child(t) {
    const e = this.segments.slice(this.offset, this.limit());
    return t instanceof ot ? t.forEach((t2) => {
      e.push(t2);
    }) : e.push(t), this.construct(e);
  }
  limit() {
    return this.offset + this.length;
  }
  popFirst(t) {
    return t = t === undefined ? 1 : t, this.construct(this.segments, this.offset + t, this.length - t);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(t) {
    return this.segments[this.offset + t];
  }
  isEmpty() {
    return this.length === 0;
  }
  isPrefixOf(t) {
    if (t.length < this.length)
      return false;
    for (let e = 0;e < this.length; e++)
      if (this.get(e) !== t.get(e))
        return false;
    return true;
  }
  isImmediateParentOf(t) {
    if (this.length + 1 !== t.length)
      return false;
    for (let e = 0;e < this.length; e++)
      if (this.get(e) !== t.get(e))
        return false;
    return true;
  }
  forEach(t) {
    for (let e = this.offset, n = this.limit();e < n; e++)
      t(this.segments[e]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  static comparator(t, e) {
    const n = Math.min(t.length, e.length);
    for (let s = 0;s < n; s++) {
      const n2 = t.get(s), i = e.get(s);
      if (n2 < i)
        return -1;
      if (n2 > i)
        return 1;
    }
    return t.length < e.length ? -1 : t.length > e.length ? 1 : 0;
  }
}

class ut extends ot {
  construct(t, e, n) {
    return new ut(t, e, n);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  static fromString(...t) {
    const e = [];
    for (const n of t) {
      if (n.indexOf("//") >= 0)
        throw new U2(q2.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
      e.push(...n.split("/").filter((t2) => t2.length > 0));
    }
    return new ut(e);
  }
  static emptyPath() {
    return new ut([]);
  }
}
var ct = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

class at extends ot {
  construct(t, e, n) {
    return new at(t, e, n);
  }
  static isValidIdentifier(t) {
    return ct.test(t);
  }
  canonicalString() {
    return this.toArray().map((t) => (t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), at.isValidIdentifier(t) || (t = "`" + t + "`"), t)).join(".");
  }
  toString() {
    return this.canonicalString();
  }
  isKeyField() {
    return this.length === 1 && this.get(0) === "__name__";
  }
  static keyField() {
    return new at(["__name__"]);
  }
  static fromServerFormat(t) {
    const e = [];
    let n = "", s = 0;
    const i = () => {
      if (n.length === 0)
        throw new U2(q2.INVALID_ARGUMENT, `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
      e.push(n), n = "";
    };
    let r2 = false;
    for (;s < t.length; ) {
      const e2 = t[s];
      if (e2 === "\\") {
        if (s + 1 === t.length)
          throw new U2(q2.INVALID_ARGUMENT, "Path has trailing escape character: " + t);
        const e3 = t[s + 1];
        if (e3 !== "\\" && e3 !== "." && e3 !== "`")
          throw new U2(q2.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t);
        n += e3, s += 2;
      } else
        e2 === "`" ? (r2 = !r2, s++) : e2 !== "." || r2 ? (n += e2, s++) : (i(), s++);
    }
    if (i(), r2)
      throw new U2(q2.INVALID_ARGUMENT, "Unterminated ` in path: " + t);
    return new at(e);
  }
  static emptyPath() {
    return new at([]);
  }
}

class ht {
  constructor(t) {
    this.path = t;
  }
  static fromPath(t) {
    return new ht(ut.fromString(t));
  }
  static fromName(t) {
    return new ht(ut.fromString(t).popFirst(5));
  }
  static empty() {
    return new ht(ut.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  hasCollectionId(t) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === t;
  }
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(t) {
    return t !== null && ut.comparator(this.path, t.path) === 0;
  }
  toString() {
    return this.path.toString();
  }
  static comparator(t, e) {
    return ut.comparator(t.path, e.path);
  }
  static isDocumentKey(t) {
    return t.length % 2 == 0;
  }
  static fromSegments(t) {
    return new ht(new ut(t.slice()));
  }
}

class lt {
  constructor(t, e, n, s) {
    this.indexId = t, this.collectionGroup = e, this.fields = n, this.indexState = s;
  }
}
lt.UNKNOWN_ID = -1;
class It {
  constructor(t, e, n) {
    this.readTime = t, this.documentKey = e, this.largestBatchId = n;
  }
  static min() {
    return new It(rt.min(), ht.empty(), -1);
  }
  static max() {
    return new It(rt.max(), ht.empty(), -1);
  }
}
var Et = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";

class At {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(t) {
    this.onCommittedListeners.push(t);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach((t) => t());
  }
}

class Rt {
  constructor(t) {
    this.nextCallback = null, this.catchCallback = null, this.result = undefined, this.error = undefined, this.isDone = false, this.callbackAttached = false, t((t2) => {
      this.isDone = true, this.result = t2, this.nextCallback && this.nextCallback(t2);
    }, (t2) => {
      this.isDone = true, this.error = t2, this.catchCallback && this.catchCallback(t2);
    });
  }
  catch(t) {
    return this.next(undefined, t);
  }
  next(t, e) {
    return this.callbackAttached && O2(), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(e, this.error) : this.wrapSuccess(t, this.result) : new Rt((n, s) => {
      this.nextCallback = (e2) => {
        this.wrapSuccess(t, e2).next(n, s);
      }, this.catchCallback = (t2) => {
        this.wrapFailure(e, t2).next(n, s);
      };
    });
  }
  toPromise() {
    return new Promise((t, e) => {
      this.next(t, e);
    });
  }
  wrapUserFunction(t) {
    try {
      const e = t();
      return e instanceof Rt ? e : Rt.resolve(e);
    } catch (t2) {
      return Rt.reject(t2);
    }
  }
  wrapSuccess(t, e) {
    return t ? this.wrapUserFunction(() => t(e)) : Rt.resolve(e);
  }
  wrapFailure(t, e) {
    return t ? this.wrapUserFunction(() => t(e)) : Rt.reject(e);
  }
  static resolve(t) {
    return new Rt((e, n) => {
      e(t);
    });
  }
  static reject(t) {
    return new Rt((e, n) => {
      n(t);
    });
  }
  static waitFor(t) {
    return new Rt((e, n) => {
      let s = 0, i = 0, r2 = false;
      t.forEach((t2) => {
        ++s, t2.next(() => {
          ++i, r2 && i === s && e();
        }, (t3) => n(t3));
      }), r2 = true, i === s && e();
    });
  }
  static or(t) {
    let e = Rt.resolve(false);
    for (const n of t)
      e = e.next((t2) => t2 ? Rt.resolve(t2) : n());
    return e;
  }
  static forEach(t, e) {
    const n = [];
    return t.forEach((t2, s) => {
      n.push(e.call(this, t2, s));
    }), this.waitFor(n);
  }
  static mapArray(t, e) {
    return new Rt((n, s) => {
      const i = t.length, r2 = new Array(i);
      let o = 0;
      for (let u = 0;u < i; u++) {
        const c = u;
        e(t[c]).next((t2) => {
          r2[c] = t2, ++o, o === i && n(r2);
        }, (t2) => s(t2));
      }
    });
  }
  static doWhile(t, e) {
    return new Rt((n, s) => {
      const i = () => {
        t() === true ? e().next(() => {
          i();
        }, s) : n();
      };
      i();
    });
  }
}
class Ot {
  constructor(t, e) {
    this.previousValue = t, e && (e.sequenceNumberHandler = (t2) => this.ot(t2), this.ut = (t2) => e.writeSequenceNumber(t2));
  }
  ot(t) {
    return this.previousValue = Math.max(t, this.previousValue), this.previousValue;
  }
  next() {
    const t = ++this.previousValue;
    return this.ut && this.ut(t), t;
  }
}
Ot.ct = -1;
var ae2 = [...[...[...[...["mutationQueues", "mutations", "documentMutations", "remoteDocuments", "targets", "owner", "targetGlobal", "targetDocuments"], "clientMetadata"], "remoteDocumentGlobal"], "collectionParents"], "bundles", "namedQueries"];
var he = [...ae2, "documentOverlays"];
var le = ["mutationQueues", "mutations", "documentMutations", "remoteDocumentsV14", "targets", "owner", "targetGlobal", "targetDocuments", "clientMetadata", "remoteDocumentGlobal", "collectionParents", "bundles", "namedQueries", "documentOverlays"];
var fe = le;
var de = [...fe, "indexConfiguration", "indexState", "indexEntries"];
class pe {
  constructor(t, e) {
    this.comparator = t, this.root = e || Te.EMPTY;
  }
  insert(t, e) {
    return new pe(this.comparator, this.root.insert(t, e, this.comparator).copy(null, null, Te.BLACK, null, null));
  }
  remove(t) {
    return new pe(this.comparator, this.root.remove(t, this.comparator).copy(null, null, Te.BLACK, null, null));
  }
  get(t) {
    let e = this.root;
    for (;!e.isEmpty(); ) {
      const n = this.comparator(t, e.key);
      if (n === 0)
        return e.value;
      n < 0 ? e = e.left : n > 0 && (e = e.right);
    }
    return null;
  }
  indexOf(t) {
    let e = 0, n = this.root;
    for (;!n.isEmpty(); ) {
      const s = this.comparator(t, n.key);
      if (s === 0)
        return e + n.left.size;
      s < 0 ? n = n.left : (e += n.left.size + 1, n = n.right);
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  get size() {
    return this.root.size;
  }
  minKey() {
    return this.root.minKey();
  }
  maxKey() {
    return this.root.maxKey();
  }
  inorderTraversal(t) {
    return this.root.inorderTraversal(t);
  }
  forEach(t) {
    this.inorderTraversal((e, n) => (t(e, n), false));
  }
  toString() {
    const t = [];
    return this.inorderTraversal((e, n) => (t.push(`${e}:${n}`), false)), `{${t.join(", ")}}`;
  }
  reverseTraversal(t) {
    return this.root.reverseTraversal(t);
  }
  getIterator() {
    return new Ie(this.root, null, this.comparator, false);
  }
  getIteratorFrom(t) {
    return new Ie(this.root, t, this.comparator, false);
  }
  getReverseIterator() {
    return new Ie(this.root, null, this.comparator, true);
  }
  getReverseIteratorFrom(t) {
    return new Ie(this.root, t, this.comparator, true);
  }
}

class Ie {
  constructor(t, e, n, s) {
    this.isReverse = s, this.nodeStack = [];
    let i = 1;
    for (;!t.isEmpty(); )
      if (i = e ? n(t.key, e) : 1, e && s && (i *= -1), i < 0)
        t = this.isReverse ? t.left : t.right;
      else {
        if (i === 0) {
          this.nodeStack.push(t);
          break;
        }
        this.nodeStack.push(t), t = this.isReverse ? t.right : t.left;
      }
  }
  getNext() {
    let t = this.nodeStack.pop();
    const e = {
      key: t.key,
      value: t.value
    };
    if (this.isReverse)
      for (t = t.left;!t.isEmpty(); )
        this.nodeStack.push(t), t = t.right;
    else
      for (t = t.right;!t.isEmpty(); )
        this.nodeStack.push(t), t = t.left;
    return e;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (this.nodeStack.length === 0)
      return null;
    const t = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: t.key,
      value: t.value
    };
  }
}

class Te {
  constructor(t, e, n, s, i) {
    this.key = t, this.value = e, this.color = n != null ? n : Te.RED, this.left = s != null ? s : Te.EMPTY, this.right = i != null ? i : Te.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  copy(t, e, n, s, i) {
    return new Te(t != null ? t : this.key, e != null ? e : this.value, n != null ? n : this.color, s != null ? s : this.left, i != null ? i : this.right);
  }
  isEmpty() {
    return false;
  }
  inorderTraversal(t) {
    return this.left.inorderTraversal(t) || t(this.key, this.value) || this.right.inorderTraversal(t);
  }
  reverseTraversal(t) {
    return this.right.reverseTraversal(t) || t(this.key, this.value) || this.left.reverseTraversal(t);
  }
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  minKey() {
    return this.min().key;
  }
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  insert(t, e, n) {
    let s = this;
    const i = n(t, s.key);
    return s = i < 0 ? s.copy(null, null, null, s.left.insert(t, e, n), null) : i === 0 ? s.copy(null, e, null, null, null) : s.copy(null, null, null, null, s.right.insert(t, e, n)), s.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty())
      return Te.EMPTY;
    let t = this;
    return t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), t = t.copy(null, null, null, t.left.removeMin(), null), t.fixUp();
  }
  remove(t, e) {
    let n, s = this;
    if (e(t, s.key) < 0)
      s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(t, e), null);
    else {
      if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), e(t, s.key) === 0) {
        if (s.right.isEmpty())
          return Te.EMPTY;
        n = s.right.min(), s = s.copy(n.key, n.value, null, null, s.right.removeMin());
      }
      s = s.copy(null, null, null, null, s.right.remove(t, e));
    }
    return s.fixUp();
  }
  isRed() {
    return this.color;
  }
  fixUp() {
    let t = this;
    return t.right.isRed() && !t.left.isRed() && (t = t.rotateLeft()), t.left.isRed() && t.left.left.isRed() && (t = t.rotateRight()), t.left.isRed() && t.right.isRed() && (t = t.colorFlip()), t;
  }
  moveRedLeft() {
    let t = this.colorFlip();
    return t.right.left.isRed() && (t = t.copy(null, null, null, null, t.right.rotateRight()), t = t.rotateLeft(), t = t.colorFlip()), t;
  }
  moveRedRight() {
    let t = this.colorFlip();
    return t.left.left.isRed() && (t = t.rotateRight(), t = t.colorFlip()), t;
  }
  rotateLeft() {
    const t = this.copy(null, null, Te.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, t, null);
  }
  rotateRight() {
    const t = this.copy(null, null, Te.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, t);
  }
  colorFlip() {
    const t = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, t, e);
  }
  checkMaxDepth() {
    const t = this.check();
    return Math.pow(2, t) <= this.size + 1;
  }
  check() {
    if (this.isRed() && this.left.isRed())
      throw O2();
    if (this.right.isRed())
      throw O2();
    const t = this.left.check();
    if (t !== this.right.check())
      throw O2();
    return t + (this.isRed() ? 0 : 1);
  }
}
Te.EMPTY = null, Te.RED = true, Te.BLACK = false;
Te.EMPTY = new class {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw O2();
  }
  get value() {
    throw O2();
  }
  get color() {
    throw O2();
  }
  get left() {
    throw O2();
  }
  get right() {
    throw O2();
  }
  copy(t, e, n, s, i) {
    return this;
  }
  insert(t, e, n) {
    return new Te(t, e);
  }
  remove(t, e) {
    return this;
  }
  isEmpty() {
    return true;
  }
  inorderTraversal(t) {
    return false;
  }
  reverseTraversal(t) {
    return false;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return false;
  }
  checkMaxDepth() {
    return true;
  }
  check() {
    return 0;
  }
};

class Ee {
  constructor(t) {
    this.comparator = t, this.data = new pe(this.comparator);
  }
  has(t) {
    return this.data.get(t) !== null;
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(t) {
    return this.data.indexOf(t);
  }
  forEach(t) {
    this.data.inorderTraversal((e, n) => (t(e), false));
  }
  forEachInRange(t, e) {
    const n = this.data.getIteratorFrom(t[0]);
    for (;n.hasNext(); ) {
      const s = n.getNext();
      if (this.comparator(s.key, t[1]) >= 0)
        return;
      e(s.key);
    }
  }
  forEachWhile(t, e) {
    let n;
    for (n = e !== undefined ? this.data.getIteratorFrom(e) : this.data.getIterator();n.hasNext(); ) {
      if (!t(n.getNext().key))
        return;
    }
  }
  firstAfterOrEqual(t) {
    const e = this.data.getIteratorFrom(t);
    return e.hasNext() ? e.getNext().key : null;
  }
  getIterator() {
    return new Ae(this.data.getIterator());
  }
  getIteratorFrom(t) {
    return new Ae(this.data.getIteratorFrom(t));
  }
  add(t) {
    return this.copy(this.data.remove(t).insert(t, true));
  }
  delete(t) {
    return this.has(t) ? this.copy(this.data.remove(t)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(t) {
    let e = this;
    return e.size < t.size && (e = t, t = this), t.forEach((t2) => {
      e = e.add(t2);
    }), e;
  }
  isEqual(t) {
    if (!(t instanceof Ee))
      return false;
    if (this.size !== t.size)
      return false;
    const e = this.data.getIterator(), n = t.data.getIterator();
    for (;e.hasNext(); ) {
      const t2 = e.getNext().key, s = n.getNext().key;
      if (this.comparator(t2, s) !== 0)
        return false;
    }
    return true;
  }
  toArray() {
    const t = [];
    return this.forEach((e) => {
      t.push(e);
    }), t;
  }
  toString() {
    const t = [];
    return this.forEach((e) => t.push(e)), "SortedSet(" + t.toString() + ")";
  }
  copy(t) {
    const e = new Ee(this.comparator);
    return e.data = t, e;
  }
}

class Ae {
  constructor(t) {
    this.iter = t;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
}

class Re {
  constructor(t) {
    this.fields = t, t.sort(at.comparator);
  }
  static empty() {
    return new Re([]);
  }
  unionWith(t) {
    let e = new Ee(at.comparator);
    for (const t2 of this.fields)
      e = e.add(t2);
    for (const n of t)
      e = e.add(n);
    return new Re(e.toArray());
  }
  covers(t) {
    for (const e of this.fields)
      if (e.isPrefixOf(t))
        return true;
    return false;
  }
  isEqual(t) {
    return nt(this.fields, t.fields, (t2, e) => t2.isEqual(e));
  }
}

class Pe extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
}

class Ve {
  constructor(t) {
    this.binaryString = t;
  }
  static fromBase64String(t) {
    const e = function(t2) {
      try {
        return atob(t2);
      } catch (t3) {
        throw typeof DOMException != "undefined" && t3 instanceof DOMException ? new Pe("Invalid base64 string: " + t3) : t3;
      }
    }(t);
    return new Ve(e);
  }
  static fromUint8Array(t) {
    const e = function(t2) {
      let e2 = "";
      for (let n = 0;n < t2.length; ++n)
        e2 += String.fromCharCode(t2[n]);
      return e2;
    }(t);
    return new Ve(e);
  }
  [Symbol.iterator]() {
    let t = 0;
    return {
      next: () => t < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(t++),
        done: false
      } : {
        value: undefined,
        done: true
      }
    };
  }
  toBase64() {
    return t = this.binaryString, btoa(t);
    var t;
  }
  toUint8Array() {
    return function(t) {
      const e = new Uint8Array(t.length);
      for (let n = 0;n < t.length; n++)
        e[n] = t.charCodeAt(n);
      return e;
    }(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(t) {
    return et(this.binaryString, t.binaryString);
  }
  isEqual(t) {
    return this.binaryString === t.binaryString;
  }
}
Ve.EMPTY_BYTE_STRING = new Ve("");
var Se = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);

class $e {
  constructor(t, e, n, s, i, r2, o, u, c) {
    this.databaseId = t, this.appId = e, this.persistenceKey = n, this.host = s, this.ssl = i, this.forceLongPolling = r2, this.autoDetectLongPolling = o, this.longPollingOptions = u, this.useFetchStreams = c;
  }
}

class Oe {
  constructor(t, e) {
    this.projectId = t, this.database = e || "(default)";
  }
  static empty() {
    return new Oe("", "");
  }
  get isDefaultDatabase() {
    return this.database === "(default)";
  }
  isEqual(t) {
    return t instanceof Oe && t.projectId === this.projectId && t.database === this.database;
  }
}
var Fe = {
  mapValue: {
    fields: {
      __type__: {
        stringValue: "__max__"
      }
    }
  }
};
class un {
  constructor(t) {
    this.value = t;
  }
  static empty() {
    return new un({
      mapValue: {}
    });
  }
  field(t) {
    if (t.isEmpty())
      return this.value;
    {
      let e = this.value;
      for (let n = 0;n < t.length - 1; ++n)
        if (e = (e.mapValue.fields || {})[t.get(n)], !Ze(e))
          return null;
      return e = (e.mapValue.fields || {})[t.lastSegment()], e || null;
    }
  }
  set(t, e) {
    this.getFieldsMap(t.popLast())[t.lastSegment()] = tn(e);
  }
  setAll(t) {
    let e = at.emptyPath(), n = {}, s = [];
    t.forEach((t2, i2) => {
      if (!e.isImmediateParentOf(i2)) {
        const t3 = this.getFieldsMap(e);
        this.applyChanges(t3, n, s), n = {}, s = [], e = i2.popLast();
      }
      t2 ? n[i2.lastSegment()] = tn(t2) : s.push(i2.lastSegment());
    });
    const i = this.getFieldsMap(e);
    this.applyChanges(i, n, s);
  }
  delete(t) {
    const e = this.field(t.popLast());
    Ze(e) && e.mapValue.fields && delete e.mapValue.fields[t.lastSegment()];
  }
  isEqual(t) {
    return qe(this.value, t.value);
  }
  getFieldsMap(t) {
    let e = this.value;
    e.mapValue.fields || (e.mapValue = {
      fields: {}
    });
    for (let n = 0;n < t.length; ++n) {
      let s = e.mapValue.fields[t.get(n)];
      Ze(s) && s.mapValue.fields || (s = {
        mapValue: {
          fields: {}
        }
      }, e.mapValue.fields[t.get(n)] = s), e = s;
    }
    return e.mapValue.fields;
  }
  applyChanges(t, e, n) {
    ge(e, (e2, n2) => t[e2] = n2);
    for (const e2 of n)
      delete t[e2];
  }
  clone() {
    return new un(tn(this.value));
  }
}

class an {
  constructor(t, e, n, s, i, r2, o) {
    this.key = t, this.documentType = e, this.version = n, this.readTime = s, this.createTime = i, this.data = r2, this.documentState = o;
  }
  static newInvalidDocument(t) {
    return new an(t, 0, rt.min(), rt.min(), rt.min(), un.empty(), 0);
  }
  static newFoundDocument(t, e, n, s) {
    return new an(t, 1, e, rt.min(), n, s, 0);
  }
  static newNoDocument(t, e) {
    return new an(t, 2, e, rt.min(), rt.min(), un.empty(), 0);
  }
  static newUnknownDocument(t, e) {
    return new an(t, 3, e, rt.min(), rt.min(), un.empty(), 2);
  }
  convertToFoundDocument(t, e) {
    return !this.createTime.isEqual(rt.min()) || this.documentType !== 2 && this.documentType !== 0 || (this.createTime = t), this.version = t, this.documentType = 1, this.data = e, this.documentState = 0, this;
  }
  convertToNoDocument(t) {
    return this.version = t, this.documentType = 2, this.data = un.empty(), this.documentState = 0, this;
  }
  convertToUnknownDocument(t) {
    return this.version = t, this.documentType = 3, this.data = un.empty(), this.documentState = 2, this;
  }
  setHasCommittedMutations() {
    return this.documentState = 2, this;
  }
  setHasLocalMutations() {
    return this.documentState = 1, this.version = rt.min(), this;
  }
  setReadTime(t) {
    return this.readTime = t, this;
  }
  get hasLocalMutations() {
    return this.documentState === 1;
  }
  get hasCommittedMutations() {
    return this.documentState === 2;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return this.documentType !== 0;
  }
  isFoundDocument() {
    return this.documentType === 1;
  }
  isNoDocument() {
    return this.documentType === 2;
  }
  isUnknownDocument() {
    return this.documentType === 3;
  }
  isEqual(t) {
    return t instanceof an && this.key.isEqual(t.key) && this.version.isEqual(t.version) && this.documentType === t.documentType && this.documentState === t.documentState && this.data.isEqual(t.data);
  }
  mutableCopy() {
    return new an(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
  }
}

class hn {
  constructor(t, e) {
    this.position = t, this.inclusive = e;
  }
}

class dn {
  constructor(t, e = "asc") {
    this.field = t, this.dir = e;
  }
}

class _n {
}

class mn extends _n {
  constructor(t, e, n) {
    super(), this.field = t, this.op = e, this.value = n;
  }
  static create(t, e, n) {
    return t.isKeyField() ? e === "in" || e === "not-in" ? this.createKeyFieldInFilter(t, e, n) : new Pn(t, e, n) : e === "array-contains" ? new Dn(t, n) : e === "in" ? new Cn(t, n) : e === "not-in" ? new xn(t, n) : e === "array-contains-any" ? new Nn(t, n) : new mn(t, e, n);
  }
  static createKeyFieldInFilter(t, e, n) {
    return e === "in" ? new bn(t, n) : new Vn(t, n);
  }
  matches(t) {
    const e = t.data.field(this.field);
    return this.op === "!=" ? e !== null && this.matchesComparison(Ke(e, this.value)) : e !== null && Le(this.value) === Le(e) && this.matchesComparison(Ke(e, this.value));
  }
  matchesComparison(t) {
    switch (this.op) {
      case "<":
        return t < 0;
      case "<=":
        return t <= 0;
      case "==":
        return t === 0;
      case "!=":
        return t !== 0;
      case ">":
        return t > 0;
      case ">=":
        return t >= 0;
      default:
        return O2();
    }
  }
  isInequality() {
    return ["<", "<=", ">", ">=", "!=", "not-in"].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
  getFirstInequalityField() {
    return this.isInequality() ? this.field : null;
  }
}

class gn extends _n {
  constructor(t, e) {
    super(), this.filters = t, this.op = e, this.lt = null;
  }
  static create(t, e) {
    return new gn(t, e);
  }
  matches(t) {
    return yn(this) ? this.filters.find((e) => !e.matches(t)) === undefined : this.filters.find((e) => e.matches(t)) !== undefined;
  }
  getFlattenedFilters() {
    return this.lt !== null || (this.lt = this.filters.reduce((t, e) => t.concat(e.getFlattenedFilters()), [])), this.lt;
  }
  getFilters() {
    return Object.assign([], this.filters);
  }
  getFirstInequalityField() {
    const t = this.ft((t2) => t2.isInequality());
    return t !== null ? t.field : null;
  }
  ft(t) {
    for (const e of this.getFlattenedFilters())
      if (t(e))
        return e;
    return null;
  }
}

class Pn extends mn {
  constructor(t, e, n) {
    super(t, e, n), this.key = ht.fromName(n.referenceValue);
  }
  matches(t) {
    const e = ht.comparator(t.key, this.key);
    return this.matchesComparison(e);
  }
}

class bn extends mn {
  constructor(t, e) {
    super(t, "in", e), this.keys = Sn("in", e);
  }
  matches(t) {
    return this.keys.some((e) => e.isEqual(t.key));
  }
}

class Vn extends mn {
  constructor(t, e) {
    super(t, "not-in", e), this.keys = Sn("not-in", e);
  }
  matches(t) {
    return !this.keys.some((e) => e.isEqual(t.key));
  }
}

class Dn extends mn {
  constructor(t, e) {
    super(t, "array-contains", e);
  }
  matches(t) {
    const e = t.data.field(this.field);
    return Je(e) && Ue(e.arrayValue, this.value);
  }
}

class Cn extends mn {
  constructor(t, e) {
    super(t, "in", e);
  }
  matches(t) {
    const e = t.data.field(this.field);
    return e !== null && Ue(this.value.arrayValue, e);
  }
}

class xn extends mn {
  constructor(t, e) {
    super(t, "not-in", e);
  }
  matches(t) {
    if (Ue(this.value.arrayValue, {
      nullValue: "NULL_VALUE"
    }))
      return false;
    const e = t.data.field(this.field);
    return e !== null && !Ue(this.value.arrayValue, e);
  }
}

class Nn extends mn {
  constructor(t, e) {
    super(t, "array-contains-any", e);
  }
  matches(t) {
    const e = t.data.field(this.field);
    return !(!Je(e) || !e.arrayValue.values) && e.arrayValue.values.some((t2) => Ue(this.value.arrayValue, t2));
  }
}

class kn {
  constructor(t, e = null, n = [], s = [], i = null, r2 = null, o = null) {
    this.path = t, this.collectionGroup = e, this.orderBy = n, this.filters = s, this.limit = i, this.startAt = r2, this.endAt = o, this.dt = null;
  }
}

class Un {
  constructor(t, e = null, n = [], s = [], i = null, r2 = "F", o = null, u = null) {
    this.path = t, this.collectionGroup = e, this.explicitOrderBy = n, this.filters = s, this.limit = i, this.limitType = r2, this.startAt = o, this.endAt = u, this.wt = null, this._t = null, this.startAt, this.endAt;
  }
}

class os {
  constructor(t, e) {
    this.mapKeyFn = t, this.equalsFn = e, this.inner = {}, this.innerSize = 0;
  }
  get(t) {
    const e = this.mapKeyFn(t), n = this.inner[e];
    if (n !== undefined) {
      for (const [e2, s] of n)
        if (this.equalsFn(e2, t))
          return s;
    }
  }
  has(t) {
    return this.get(t) !== undefined;
  }
  set(t, e) {
    const n = this.mapKeyFn(t), s = this.inner[n];
    if (s === undefined)
      return this.inner[n] = [[t, e]], void this.innerSize++;
    for (let n2 = 0;n2 < s.length; n2++)
      if (this.equalsFn(s[n2][0], t))
        return void (s[n2] = [t, e]);
    s.push([t, e]), this.innerSize++;
  }
  delete(t) {
    const e = this.mapKeyFn(t), n = this.inner[e];
    if (n === undefined)
      return false;
    for (let s = 0;s < n.length; s++)
      if (this.equalsFn(n[s][0], t))
        return n.length === 1 ? delete this.inner[e] : n.splice(s, 1), this.innerSize--, true;
    return false;
  }
  forEach(t) {
    ge(this.inner, (e, n) => {
      for (const [e2, s] of n)
        t(e2, s);
    });
  }
  isEmpty() {
    return ye(this.inner);
  }
  size() {
    return this.innerSize;
  }
}
var us = new pe(ht.comparator);
var as = new pe(ht.comparator);
var _s = new pe(ht.comparator);
var ms = new Ee(ht.comparator);
var ys = new Ee(et);

class As {
  constructor() {
    this._ = undefined;
  }
}

class bs extends As {
}

class Vs extends As {
  constructor(t) {
    super(), this.elements = t;
  }
}

class Ds extends As {
  constructor(t) {
    super(), this.elements = t;
  }
}

class xs extends As {
  constructor(t, e) {
    super(), this.serializer = t, this.gt = e;
  }
}
class Os {
  constructor(t, e) {
    this.version = t, this.transformResults = e;
  }
}

class Fs {
  constructor(t, e) {
    this.updateTime = t, this.exists = e;
  }
  static none() {
    return new Fs;
  }
  static exists(t) {
    return new Fs(undefined, t);
  }
  static updateTime(t) {
    return new Fs(t);
  }
  get isNone() {
    return this.updateTime === undefined && this.exists === undefined;
  }
  isEqual(t) {
    return this.exists === t.exists && (this.updateTime ? !!t.updateTime && this.updateTime.isEqual(t.updateTime) : !t.updateTime);
  }
}

class Ls {
}

class js extends Ls {
  constructor(t, e, n, s = []) {
    super(), this.key = t, this.value = e, this.precondition = n, this.fieldTransforms = s, this.type = 0;
  }
  getFieldMask() {
    return null;
  }
}

class zs extends Ls {
  constructor(t, e, n, s, i = []) {
    super(), this.key = t, this.data = e, this.fieldMask = n, this.precondition = s, this.fieldTransforms = i, this.type = 1;
  }
  getFieldMask() {
    return this.fieldMask;
  }
}

class Ys extends Ls {
  constructor(t, e) {
    super(), this.key = t, this.precondition = e, this.type = 2, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}

class Xs extends Ls {
  constructor(t, e) {
    super(), this.key = t, this.precondition = e, this.type = 3, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}

class Zs {
  constructor(t, e, n, s) {
    this.batchId = t, this.localWriteTime = e, this.baseMutations = n, this.mutations = s;
  }
  applyToRemoteDocument(t, e) {
    const n = e.mutationResults;
    for (let e2 = 0;e2 < this.mutations.length; e2++) {
      const s = this.mutations[e2];
      if (s.key.isEqual(t.key)) {
        Us(s, t, n[e2]);
      }
    }
  }
  applyToLocalView(t, e) {
    for (const n of this.baseMutations)
      n.key.isEqual(t.key) && (e = Ks(n, t, e, this.localWriteTime));
    for (const n of this.mutations)
      n.key.isEqual(t.key) && (e = Ks(n, t, e, this.localWriteTime));
    return e;
  }
  applyToLocalDocumentSet(t, e) {
    const n = ds();
    return this.mutations.forEach((s) => {
      const i = t.get(s.key), r2 = i.overlayedDocument;
      let o = this.applyToLocalView(r2, i.mutatedFields);
      o = e.has(s.key) ? null : o;
      const u = qs(r2, o);
      u !== null && n.set(s.key, u), r2.isValidDocument() || r2.convertToNoDocument(rt.min());
    }), n;
  }
  keys() {
    return this.mutations.reduce((t, e) => t.add(e.key), gs());
  }
  isEqual(t) {
    return this.batchId === t.batchId && nt(this.mutations, t.mutations, (t2, e) => Qs(t2, e)) && nt(this.baseMutations, t.baseMutations, (t2, e) => Qs(t2, e));
  }
}

class ti {
  constructor(t, e, n, s) {
    this.batch = t, this.commitVersion = e, this.mutationResults = n, this.docVersions = s;
  }
  static from(t, e, n) {
    F2(t.mutations.length === n.length);
    let s = _s;
    const i = t.mutations;
    for (let t2 = 0;t2 < i.length; t2++)
      s = s.insert(i[t2].key, n[t2].version);
    return new ti(t, e, n, s);
  }
}

class ei {
  constructor(t, e) {
    this.largestBatchId = t, this.mutation = e;
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(t) {
    return t !== null && this.mutation === t.mutation;
  }
  toString() {
    return `Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`;
  }
}
class si {
  constructor(t, e) {
    this.count = t, this.unchangedNames = e;
  }
}
var ii;
var ri;
(ri = ii || (ii = {}))[ri.OK = 0] = "OK", ri[ri.CANCELLED = 1] = "CANCELLED", ri[ri.UNKNOWN = 2] = "UNKNOWN", ri[ri.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", ri[ri.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", ri[ri.NOT_FOUND = 5] = "NOT_FOUND", ri[ri.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", ri[ri.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", ri[ri.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", ri[ri.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", ri[ri.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", ri[ri.ABORTED = 10] = "ABORTED", ri[ri.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", ri[ri.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", ri[ri.INTERNAL = 13] = "INTERNAL", ri[ri.UNAVAILABLE = 14] = "UNAVAILABLE", ri[ri.DATA_LOSS = 15] = "DATA_LOSS";

class ci {
  constructor() {
    this.onExistenceFilterMismatchCallbacks = new Map;
  }
  static get instance() {
    return ai;
  }
  static getOrCreateInstance() {
    return ai === null && (ai = new ci), ai;
  }
  onExistenceFilterMismatch(t) {
    const e = Symbol();
    return this.onExistenceFilterMismatchCallbacks.set(e, t), () => this.onExistenceFilterMismatchCallbacks.delete(e);
  }
  notifyOnExistenceFilterMismatch(t) {
    this.onExistenceFilterMismatchCallbacks.forEach((e) => e(t));
  }
}
var ai = null;
var li = new Integer([4294967295, 4294967295], 0);

class wi {
  constructor(t, e, n) {
    if (this.bitmap = t, this.padding = e, this.hashCount = n, e < 0 || e >= 8)
      throw new _i(`Invalid padding: ${e}`);
    if (n < 0)
      throw new _i(`Invalid hash count: ${n}`);
    if (t.length > 0 && this.hashCount === 0)
      throw new _i(`Invalid hash count: ${n}`);
    if (t.length === 0 && e !== 0)
      throw new _i(`Invalid padding when bitmap length is 0: ${e}`);
    this.It = 8 * t.length - e, this.Tt = Integer.fromNumber(this.It);
  }
  Et(t, e, n) {
    let s = t.add(e.multiply(Integer.fromNumber(n)));
    return s.compare(li) === 1 && (s = new Integer([s.getBits(0), s.getBits(1)], 0)), s.modulo(this.Tt).toNumber();
  }
  At(t) {
    return (this.bitmap[Math.floor(t / 8)] & 1 << t % 8) != 0;
  }
  vt(t) {
    if (this.It === 0)
      return false;
    const e = fi(t), [n, s] = di(e);
    for (let t2 = 0;t2 < this.hashCount; t2++) {
      const e2 = this.Et(n, s, t2);
      if (!this.At(e2))
        return false;
    }
    return true;
  }
  static create(t, e, n) {
    const s = t % 8 == 0 ? 0 : 8 - t % 8, i = new Uint8Array(Math.ceil(t / 8)), r2 = new wi(i, s, e);
    return n.forEach((t2) => r2.insert(t2)), r2;
  }
  insert(t) {
    if (this.It === 0)
      return;
    const e = fi(t), [n, s] = di(e);
    for (let t2 = 0;t2 < this.hashCount; t2++) {
      const e2 = this.Et(n, s, t2);
      this.Rt(e2);
    }
  }
  Rt(t) {
    const e = Math.floor(t / 8), n = t % 8;
    this.bitmap[e] |= 1 << n;
  }
}

class _i extends Error {
  constructor() {
    super(...arguments), this.name = "BloomFilterError";
  }
}

class mi {
  constructor(t, e, n, s, i) {
    this.snapshotVersion = t, this.targetChanges = e, this.targetMismatches = n, this.documentUpdates = s, this.resolvedLimboDocuments = i;
  }
  static createSynthesizedRemoteEventForCurrentChange(t, e, n) {
    const s = new Map;
    return s.set(t, gi.createSynthesizedTargetChangeForCurrentChange(t, e, n)), new mi(rt.min(), s, new pe(et), cs(), gs());
  }
}

class gi {
  constructor(t, e, n, s, i) {
    this.resumeToken = t, this.current = e, this.addedDocuments = n, this.modifiedDocuments = s, this.removedDocuments = i;
  }
  static createSynthesizedTargetChangeForCurrentChange(t, e, n) {
    return new gi(n, e, gs(), gs(), gs());
  }
}

class yi {
  constructor(t, e, n, s) {
    this.Pt = t, this.removedTargetIds = e, this.key = n, this.bt = s;
  }
}

class pi {
  constructor(t, e) {
    this.targetId = t, this.Vt = e;
  }
}

class Ii {
  constructor(t, e, n = Ve.EMPTY_BYTE_STRING, s = null) {
    this.state = t, this.targetIds = e, this.resumeToken = n, this.cause = s;
  }
}

class Ti {
  constructor() {
    this.St = 0, this.Dt = vi(), this.Ct = Ve.EMPTY_BYTE_STRING, this.xt = false, this.Nt = true;
  }
  get current() {
    return this.xt;
  }
  get resumeToken() {
    return this.Ct;
  }
  get kt() {
    return this.St !== 0;
  }
  get Mt() {
    return this.Nt;
  }
  $t(t) {
    t.approximateByteSize() > 0 && (this.Nt = true, this.Ct = t);
  }
  Ot() {
    let t = gs(), e = gs(), n = gs();
    return this.Dt.forEach((s, i) => {
      switch (i) {
        case 0:
          t = t.add(s);
          break;
        case 2:
          e = e.add(s);
          break;
        case 1:
          n = n.add(s);
          break;
        default:
          O2();
      }
    }), new gi(this.Ct, this.xt, t, e, n);
  }
  Ft() {
    this.Nt = false, this.Dt = vi();
  }
  Bt(t, e) {
    this.Nt = true, this.Dt = this.Dt.insert(t, e);
  }
  Lt(t) {
    this.Nt = true, this.Dt = this.Dt.remove(t);
  }
  qt() {
    this.St += 1;
  }
  Ut() {
    this.St -= 1;
  }
  Kt() {
    this.Nt = true, this.xt = true;
  }
}

class Ei {
  constructor(t) {
    this.Gt = t, this.Qt = new Map, this.jt = cs(), this.zt = Ai(), this.Wt = new pe(et);
  }
  Ht(t) {
    for (const e of t.Pt)
      t.bt && t.bt.isFoundDocument() ? this.Jt(e, t.bt) : this.Yt(e, t.key, t.bt);
    for (const e of t.removedTargetIds)
      this.Yt(e, t.key, t.bt);
  }
  Xt(t) {
    this.forEachTarget(t, (e) => {
      const n = this.Zt(e);
      switch (t.state) {
        case 0:
          this.te(e) && n.$t(t.resumeToken);
          break;
        case 1:
          n.Ut(), n.kt || n.Ft(), n.$t(t.resumeToken);
          break;
        case 2:
          n.Ut(), n.kt || this.removeTarget(e);
          break;
        case 3:
          this.te(e) && (n.Kt(), n.$t(t.resumeToken));
          break;
        case 4:
          this.te(e) && (this.ee(e), n.$t(t.resumeToken));
          break;
        default:
          O2();
      }
    });
  }
  forEachTarget(t, e) {
    t.targetIds.length > 0 ? t.targetIds.forEach(e) : this.Qt.forEach((t2, n) => {
      this.te(n) && e(n);
    });
  }
  ne(t) {
    var e;
    const n = t.targetId, s = t.Vt.count, i = this.se(n);
    if (i) {
      const r2 = i.target;
      if (Fn(r2))
        if (s === 0) {
          const t2 = new ht(r2.path);
          this.Yt(n, t2, an.newNoDocument(t2, rt.min()));
        } else
          F2(s === 1);
      else {
        const i2 = this.ie(n);
        if (i2 !== s) {
          const s2 = this.re(t, i2);
          if (s2 !== 0) {
            this.ee(n);
            const t2 = s2 === 2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
            this.Wt = this.Wt.insert(n, t2);
          }
          (e = ci.instance) === null || e === undefined || e.notifyOnExistenceFilterMismatch(function(t2, e2, n2) {
            var s3, i3, r3, o, u, c;
            const a = {
              localCacheCount: e2,
              existenceFilterCount: n2.count
            }, h = n2.unchangedNames;
            h && (a.bloomFilter = {
              applied: t2 === 0,
              hashCount: (s3 = h == null ? undefined : h.hashCount) !== null && s3 !== undefined ? s3 : 0,
              bitmapLength: (o = (r3 = (i3 = h == null ? undefined : h.bits) === null || i3 === undefined ? undefined : i3.bitmap) === null || r3 === undefined ? undefined : r3.length) !== null && o !== undefined ? o : 0,
              padding: (c = (u = h == null ? undefined : h.bits) === null || u === undefined ? undefined : u.padding) !== null && c !== undefined ? c : 0
            });
            return a;
          }(s2, i2, t.Vt));
        }
      }
    }
  }
  re(t, e) {
    const { unchangedNames: n, count: s } = t.Vt;
    if (!n || !n.bits)
      return 1;
    const { bits: { bitmap: i = "", padding: r2 = 0 }, hashCount: o = 0 } = n;
    let u, c;
    try {
      u = xe(i).toUint8Array();
    } catch (t2) {
      if (t2 instanceof Pe)
        return M2("Decoding the base64 bloom filter in existence filter failed (" + t2.message + "); ignoring the bloom filter and falling back to full re-query."), 1;
      throw t2;
    }
    try {
      c = new wi(u, r2, o);
    } catch (t2) {
      return M2(t2 instanceof _i ? "BloomFilter error: " : "Applying bloom filter failed: ", t2), 1;
    }
    if (c.It === 0)
      return 1;
    return s !== e - this.oe(t.targetId, c) ? 2 : 0;
  }
  oe(t, e) {
    const n = this.Gt.getRemoteKeysForTarget(t);
    let s = 0;
    return n.forEach((n2) => {
      const i = this.Gt.ue(), r2 = `projects/${i.projectId}/databases/${i.database}/documents/${n2.path.canonicalString()}`;
      e.vt(r2) || (this.Yt(t, n2, null), s++);
    }), s;
  }
  ce(t) {
    const e = new Map;
    this.Qt.forEach((n2, s2) => {
      const i = this.se(s2);
      if (i) {
        if (n2.current && Fn(i.target)) {
          const e2 = new ht(i.target.path);
          this.jt.get(e2) !== null || this.ae(s2, e2) || this.Yt(s2, e2, an.newNoDocument(e2, t));
        }
        n2.Mt && (e.set(s2, n2.Ot()), n2.Ft());
      }
    });
    let n = gs();
    this.zt.forEach((t2, e2) => {
      let s2 = true;
      e2.forEachWhile((t3) => {
        const e3 = this.se(t3);
        return !e3 || e3.purpose === "TargetPurposeLimboResolution" || (s2 = false, false);
      }), s2 && (n = n.add(t2));
    }), this.jt.forEach((e2, n2) => n2.setReadTime(t));
    const s = new mi(t, e, this.Wt, this.jt, n);
    return this.jt = cs(), this.zt = Ai(), this.Wt = new pe(et), s;
  }
  Jt(t, e) {
    if (!this.te(t))
      return;
    const n = this.ae(t, e.key) ? 2 : 0;
    this.Zt(t).Bt(e.key, n), this.jt = this.jt.insert(e.key, e), this.zt = this.zt.insert(e.key, this.he(e.key).add(t));
  }
  Yt(t, e, n) {
    if (!this.te(t))
      return;
    const s = this.Zt(t);
    this.ae(t, e) ? s.Bt(e, 1) : s.Lt(e), this.zt = this.zt.insert(e, this.he(e).delete(t)), n && (this.jt = this.jt.insert(e, n));
  }
  removeTarget(t) {
    this.Qt.delete(t);
  }
  ie(t) {
    const e = this.Zt(t).Ot();
    return this.Gt.getRemoteKeysForTarget(t).size + e.addedDocuments.size - e.removedDocuments.size;
  }
  qt(t) {
    this.Zt(t).qt();
  }
  Zt(t) {
    let e = this.Qt.get(t);
    return e || (e = new Ti, this.Qt.set(t, e)), e;
  }
  he(t) {
    let e = this.zt.get(t);
    return e || (e = new Ee(et), this.zt = this.zt.insert(t, e)), e;
  }
  te(t) {
    const e = this.se(t) !== null;
    return e || N2("WatchChangeAggregator", "Detected inactive target", t), e;
  }
  se(t) {
    const e = this.Qt.get(t);
    return e && e.kt ? null : this.Gt.le(t);
  }
  ee(t) {
    this.Qt.set(t, new Ti);
    this.Gt.getRemoteKeysForTarget(t).forEach((e) => {
      this.Yt(t, e, null);
    });
  }
  ae(t, e) {
    return this.Gt.getRemoteKeysForTarget(t).has(e);
  }
}
var Ri = (() => {
  const t = {
    asc: "ASCENDING",
    desc: "DESCENDING"
  };
  return t;
})();
var Pi = (() => {
  const t = {
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
  };
  return t;
})();
var bi = (() => {
  const t = {
    and: "AND",
    or: "OR"
  };
  return t;
})();

class Vi {
  constructor(t, e) {
    this.databaseId = t, this.useProto3Json = e;
  }
}

class cr {
  constructor(t, e, n, s, i = rt.min(), r2 = rt.min(), o = Ve.EMPTY_BYTE_STRING, u = null) {
    this.target = t, this.targetId = e, this.purpose = n, this.sequenceNumber = s, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = r2, this.resumeToken = o, this.expectedCount = u;
  }
  withSequenceNumber(t) {
    return new cr(this.target, this.targetId, this.purpose, t, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
  }
  withResumeToken(t, e) {
    return new cr(this.target, this.targetId, this.purpose, this.sequenceNumber, e, this.lastLimboFreeSnapshotVersion, t, null);
  }
  withExpectedCount(t) {
    return new cr(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, t);
  }
  withLastLimboFreeSnapshotVersion(t) {
    return new cr(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t, this.resumeToken, this.expectedCount);
  }
}

class ar {
  constructor(t) {
    this.fe = t;
  }
}
class br {
  constructor() {
  }
  _e(t, e) {
    this.me(t, e), e.ge();
  }
  me(t, e) {
    if ("nullValue" in t)
      this.ye(e, 5);
    else if ("booleanValue" in t)
      this.ye(e, 10), e.pe(t.booleanValue ? 1 : 0);
    else if ("integerValue" in t)
      this.ye(e, 15), e.pe(Ce(t.integerValue));
    else if ("doubleValue" in t) {
      const n = Ce(t.doubleValue);
      isNaN(n) ? this.ye(e, 13) : (this.ye(e, 15), Bt(n) ? e.pe(0) : e.pe(n));
    } else if ("timestampValue" in t) {
      const n = t.timestampValue;
      this.ye(e, 20), typeof n == "string" ? e.Ie(n) : (e.Ie(`${n.seconds || ""}`), e.pe(n.nanos || 0));
    } else if ("stringValue" in t)
      this.Te(t.stringValue, e), this.Ee(e);
    else if ("bytesValue" in t)
      this.ye(e, 30), e.Ae(xe(t.bytesValue)), this.Ee(e);
    else if ("referenceValue" in t)
      this.ve(t.referenceValue, e);
    else if ("geoPointValue" in t) {
      const n = t.geoPointValue;
      this.ye(e, 45), e.pe(n.latitude || 0), e.pe(n.longitude || 0);
    } else
      "mapValue" in t ? en(t) ? this.ye(e, Number.MAX_SAFE_INTEGER) : (this.Re(t.mapValue, e), this.Ee(e)) : ("arrayValue" in t) ? (this.Pe(t.arrayValue, e), this.Ee(e)) : O2();
  }
  Te(t, e) {
    this.ye(e, 25), this.be(t, e);
  }
  be(t, e) {
    e.Ie(t);
  }
  Re(t, e) {
    const n = t.fields || {};
    this.ye(e, 55);
    for (const t2 of Object.keys(n))
      this.Te(t2, e), this.me(n[t2], e);
  }
  Pe(t, e) {
    const n = t.values || [];
    this.ye(e, 50);
    for (const t2 of n)
      this.me(t2, e);
  }
  ve(t, e) {
    this.ye(e, 37);
    ht.fromName(t).path.forEach((t2) => {
      this.ye(e, 60), this.be(t2, e);
    });
  }
  ye(t, e) {
    t.pe(e);
  }
  Ee(t) {
    t.pe(2);
  }
}
br.Ve = new br;
class zr {
  constructor() {
    this.rn = new Wr;
  }
  addToCollectionParentIndex(t, e) {
    return this.rn.add(e), Rt.resolve();
  }
  getCollectionParents(t, e) {
    return Rt.resolve(this.rn.getEntries(e));
  }
  addFieldIndex(t, e) {
    return Rt.resolve();
  }
  deleteFieldIndex(t, e) {
    return Rt.resolve();
  }
  getDocumentsMatchingTarget(t, e) {
    return Rt.resolve(null);
  }
  getIndexType(t, e) {
    return Rt.resolve(0);
  }
  getFieldIndexes(t, e) {
    return Rt.resolve([]);
  }
  getNextCollectionGroupToUpdate(t) {
    return Rt.resolve(null);
  }
  getMinOffset(t, e) {
    return Rt.resolve(It.min());
  }
  getMinOffsetFromCollectionGroup(t, e) {
    return Rt.resolve(It.min());
  }
  updateCollectionGroup(t, e, n) {
    return Rt.resolve();
  }
  updateIndexEntries(t, e) {
    return Rt.resolve();
  }
}

class Wr {
  constructor() {
    this.index = {};
  }
  add(t) {
    const e = t.lastSegment(), n = t.popLast(), s = this.index[e] || new Ee(ut.comparator), i = !s.has(n);
    return this.index[e] = s.add(n), i;
  }
  has(t) {
    const e = t.lastSegment(), n = t.popLast(), s = this.index[e];
    return s && s.has(n);
  }
  getEntries(t) {
    return (this.index[t] || new Ee(ut.comparator)).toArray();
  }
}
var Hr = new Uint8Array(0);
class so {
  constructor(t, e, n) {
    this.cacheSizeCollectionThreshold = t, this.percentileToCollect = e, this.maximumSequenceNumbersToCollect = n;
  }
  static withCacheSize(t) {
    return new so(t, so.DEFAULT_COLLECTION_PERCENTILE, so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
}
so.DEFAULT_COLLECTION_PERCENTILE = 10, so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1000, so.DEFAULT = new so(41943040, so.DEFAULT_COLLECTION_PERCENTILE, so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), so.DISABLED = new so(-1, 0, 0);
class lo {
  constructor(t) {
    this.Nn = t;
  }
  next() {
    return this.Nn += 2, this.Nn;
  }
  static kn() {
    return new lo(0);
  }
  static Mn() {
    return new lo(-1);
  }
}
class vo {
  constructor() {
    this.changes = new os((t) => t.toString(), (t, e) => t.isEqual(e)), this.changesApplied = false;
  }
  addEntry(t) {
    this.assertNotApplied(), this.changes.set(t.key, t);
  }
  removeEntry(t, e) {
    this.assertNotApplied(), this.changes.set(t, an.newInvalidDocument(t).setReadTime(e));
  }
  getEntry(t, e) {
    this.assertNotApplied();
    const n = this.changes.get(e);
    return n !== undefined ? Rt.resolve(n) : this.getFromCache(t, e);
  }
  getEntries(t, e) {
    return this.getAllFromCache(t, e);
  }
  apply(t) {
    return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(t);
  }
  assertNotApplied() {
  }
}
class No {
  constructor(t, e) {
    this.overlayedDocument = t, this.mutatedFields = e;
  }
}

class ko {
  constructor(t, e, n, s) {
    this.remoteDocumentCache = t, this.mutationQueue = e, this.documentOverlayCache = n, this.indexManager = s;
  }
  getDocument(t, e) {
    let n = null;
    return this.documentOverlayCache.getOverlay(t, e).next((s) => (n = s, this.remoteDocumentCache.getEntry(t, e))).next((t2) => (n !== null && Ks(n.mutation, t2, Re.empty(), it.now()), t2));
  }
  getDocuments(t, e) {
    return this.remoteDocumentCache.getEntries(t, e).next((e2) => this.getLocalViewOfDocuments(t, e2, gs()).next(() => e2));
  }
  getLocalViewOfDocuments(t, e, n = gs()) {
    const s = fs();
    return this.populateOverlays(t, s, e).next(() => this.computeViews(t, e, s, n).next((t2) => {
      let e2 = hs();
      return t2.forEach((t3, n2) => {
        e2 = e2.insert(t3, n2.overlayedDocument);
      }), e2;
    }));
  }
  getOverlayedDocuments(t, e) {
    const n = fs();
    return this.populateOverlays(t, n, e).next(() => this.computeViews(t, e, n, gs()));
  }
  populateOverlays(t, e, n) {
    const s = [];
    return n.forEach((t2) => {
      e.has(t2) || s.push(t2);
    }), this.documentOverlayCache.getOverlays(t, s).next((t2) => {
      t2.forEach((t3, n2) => {
        e.set(t3, n2);
      });
    });
  }
  computeViews(t, e, n, s) {
    let i = cs();
    const r2 = ws(), o = ws();
    return e.forEach((t2, e2) => {
      const o2 = n.get(e2.key);
      s.has(e2.key) && (o2 === undefined || o2.mutation instanceof zs) ? i = i.insert(e2.key, e2) : o2 !== undefined ? (r2.set(e2.key, o2.mutation.getFieldMask()), Ks(o2.mutation, e2, o2.mutation.getFieldMask(), it.now())) : r2.set(e2.key, Re.empty());
    }), this.recalculateAndSaveOverlays(t, i).next((t2) => (t2.forEach((t3, e2) => r2.set(t3, e2)), e.forEach((t3, e2) => {
      var n2;
      return o.set(t3, new No(e2, (n2 = r2.get(t3)) !== null && n2 !== undefined ? n2 : null));
    }), o));
  }
  recalculateAndSaveOverlays(t, e) {
    const n = ws();
    let s = new pe((t2, e2) => t2 - e2), i = gs();
    return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t, e).next((t2) => {
      for (const i2 of t2)
        i2.keys().forEach((t3) => {
          const r2 = e.get(t3);
          if (r2 === null)
            return;
          let o = n.get(t3) || Re.empty();
          o = i2.applyToLocalView(r2, o), n.set(t3, o);
          const u = (s.get(i2.batchId) || gs()).add(t3);
          s = s.insert(i2.batchId, u);
        });
    }).next(() => {
      const r2 = [], o = s.getReverseIterator();
      for (;o.hasNext(); ) {
        const s2 = o.getNext(), u = s2.key, c = s2.value, a = ds();
        c.forEach((t2) => {
          if (!i.has(t2)) {
            const s3 = qs(e.get(t2), n.get(t2));
            s3 !== null && a.set(t2, s3), i = i.add(t2);
          }
        }), r2.push(this.documentOverlayCache.saveOverlays(t, u, a));
      }
      return Rt.waitFor(r2);
    }).next(() => n);
  }
  recalculateAndSaveOverlaysForDocumentKeys(t, e) {
    return this.remoteDocumentCache.getEntries(t, e).next((e2) => this.recalculateAndSaveOverlays(t, e2));
  }
  getDocumentsMatchingQuery(t, e, n) {
    return function(t2) {
      return ht.isDocumentKey(t2.path) && t2.collectionGroup === null && t2.filters.length === 0;
    }(e) ? this.getDocumentsMatchingDocumentQuery(t, e.path) : Wn(e) ? this.getDocumentsMatchingCollectionGroupQuery(t, e, n) : this.getDocumentsMatchingCollectionQuery(t, e, n);
  }
  getNextDocuments(t, e, n, s) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(t, e, n, s).next((i) => {
      const r2 = s - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(t, e, n.largestBatchId, s - i.size) : Rt.resolve(fs());
      let o = -1, u = i;
      return r2.next((e2) => Rt.forEach(e2, (e3, n2) => (o < n2.largestBatchId && (o = n2.largestBatchId), i.get(e3) ? Rt.resolve() : this.remoteDocumentCache.getEntry(t, e3).next((t2) => {
        u = u.insert(e3, t2);
      }))).next(() => this.populateOverlays(t, e2, i)).next(() => this.computeViews(t, u, e2, gs())).next((t2) => ({
        batchId: o,
        changes: ls(t2)
      })));
    });
  }
  getDocumentsMatchingDocumentQuery(t, e) {
    return this.getDocument(t, new ht(e)).next((t2) => {
      let e2 = hs();
      return t2.isFoundDocument() && (e2 = e2.insert(t2.key, t2)), e2;
    });
  }
  getDocumentsMatchingCollectionGroupQuery(t, e, n) {
    const s = e.collectionGroup;
    let i = hs();
    return this.indexManager.getCollectionParents(t, s).next((r2) => Rt.forEach(r2, (r3) => {
      const o = function(t2, e2) {
        return new Un(e2, null, t2.explicitOrderBy.slice(), t2.filters.slice(), t2.limit, t2.limitType, t2.startAt, t2.endAt);
      }(e, r3.child(s));
      return this.getDocumentsMatchingCollectionQuery(t, o, n).next((t2) => {
        t2.forEach((t3, e2) => {
          i = i.insert(t3, e2);
        });
      });
    }).next(() => i));
  }
  getDocumentsMatchingCollectionQuery(t, e, n) {
    let s;
    return this.documentOverlayCache.getOverlaysForCollection(t, e.path, n.largestBatchId).next((i) => (s = i, this.remoteDocumentCache.getDocumentsMatchingQuery(t, e, n, s))).next((t2) => {
      s.forEach((e2, n3) => {
        const s2 = n3.getKey();
        t2.get(s2) === null && (t2 = t2.insert(s2, an.newInvalidDocument(s2)));
      });
      let n2 = hs();
      return t2.forEach((t3, i) => {
        const r2 = s.get(t3);
        r2 !== undefined && Ks(r2.mutation, i, Re.empty(), it.now()), ns(e, i) && (n2 = n2.insert(t3, i));
      }), n2;
    });
  }
}

class Mo {
  constructor(t) {
    this.serializer = t, this.cs = new Map, this.hs = new Map;
  }
  getBundleMetadata(t, e) {
    return Rt.resolve(this.cs.get(e));
  }
  saveBundleMetadata(t, e) {
    var n;
    return this.cs.set(e.id, {
      id: (n = e).id,
      version: n.version,
      createTime: Ni(n.createTime)
    }), Rt.resolve();
  }
  getNamedQuery(t, e) {
    return Rt.resolve(this.hs.get(e));
  }
  saveNamedQuery(t, e) {
    return this.hs.set(e.name, function(t2) {
      return {
        name: t2.name,
        query: yr(t2.bundledQuery),
        readTime: Ni(t2.readTime)
      };
    }(e)), Rt.resolve();
  }
}

class $o {
  constructor() {
    this.overlays = new pe(ht.comparator), this.ls = new Map;
  }
  getOverlay(t, e) {
    return Rt.resolve(this.overlays.get(e));
  }
  getOverlays(t, e) {
    const n = fs();
    return Rt.forEach(e, (e2) => this.getOverlay(t, e2).next((t2) => {
      t2 !== null && n.set(e2, t2);
    })).next(() => n);
  }
  saveOverlays(t, e, n) {
    return n.forEach((n2, s) => {
      this.we(t, e, s);
    }), Rt.resolve();
  }
  removeOverlaysForBatchId(t, e, n) {
    const s = this.ls.get(n);
    return s !== undefined && (s.forEach((t2) => this.overlays = this.overlays.remove(t2)), this.ls.delete(n)), Rt.resolve();
  }
  getOverlaysForCollection(t, e, n) {
    const s = fs(), i = e.length + 1, r2 = new ht(e.child("")), o = this.overlays.getIteratorFrom(r2);
    for (;o.hasNext(); ) {
      const t2 = o.getNext().value, r3 = t2.getKey();
      if (!e.isPrefixOf(r3.path))
        break;
      r3.path.length === i && (t2.largestBatchId > n && s.set(t2.getKey(), t2));
    }
    return Rt.resolve(s);
  }
  getOverlaysForCollectionGroup(t, e, n, s) {
    let i = new pe((t2, e2) => t2 - e2);
    const r2 = this.overlays.getIterator();
    for (;r2.hasNext(); ) {
      const t2 = r2.getNext().value;
      if (t2.getKey().getCollectionGroup() === e && t2.largestBatchId > n) {
        let e2 = i.get(t2.largestBatchId);
        e2 === null && (e2 = fs(), i = i.insert(t2.largestBatchId, e2)), e2.set(t2.getKey(), t2);
      }
    }
    const o = fs(), u = i.getIterator();
    for (;u.hasNext(); ) {
      if (u.getNext().value.forEach((t2, e2) => o.set(t2, e2)), o.size() >= s)
        break;
    }
    return Rt.resolve(o);
  }
  we(t, e, n) {
    const s = this.overlays.get(n.key);
    if (s !== null) {
      const t2 = this.ls.get(s.largestBatchId).delete(n.key);
      this.ls.set(s.largestBatchId, t2);
    }
    this.overlays = this.overlays.insert(n.key, new ei(e, n));
    let i = this.ls.get(e);
    i === undefined && (i = gs(), this.ls.set(e, i)), this.ls.set(e, i.add(n.key));
  }
}

class Oo {
  constructor() {
    this.fs = new Ee(Fo.ds), this.ws = new Ee(Fo._s);
  }
  isEmpty() {
    return this.fs.isEmpty();
  }
  addReference(t, e) {
    const n = new Fo(t, e);
    this.fs = this.fs.add(n), this.ws = this.ws.add(n);
  }
  gs(t, e) {
    t.forEach((t2) => this.addReference(t2, e));
  }
  removeReference(t, e) {
    this.ys(new Fo(t, e));
  }
  ps(t, e) {
    t.forEach((t2) => this.removeReference(t2, e));
  }
  Is(t) {
    const e = new ht(new ut([])), n = new Fo(e, t), s = new Fo(e, t + 1), i = [];
    return this.ws.forEachInRange([n, s], (t2) => {
      this.ys(t2), i.push(t2.key);
    }), i;
  }
  Ts() {
    this.fs.forEach((t) => this.ys(t));
  }
  ys(t) {
    this.fs = this.fs.delete(t), this.ws = this.ws.delete(t);
  }
  Es(t) {
    const e = new ht(new ut([])), n = new Fo(e, t), s = new Fo(e, t + 1);
    let i = gs();
    return this.ws.forEachInRange([n, s], (t2) => {
      i = i.add(t2.key);
    }), i;
  }
  containsKey(t) {
    const e = new Fo(t, 0), n = this.fs.firstAfterOrEqual(e);
    return n !== null && t.isEqual(n.key);
  }
}

class Fo {
  constructor(t, e) {
    this.key = t, this.As = e;
  }
  static ds(t, e) {
    return ht.comparator(t.key, e.key) || et(t.As, e.As);
  }
  static _s(t, e) {
    return et(t.As, e.As) || ht.comparator(t.key, e.key);
  }
}

class Bo {
  constructor(t, e) {
    this.indexManager = t, this.referenceDelegate = e, this.mutationQueue = [], this.vs = 1, this.Rs = new Ee(Fo.ds);
  }
  checkEmpty(t) {
    return Rt.resolve(this.mutationQueue.length === 0);
  }
  addMutationBatch(t, e, n, s) {
    const i = this.vs;
    this.vs++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
    const r2 = new Zs(i, e, n, s);
    this.mutationQueue.push(r2);
    for (const e2 of s)
      this.Rs = this.Rs.add(new Fo(e2.key, i)), this.indexManager.addToCollectionParentIndex(t, e2.key.path.popLast());
    return Rt.resolve(r2);
  }
  lookupMutationBatch(t, e) {
    return Rt.resolve(this.Ps(e));
  }
  getNextMutationBatchAfterBatchId(t, e) {
    const n = e + 1, s = this.bs(n), i = s < 0 ? 0 : s;
    return Rt.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return Rt.resolve(this.mutationQueue.length === 0 ? -1 : this.vs - 1);
  }
  getAllMutationBatches(t) {
    return Rt.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(t, e) {
    const n = new Fo(e, 0), s = new Fo(e, Number.POSITIVE_INFINITY), i = [];
    return this.Rs.forEachInRange([n, s], (t2) => {
      const e2 = this.Ps(t2.As);
      i.push(e2);
    }), Rt.resolve(i);
  }
  getAllMutationBatchesAffectingDocumentKeys(t, e) {
    let n = new Ee(et);
    return e.forEach((t2) => {
      const e2 = new Fo(t2, 0), s = new Fo(t2, Number.POSITIVE_INFINITY);
      this.Rs.forEachInRange([e2, s], (t3) => {
        n = n.add(t3.As);
      });
    }), Rt.resolve(this.Vs(n));
  }
  getAllMutationBatchesAffectingQuery(t, e) {
    const n = e.path, s = n.length + 1;
    let i = n;
    ht.isDocumentKey(i) || (i = i.child(""));
    const r2 = new Fo(new ht(i), 0);
    let o = new Ee(et);
    return this.Rs.forEachWhile((t2) => {
      const e2 = t2.key.path;
      return !!n.isPrefixOf(e2) && (e2.length === s && (o = o.add(t2.As)), true);
    }, r2), Rt.resolve(this.Vs(o));
  }
  Vs(t) {
    const e = [];
    return t.forEach((t2) => {
      const n = this.Ps(t2);
      n !== null && e.push(n);
    }), e;
  }
  removeMutationBatch(t, e) {
    F2(this.Ss(e.batchId, "removed") === 0), this.mutationQueue.shift();
    let n = this.Rs;
    return Rt.forEach(e.mutations, (s) => {
      const i = new Fo(s.key, e.batchId);
      return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(t, s.key);
    }).next(() => {
      this.Rs = n;
    });
  }
  Cn(t) {
  }
  containsKey(t, e) {
    const n = new Fo(e, 0), s = this.Rs.firstAfterOrEqual(n);
    return Rt.resolve(e.isEqual(s && s.key));
  }
  performConsistencyCheck(t) {
    return this.mutationQueue.length, Rt.resolve();
  }
  Ss(t, e) {
    return this.bs(t);
  }
  bs(t) {
    if (this.mutationQueue.length === 0)
      return 0;
    return t - this.mutationQueue[0].batchId;
  }
  Ps(t) {
    const e = this.bs(t);
    if (e < 0 || e >= this.mutationQueue.length)
      return null;
    return this.mutationQueue[e];
  }
}

class Lo {
  constructor(t) {
    this.Ds = t, this.docs = new pe(ht.comparator), this.size = 0;
  }
  setIndexManager(t) {
    this.indexManager = t;
  }
  addEntry(t, e) {
    const n = e.key, s = this.docs.get(n), i = s ? s.size : 0, r2 = this.Ds(e);
    return this.docs = this.docs.insert(n, {
      document: e.mutableCopy(),
      size: r2
    }), this.size += r2 - i, this.indexManager.addToCollectionParentIndex(t, n.path.popLast());
  }
  removeEntry(t) {
    const e = this.docs.get(t);
    e && (this.docs = this.docs.remove(t), this.size -= e.size);
  }
  getEntry(t, e) {
    const n = this.docs.get(e);
    return Rt.resolve(n ? n.document.mutableCopy() : an.newInvalidDocument(e));
  }
  getEntries(t, e) {
    let n = cs();
    return e.forEach((t2) => {
      const e2 = this.docs.get(t2);
      n = n.insert(t2, e2 ? e2.document.mutableCopy() : an.newInvalidDocument(t2));
    }), Rt.resolve(n);
  }
  getDocumentsMatchingQuery(t, e, n, s) {
    let i = cs();
    const r2 = e.path, o = new ht(r2.child("")), u = this.docs.getIteratorFrom(o);
    for (;u.hasNext(); ) {
      const { key: t2, value: { document: o2 } } = u.getNext();
      if (!r2.isPrefixOf(t2.path))
        break;
      t2.path.length > r2.length + 1 || (Tt(pt(o2), n) <= 0 || (s.has(o2.key) || ns(e, o2)) && (i = i.insert(o2.key, o2.mutableCopy())));
    }
    return Rt.resolve(i);
  }
  getAllFromCollectionGroup(t, e, n, s) {
    O2();
  }
  Cs(t, e) {
    return Rt.forEach(this.docs, (t2) => e(t2));
  }
  newChangeBuffer(t) {
    return new qo(this);
  }
  getSize(t) {
    return Rt.resolve(this.size);
  }
}

class qo extends vo {
  constructor(t) {
    super(), this.os = t;
  }
  applyChanges(t) {
    const e = [];
    return this.changes.forEach((n, s) => {
      s.isValidDocument() ? e.push(this.os.addEntry(t, s)) : this.os.removeEntry(n);
    }), Rt.waitFor(e);
  }
  getFromCache(t, e) {
    return this.os.getEntry(t, e);
  }
  getAllFromCache(t, e) {
    return this.os.getEntries(t, e);
  }
}

class Uo {
  constructor(t) {
    this.persistence = t, this.xs = new os((t2) => $n(t2), On), this.lastRemoteSnapshotVersion = rt.min(), this.highestTargetId = 0, this.Ns = 0, this.ks = new Oo, this.targetCount = 0, this.Ms = lo.kn();
  }
  forEachTarget(t, e) {
    return this.xs.forEach((t2, n) => e(n)), Rt.resolve();
  }
  getLastRemoteSnapshotVersion(t) {
    return Rt.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(t) {
    return Rt.resolve(this.Ns);
  }
  allocateTargetId(t) {
    return this.highestTargetId = this.Ms.next(), Rt.resolve(this.highestTargetId);
  }
  setTargetsMetadata(t, e, n) {
    return n && (this.lastRemoteSnapshotVersion = n), e > this.Ns && (this.Ns = e), Rt.resolve();
  }
  Fn(t) {
    this.xs.set(t.target, t);
    const e = t.targetId;
    e > this.highestTargetId && (this.Ms = new lo(e), this.highestTargetId = e), t.sequenceNumber > this.Ns && (this.Ns = t.sequenceNumber);
  }
  addTargetData(t, e) {
    return this.Fn(e), this.targetCount += 1, Rt.resolve();
  }
  updateTargetData(t, e) {
    return this.Fn(e), Rt.resolve();
  }
  removeTargetData(t, e) {
    return this.xs.delete(e.target), this.ks.Is(e.targetId), this.targetCount -= 1, Rt.resolve();
  }
  removeTargets(t, e, n) {
    let s = 0;
    const i = [];
    return this.xs.forEach((r2, o) => {
      o.sequenceNumber <= e && n.get(o.targetId) === null && (this.xs.delete(r2), i.push(this.removeMatchingKeysForTargetId(t, o.targetId)), s++);
    }), Rt.waitFor(i).next(() => s);
  }
  getTargetCount(t) {
    return Rt.resolve(this.targetCount);
  }
  getTargetData(t, e) {
    const n = this.xs.get(e) || null;
    return Rt.resolve(n);
  }
  addMatchingKeys(t, e, n) {
    return this.ks.gs(e, n), Rt.resolve();
  }
  removeMatchingKeys(t, e, n) {
    this.ks.ps(e, n);
    const s = this.persistence.referenceDelegate, i = [];
    return s && e.forEach((e2) => {
      i.push(s.markPotentiallyOrphaned(t, e2));
    }), Rt.waitFor(i);
  }
  removeMatchingKeysForTargetId(t, e) {
    return this.ks.Is(e), Rt.resolve();
  }
  getMatchingKeysForTargetId(t, e) {
    const n = this.ks.Es(e);
    return Rt.resolve(n);
  }
  containsKey(t, e) {
    return Rt.resolve(this.ks.containsKey(e));
  }
}

class Ko {
  constructor(t, e) {
    this.$s = {}, this.overlays = {}, this.Os = new Ot(0), this.Fs = false, this.Fs = true, this.referenceDelegate = t(this), this.Bs = new Uo(this);
    this.indexManager = new zr, this.remoteDocumentCache = function(t2) {
      return new Lo(t2);
    }((t2) => this.referenceDelegate.Ls(t2)), this.serializer = new ar(e), this.qs = new Mo(this.serializer);
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return this.Fs = false, Promise.resolve();
  }
  get started() {
    return this.Fs;
  }
  setDatabaseDeletedListener() {
  }
  setNetworkEnabled() {
  }
  getIndexManager(t) {
    return this.indexManager;
  }
  getDocumentOverlayCache(t) {
    let e = this.overlays[t.toKey()];
    return e || (e = new $o, this.overlays[t.toKey()] = e), e;
  }
  getMutationQueue(t, e) {
    let n = this.$s[t.toKey()];
    return n || (n = new Bo(e, this.referenceDelegate), this.$s[t.toKey()] = n), n;
  }
  getTargetCache() {
    return this.Bs;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.qs;
  }
  runTransaction(t, e, n) {
    N2("MemoryPersistence", "Starting transaction:", t);
    const s = new Go(this.Os.next());
    return this.referenceDelegate.Us(), n(s).next((t2) => this.referenceDelegate.Ks(s).next(() => t2)).toPromise().then((t2) => (s.raiseOnCommittedEvent(), t2));
  }
  Gs(t, e) {
    return Rt.or(Object.values(this.$s).map((n) => () => n.containsKey(t, e)));
  }
}

class Go extends At {
  constructor(t) {
    super(), this.currentSequenceNumber = t;
  }
}

class Qo {
  constructor(t) {
    this.persistence = t, this.Qs = new Oo, this.js = null;
  }
  static zs(t) {
    return new Qo(t);
  }
  get Ws() {
    if (this.js)
      return this.js;
    throw O2();
  }
  addReference(t, e, n) {
    return this.Qs.addReference(n, e), this.Ws.delete(n.toString()), Rt.resolve();
  }
  removeReference(t, e, n) {
    return this.Qs.removeReference(n, e), this.Ws.add(n.toString()), Rt.resolve();
  }
  markPotentiallyOrphaned(t, e) {
    return this.Ws.add(e.toString()), Rt.resolve();
  }
  removeTarget(t, e) {
    this.Qs.Is(e.targetId).forEach((t2) => this.Ws.add(t2.toString()));
    const n = this.persistence.getTargetCache();
    return n.getMatchingKeysForTargetId(t, e.targetId).next((t2) => {
      t2.forEach((t3) => this.Ws.add(t3.toString()));
    }).next(() => n.removeTargetData(t, e));
  }
  Us() {
    this.js = new Set;
  }
  Ks(t) {
    const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return Rt.forEach(this.Ws, (n) => {
      const s = ht.fromPath(n);
      return this.Hs(t, s).next((t2) => {
        t2 || e.removeEntry(s, rt.min());
      });
    }).next(() => (this.js = null, e.apply(t)));
  }
  updateLimboDocument(t, e) {
    return this.Hs(t, e).next((t2) => {
      t2 ? this.Ws.delete(e.toString()) : this.Ws.add(e.toString());
    });
  }
  Ls(t) {
    return 0;
  }
  Hs(t, e) {
    return Rt.or([() => Rt.resolve(this.Qs.containsKey(e)), () => this.persistence.getTargetCache().containsKey(t, e), () => this.persistence.Gs(t, e)]);
  }
}
class tu {
  constructor(t, e, n, s) {
    this.targetId = t, this.fromCache = e, this.Fi = n, this.Bi = s;
  }
  static Li(t, e) {
    let n = gs(), s = gs();
    for (const t2 of e.docChanges)
      switch (t2.type) {
        case 0:
          n = n.add(t2.doc.key);
          break;
        case 1:
          s = s.add(t2.doc.key);
      }
    return new tu(t, e.fromCache, n, s);
  }
}

class eu {
  constructor() {
    this.qi = false;
  }
  initialize(t, e) {
    this.Ui = t, this.indexManager = e, this.qi = true;
  }
  getDocumentsMatchingQuery(t, e, n, s) {
    return this.Ki(t, e).next((i) => i || this.Gi(t, e, s, n)).next((n2) => n2 || this.Qi(t, e));
  }
  Ki(t, e) {
    if (Qn(e))
      return Rt.resolve(null);
    let n = Jn(e);
    return this.indexManager.getIndexType(t, n).next((s) => s === 0 ? null : (e.limit !== null && s === 1 && (e = Xn(e, null, "F"), n = Jn(e)), this.indexManager.getDocumentsMatchingTarget(t, n).next((s2) => {
      const i = gs(...s2);
      return this.Ui.getDocuments(t, i).next((s3) => this.indexManager.getMinOffset(t, n).next((n2) => {
        const r2 = this.ji(e, s3);
        return this.zi(e, r2, i, n2.readTime) ? this.Ki(t, Xn(e, null, "F")) : this.Wi(t, r2, e, n2);
      }));
    })));
  }
  Gi(t, e, n, s) {
    return Qn(e) || s.isEqual(rt.min()) ? this.Qi(t, e) : this.Ui.getDocuments(t, n).next((i) => {
      const r2 = this.ji(e, i);
      return this.zi(e, r2, n, s) ? this.Qi(t, e) : (C2() <= LogLevel.DEBUG && N2("QueryEngine", "Re-using previous result from %s to execute query: %s", s.toString(), es(e)), this.Wi(t, r2, e, yt(s, -1)));
    });
  }
  ji(t, e) {
    let n = new Ee(is(t));
    return e.forEach((e2, s) => {
      ns(t, s) && (n = n.add(s));
    }), n;
  }
  zi(t, e, n, s) {
    if (t.limit === null)
      return false;
    if (n.size !== e.size)
      return true;
    const i = t.limitType === "F" ? e.last() : e.first();
    return !!i && (i.hasPendingWrites || i.version.compareTo(s) > 0);
  }
  Qi(t, e) {
    return C2() <= LogLevel.DEBUG && N2("QueryEngine", "Using full collection scan to execute query:", es(e)), this.Ui.getDocumentsMatchingQuery(t, e, It.min());
  }
  Wi(t, e, n, s) {
    return this.Ui.getDocumentsMatchingQuery(t, n, s).next((t2) => (e.forEach((e2) => {
      t2 = t2.insert(e2.key, e2);
    }), t2));
  }
}

class nu {
  constructor(t, e, n, s) {
    this.persistence = t, this.Hi = e, this.serializer = s, this.Ji = new pe(et), this.Yi = new os((t2) => $n(t2), On), this.Xi = new Map, this.Zi = t.getRemoteDocumentCache(), this.Bs = t.getTargetCache(), this.qs = t.getBundleCache(), this.tr(n);
  }
  tr(t) {
    this.documentOverlayCache = this.persistence.getDocumentOverlayCache(t), this.indexManager = this.persistence.getIndexManager(t), this.mutationQueue = this.persistence.getMutationQueue(t, this.indexManager), this.localDocuments = new ko(this.Zi, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.Zi.setIndexManager(this.indexManager), this.Hi.initialize(this.localDocuments, this.indexManager);
  }
  collectGarbage(t) {
    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e) => t.collect(e, this.Ji));
  }
}
class Ru {
  constructor() {
    this.activeTargetIds = ps();
  }
  lr(t) {
    this.activeTargetIds = this.activeTargetIds.add(t);
  }
  dr(t) {
    this.activeTargetIds = this.activeTargetIds.delete(t);
  }
  hr() {
    const t = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now()
    };
    return JSON.stringify(t);
  }
}
class bu {
  constructor() {
    this.Hr = new Ru, this.Jr = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
  }
  addPendingMutation(t) {
  }
  updateMutationState(t, e, n) {
  }
  addLocalQueryTarget(t) {
    return this.Hr.lr(t), this.Jr[t] || "not-current";
  }
  updateQueryState(t, e, n) {
    this.Jr[t] = e;
  }
  removeLocalQueryTarget(t) {
    this.Hr.dr(t);
  }
  isLocalQueryTarget(t) {
    return this.Hr.activeTargetIds.has(t);
  }
  clearQueryState(t) {
    delete this.Jr[t];
  }
  getAllActiveQueryTargets() {
    return this.Hr.activeTargetIds;
  }
  isActiveQueryTarget(t) {
    return this.Hr.activeTargetIds.has(t);
  }
  start() {
    return this.Hr = new Ru, Promise.resolve();
  }
  handleUserChange(t, e, n) {
  }
  setOnlineState(t) {
  }
  shutdown() {
  }
  writeSequenceNumber(t) {
  }
  notifyBundleLoaded(t) {
  }
}

class Vu {
  Yr(t) {
  }
  shutdown() {
  }
}

class Su {
  constructor() {
    this.Xr = () => this.Zr(), this.eo = () => this.no(), this.so = [], this.io();
  }
  Yr(t) {
    this.so.push(t);
  }
  shutdown() {
    window.removeEventListener("online", this.Xr), window.removeEventListener("offline", this.eo);
  }
  io() {
    window.addEventListener("online", this.Xr), window.addEventListener("offline", this.eo);
  }
  Zr() {
    N2("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
    for (const t of this.so)
      t(0);
  }
  no() {
    N2("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
    for (const t of this.so)
      t(1);
  }
  static D() {
    return typeof window != "undefined" && window.addEventListener !== undefined && window.removeEventListener !== undefined;
  }
}
var Du = null;
var xu = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery",
  RunAggregationQuery: "runAggregationQuery"
};

class Nu {
  constructor(t) {
    this.ro = t.ro, this.oo = t.oo;
  }
  uo(t) {
    this.co = t;
  }
  ao(t) {
    this.ho = t;
  }
  onMessage(t) {
    this.lo = t;
  }
  close() {
    this.oo();
  }
  send(t) {
    this.ro(t);
  }
  fo() {
    this.co();
  }
  wo(t) {
    this.ho(t);
  }
  _o(t) {
    this.lo(t);
  }
}
var ku = "WebChannelConnection";

class Mu extends class {
  constructor(t) {
    this.databaseInfo = t, this.databaseId = t.databaseId;
    const e = t.ssl ? "https" : "http";
    this.mo = e + "://" + t.host, this.yo = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
  }
  get po() {
    return false;
  }
  Io(t, e, n, s, i) {
    const r2 = Cu(), o = this.To(t, e);
    N2("RestConnection", `Sending RPC '${t}' ${r2}:`, o, n);
    const u = {};
    return this.Eo(u, s, i), this.Ao(t, o, u, n).then((e2) => (N2("RestConnection", `Received RPC '${t}' ${r2}: `, e2), e2), (e2) => {
      throw M2("RestConnection", `RPC '${t}' ${r2} failed with error: `, e2, "url: ", o, "request:", n), e2;
    });
  }
  vo(t, e, n, s, i, r2) {
    return this.Io(t, e, n, s, i);
  }
  Eo(t, e, n) {
    t["X-Goog-Api-Client"] = "gl-js/ fire/" + S2, t["Content-Type"] = "text/plain", this.databaseInfo.appId && (t["X-Firebase-GMPID"] = this.databaseInfo.appId), e && e.headers.forEach((e2, n2) => t[n2] = e2), n && n.headers.forEach((e2, n2) => t[n2] = e2);
  }
  To(t, e) {
    const n = xu[t];
    return `${this.mo}/v1/${e}:${n}`;
  }
} {
  constructor(t) {
    super(t), this.forceLongPolling = t.forceLongPolling, this.autoDetectLongPolling = t.autoDetectLongPolling, this.useFetchStreams = t.useFetchStreams, this.longPollingOptions = t.longPollingOptions;
  }
  Ao(t, e, n, s) {
    const i = Cu();
    return new Promise((r2, o) => {
      const u = new XhrIo;
      u.setWithCredentials(true), u.listenOnce(EventType.COMPLETE, () => {
        try {
          switch (u.getLastErrorCode()) {
            case ErrorCode.NO_ERROR:
              const e2 = u.getResponseJson();
              N2(ku, `XHR for RPC '${t}' ${i} received:`, JSON.stringify(e2)), r2(e2);
              break;
            case ErrorCode.TIMEOUT:
              N2(ku, `RPC '${t}' ${i} timed out`), o(new U2(q2.DEADLINE_EXCEEDED, "Request time out"));
              break;
            case ErrorCode.HTTP_ERROR:
              const n2 = u.getStatus();
              if (N2(ku, `RPC '${t}' ${i} failed with status:`, n2, "response text:", u.getResponseText()), n2 > 0) {
                let t2 = u.getResponseJson();
                Array.isArray(t2) && (t2 = t2[0]);
                const e3 = t2 == null ? undefined : t2.error;
                if (e3 && e3.status && e3.message) {
                  const t3 = function(t4) {
                    const e4 = t4.toLowerCase().replace(/_/g, "-");
                    return Object.values(q2).indexOf(e4) >= 0 ? e4 : q2.UNKNOWN;
                  }(e3.status);
                  o(new U2(t3, e3.message));
                } else
                  o(new U2(q2.UNKNOWN, "Server responded with status " + u.getStatus()));
              } else
                o(new U2(q2.UNAVAILABLE, "Connection failed."));
              break;
            default:
              O2();
          }
        } finally {
          N2(ku, `RPC '${t}' ${i} completed.`);
        }
      });
      const c = JSON.stringify(s);
      N2(ku, `RPC '${t}' ${i} sending request:`, s), u.send(e, "POST", c, n, 15);
    });
  }
  Ro(t, e, n) {
    const s = Cu(), i = [this.mo, "/", "google.firestore.v1.Firestore", "/", t, "/channel"], r2 = createWebChannelTransport(), o = getStatEventTarget(), u = {
      httpSessionIdParam: "gsessionid",
      initMessageHeaders: {},
      messageUrlParams: {
        database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
      },
      sendRawJson: true,
      supportsCrossDomainXhr: true,
      internalChannelParams: {
        forwardChannelRequestTimeoutMs: 600000
      },
      forceLongPolling: this.forceLongPolling,
      detectBufferingProxy: this.autoDetectLongPolling
    }, c = this.longPollingOptions.timeoutSeconds;
    c !== undefined && (u.longPollingTimeout = Math.round(1000 * c)), this.useFetchStreams && (u.xmlHttpFactory = new FetchXmlHttpFactory({})), this.Eo(u.initMessageHeaders, e, n), u.encodeInitMessageHeaders = true;
    const a = i.join("");
    N2(ku, `Creating RPC '${t}' stream ${s}: ${a}`, u);
    const h = r2.createWebChannel(a, u);
    let l2 = false, f = false;
    const d = new Nu({
      ro: (e2) => {
        f ? N2(ku, `Not sending because RPC '${t}' stream ${s} is closed:`, e2) : (l2 || (N2(ku, `Opening RPC '${t}' stream ${s} transport.`), h.open(), l2 = true), N2(ku, `RPC '${t}' stream ${s} sending:`, e2), h.send(e2));
      },
      oo: () => h.close()
    }), w2 = (t2, e2, n2) => {
      t2.listen(e2, (t3) => {
        try {
          n2(t3);
        } catch (t4) {
          setTimeout(() => {
            throw t4;
          }, 0);
        }
      });
    };
    return w2(h, WebChannel.EventType.OPEN, () => {
      f || N2(ku, `RPC '${t}' stream ${s} transport opened.`);
    }), w2(h, WebChannel.EventType.CLOSE, () => {
      f || (f = true, N2(ku, `RPC '${t}' stream ${s} transport closed`), d.wo());
    }), w2(h, WebChannel.EventType.ERROR, (e2) => {
      f || (f = true, M2(ku, `RPC '${t}' stream ${s} transport errored:`, e2), d.wo(new U2(q2.UNAVAILABLE, "The operation could not be completed")));
    }), w2(h, WebChannel.EventType.MESSAGE, (e2) => {
      var n2;
      if (!f) {
        const i2 = e2.data[0];
        F2(!!i2);
        const r3 = i2, o2 = r3.error || ((n2 = r3[0]) === null || n2 === undefined ? undefined : n2.error);
        if (o2) {
          N2(ku, `RPC '${t}' stream ${s} received error:`, o2);
          const e3 = o2.status;
          let n3 = function(t2) {
            const e4 = ii[t2];
            if (e4 !== undefined)
              return ui(e4);
          }(e3), i3 = o2.message;
          n3 === undefined && (n3 = q2.INTERNAL, i3 = "Unknown error status: " + e3 + " with message " + o2.message), f = true, d.wo(new U2(n3, i3)), h.close();
        } else
          N2(ku, `RPC '${t}' stream ${s} received:`, i2), d._o(i2);
      }
    }), w2(o, Event.STAT_EVENT, (e2) => {
      e2.stat === Stat.PROXY ? N2(ku, `RPC '${t}' stream ${s} detected buffering proxy`) : e2.stat === Stat.NOPROXY && N2(ku, `RPC '${t}' stream ${s} detected no buffering proxy`);
    }), setTimeout(() => {
      d.fo();
    }, 0), d;
  }
}

class Bu {
  constructor(t, e, n = 1000, s = 1.5, i = 60000) {
    this.ii = t, this.timerId = e, this.Po = n, this.bo = s, this.Vo = i, this.So = 0, this.Do = null, this.Co = Date.now(), this.reset();
  }
  reset() {
    this.So = 0;
  }
  xo() {
    this.So = this.Vo;
  }
  No(t) {
    this.cancel();
    const e = Math.floor(this.So + this.ko()), n = Math.max(0, Date.now() - this.Co), s = Math.max(0, e - n);
    s > 0 && N2("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.So} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), this.Do = this.ii.enqueueAfterDelay(this.timerId, s, () => (this.Co = Date.now(), t())), this.So *= this.bo, this.So < this.Po && (this.So = this.Po), this.So > this.Vo && (this.So = this.Vo);
  }
  Mo() {
    this.Do !== null && (this.Do.skipDelay(), this.Do = null);
  }
  cancel() {
    this.Do !== null && (this.Do.cancel(), this.Do = null);
  }
  ko() {
    return (Math.random() - 0.5) * this.So;
  }
}

class Lu {
  constructor(t, e, n, s, i, r2, o, u) {
    this.ii = t, this.$o = n, this.Oo = s, this.connection = i, this.authCredentialsProvider = r2, this.appCheckCredentialsProvider = o, this.listener = u, this.state = 0, this.Fo = 0, this.Bo = null, this.Lo = null, this.stream = null, this.qo = new Bu(t, e);
  }
  Uo() {
    return this.state === 1 || this.state === 5 || this.Ko();
  }
  Ko() {
    return this.state === 2 || this.state === 3;
  }
  start() {
    this.state !== 4 ? this.auth() : this.Go();
  }
  async stop() {
    this.Uo() && await this.close(0);
  }
  Qo() {
    this.state = 0, this.qo.reset();
  }
  jo() {
    this.Ko() && this.Bo === null && (this.Bo = this.ii.enqueueAfterDelay(this.$o, 60000, () => this.zo()));
  }
  Wo(t) {
    this.Ho(), this.stream.send(t);
  }
  async zo() {
    if (this.Ko())
      return this.close(0);
  }
  Ho() {
    this.Bo && (this.Bo.cancel(), this.Bo = null);
  }
  Jo() {
    this.Lo && (this.Lo.cancel(), this.Lo = null);
  }
  async close(t, e) {
    this.Ho(), this.Jo(), this.qo.cancel(), this.Fo++, t !== 4 ? this.qo.reset() : e && e.code === q2.RESOURCE_EXHAUSTED ? (k2(e.toString()), k2("Using maximum backoff delay to prevent overloading the backend."), this.qo.xo()) : e && e.code === q2.UNAUTHENTICATED && this.state !== 3 && (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), this.stream !== null && (this.Yo(), this.stream.close(), this.stream = null), this.state = t, await this.listener.ao(e);
  }
  Yo() {
  }
  auth() {
    this.state = 1;
    const t = this.Xo(this.Fo), e = this.Fo;
    Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([t2, n]) => {
      this.Fo === e && this.Zo(t2, n);
    }, (e2) => {
      t(() => {
        const t2 = new U2(q2.UNKNOWN, "Fetching auth token failed: " + e2.message);
        return this.tu(t2);
      });
    });
  }
  Zo(t, e) {
    const n = this.Xo(this.Fo);
    this.stream = this.eu(t, e), this.stream.uo(() => {
      n(() => (this.state = 2, this.Lo = this.ii.enqueueAfterDelay(this.Oo, 1e4, () => (this.Ko() && (this.state = 3), Promise.resolve())), this.listener.uo()));
    }), this.stream.ao((t2) => {
      n(() => this.tu(t2));
    }), this.stream.onMessage((t2) => {
      n(() => this.onMessage(t2));
    });
  }
  Go() {
    this.state = 5, this.qo.No(async () => {
      this.state = 0, this.start();
    });
  }
  tu(t) {
    return N2("PersistentStream", `close with error: ${t}`), this.stream = null, this.close(4, t);
  }
  Xo(t) {
    return (e) => {
      this.ii.enqueueAndForget(() => this.Fo === t ? e() : (N2("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
    };
  }
}

class qu extends Lu {
  constructor(t, e, n, s, i, r2) {
    super(t, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", e, n, s, r2), this.serializer = i;
  }
  eu(t, e) {
    return this.connection.Ro("Listen", t, e);
  }
  onMessage(t) {
    this.qo.reset();
    const e = Qi(this.serializer, t), n = function(t2) {
      if (!("targetChange" in t2))
        return rt.min();
      const e2 = t2.targetChange;
      return e2.targetIds && e2.targetIds.length ? rt.min() : e2.readTime ? Ni(e2.readTime) : rt.min();
    }(t);
    return this.listener.nu(e, n);
  }
  su(t) {
    const e = {};
    e.database = Li(this.serializer), e.addTarget = function(t2, e2) {
      let n2;
      const s = e2.target;
      if (n2 = Fn(s) ? {
        documents: Hi(t2, s)
      } : {
        query: Ji(t2, s)
      }, n2.targetId = e2.targetId, e2.resumeToken.approximateByteSize() > 0) {
        n2.resumeToken = Ci(t2, e2.resumeToken);
        const s2 = Si(t2, e2.expectedCount);
        s2 !== null && (n2.expectedCount = s2);
      } else if (e2.snapshotVersion.compareTo(rt.min()) > 0) {
        n2.readTime = Di(t2, e2.snapshotVersion.toTimestamp());
        const s2 = Si(t2, e2.expectedCount);
        s2 !== null && (n2.expectedCount = s2);
      }
      return n2;
    }(this.serializer, t);
    const n = Xi(this.serializer, t);
    n && (e.labels = n), this.Wo(e);
  }
  iu(t) {
    const e = {};
    e.database = Li(this.serializer), e.removeTarget = t, this.Wo(e);
  }
}

class Uu extends Lu {
  constructor(t, e, n, s, i, r2) {
    super(t, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", e, n, s, r2), this.serializer = i, this.ru = false;
  }
  get ou() {
    return this.ru;
  }
  start() {
    this.ru = false, this.lastStreamToken = undefined, super.start();
  }
  Yo() {
    this.ru && this.uu([]);
  }
  eu(t, e) {
    return this.connection.Ro("Write", t, e);
  }
  onMessage(t) {
    if (F2(!!t.streamToken), this.lastStreamToken = t.streamToken, this.ru) {
      this.qo.reset();
      const e = Wi(t.writeResults, t.commitTime), n = Ni(t.commitTime);
      return this.listener.cu(n, e);
    }
    return F2(!t.writeResults || t.writeResults.length === 0), this.ru = true, this.listener.au();
  }
  hu() {
    const t = {};
    t.database = Li(this.serializer), this.Wo(t);
  }
  uu(t) {
    const e = {
      streamToken: this.lastStreamToken,
      writes: t.map((t2) => ji(this.serializer, t2))
    };
    this.Wo(e);
  }
}

class Ku extends class {
} {
  constructor(t, e, n, s) {
    super(), this.authCredentials = t, this.appCheckCredentials = e, this.connection = n, this.serializer = s, this.lu = false;
  }
  fu() {
    if (this.lu)
      throw new U2(q2.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  Io(t, e, n) {
    return this.fu(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([s, i]) => this.connection.Io(t, e, n, s, i)).catch((t2) => {
      throw t2.name === "FirebaseError" ? (t2.code === q2.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), t2) : new U2(q2.UNKNOWN, t2.toString());
    });
  }
  vo(t, e, n, s) {
    return this.fu(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([i, r2]) => this.connection.vo(t, e, n, i, r2, s)).catch((t2) => {
      throw t2.name === "FirebaseError" ? (t2.code === q2.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), t2) : new U2(q2.UNKNOWN, t2.toString());
    });
  }
  terminate() {
    this.lu = true;
  }
}

class Qu {
  constructor(t, e) {
    this.asyncQueue = t, this.onlineStateHandler = e, this.state = "Unknown", this.wu = 0, this._u = null, this.mu = true;
  }
  gu() {
    this.wu === 0 && (this.yu("Unknown"), this._u = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this._u = null, this.pu("Backend didn't respond within 10 seconds."), this.yu("Offline"), Promise.resolve())));
  }
  Iu(t) {
    this.state === "Online" ? this.yu("Unknown") : (this.wu++, this.wu >= 1 && (this.Tu(), this.pu(`Connection failed 1 times. Most recent error: ${t.toString()}`), this.yu("Offline")));
  }
  set(t) {
    this.Tu(), this.wu = 0, t === "Online" && (this.mu = false), this.yu(t);
  }
  yu(t) {
    t !== this.state && (this.state = t, this.onlineStateHandler(t));
  }
  pu(t) {
    const e = `Could not reach Cloud Firestore backend. ${t}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this.mu ? (k2(e), this.mu = false) : N2("OnlineStateTracker", e);
  }
  Tu() {
    this._u !== null && (this._u.cancel(), this._u = null);
  }
}

class ju {
  constructor(t, e, n, s, i) {
    this.localStore = t, this.datastore = e, this.asyncQueue = n, this.remoteSyncer = {}, this.Eu = [], this.Au = new Map, this.vu = new Set, this.Ru = [], this.Pu = i, this.Pu.Yr((t2) => {
      n.enqueueAndForget(async () => {
        ec2(this) && (N2("RemoteStore", "Restarting streams for network reachability change."), await async function(t3) {
          const e2 = L(t3);
          e2.vu.add(4), await Wu(e2), e2.bu.set("Unknown"), e2.vu.delete(4), await zu(e2);
        }(this));
      });
    }), this.bu = new Qu(n, s);
  }
}

class Tc2 {
  constructor(t, e, n, s, i) {
    this.asyncQueue = t, this.timerId = e, this.targetTimeMs = n, this.op = s, this.removalCallback = i, this.deferred = new K2, this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((t2) => {
    });
  }
  static createAndSchedule(t, e, n, s, i) {
    const r2 = Date.now() + n, o = new Tc2(t, e, r2, s, i);
    return o.start(n), o;
  }
  start(t) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), t);
  }
  skipDelay() {
    return this.handleDelayElapsed();
  }
  cancel(t) {
    this.timerHandle !== null && (this.clearTimeout(), this.deferred.reject(new U2(q2.CANCELLED, "Operation cancelled" + (t ? ": " + t : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() => this.timerHandle !== null ? (this.clearTimeout(), this.op().then((t) => this.deferred.resolve(t))) : Promise.resolve());
  }
  clearTimeout() {
    this.timerHandle !== null && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
}

class Ac2 {
  constructor(t) {
    this.comparator = t ? (e, n) => t(e, n) || ht.comparator(e.key, n.key) : (t2, e) => ht.comparator(t2.key, e.key), this.keyedMap = hs(), this.sortedSet = new pe(this.comparator);
  }
  static emptySet(t) {
    return new Ac2(t.comparator);
  }
  has(t) {
    return this.keyedMap.get(t) != null;
  }
  get(t) {
    return this.keyedMap.get(t);
  }
  first() {
    return this.sortedSet.minKey();
  }
  last() {
    return this.sortedSet.maxKey();
  }
  isEmpty() {
    return this.sortedSet.isEmpty();
  }
  indexOf(t) {
    const e = this.keyedMap.get(t);
    return e ? this.sortedSet.indexOf(e) : -1;
  }
  get size() {
    return this.sortedSet.size;
  }
  forEach(t) {
    this.sortedSet.inorderTraversal((e, n) => (t(e), false));
  }
  add(t) {
    const e = this.delete(t.key);
    return e.copy(e.keyedMap.insert(t.key, t), e.sortedSet.insert(t, null));
  }
  delete(t) {
    const e = this.get(t);
    return e ? this.copy(this.keyedMap.remove(t), this.sortedSet.remove(e)) : this;
  }
  isEqual(t) {
    if (!(t instanceof Ac2))
      return false;
    if (this.size !== t.size)
      return false;
    const e = this.sortedSet.getIterator(), n = t.sortedSet.getIterator();
    for (;e.hasNext(); ) {
      const t2 = e.getNext().key, s = n.getNext().key;
      if (!t2.isEqual(s))
        return false;
    }
    return true;
  }
  toString() {
    const t = [];
    return this.forEach((e) => {
      t.push(e.toString());
    }), t.length === 0 ? "DocumentSet ()" : "DocumentSet (\n  " + t.join("  \n") + "\n)";
  }
  copy(t, e) {
    const n = new Ac2;
    return n.comparator = this.comparator, n.keyedMap = t, n.sortedSet = e, n;
  }
}

class vc2 {
  constructor() {
    this.Cu = new pe(ht.comparator);
  }
  track(t) {
    const e = t.doc.key, n = this.Cu.get(e);
    n ? t.type !== 0 && n.type === 3 ? this.Cu = this.Cu.insert(e, t) : t.type === 3 && n.type !== 1 ? this.Cu = this.Cu.insert(e, {
      type: n.type,
      doc: t.doc
    }) : t.type === 2 && n.type === 2 ? this.Cu = this.Cu.insert(e, {
      type: 2,
      doc: t.doc
    }) : t.type === 2 && n.type === 0 ? this.Cu = this.Cu.insert(e, {
      type: 0,
      doc: t.doc
    }) : t.type === 1 && n.type === 0 ? this.Cu = this.Cu.remove(e) : t.type === 1 && n.type === 2 ? this.Cu = this.Cu.insert(e, {
      type: 1,
      doc: n.doc
    }) : t.type === 0 && n.type === 1 ? this.Cu = this.Cu.insert(e, {
      type: 2,
      doc: t.doc
    }) : O2() : this.Cu = this.Cu.insert(e, t);
  }
  xu() {
    const t = [];
    return this.Cu.inorderTraversal((e, n) => {
      t.push(n);
    }), t;
  }
}

class Rc2 {
  constructor(t, e, n, s, i, r2, o, u, c) {
    this.query = t, this.docs = e, this.oldDocs = n, this.docChanges = s, this.mutatedKeys = i, this.fromCache = r2, this.syncStateChanged = o, this.excludesMetadataChanges = u, this.hasCachedResults = c;
  }
  static fromInitialDocuments(t, e, n, s, i) {
    const r2 = [];
    return e.forEach((t2) => {
      r2.push({
        type: 0,
        doc: t2
      });
    }), new Rc2(t, e, Ac2.emptySet(e), r2, n, s, true, false, i);
  }
  get hasPendingWrites() {
    return !this.mutatedKeys.isEmpty();
  }
  isEqual(t) {
    if (!(this.fromCache === t.fromCache && this.hasCachedResults === t.hasCachedResults && this.syncStateChanged === t.syncStateChanged && this.mutatedKeys.isEqual(t.mutatedKeys) && Zn(this.query, t.query) && this.docs.isEqual(t.docs) && this.oldDocs.isEqual(t.oldDocs)))
      return false;
    const e = this.docChanges, n = t.docChanges;
    if (e.length !== n.length)
      return false;
    for (let t2 = 0;t2 < e.length; t2++)
      if (e[t2].type !== n[t2].type || !e[t2].doc.isEqual(n[t2].doc))
        return false;
    return true;
  }
}

class Pc2 {
  constructor() {
    this.Nu = undefined, this.listeners = [];
  }
}

class bc2 {
  constructor() {
    this.queries = new os((t) => ts(t), Zn), this.onlineState = "Unknown", this.ku = new Set;
  }
}

class Nc2 {
  constructor(t, e, n) {
    this.query = t, this.Ou = e, this.Fu = false, this.Bu = null, this.onlineState = "Unknown", this.options = n || {};
  }
  $u(t) {
    if (!this.options.includeMetadataChanges) {
      const e2 = [];
      for (const n of t.docChanges)
        n.type !== 3 && e2.push(n);
      t = new Rc2(t.query, t.docs, t.oldDocs, e2, t.mutatedKeys, t.fromCache, t.syncStateChanged, true, t.hasCachedResults);
    }
    let e = false;
    return this.Fu ? this.Lu(t) && (this.Ou.next(t), e = true) : this.qu(t, this.onlineState) && (this.Uu(t), e = true), this.Bu = t, e;
  }
  onError(t) {
    this.Ou.error(t);
  }
  Mu(t) {
    this.onlineState = t;
    let e = false;
    return this.Bu && !this.Fu && this.qu(this.Bu, t) && (this.Uu(this.Bu), e = true), e;
  }
  qu(t, e) {
    if (!t.fromCache)
      return true;
    const n = e !== "Offline";
    return (!this.options.Ku || !n) && (!t.docs.isEmpty() || t.hasCachedResults || e === "Offline");
  }
  Lu(t) {
    if (t.docChanges.length > 0)
      return true;
    const e = this.Bu && this.Bu.hasPendingWrites !== t.hasPendingWrites;
    return !(!t.syncStateChanged && !e) && this.options.includeMetadataChanges === true;
  }
  Uu(t) {
    t = Rc2.fromInitialDocuments(t.query, t.docs, t.mutatedKeys, t.fromCache, t.hasCachedResults), this.Fu = true, this.Ou.next(t);
  }
}
class Fc2 {
  constructor(t) {
    this.key = t;
  }
}

class Bc2 {
  constructor(t) {
    this.key = t;
  }
}

class Lc2 {
  constructor(t, e) {
    this.query = t, this.Yu = e, this.Xu = null, this.hasCachedResults = false, this.current = false, this.Zu = gs(), this.mutatedKeys = gs(), this.tc = is(t), this.ec = new Ac2(this.tc);
  }
  get nc() {
    return this.Yu;
  }
  sc(t, e) {
    const n = e ? e.ic : new vc2, s = e ? e.ec : this.ec;
    let i = e ? e.mutatedKeys : this.mutatedKeys, r2 = s, o = false;
    const u = this.query.limitType === "F" && s.size === this.query.limit ? s.last() : null, c = this.query.limitType === "L" && s.size === this.query.limit ? s.first() : null;
    if (t.inorderTraversal((t2, e2) => {
      const a = s.get(t2), h = ns(this.query, e2) ? e2 : null, l2 = !!a && this.mutatedKeys.has(a.key), f = !!h && (h.hasLocalMutations || this.mutatedKeys.has(h.key) && h.hasCommittedMutations);
      let d = false;
      if (a && h) {
        a.data.isEqual(h.data) ? l2 !== f && (n.track({
          type: 3,
          doc: h
        }), d = true) : this.rc(a, h) || (n.track({
          type: 2,
          doc: h
        }), d = true, (u && this.tc(h, u) > 0 || c && this.tc(h, c) < 0) && (o = true));
      } else
        !a && h ? (n.track({
          type: 0,
          doc: h
        }), d = true) : a && !h && (n.track({
          type: 1,
          doc: a
        }), d = true, (u || c) && (o = true));
      d && (h ? (r2 = r2.add(h), i = f ? i.add(t2) : i.delete(t2)) : (r2 = r2.delete(t2), i = i.delete(t2)));
    }), this.query.limit !== null)
      for (;r2.size > this.query.limit; ) {
        const t2 = this.query.limitType === "F" ? r2.last() : r2.first();
        r2 = r2.delete(t2.key), i = i.delete(t2.key), n.track({
          type: 1,
          doc: t2
        });
      }
    return {
      ec: r2,
      ic: n,
      zi: o,
      mutatedKeys: i
    };
  }
  rc(t, e) {
    return t.hasLocalMutations && e.hasCommittedMutations && !e.hasLocalMutations;
  }
  applyChanges(t, e, n) {
    const s = this.ec;
    this.ec = t.ec, this.mutatedKeys = t.mutatedKeys;
    const i = t.ic.xu();
    i.sort((t2, e2) => function(t3, e3) {
      const n2 = (t4) => {
        switch (t4) {
          case 0:
            return 1;
          case 2:
          case 3:
            return 2;
          case 1:
            return 0;
          default:
            return O2();
        }
      };
      return n2(t3) - n2(e3);
    }(t2.type, e2.type) || this.tc(t2.doc, e2.doc)), this.oc(n);
    const r2 = e ? this.uc() : [], o = this.Zu.size === 0 && this.current ? 1 : 0, u = o !== this.Xu;
    if (this.Xu = o, i.length !== 0 || u) {
      return {
        snapshot: new Rc2(this.query, t.ec, s, i, t.mutatedKeys, o === 0, u, false, !!n && n.resumeToken.approximateByteSize() > 0),
        cc: r2
      };
    }
    return {
      cc: r2
    };
  }
  Mu(t) {
    return this.current && t === "Offline" ? (this.current = false, this.applyChanges({
      ec: this.ec,
      ic: new vc2,
      mutatedKeys: this.mutatedKeys,
      zi: false
    }, false)) : {
      cc: []
    };
  }
  ac(t) {
    return !this.Yu.has(t) && (!!this.ec.has(t) && !this.ec.get(t).hasLocalMutations);
  }
  oc(t) {
    t && (t.addedDocuments.forEach((t2) => this.Yu = this.Yu.add(t2)), t.modifiedDocuments.forEach((t2) => {
    }), t.removedDocuments.forEach((t2) => this.Yu = this.Yu.delete(t2)), this.current = t.current);
  }
  uc() {
    if (!this.current)
      return [];
    const t = this.Zu;
    this.Zu = gs(), this.ec.forEach((t2) => {
      this.ac(t2.key) && (this.Zu = this.Zu.add(t2.key));
    });
    const e = [];
    return t.forEach((t2) => {
      this.Zu.has(t2) || e.push(new Bc2(t2));
    }), this.Zu.forEach((n) => {
      t.has(n) || e.push(new Fc2(n));
    }), e;
  }
  hc(t) {
    this.Yu = t.ir, this.Zu = gs();
    const e = this.sc(t.documents);
    return this.applyChanges(e, true);
  }
  lc() {
    return Rc2.fromInitialDocuments(this.query, this.ec, this.mutatedKeys, this.Xu === 0, this.hasCachedResults);
  }
}

class qc2 {
  constructor(t, e, n) {
    this.query = t, this.targetId = e, this.view = n;
  }
}

class Uc2 {
  constructor(t) {
    this.key = t, this.fc = false;
  }
}

class Kc2 {
  constructor(t, e, n, s, i, r2) {
    this.localStore = t, this.remoteStore = e, this.eventManager = n, this.sharedClientState = s, this.currentUser = i, this.maxConcurrentLimboResolutions = r2, this.dc = {}, this.wc = new os((t2) => ts(t2), Zn), this._c = new Map, this.mc = new Set, this.gc = new pe(ht.comparator), this.yc = new Map, this.Ic = new Oo, this.Tc = {}, this.Ec = new Map, this.Ac = lo.Mn(), this.onlineState = "Unknown", this.vc = undefined;
  }
  get isPrimaryClient() {
    return this.vc === true;
  }
}

class Ea {
  constructor() {
    this.synchronizeTabs = false;
  }
  async initialize(t) {
    this.serializer = Fu(t.databaseInfo.databaseId), this.sharedClientState = this.createSharedClientState(t), this.persistence = this.createPersistence(t), await this.persistence.start(), this.localStore = this.createLocalStore(t), this.gcScheduler = this.createGarbageCollectionScheduler(t, this.localStore), this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(t, this.localStore);
  }
  createGarbageCollectionScheduler(t, e) {
    return null;
  }
  createIndexBackfillerScheduler(t, e) {
    return null;
  }
  createLocalStore(t) {
    return su(this.persistence, new eu, t.initialUser, this.serializer);
  }
  createPersistence(t) {
    return new Ko(Qo.zs, this.serializer);
  }
  createSharedClientState(t) {
    return new bu;
  }
  async terminate() {
    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
  }
}
class Pa2 {
  async initialize(t, e) {
    this.localStore || (this.localStore = t.localStore, this.sharedClientState = t.sharedClientState, this.datastore = this.createDatastore(e), this.remoteStore = this.createRemoteStore(e), this.eventManager = this.createEventManager(e), this.syncEngine = this.createSyncEngine(e, !t.synchronizeTabs), this.sharedClientState.onlineStateHandler = (t2) => Hc2(this.syncEngine, t2, 1), this.remoteStore.remoteSyncer.handleCredentialChange = ca2.bind(null, this.syncEngine), await yc2(this.remoteStore, this.syncEngine.isPrimaryClient));
  }
  createEventManager(t) {
    return new bc2;
  }
  createDatastore(t) {
    const e = Fu(t.databaseInfo.databaseId), n = (s = t.databaseInfo, new Mu(s));
    var s;
    return function(t2, e2, n2, s2) {
      return new Ku(t2, e2, n2, s2);
    }(t.authCredentials, t.appCheckCredentials, n, e);
  }
  createRemoteStore(t) {
    return e = this.localStore, n = this.datastore, s = t.asyncQueue, i = (t2) => Hc2(this.syncEngine, t2, 0), r2 = Su.D() ? new Su : new Vu, new ju(e, n, s, i, r2);
    var e, n, s, i, r2;
  }
  createSyncEngine(t, e) {
    return function(t2, e2, n, s, i, r2, o) {
      const u = new Kc2(t2, e2, n, s, i, r2);
      return o && (u.vc = true), u;
    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t.initialUser, t.maxConcurrentLimboResolutions, e);
  }
  terminate() {
    return async function(t) {
      const e = L(t);
      N2("RemoteStore", "RemoteStore shutting down."), e.vu.add(5), await Wu(e), e.Pu.shutdown(), e.bu.set("Unknown");
    }(this.remoteStore);
  }
}

class Va2 {
  constructor(t) {
    this.observer = t, this.muted = false;
  }
  next(t) {
    this.observer.next && this.Sc(this.observer.next, t);
  }
  error(t) {
    this.observer.error ? this.Sc(this.observer.error, t) : k2("Uncaught Error in snapshot listener:", t.toString());
  }
  Dc() {
    this.muted = true;
  }
  Sc(t, e) {
    this.muted || setTimeout(() => {
      this.muted || t(e);
    }, 0);
  }
}
class xa2 {
  constructor(t, e, n, s) {
    this.authCredentials = t, this.appCheckCredentials = e, this.asyncQueue = n, this.databaseInfo = s, this.user = V2.UNAUTHENTICATED, this.clientId = tt.A(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this.authCredentials.start(n, async (t2) => {
      N2("FirestoreClient", "Received user=", t2.uid), await this.authCredentialListener(t2), this.user = t2;
    }), this.appCheckCredentials.start(n, (t2) => (N2("FirestoreClient", "Received new app check token=", t2), this.appCheckCredentialListener(t2, this.user)));
  }
  async getConfiguration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this.databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100
    };
  }
  setCredentialChangeListener(t) {
    this.authCredentialListener = t;
  }
  setAppCheckTokenChangeListener(t) {
    this.appCheckCredentialListener = t;
  }
  verifyNotTerminated() {
    if (this.asyncQueue.isShuttingDown)
      throw new U2(q2.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const t = new K2;
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
      try {
        this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), t.resolve();
      } catch (e) {
        const n = Ec2(e, "Failed to shutdown persistence");
        t.reject(n);
      }
    }), t.promise;
  }
}
var eh = new Map;

class ah {
  constructor(t) {
    var e, n;
    if (t.host === undefined) {
      if (t.ssl !== undefined)
        throw new U2(q2.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = "firestore.googleapis.com", this.ssl = true;
    } else
      this.host = t.host, this.ssl = (e = t.ssl) === null || e === undefined || e;
    if (this.credentials = t.credentials, this.ignoreUndefinedProperties = !!t.ignoreUndefinedProperties, this.cache = t.localCache, t.cacheSizeBytes === undefined)
      this.cacheSizeBytes = 41943040;
    else {
      if (t.cacheSizeBytes !== -1 && t.cacheSizeBytes < 1048576)
        throw new U2(q2.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = t.cacheSizeBytes;
    }
    sh("experimentalForceLongPolling", t.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!t.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : t.experimentalAutoDetectLongPolling === undefined ? this.experimentalAutoDetectLongPolling = true : this.experimentalAutoDetectLongPolling = !!t.experimentalAutoDetectLongPolling, this.experimentalLongPollingOptions = th((n = t.experimentalLongPollingOptions) !== null && n !== undefined ? n : {}), function(t2) {
      if (t2.timeoutSeconds !== undefined) {
        if (isNaN(t2.timeoutSeconds))
          throw new U2(q2.INVALID_ARGUMENT, `invalid long polling timeout: ${t2.timeoutSeconds} (must not be NaN)`);
        if (t2.timeoutSeconds < 5)
          throw new U2(q2.INVALID_ARGUMENT, `invalid long polling timeout: ${t2.timeoutSeconds} (minimum allowed value is 5)`);
        if (t2.timeoutSeconds > 30)
          throw new U2(q2.INVALID_ARGUMENT, `invalid long polling timeout: ${t2.timeoutSeconds} (maximum allowed value is 30)`);
      }
    }(this.experimentalLongPollingOptions), this.useFetchStreams = !!t.useFetchStreams;
  }
  isEqual(t) {
    return this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && (e = this.experimentalLongPollingOptions, n = t.experimentalLongPollingOptions, e.timeoutSeconds === n.timeoutSeconds) && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams;
    var e, n;
  }
}

class hh {
  constructor(t, e, n, s) {
    this._authCredentials = t, this._appCheckCredentials = e, this._databaseId = n, this._app = s, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new ah({}), this._settingsFrozen = false;
  }
  get app() {
    if (!this._app)
      throw new U2(q2.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return this._terminateTask !== undefined;
  }
  _setSettings(t) {
    if (this._settingsFrozen)
      throw new U2(q2.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new ah(t), t.credentials !== undefined && (this._authCredentials = function(t2) {
      if (!t2)
        return new Q2;
      switch (t2.type) {
        case "firstParty":
          return new H2(t2.sessionIndex || "0", t2.iamToken || null, t2.authTokenFactory || null);
        case "provider":
          return t2.client;
        default:
          throw new U2(q2.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    }(t.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _freezeSettings() {
    return this._settingsFrozen = true, this._settings;
  }
  _delete() {
    return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
  }
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  _terminate() {
    return function(t) {
      const e = eh.get(t);
      e && (N2("ComponentProvider", "Removing Datastore"), eh.delete(t), e.terminate());
    }(this), Promise.resolve();
  }
}

class fh {
  constructor(t, e, n) {
    this.converter = e, this._key = n, this.type = "document", this.firestore = t;
  }
  get _path() {
    return this._key.path;
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get path() {
    return this._key.path.canonicalString();
  }
  get parent() {
    return new wh(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(t) {
    return new fh(this.firestore, t, this._key);
  }
}

class dh {
  constructor(t, e, n) {
    this.converter = e, this._query = n, this.type = "query", this.firestore = t;
  }
  withConverter(t) {
    return new dh(this.firestore, t, this._query);
  }
}

class wh extends dh {
  constructor(t, e, n) {
    super(t, e, Gn(n)), this._path = n, this.type = "collection";
  }
  get id() {
    return this._query.path.lastSegment();
  }
  get path() {
    return this._query.path.canonicalString();
  }
  get parent() {
    const t = this._path.popLast();
    return t.isEmpty() ? null : new fh(this.firestore, null, new ht(t));
  }
  withConverter(t) {
    return new wh(this.firestore, t, this._path);
  }
}

class Ih {
  constructor() {
    this.Gc = Promise.resolve(), this.Qc = [], this.jc = false, this.zc = [], this.Wc = null, this.Hc = false, this.Jc = false, this.Yc = [], this.qo = new Bu(this, "async_queue_retry"), this.Xc = () => {
      const t2 = Ou();
      t2 && N2("AsyncQueue", "Visibility state changed to " + t2.visibilityState), this.qo.Mo();
    };
    const t = Ou();
    t && typeof t.addEventListener == "function" && t.addEventListener("visibilitychange", this.Xc);
  }
  get isShuttingDown() {
    return this.jc;
  }
  enqueueAndForget(t) {
    this.enqueue(t);
  }
  enqueueAndForgetEvenWhileRestricted(t) {
    this.Zc(), this.ta(t);
  }
  enterRestrictedMode(t) {
    if (!this.jc) {
      this.jc = true, this.Jc = t || false;
      const e = Ou();
      e && typeof e.removeEventListener == "function" && e.removeEventListener("visibilitychange", this.Xc);
    }
  }
  enqueue(t) {
    if (this.Zc(), this.jc)
      return new Promise(() => {
      });
    const e = new K2;
    return this.ta(() => this.jc && this.Jc ? Promise.resolve() : (t().then(e.resolve, e.reject), e.promise)).then(() => e.promise);
  }
  enqueueRetryable(t) {
    this.enqueueAndForget(() => (this.Qc.push(t), this.ea()));
  }
  async ea() {
    if (this.Qc.length !== 0) {
      try {
        await this.Qc[0](), this.Qc.shift(), this.qo.reset();
      } catch (t) {
        if (!Dt(t))
          throw t;
        N2("AsyncQueue", "Operation failed with retryable error: " + t);
      }
      this.Qc.length > 0 && this.qo.No(() => this.ea());
    }
  }
  ta(t) {
    const e = this.Gc.then(() => (this.Hc = true, t().catch((t2) => {
      this.Wc = t2, this.Hc = false;
      const e2 = function(t3) {
        let e3 = t3.message || "";
        t3.stack && (e3 = t3.stack.includes(t3.message) ? t3.stack : t3.message + "\n" + t3.stack);
        return e3;
      }(t2);
      throw k2("INTERNAL UNHANDLED ERROR: ", e2), t2;
    }).then((t2) => (this.Hc = false, t2))));
    return this.Gc = e, e;
  }
  enqueueAfterDelay(t, e, n) {
    this.Zc(), this.Yc.indexOf(t) > -1 && (e = 0);
    const s = Tc2.createAndSchedule(this, t, e, n, (t2) => this.na(t2));
    return this.zc.push(s), s;
  }
  Zc() {
    this.Wc && O2();
  }
  verifyOperationInProgress() {
  }
  async sa() {
    let t;
    do {
      t = this.Gc, await t;
    } while (t !== this.Gc);
  }
  ia(t) {
    for (const e of this.zc)
      if (e.timerId === t)
        return true;
    return false;
  }
  ra(t) {
    return this.sa().then(() => {
      this.zc.sort((t2, e) => t2.targetTimeMs - e.targetTimeMs);
      for (const e of this.zc)
        if (e.skipDelay(), t !== "all" && e.timerId === t)
          break;
      return this.sa();
    });
  }
  oa(t) {
    this.Yc.push(t);
  }
  na(t) {
    const e = this.zc.indexOf(t);
    this.zc.splice(e, 1);
  }
}
class vh extends hh {
  constructor(t, e, n, s) {
    super(t, e, n, s), this.type = "firestore", this._queue = new Ih, this._persistenceKey = (s == null ? undefined : s.name) || "[DEFAULT]";
  }
  _terminate() {
    return this._firestoreClient || Vh(this), this._firestoreClient.terminate();
  }
}
class Uh {
  constructor(t) {
    this._byteString = t;
  }
  static fromBase64String(t) {
    try {
      return new Uh(Ve.fromBase64String(t));
    } catch (t2) {
      throw new U2(q2.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t2);
    }
  }
  static fromUint8Array(t) {
    return new Uh(Ve.fromUint8Array(t));
  }
  toBase64() {
    return this._byteString.toBase64();
  }
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  toString() {
    return "Bytes(base64: " + this.toBase64() + ")";
  }
  isEqual(t) {
    return this._byteString.isEqual(t._byteString);
  }
}

class Kh {
  constructor(...t) {
    for (let e = 0;e < t.length; ++e)
      if (t[e].length === 0)
        throw new U2(q2.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    this._internalPath = new at(t);
  }
  isEqual(t) {
    return this._internalPath.isEqual(t._internalPath);
  }
}

class Qh {
  constructor(t) {
    this._methodName = t;
  }
}

class jh {
  constructor(t, e) {
    if (!isFinite(t) || t < -90 || t > 90)
      throw new U2(q2.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + t);
    if (!isFinite(e) || e < -180 || e > 180)
      throw new U2(q2.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + e);
    this._lat = t, this._long = e;
  }
  get latitude() {
    return this._lat;
  }
  get longitude() {
    return this._long;
  }
  isEqual(t) {
    return this._lat === t._lat && this._long === t._long;
  }
  toJSON() {
    return {
      latitude: this._lat,
      longitude: this._long
    };
  }
  _compareTo(t) {
    return et(this._lat, t._lat) || et(this._long, t._long);
  }
}
var zh = /^__.*__$/;

class Wh {
  constructor(t, e, n) {
    this.data = t, this.fieldMask = e, this.fieldTransforms = n;
  }
  toMutation(t, e) {
    return this.fieldMask !== null ? new zs(t, this.data, this.fieldMask, e, this.fieldTransforms) : new js(t, this.data, e, this.fieldTransforms);
  }
}
class Yh {
  constructor(t, e, n, s, i, r2) {
    this.settings = t, this.databaseId = e, this.serializer = n, this.ignoreUndefinedProperties = s, i === undefined && this.ua(), this.fieldTransforms = i || [], this.fieldMask = r2 || [];
  }
  get path() {
    return this.settings.path;
  }
  get ca() {
    return this.settings.ca;
  }
  aa(t) {
    return new Yh(Object.assign(Object.assign({}, this.settings), t), this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
  }
  ha(t) {
    var e;
    const n = (e = this.path) === null || e === undefined ? undefined : e.child(t), s = this.aa({
      path: n,
      la: false
    });
    return s.fa(t), s;
  }
  da(t) {
    var e;
    const n = (e = this.path) === null || e === undefined ? undefined : e.child(t), s = this.aa({
      path: n,
      la: false
    });
    return s.ua(), s;
  }
  wa(t) {
    return this.aa({
      path: undefined,
      la: true
    });
  }
  _a(t) {
    return gl(t, this.settings.methodName, this.settings.ma || false, this.path, this.settings.ga);
  }
  contains(t) {
    return this.fieldMask.find((e) => t.isPrefixOf(e)) !== undefined || this.fieldTransforms.find((e) => t.isPrefixOf(e.field)) !== undefined;
  }
  ua() {
    if (this.path)
      for (let t = 0;t < this.path.length; t++)
        this.fa(this.path.get(t));
  }
  fa(t) {
    if (t.length === 0)
      throw this._a("Document fields must not be empty");
    if (Jh(this.ca) && zh.test(t))
      throw this._a('Document fields cannot begin and end with "__"');
  }
}

class Xh {
  constructor(t, e, n) {
    this.databaseId = t, this.ignoreUndefinedProperties = e, this.serializer = n || Fu(t);
  }
  ya(t, e, n, s = false) {
    return new Yh({
      ca: t,
      methodName: e,
      ga: n,
      path: at.emptyPath(),
      la: false,
      ma: s
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
  }
}
var _l = new RegExp("[~\\*/\\[\\]]");

class pl {
  constructor(t, e, n, s, i) {
    this._firestore = t, this._userDataWriter = e, this._key = n, this._document = s, this._converter = i;
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get ref() {
    return new fh(this._firestore, this._converter, this._key);
  }
  exists() {
    return this._document !== null;
  }
  data() {
    if (this._document) {
      if (this._converter) {
        const t = new Il(this._firestore, this._userDataWriter, this._key, this._document, null);
        return this._converter.fromFirestore(t);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  get(t) {
    if (this._document) {
      const e = this._document.data.field(Tl("DocumentSnapshot.get", t));
      if (e !== null)
        return this._userDataWriter.convertValue(e);
    }
  }
}

class Il extends pl {
  data() {
    return super.data();
  }
}

class Al {
}

class vl extends Al {
}

class Pl extends vl {
  constructor(t, e, n) {
    super(), this._field = t, this._op = e, this._value = n, this.type = "where";
  }
  static _create(t, e, n) {
    return new Pl(t, e, n);
  }
  _apply(t) {
    const e = this._parse(t);
    return Ql(t._query, e), new dh(t.firestore, t.converter, Yn(t._query, e));
  }
  _parse(t) {
    const e = Zh(t.firestore), n = function(t2, e2, n2, s, i, r2, o) {
      let u;
      if (i.isKeyField()) {
        if (r2 === "array-contains" || r2 === "array-contains-any")
          throw new U2(q2.INVALID_ARGUMENT, `Invalid Query. You can't perform '${r2}' queries on documentId().`);
        if (r2 === "in" || r2 === "not-in") {
          Gl(o, r2);
          const e3 = [];
          for (const n3 of o)
            e3.push(Kl(s, t2, n3));
          u = {
            arrayValue: {
              values: e3
            }
          };
        } else
          u = Kl(s, t2, o);
      } else
        r2 !== "in" && r2 !== "not-in" && r2 !== "array-contains-any" || Gl(o, r2), u = al(n2, e2, o, r2 === "in" || r2 === "not-in");
      return mn.create(i, r2, u);
    }(t._query, "where", e, t.firestore._databaseId, this._field, this._op, this._value);
    return n;
  }
}

class Vl extends Al {
  constructor(t, e) {
    super(), this.type = t, this._queryConstraints = e;
  }
  static _create(t, e) {
    return new Vl(t, e);
  }
  _parse(t) {
    const e = this._queryConstraints.map((e2) => e2._parse(t)).filter((t2) => t2.getFilters().length > 0);
    return e.length === 1 ? e[0] : gn.create(e, this._getOperator());
  }
  _apply(t) {
    const e = this._parse(t);
    return e.getFilters().length === 0 ? t : (function(t2, e2) {
      let n = t2;
      const s = e2.getFlattenedFilters();
      for (const t3 of s)
        Ql(n, t3), n = Yn(n, t3);
    }(t._query, e), new dh(t.firestore, t.converter, Yn(t._query, e)));
  }
  _getQueryConstraints() {
    return this._queryConstraints;
  }
  _getOperator() {
    return this.type === "and" ? "and" : "or";
  }
}
class Wl {
  convertValue(t, e = "none") {
    switch (Le(t)) {
      case 0:
        return null;
      case 1:
        return t.booleanValue;
      case 2:
        return Ce(t.integerValue || t.doubleValue);
      case 3:
        return this.convertTimestamp(t.timestampValue);
      case 4:
        return this.convertServerTimestamp(t, e);
      case 5:
        return t.stringValue;
      case 6:
        return this.convertBytes(xe(t.bytesValue));
      case 7:
        return this.convertReference(t.referenceValue);
      case 8:
        return this.convertGeoPoint(t.geoPointValue);
      case 9:
        return this.convertArray(t.arrayValue, e);
      case 10:
        return this.convertObject(t.mapValue, e);
      default:
        throw O2();
    }
  }
  convertObject(t, e) {
    return this.convertObjectMap(t.fields, e);
  }
  convertObjectMap(t, e = "none") {
    const n = {};
    return ge(t, (t2, s) => {
      n[t2] = this.convertValue(s, e);
    }), n;
  }
  convertGeoPoint(t) {
    return new jh(Ce(t.latitude), Ce(t.longitude));
  }
  convertArray(t, e) {
    return (t.values || []).map((t2) => this.convertValue(t2, e));
  }
  convertServerTimestamp(t, e) {
    switch (e) {
      case "previous":
        const n = ke(t);
        return n == null ? null : this.convertValue(n, e);
      case "estimate":
        return this.convertTimestamp(Me(t));
      default:
        return null;
    }
  }
  convertTimestamp(t) {
    const e = De(t);
    return new it(e.seconds, e.nanos);
  }
  convertDocumentKey(t, e) {
    const n = ut.fromString(t);
    F2(ur(n));
    const s = new Oe(n.get(1), n.get(3)), i = new ht(n.popFirst(5));
    return s.isEqual(e) || k2(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), i;
  }
}
class nf {
  constructor(t, e) {
    this.hasPendingWrites = t, this.fromCache = e;
  }
  isEqual(t) {
    return this.hasPendingWrites === t.hasPendingWrites && this.fromCache === t.fromCache;
  }
}

class sf extends pl {
  constructor(t, e, n, s, i, r2) {
    super(t, e, n, s, r2), this._firestore = t, this._firestoreImpl = t, this.metadata = i;
  }
  exists() {
    return super.exists();
  }
  data(t = {}) {
    if (this._document) {
      if (this._converter) {
        const e = new rf(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
        return this._converter.fromFirestore(e, t);
      }
      return this._userDataWriter.convertValue(this._document.data.value, t.serverTimestamps);
    }
  }
  get(t, e = {}) {
    if (this._document) {
      const n = this._document.data.field(Tl("DocumentSnapshot.get", t));
      if (n !== null)
        return this._userDataWriter.convertValue(n, e.serverTimestamps);
    }
  }
}

class rf extends sf {
  data(t = {}) {
    return super.data(t);
  }
}

class of {
  constructor(t, e, n, s) {
    this._firestore = t, this._userDataWriter = e, this._snapshot = s, this.metadata = new nf(s.hasPendingWrites, s.fromCache), this.query = n;
  }
  get docs() {
    const t = [];
    return this.forEach((e) => t.push(e)), t;
  }
  get size() {
    return this._snapshot.docs.size;
  }
  get empty() {
    return this.size === 0;
  }
  forEach(t, e) {
    this._snapshot.docs.forEach((n) => {
      t.call(e, new rf(this._firestore, this._userDataWriter, n.key, n, new nf(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
    });
  }
  docChanges(t = {}) {
    const e = !!t.includeMetadataChanges;
    if (e && this._snapshot.excludesMetadataChanges)
      throw new U2(q2.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = function(t2, e2) {
      if (t2._snapshot.oldDocs.isEmpty()) {
        let e3 = 0;
        return t2._snapshot.docChanges.map((n) => {
          const s = new rf(t2._firestore, t2._userDataWriter, n.doc.key, n.doc, new nf(t2._snapshot.mutatedKeys.has(n.doc.key), t2._snapshot.fromCache), t2.query.converter);
          return n.doc, {
            type: "added",
            doc: s,
            oldIndex: -1,
            newIndex: e3++
          };
        });
      }
      {
        let n = t2._snapshot.oldDocs;
        return t2._snapshot.docChanges.filter((t3) => e2 || t3.type !== 3).map((e3) => {
          const s = new rf(t2._firestore, t2._userDataWriter, e3.doc.key, e3.doc, new nf(t2._snapshot.mutatedKeys.has(e3.doc.key), t2._snapshot.fromCache), t2.query.converter);
          let i = -1, r2 = -1;
          return e3.type !== 0 && (i = n.indexOf(e3.doc.key), n = n.delete(e3.doc.key)), e3.type !== 1 && (n = n.add(e3.doc), r2 = n.indexOf(e3.doc.key)), {
            type: uf(e3.type),
            doc: s,
            oldIndex: i,
            newIndex: r2
          };
        });
      }
    }(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
  }
}

class hf extends Wl {
  constructor(t) {
    super(), this.firestore = t;
  }
  convertBytes(t) {
    return new Uh(t);
  }
  convertReference(t) {
    const e = this.convertDocumentKey(t, this.firestore._databaseId);
    return new fh(this.firestore, null, e);
  }
}
(function(t, e = true) {
  (function(t2) {
    S2 = t2;
  })(SDK_VERSION), _registerComponent(new Component("firestore", (t2, { instanceIdentifier: n, options: s }) => {
    const i = t2.getProvider("app").getImmediate(), r2 = new vh(new z2(t2.getProvider("auth-internal")), new Y2(t2.getProvider("app-check-internal")), function(t3, e2) {
      if (!Object.prototype.hasOwnProperty.apply(t3.options, ["projectId"]))
        throw new U2(q2.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
      return new Oe(t3.options.projectId, e2);
    }(i, n), i);
    return s = Object.assign({
      useFetchStreams: e
    }, s), r2._setSettings(s), r2;
  }, "PUBLIC").setMultipleInstances(true)), registerVersion(b, "3.13.0", t), registerVersion(b, "3.13.0", "esm2017");
})();
// src/firebase.ts
function initialLoadComplete() {
  return initialLoadDone;
}
function isConfiguration(id2) {
  return id2 === firebaseConfigTiddler;
}
var makeId = function(id2) {
  return id2.replaceAll("/", "\u2215");
};
function registerSyncCallback(callback) {
  if (firestore3) {
    const tiddlers = _h(firestore3, "tiddlers");
    const unsub = If(Rl(tiddlers), (querySnapshot) => {
      const changed = querySnapshot.docChanges();
      const modifications = [];
      const deletions = [];
      changed.forEach((docchange) => {
        const title = docchange.doc.data().title;
        if (docchange.type === "removed") {
          deletions.push(title);
        } else {
          modifications.push(title);
        }
      });
      if (modifications.length > 0 || deletions.length > 0) {
        console.log(`Tiddler update mods=${JSON.stringify(modifications)} dels=${JSON.stringify(deletions)}`);
        callback(null, { modifications, deletions });
      }
      initialLoadDone = true;
    }, (err) => {
      console.error(err);
      alert(err);
    });
  }
}
function storeTiddler(id2, tiddlerData) {
  if (id2 === firebaseConfigTiddler) {
    window.localStorage.setItem(firebaseConfigStorage, tiddlerData.text);
    window.location.reload();
  }
  if (id2 && firestore3) {
    const store = gh(firestore3, `tiddlers/${makeId(id2)}`);
    return mf(store, tiddlerData);
  }
}
async function loadTiddler(id2, callback) {
  if (id2 && firestore3) {
    const store = gh(firestore3, `tiddlers/${makeId(id2)}`);
    const tiddler = await af(store);
    callback(null, tiddler.data());
  }
}
function deleteTiddler(id2) {
  if (id2 && firestore3) {
    const store = gh(firestore3, `tiddlers/${makeId(id2)}`);
    return yf(store);
  }
}
var firebaseConfigTiddler = "$:/FirebaseConfig";
var location = typeof window !== "undefined" ? window.location.href : "build-time";
var firebaseConfigStorage = `${firebaseConfigTiddler}|${location}}`;
var firebaseConfig = undefined;
if (typeof window !== "undefined") {
  const configString = window.localStorage.getItem(firebaseConfigStorage);
  console.log(`FIREBASE: ${configString}`);
  firebaseConfig = JSON.parse(configString);
}
var app5 = firebaseConfig ? initializeApp(firebaseConfig) : undefined;
var firestore3 = app5 ? Rh(app5, {
  experimentalForceLongPolling: false
}) : undefined;
var initialLoadDone = false;

// src/firestoreadaptor.ts
(function() {
  function FirestoreAdaptor(options) {
    var self2 = this;
    self2.wiki = options.wiki;
    self2.boot = options.boot || $tw.boot;
    self2.logger = new $tw.utils.Logger("firestore");
  }
  FirestoreAdaptor.prototype.name = "firestore";
  FirestoreAdaptor.prototype.supportsLazyLoading = false;
  FirestoreAdaptor.prototype.isReady = function() {
    const ret = initialLoadComplete();
    this.logger.log(`isReady: ${ret}`);
    return true;
  };
  let idCounter = 100;
  FirestoreAdaptor.prototype.getTiddlerInfo = function(tiddler) {
    const tiddlerclone = tiddler.fields.title;
    this.logger.log(`getTiddlerInfo ${JSON.stringify(tiddlerclone)}`);
    return { id: ++idCounter };
  };
  let registered = false;
  FirestoreAdaptor.prototype.getUpdatedTiddlers = function(_syncer, callback) {
    if (!registered) {
      registered = true;
      if (typeof window !== "undefined") {
        registerSyncCallback(callback);
      }
      this.logger.log("getUpdatedTiddlers");
    } else {
      this.logger.log("getUpdatedTiddlers ignored, already registered");
    }
  };
  FirestoreAdaptor.prototype.saveTiddler = function(tiddler, callback, options) {
    const data = tiddler.getFieldStrings({
      exclude: ["bag"]
    });
    this.logger.log(`saveTiddler ${JSON.stringify(tiddler)} with ${JSON.stringify(options)}`);
    if (typeof window !== "undefined" && (initialLoadComplete() || isConfiguration(data.title))) {
      storeTiddler(data.title, data);
    }
    callback(null, null);
  };
  FirestoreAdaptor.prototype.loadTiddler = function(title, callback) {
    this.logger.log(`loadTiddler ${JSON.stringify(title)}`);
    if (typeof window !== "undefined") {
      loadTiddler(title, callback);
    }
  };
  FirestoreAdaptor.prototype.deleteTiddler = function(title, callback, options) {
    this.logger.log(`deleteTiddler ${JSON.stringify(title)}`);
    if (typeof window !== "undefined") {
      deleteTiddler(title);
    }
    callback(null, null);
  };
  exports.adaptorClass = FirestoreAdaptor;
})();
