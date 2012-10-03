// Generated by CoffeeScript 1.3.1
(function() {
  var __slice = [].slice;

  (function(root, factory) {
    if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
      return define(['jquery'], factory);
    } else if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
      return module.exports = factory(typeof $ !== "undefined" && $ !== null ? $ : {
        fn: {}
      });
    } else {
      return root.Transparency = factory(typeof $ !== "undefined" && $ !== null ? $ : {
        fn: {}
      });
    }
  })(this, function($) {
    var ELEMENT_NODE, TEXT_NODE, attr, cloneNode, consoleLogger, data, elementMatcher, elementNodes, expando, getText, html5Clone, isDate, isPlainValue, log, logger, matchingElements, nullLogger, prepareContext, register, render, renderChildren, renderDirectives, renderValues, setContent, setHtml, setText, _base;
    register = function($) {
      return $.fn.render = function(models, directives, config) {
        var context, _i, _len;
        for (_i = 0, _len = this.length; _i < _len; _i++) {
          context = this[_i];
          render(context, models, directives, config);
        }
        return this;
      };
    };
    register($);
    expando = 'transparency';
    data = function(element) {
      return element[expando] || (element[expando] = {});
    };
    nullLogger = function() {};
    consoleLogger = function() {
      var m, messages, _i, _len, _results;
      messages = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        m = messages[_i];
        _results.push(console.log(m));
      }
      return _results;
    };
    log = null;
    logger = function(config) {
      if ((config != null ? config.debug : void 0) && (typeof console !== "undefined" && console !== null)) {
        return consoleLogger;
      } else {
        return nullLogger;
      }
    };
    render = function(context, models, directives, config) {
      var contextData, e, index, instance, model, parent, sibling, _i, _j, _len, _len1, _ref;
      log = logger(config);
      log("Context:", context, "Models:", models, "Directives:", directives, "Config:", config);
      if (!context) {
        return;
      }
      models || (models = []);
      directives || (directives = {});
      if (!Array.isArray(models)) {
        models = [models];
      }
      sibling = context.nextSibling;
      parent = context.parentNode;
      if (parent != null) {
        parent.removeChild(context);
      }
      prepareContext(context, models);
      contextData = data(context);
      for (index = _i = 0, _len = models.length; _i < _len; index = ++_i) {
        model = models[index];
        instance = contextData.instances[index];
        log("Model:", model, "Template instance for the model:", instance);
        _ref = instance.elements;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          e = _ref[_j];
          data(e).model = model;
        }
        renderValues(instance, model);
        renderDirectives(instance, model, index, directives);
        renderChildren(instance, model, directives, config);
      }
      if (sibling) {
        if (parent != null) {
          parent.insertBefore(context, sibling);
        }
      } else {
        if (parent != null) {
          parent.appendChild(context);
        }
      }
      return context;
    };
    prepareContext = function(context, models) {
      var contextData, instance, n, _i, _len, _ref, _results;
      contextData = data(context);
      contextData.template || (contextData.template = ((function() {
        var _results;
        _results = [];
        while (context.firstChild) {
          _results.push(context.removeChild(context.firstChild));
        }
        return _results;
      })()));
      contextData.instanceCache || (contextData.instanceCache = []);
      contextData.instances || (contextData.instances = []);
      log("Original template", contextData.template);
      while (models.length > contextData.instances.length) {
        instance = contextData.instanceCache.pop() || {};
        instance.queryCache || (instance.queryCache = {});
        instance.template || (instance.template = (function() {
          var _i, _len, _ref, _results;
          _ref = contextData.template;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            n = _ref[_i];
            _results.push(cloneNode(n));
          }
          return _results;
        })());
        instance.elements || (instance.elements = elementNodes(instance.template));
        _ref = instance.template;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          context.appendChild(n);
        }
        contextData.instances.push(instance);
      }
      _results = [];
      while (models.length < contextData.instances.length) {
        contextData.instanceCache.push(instance = contextData.instances.pop());
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = instance.template;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            n = _ref1[_j];
            _results1.push(n.parentNode.removeChild(n));
          }
          return _results1;
        })());
      }
      return _results;
    };
    renderValues = function(instance, model) {
      var element, key, value, _results;
      _results = [];
      for (key in model) {
        value = model[key];
        if (typeof model === 'object' && isPlainValue(value)) {
          _results.push((function() {
            var _i, _len, _ref, _results1;
            _ref = matchingElements(instance, key);
            _results1 = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              element = _ref[_i];
              if (element.nodeName.toLowerCase() === 'input') {
                _results1.push(attr(element, 'value', value));
              } else {
                _results1.push(attr(element, 'text', value));
              }
            }
            return _results1;
          })());
        }
      }
      return _results;
    };
    renderDirectives = function(instance, model, index, directives) {
      var attribute, attributes, directive, element, key, value, _results;
      model = typeof model === 'object' ? model : {
        value: model
      };
      _results = [];
      for (key in directives) {
        attributes = directives[key];
        if (typeof attributes !== 'object') {
          throw new Error("Directive syntax is directive[element][attribute] = function(params)");
        }
        _results.push((function() {
          var _i, _len, _ref, _results1;
          _ref = matchingElements(instance, key);
          _results1 = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            element = _ref[_i];
            _results1.push((function() {
              var _results2;
              _results2 = [];
              for (attribute in attributes) {
                directive = attributes[attribute];
                if (!(typeof directive === 'function')) {
                  continue;
                }
                value = directive.call(model, {
                  element: element,
                  index: index,
                  value: attr(element, attribute)
                });
                if (value != null) {
                  _results2.push(attr(element, attribute, value));
                } else {
                  _results2.push(void 0);
                }
              }
              return _results2;
            })());
          }
          return _results1;
        })());
      }
      return _results;
    };
    renderChildren = function(instance, model, directives, config) {
      var element, key, value, _results;
      _results = [];
      for (key in model) {
        value = model[key];
        if (typeof value === 'object' && !isDate(value)) {
          _results.push((function() {
            var _i, _len, _ref, _results1;
            _ref = matchingElements(instance, key);
            _results1 = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              element = _ref[_i];
              _results1.push(render(element, value, directives[key], config));
            }
            return _results1;
          })());
        }
      }
      return _results;
    };
    setContent = function(callback) {
      return function(element, content) {
        var c, elementData, n, _i, _len, _ref, _results;
        elementData = data(element);
        if (elementData.content === content) {
          return;
        }
        elementData.content = content;
        elementData.children || (elementData.children = (function() {
          var _i, _len, _ref, _results;
          _ref = element.childNodes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            n = _ref[_i];
            if (n.nodeType === ELEMENT_NODE) {
              _results.push(n);
            }
          }
          return _results;
        })());
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        callback(element, content);
        _ref = elementData.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(element.appendChild(c));
        }
        return _results;
      };
    };
    setHtml = setContent(function(element, html) {
      return element.innerHTML = html;
    });
    setText = setContent(function(element, text) {
      return element.appendChild(element.ownerDocument.createTextNode(text));
    });
    getText = function(element) {
      var child;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = element.childNodes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (child.nodeType === TEXT_NODE) {
            _results.push(child.nodeValue);
          }
        }
        return _results;
      })()).join('');
    };
    attr = function(element, attribute, value) {
      var elementData, _base, _base1, _base2, _base3;
      if ((value != null) && typeof value !== 'string') {
        value = value.toString();
      }
      elementData = data(element);
      elementData.originalAttributes || (elementData.originalAttributes = {});
      switch (attribute) {
        case 'text':
          (_base = elementData.originalAttributes)['text'] || (_base['text'] = getText(element));
          if (value != null) {
            setText(element, value);
          }
          break;
        case 'html':
          (_base1 = elementData.originalAttributes)['html'] || (_base1['html'] = element.innerHTML);
          if (value != null) {
            setHtml(element, value);
          }
          break;
        case 'class':
          (_base2 = elementData.originalAttributes)['class'] || (_base2['class'] = element.className);
          if (value != null) {
            element.className = value;
          }
          break;
        default:
          (_base3 = elementData.originalAttributes)[attribute] || (_base3[attribute] = element.getAttribute(attribute));
          if (value != null) {
            element.setAttribute(attribute, value);
          }
      }
      if (value != null) {
        return value;
      } else {
        return elementData.originalAttributes[attribute];
      }
    };
    elementNodes = function(template) {
      var child, e, elements, _i, _j, _len, _len1, _ref;
      elements = [];
      for (_i = 0, _len = template.length; _i < _len; _i++) {
        e = template[_i];
        if (!(e.nodeType === ELEMENT_NODE)) {
          continue;
        }
        elements.push(e);
        _ref = e.getElementsByTagName('*');
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          child = _ref[_j];
          elements.push(child);
        }
      }
      return elements;
    };
    matchingElements = function(instance, key) {
      var e, elements, _base;
      elements = (_base = instance.queryCache)[key] || (_base[key] = (function() {
        var _i, _len, _ref, _results;
        _ref = instance.elements;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          if (elementMatcher(e, key)) {
            _results.push(e);
          }
        }
        return _results;
      })());
      log("Matching elements for '" + key + "':", elements);
      return elements;
    };
    elementMatcher = function(element, key) {
      return element.id === key || element.className.split(' ').indexOf(key) > -1 || element.name === key || element.getAttribute('data-bind') === key;
    };
    ELEMENT_NODE = 1;
    TEXT_NODE = 3;
    html5Clone = function() {
      return document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>";
    };
    cloneNode = !(typeof document !== "undefined" && document !== null) || html5Clone() ? function(node) {
      return node.cloneNode(true);
    } : function(node) {
      return $(node).clone()[0];
    };
    if (Array.isArray == null) {
      Array.isArray = function(obj) {
        return $.isArray(obj);
      };
    }
    if ((_base = Array.prototype).indexOf == null) {
      _base.indexOf = function(obj) {
        return $.inArray(obj, this);
      };
    }
    isDate = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Date]';
    };
    isPlainValue = function(obj) {
      return isDate(obj) || typeof obj !== 'object' && typeof obj !== 'function';
    };
    return {
      render: render,
      register: register
    };
  });

}).call(this);