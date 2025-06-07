/**
 * Core JS
 * A lightweight, modern, and dependency-free JavaScript library that provides
 * a familiar jQuery-like API for DOM manipulation, events, and AJAX.
 *
 * @version 1.5.0 (Optimized with DocumentFragment)
 * @author https://github.com/suwahas
 * @license MIT
 */
(function (global) {
  'use strict';

  // --- PRIVATE HELPERS ---
  const eventStore = new WeakMap();

  function _createNodesFromContent(content) {
    if (typeof content === 'string') {
      const template = document.createElement('template');
      template.innerHTML = content.trim();
      return Array.from(template.content.childNodes);
    }
    if (content.nodeType) { return [content]; }
    if (content instanceof NodeList || Array.isArray(content) || content instanceof J) {
      return Array.from(content);
    }
    return [];
  }

  // --- CONSTRUCTOR ---
  const J = function (selector) {
    return new J.fn.init(selector);
  };

  // --- MAIN PROTOTYPE ---
  J.fn = J.prototype = {
    constructor: J,
    length: 0,
    [Symbol.iterator]: Array.prototype[Symbol.iterator],

    init: function (selector) {
      if (!selector) return this;

      if (typeof selector === 'string') {
        if (selector.trim().startsWith('<') && selector.trim().endsWith('>')) {
          Array.prototype.push.apply(this, _createNodesFromContent(selector));
        } else {
          const nodeList = document.querySelectorAll(selector);
          Array.prototype.push.apply(this, nodeList);
        }
      } else if (selector.nodeType || selector === global) {
        this[0] = selector;
        this.length = 1;
      } else if (selector instanceof NodeList || Array.isArray(selector)) {
        Array.prototype.push.apply(this, selector);
      } else if (selector instanceof J) {
        return selector;
      }

      return this;
    },

    each: function (callback) {
      for (let i = 0; i < this.length; i++) {
        callback.call(this[i], i, this[i]);
      }
      return this;
    },

    // --- DOM TRAVERSAL ---

    find: function (sel) {
      let found = [];
      this.each(function () {
        found = found.concat(Array.from(this.querySelectorAll(sel)));
      });
      return J([...new Set(found)]);
    },

    closest: function (sel) {
      const closestElements = [];
      this.each(function () {
        const el = this.closest(sel);
        if (el) {
          closestElements.push(el);
        }
      });
      return J([...new Set(closestElements)]);
    },

    parent: function () {
      const parents = [];
      this.each(function () {
        if (this.parentElement) {
          parents.push(this.parentElement);
        }
      });
      return J([...new Set(parents)]);
    },

    children: function (sel) {
      let kids = [];
      this.each(function () {
        kids = kids.concat(Array.from(this.children));
      });
      if (sel) {
        kids = kids.filter(kid => kid.matches(sel));
      }
      return J([...new Set(kids)]);
    },

    // --- EVENT HANDLING ---

    on: function (eventType, selectorOrHandler, handler) {
      if (typeof selectorOrHandler === 'function') {
        const directHandler = selectorOrHandler;
        return this.each(function () {
          this.addEventListener(eventType, directHandler);
          const elementEvents = eventStore.get(this) || new Map();
          const typeHandlers = elementEvents.get(eventType) || new Map();
          typeHandlers.set(directHandler, directHandler);
          elementEvents.set(eventType, typeHandlers);
          eventStore.set(this, elementEvents);
        });
      }
      else if (typeof selectorOrHandler === 'string' && typeof handler === 'function') {
        const selector = selectorOrHandler;
        const delegatedHandler = function (event) {
          let target = event.target;
          while (target && target !== this) {
            if (target.matches(selector)) {
              handler.call(target, event);
              return;
            }
            target = target.parentElement;
          }
        };
        return this.each(function () {
          this.addEventListener(eventType, delegatedHandler);
          const elementEvents = eventStore.get(this) || new Map();
          const typeHandlers = elementEvents.get(eventType) || new Map();
          typeHandlers.set(handler, delegatedHandler);
          elementEvents.set(eventType, typeHandlers);
          eventStore.set(this, elementEvents);
        });
      }
      return this;
    },

    off: function (eventType, handler) {
      return this.each(function () {
        const elementEvents = eventStore.get(this);
        if (!elementEvents || !elementEvents.has(eventType)) return;

        const typeHandlers = elementEvents.get(eventType);

        if (handler) {
          const wrapperHandler = typeHandlers.get(handler);
          if (wrapperHandler) {
            this.removeEventListener(eventType, wrapperHandler);
            typeHandlers.delete(handler);
          }
        }
        else {
          for (const wrapperHandler of typeHandlers.values()) {
            this.removeEventListener(eventType, wrapperHandler);
          }
          typeHandlers.clear();
        }

        if (typeHandlers.size === 0) { elementEvents.delete(eventType); }
        if (elementEvents.size === 0) { eventStore.delete(this); }
      });
    },

    trigger: function (eventType, data) {
      const event = new CustomEvent(eventType, {
        bubbles: true,
        cancelable: true,
        detail: data
      });
      return this.each(function () {
        this.dispatchEvent(event);
      });
    },

    // --- CLASS & ATTRIBUTE MANIPULATION ---

    addClass: function (classNames) {
      const classes = classNames.split(' ').filter(Boolean);
      return this.each(function () {
        this.classList.add(...classes);
      });
    },

    removeClass: function (classNames) {
      const classes = classNames.split(' ').filter(Boolean);
      return this.each(function () {
        this.classList.remove(...classes);
      });
    },

    toggleClass: function (classNames) {
      const classes = classNames.split(' ').filter(Boolean);
      return this.each(function () {
        classes.forEach(cls => this.classList.toggle(cls));
      });
    },

    attr: function (name, value) {
      if (value === undefined) {
        return this[0]?.getAttribute(name);
      }
      return this.each(function () {
        this.setAttribute(name, value);
      });
    },

    // --- OPTIMIZED DOM MANIPULATION ---

    append: function (content) {
      const nodesToAppend = _createNodesFromContent(content);
      if (nodesToAppend.length === 0) return this;

      return this.each(function () {
        const fragment = document.createDocumentFragment();
        nodesToAppend.forEach(node => {
          fragment.appendChild(node.cloneNode(true));
        });
        this.appendChild(fragment);
      });
    },

    prepend: function (content) {
      const nodesToPrepend = _createNodesFromContent(content);
      if (nodesToPrepend.length === 0) return this;

      return this.each(function () {
        const fragment = document.createDocumentFragment();
        nodesToPrepend.forEach(node => {
          fragment.appendChild(node.cloneNode(true));
        });
        this.insertBefore(fragment, this.firstChild);
      });
    },

    before: function(content) {
      const nodesToInsert = _createNodesFromContent(content);
      if (nodesToInsert.length === 0) return this;
      
      return this.each(function() {
        const parent = this.parentNode;
        if (!parent) return;
        const fragment = document.createDocumentFragment();
        nodesToInsert.forEach(node => {
          fragment.appendChild(node.cloneNode(true));
        });
        parent.insertBefore(fragment, this);
      });
    },
    
    after: function(content) {
      const nodesToInsert = _createNodesFromContent(content);
      if (nodesToInsert.length === 0) return this;

      return this.each(function() {
        const parent = this.parentNode;
        if (!parent) return;
        const fragment = document.createDocumentFragment();
        nodesToInsert.forEach(node => {
          fragment.appendChild(node.cloneNode(true));
        });
        parent.insertBefore(fragment, this.nextSibling);
      });
    },

    clone: function() {
      const clonedElements = [];
      this.each(function() {
        clonedElements.push(this.cloneNode(true));
      });
      return J(clonedElements);
    },

    remove: function () {
      return this.each(function () {
        this.remove();
      });
    },

    empty: function () {
      return this.html('');
    },

    // --- GETTERS/SETTERS ---

    css: function (prop, value) {
      if (typeof prop === 'string' && value === undefined) {
        return this[0] ? getComputedStyle(this[0])[prop] : undefined;
      }
      return this.each(function () {
        if (typeof prop === 'object') {
          for (let key in prop) {
            this.style[key] = prop[key];
          }
        } else {
          this.style[prop] = value;
        }
      });
    },

    data: function (key, value) {
      if (value === undefined) {
        return this[0]?.dataset?.[key];
      }
      return this.each(function () {
        this.dataset[key] = value;
      });
    },

    html: function (value) {
      if (value === undefined) {
        return this[0]?.innerHTML;
      }
      return this.each(function () {
        this.innerHTML = value;
      });
    },

    text: function (value) {
      if (value === undefined) {
        return this[0]?.textContent;
      }
      return this.each(function () {
        this.textContent = value;
      });
    },
    
    // --- FORM METHODS ---

    serialize: function() {
      const params = [];
      this.each(function() {
        const elements = this.matches('form') ? this.elements : [this];

        Array.from(elements).forEach(el => {
          if (!el.name || el.disabled || ['file', 'reset', 'submit', 'button'].includes(el.type)) return;
          if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) return;
          
          if (el.tagName === 'SELECT') {
            Array.from(el.options).forEach(option => {
              if (option.selected) {
                params.push(`${encodeURIComponent(el.name)}=${encodeURIComponent(option.value)}`);
              }
            });
          } else {
            params.push(`${encodeURIComponent(el.name)}=${encodeURIComponent(el.value)}`);
          }
        });
      });
      return params.join('&');
    }
  };

  // Ensure instanceof works correctly
  J.fn.init.prototype = J.fn;

  // --- STATIC METHODS ---
  J.ready = function (fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  // --- AJAX MODULE ---
  function serializeParams(params = {}) {
    return Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
  }

  J.ajax = function ({
    url,
    method = 'GET',
    headers = {},
    data = null,
    responseType = 'json',
    contentType = 'application/x-www-form-urlencoded; charset=UTF-8',
    timeout = 0,
    beforeSend = () => {},
    success = () => {},
    error = () => {},
    complete = () => {},
  } = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      let finalUrl = url;
      let sendData = null;

      if (method.toUpperCase() === 'GET' && data && typeof data === 'object') {
        const queryString = serializeParams(data);
        finalUrl += (url.includes('?') ? '&' : '?') + queryString;
      } else if (data) {
        if (contentType.includes('json')) {
          sendData = JSON.stringify(data);
        } else if (contentType.includes('x-www-form-urlencoded')) {
          sendData = serializeParams(data);
        } else {
          sendData = data;
        }
      }

      xhr.open(method, finalUrl, true);
      if (responseType) xhr.responseType = responseType;
      Object.entries(headers).forEach(([key, val]) => xhr.setRequestHeader(key, val));
      if (method.toUpperCase() !== 'GET' && contentType && !headers['Content-Type']) {
        xhr.setRequestHeader('Content-Type', contentType);
      }
      if (timeout > 0) xhr.timeout = timeout;

      try { beforeSend(xhr); } catch (e) { console.warn('beforeSend hook error:', e); }

      xhr.onload = () => {
        const isSuccess = xhr.status >= 200 && xhr.status < 400;
        let responseData = ('response' in xhr) ? xhr.response : xhr.responseText;
        if (xhr.responseType === 'json' && typeof responseData === 'string') {
            try { responseData = JSON.parse(responseData); } catch (e) { /* ignore parse error */ }
        }
        
        if (isSuccess) {
          success(responseData, xhr.status, xhr);
          resolve(responseData);
        } else {
          const err = new Error(`Request failed with status ${xhr.status}`);
          error(err, xhr.status, xhr);
          reject(err);
        }
        complete(xhr);
      };
      xhr.onerror = () => {
        const err = new Error('Network error');
        error(err, xhr.status, xhr);
        complete(xhr);
        reject(err);
      };
      xhr.ontimeout = () => {
        const err = new Error('Request timed out');
        error(err, xhr.status, xhr);
        complete(xhr);
        reject(err);
      };
      xhr.send(sendData);
    });
  };

  J.get = function (url, data, success, options) {
    if (typeof data === 'function') {
        options = { success: data };
        data = null;
    }
    return J.ajax({ url, method: 'GET', data, success, ...options });
  };

  J.post = function (url, data, success, options) {
    if (typeof data === 'function') {
        options = { success: data };
        data = null;
    }
    return J.ajax({
      url,
      method: 'POST',
      data,
      success,
      contentType: 'application/json; charset=UTF-8',
      ...options
    });
  };

  // --- EXPORT ---
  global.J = J;

})(typeof window !== 'undefined' ? window : this);
