/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/helper.js":
/*!**************************!*\
  !*** ./src/js/helper.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"checkBlanks\": () => (/* binding */ checkBlanks),\n/* harmony export */   \"clearCards\": () => (/* binding */ clearCards),\n/* harmony export */   \"controlsDisableEnable\": () => (/* binding */ controlsDisableEnable),\n/* harmony export */   \"displayCardsPoints\": () => (/* binding */ displayCardsPoints),\n/* harmony export */   \"hideModal\": () => (/* binding */ hideModal),\n/* harmony export */   \"highlightingOtherSeats\": () => (/* binding */ highlightingOtherSeats),\n/* harmony export */   \"highlightingSeat\": () => (/* binding */ highlightingSeat),\n/* harmony export */   \"presentingStatus\": () => (/* binding */ presentingStatus),\n/* harmony export */   \"removeHighlighting\": () => (/* binding */ removeHighlighting),\n/* harmony export */   \"reshuffleSeats\": () => (/* binding */ reshuffleSeats),\n/* harmony export */   \"reversingWinStatus\": () => (/* binding */ reversingWinStatus),\n/* harmony export */   \"startTimer\": () => (/* binding */ startTimer),\n/* harmony export */   \"stopTimer\": () => (/* binding */ stopTimer),\n/* harmony export */   \"toggleValidity\": () => (/* binding */ toggleValidity)\n/* harmony export */ });\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\n//HELPER FUNCIONS\nvar toggleValidity = function toggleValidity(element, validity) {\n  if (validity === \"valid\") {\n    element.classList.remove(\"is-invalid\");\n    element.classList.add(\"is-valid\");\n  } else {\n    element.classList.remove(\"is-valid\");\n    element.classList.add(\"is-invalid\");\n  }\n};\nvar checkBlanks = function checkBlanks(name, password, chips, invalidName, formName, invalidPass, formPass, invalidChips, formChips) {\n  if (name === \"\") {\n    invalidName.innerHTML = \"Please input a valid name\";\n    invalidName.hidden = false;\n    toggleValidity(formName, \"invalid\");\n  } else {\n    invalidName.hidden = true;\n    toggleValidity(formName, \"valid\");\n  }\n\n  if (password === \"\") {\n    invalidPass.innerHTML = \"Please input a valid password\";\n    invalidPass.hidden = false;\n    toggleValidity(formPass, \"invalid\");\n  } else {\n    invalidPass.hidden = true;\n    toggleValidity(formPass, \"valid\");\n  }\n\n  if (chips === \"\") {\n    invalidChips.innerHTML = \"Please input some chips you want to buy\";\n    invalidChips.hidden = false;\n    toggleValidity(formChips, \"invalid\");\n  } else {\n    invalidChips.hidden = true;\n    toggleValidity(formChips, \"valid\");\n  }\n}; // FUNCTIONS RELATED TO SEATS\n\nvar reshuffleSeats = function reshuffleSeats(seatId) {\n  var restOfSeats = document.getElementsByClassName(\"seated\");\n  var currentSeat = seatId + 1;\n\n  for (var i = 0; i < restOfSeats.length; i++) {\n    if (currentSeat === 12) {\n      currentSeat = 1;\n    }\n\n    restOfSeats[i].id = currentSeat;\n    currentSeat += 1;\n  }\n\n  var banker = document.getElementById(\"1\");\n  banker.classList.add(\"banker\");\n  banker.innerHTML = \"Banker\";\n}; //DISPLAYS CARDS\n\nvar clearCards = function clearCards() {\n  document.getElementById(\"mainseat-1\").style.backgroundImage = \"none\";\n  document.getElementById(\"mainseat-2\").style.backgroundImage = \"none\";\n  document.getElementById(\"mainseat-3\").style.backgroundImage = \"none\";\n};\nvar displayCardsPoints = function displayCardsPoints(data) {\n  console.log(\"cards\", data);\n  var sum = 0;\n  var stringSum;\n\n  for (var i = 0; i < data.length; i++) {\n    sum += data[i].points;\n    stringSum = String(sum).slice(-1);\n    var card = document.getElementById(\"mainseat-\".concat(i + 1));\n    card.innerHTML = \"\";\n    card.style.backgroundImage = \"url(\".concat(data[i].pic, \")\");\n    card.hidden = false;\n  }\n\n  if (data.length === 3) {\n    document.getElementById(\"mainseat-1\").style.left = \"43%\";\n    document.getElementById(\"mainseat-2\").style.left = \"46%\";\n    document.getElementById(\"mainseat-3\").hidden = false;\n  } else if (data.length === 2) {\n    document.getElementById(\"mainseat-1\").style.left = \"44%\";\n    document.getElementById(\"mainseat-2\").style.left = \"48%\";\n    document.getElementById(\"mainseat-3\").hidden = true;\n    document.getElementById(\"mainseat-3\").style.backgroundImage = \"none\";\n  }\n\n  var points = document.getElementById(\"points\");\n  points.innerHTML = \"\".concat(stringSum);\n  gameStartBtn.hidden = true;\n  controls.hidden = false;\n};\nvar reversingWinStatus = function reversingWinStatus(key, value) {\n  var innerContent = \"\";\n\n  if (value === \"Win\") {\n    innerContent += \"Seat \".concat(key, \" : Lose <br>\");\n  } else if (value === \"Win-Double\") {\n    innerContent += \"Seat \".concat(key, \" : Lose Double <br>\");\n  } else if (value === \"Win-Triple\") {\n    innerContent += \"Seat \".concat(key, \" : Lose Triple <br>\");\n  } else if (value === \"Win-Five Times\") {\n    innerContent += \"Seat \".concat(key, \" : Lose Five Times <br>\");\n  } else if (value === \"Lose\") {\n    innerContent += \"Seat \".concat(key, \" : Win <br>\");\n  } else if (value === \"Lose-Double\") {\n    innerContent += \"Seat \".concat(key, \" : Win Double <br>\");\n  } else if (value === \"Lose-Triple\") {\n    innerContent += \"Seat \".concat(key, \" : Win Triple <br>\");\n  } else if (value === \"Lose-Five Times\") {\n    innerContent += \"Seat \".concat(key, \" : Win Five Times <br>\");\n  } else if (value === \"Draw\") {\n    innerContent += \"Seat \".concat(key, \" : Draw <br>\");\n  }\n\n  console.log(\"innner\", innerContent);\n  return innerContent;\n};\nvar highlightingSeat = function highlightingSeat(turn, seatId) {\n  if (turn === seatId) {\n    var turnSeat = document.getElementById(\"mainseat-back\");\n    turnSeat.classList.add(\"turn\");\n    takeCardBtn.disabled = false;\n  } else {\n    var _turnSeat = document.getElementById(\"\".concat(turn));\n\n    _turnSeat.classList.add(\"turn\");\n\n    takeCardBtn.disabled = true;\n  }\n}; //clear highlighting\n\nvar removeHighlighting = function removeHighlighting() {\n  var turnSeat = document.getElementById(\"mainseat-back\");\n  turnSeat.classList.remove(\"turn\");\n  var allSeats = document.getElementsByClassName(\"seated\");\n\n  for (var i = 0; i < allSeats.length; i++) {\n    var seat = allSeats[i];\n\n    if (seat.classList.contains(\"turn\")) {\n      seat.classList.remove(\"turn\");\n    }\n  }\n};\nvar highlightingOtherSeats = function highlightingOtherSeats(users, string) {\n  if (users !== undefined) {\n    users.forEach(function (user) {\n      if (user.seat_id !== 1) {\n        var seat = document.getElementById(\"\".concat(string).concat(user.seat_id));\n        seat.classList.add(\"taken\");\n        seat.disabled = true;\n      }\n    });\n  }\n};\nvar presentingStatus = function presentingStatus(data, seatId) {\n  document.getElementById(\"game-results-btn\").hidden = false;\n  var table = document.getElementById(\"game-results-table\");\n  var status = localStorage.getItem(\"status\"); //null if have yet to b created\n  //for when its a single entry\n\n  var users;\n\n  if (Array.isArray(data) === false) {\n    users = [data];\n  } else {\n    users = _toConsumableArray(data);\n  }\n\n  for (var i = 0; i < users.length; i++) {\n    var user = users[i];\n\n    if (document.getElementById(\"status-\".concat(user.id)) === null) {\n      console.log(\"generating new\"); //check if the user information is already found in the table\n\n      var row = table.insertRow();\n      row.id = \"status-\".concat(user.id);\n      var cell1 = row.insertCell(0);\n      var cell2 = row.insertCell(1);\n      var cell3 = row.insertCell(2);\n      var cell4 = row.insertCell(3);\n\n      if (user.banker === true) {\n        cell1.innerHTML = \"Banker\";\n      } else {\n        cell1.innerHTML = user.username;\n        cell1.classList.add(\"text-capitalize\");\n      }\n\n      cell2.innerHTML = user.chips_bought;\n      cell3.innerHTML = user.chips;\n      cell4.innerHTML = Number(user.chips) - Number(user.chips_bought);\n\n      if (user.seat_id === seatId) {\n        row.classList.add(\"table-warning\");\n      } else {\n        row.style.color = \"white\";\n      }\n    } else {\n      //if the document does have the user infromation, update the info\n      console.log(\"changing old\");\n\n      var _row = document.getElementById(\"status-\".concat(user.id));\n\n      console.log(_row.cells);\n      _row.cells.item(1).innerHTML = user.chips_bought;\n      _row.cells.item(2).innerHTML = user.chips;\n      _row.cells.item(3).innerHTML = Number(user.chips) - Number(user.chips_bought);\n    }\n  }\n};\nvar hideModal = function hideModal() {\n  $(\"#results-modal\").modal(\"hide\");\n};\nvar controlsDisableEnable = function controlsDisableEnable(turn, seatId) {\n  var takeCardBtn = document.getElementById(\"take-card\");\n  var skipTurnBtn = document.getElementById(\"skip-turn-btn\");\n\n  if (turn !== seatId) {\n    takeCardBtn.disabled = true;\n    skipTurnBtn.disabled = true;\n  } else {\n    takeCardBtn.disabled = false;\n    skipTurnBtn.disabled = false;\n  }\n};\nvar timerInterval;\nvar startTimer = function startTimer() {\n  var timer = document.getElementById(\"timer\");\n  timer.hidden = false;\n  timer.innerHTML = \"10\";\n  var counter = 10;\n  var timerInterval = setInterval(function () {\n    counter--;\n    timer.innerHTML = counter;\n\n    if (counter === 0) {\n      clearInterval(timerInterval);\n      timer.innerHTML = \"\";\n    }\n  }, 1000);\n};\nvar stopTimer = function stopTimer() {\n  clearInterval(timerInterval);\n  var timer = document.getElementById(\"timer\");\n  timer.hidden = true;\n  timer.innerHTML = \"\";\n  console.log(\"cleared\", timerInterval);\n};\n\n//# sourceURL=webpack://baccarratstar/./src/js/helper.js?");

/***/ }),

/***/ "./src/js/pre-room.js":
/*!****************************!*\
  !*** ./src/js/pre-room.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper.js */ \"./src/js/helper.js\");\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && \"function\" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }, _typeof(obj); }\n\nfunction _regeneratorRuntime() { \"use strict\"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = \"function\" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || \"@@iterator\", asyncIteratorSymbol = $Symbol.asyncIterator || \"@@asyncIterator\", toStringTagSymbol = $Symbol.toStringTag || \"@@toStringTag\"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, \"\"); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = \"suspendedStart\"; return function (method, arg) { if (\"executing\" === state) throw new Error(\"Generator is already running\"); if (\"completed\" === state) { if (\"throw\" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if (\"next\" === context.method) context.sent = context._sent = context.arg;else if (\"throw\" === context.method) { if (\"suspendedStart\" === state) throw state = \"completed\", context.arg; context.dispatchException(context.arg); } else \"return\" === context.method && context.abrupt(\"return\", context.arg); state = \"executing\"; var record = tryCatch(innerFn, self, context); if (\"normal\" === record.type) { if (state = context.done ? \"completed\" : \"suspendedYield\", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } \"throw\" === record.type && (state = \"completed\", context.method = \"throw\", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: \"normal\", arg: fn.call(obj, arg) }; } catch (err) { return { type: \"throw\", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { [\"next\", \"throw\", \"return\"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if (\"throw\" !== record.type) { var result = record.arg, value = result.value; return value && \"object\" == _typeof(value) && hasOwn.call(value, \"__await\") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke(\"next\", value, resolve, reject); }, function (err) { invoke(\"throw\", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke(\"throw\", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, \"throw\" === context.method) { if (delegate.iterator[\"return\"] && (context.method = \"return\", context.arg = undefined, maybeInvokeDelegate(delegate, context), \"throw\" === context.method)) return ContinueSentinel; context.method = \"throw\", context.arg = new TypeError(\"The iterator does not provide a 'throw' method\"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if (\"throw\" === record.type) return context.method = \"throw\", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, \"return\" !== context.method && (context.method = \"next\", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = \"throw\", context.arg = new TypeError(\"iterator result is not an object\"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = \"normal\", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: \"root\" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if (\"function\" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, \"constructor\", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, \"constructor\", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, \"GeneratorFunction\"), exports.isGeneratorFunction = function (genFun) { var ctor = \"function\" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || \"GeneratorFunction\" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, \"GeneratorFunction\")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, \"Generator\"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, \"toString\", function () { return \"[object Generator]\"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = \"next\", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { \"t\" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if (\"throw\" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = \"throw\", record.arg = exception, context.next = loc, caught && (context.method = \"next\", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if (\"root\" === entry.tryLoc) return handle(\"end\"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, \"catchLoc\"), hasFinally = hasOwn.call(entry, \"finallyLoc\"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error(\"try statement without catch or finally\"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, \"finallyLoc\") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && (\"break\" === type || \"continue\" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = \"next\", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if (\"throw\" === record.type) throw record.arg; return \"break\" === record.type || \"continue\" === record.type ? this.next = record.arg : \"return\" === record.type ? (this.rval = this.arg = record.arg, this.method = \"return\", this.next = \"end\") : \"normal\" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, \"catch\": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if (\"throw\" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error(\"illegal catch attempt\"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, \"next\" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n// IMPORT\n\n\nfunction importAll(r) {\n  r.keys().forEach(r);\n}\n\nimportAll(require.context(\"../images/\", true, /\\.jpg\\.svg\\.png$/)); // BUTTONS\n\nvar showCreateRoomBtn = document.getElementById(\"get-create-room\");\nvar showJoinRoomBtn = document.getElementById(\"get-join-room\");\nvar createRoomBtn = document.getElementById(\"create-room-btn\");\nvar joinRoomBtn = document.getElementById(\"join-room-btn\"); //SECTIONS\n\nvar mainForms = document.getElementById(\"create-or-join\");\nvar mainSeat = document.getElementById(\"main-seat\");\nvar createForm = document.getElementById(\"create-room\");\nvar joinForm = document.getElementById(\"join-room\");\nvar navUsername = document.getElementById(\"navbarDropdown\"); //ERROR MESSAGES\n\nvar createInvalidName = document.getElementById(\"create-name-invalid\");\nvar createInvalidPassword = document.getElementById(\"create-password-invalid\");\nvar createInvalidChips = document.getElementById(\"create-chips-invalid\");\nvar createInvalidBet = document.getElementById(\"create-bet-invalid\");\nvar joinInvalidName = document.getElementById(\"join-name-invalid\");\nvar joinInvalidPassword = document.getElementById(\"join-password-invalid\");\nvar joinInvalidChips = document.getElementById(\"join-chips-invalid\");\nvar joinInvalidBet = document.getElementById(\"join-bet-invalid\"); //FORM ELEMENTS\n\nvar createFormName = document.getElementById(\"create-name\");\nvar createFormPassword = document.getElementById(\"create-password\");\nvar createFormChips = document.getElementById(\"create-chips\");\nvar createFormBet = document.getElementById(\"create-bet\");\nvar joinFormName = document.getElementById(\"join-name\");\nvar joinFormPassword = document.getElementById(\"join-password\");\nvar joinFormChips = document.getElementById(\"join-chips\");\nvar joinFormBet = document.getElementById(\"join-bet\"); //AJAX FUNCTIONS\n\nvar showMain = function showMain() {\n  mainForms.hidden = false;\n  joinForm.hidden = true;\n  createForm.hidden = true;\n};\n\nvar showCreateForm = function showCreateForm() {\n  mainForms.hidden = true;\n  joinForm.hidden = true;\n  createForm.hidden = false;\n};\n\nvar showJoinForm = function showJoinForm() {\n  mainForms.hidden = true;\n  createForm.hidden = true;\n  joinForm.hidden = false;\n};\n\nvar logout = /*#__PURE__*/function () {\n  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {\n    var response;\n    return _regeneratorRuntime().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.next = 2;\n            return axios.post(\"/logout\");\n\n          case 2:\n            response = _context.sent;\n\n            if (response.data === \"logout\") {\n              window.location.replace(\"http://localhost:3004\");\n            }\n\n          case 4:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function logout() {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nvar init = /*#__PURE__*/function () {\n  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {\n    var response, name;\n    return _regeneratorRuntime().wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            _context2.next = 2;\n            return axios.get(\"/game/userstate\");\n\n          case 2:\n            response = _context2.sent;\n            name = response.data.username;\n\n            if (name !== null || undefined) {\n              navUsername.innerHTML = name;\n            }\n\n          case 5:\n          case \"end\":\n            return _context2.stop();\n        }\n      }\n    }, _callee2);\n  }));\n\n  return function init() {\n    return _ref2.apply(this, arguments);\n  };\n}(); // create room jumps straight to the room, as the user cannot choose his seat.\n\n\nvar createRoom = function createRoom() {\n  try {\n    var name = createFormName.value;\n    var password = createFormPassword.value;\n    var chips = createFormChips.value;\n    var data = {\n      name: name,\n      password: password,\n      chips: chips\n    };\n    (0,_helper_js__WEBPACK_IMPORTED_MODULE_0__.checkBlanks)(name, password, chips, createInvalidName, createFormName, createInvalidPassword, createFormPassword, createInvalidChips, createFormChips);\n\n    if (name !== \"\" && password !== \"\" && chips !== \"\") {\n      axios.post(\"/game/create\", data).then(function (response) {\n        if (response.data.message === \"room name is not unique\") {\n          createInvalidName.innerHTML = \"Name not unique, please use different name\";\n          createInvalidName.hidden = false;\n          (0,_helper_js__WEBPACK_IMPORTED_MODULE_0__.toggleValidity)(createFormName, \"invalid\");\n        } else {\n          window.location.replace(\"http://localhost:3004/game\");\n        }\n      });\n    }\n  } catch (error) {\n    console.log(error);\n  }\n};\n\nvar joinRoom = function joinRoom() {\n  try {\n    var name = joinFormName.value;\n    var password = joinFormPassword.value;\n    var chips = joinFormChips.value;\n    var bet = joinFormBet.value;\n    var data = {\n      name: name,\n      password: password,\n      chips: chips,\n      bet: bet\n    };\n    (0,_helper_js__WEBPACK_IMPORTED_MODULE_0__.checkBlanks)(name, password, chips, joinInvalidName, joinFormName, joinInvalidPassword, joinFormPassword, joinInvalidChips, joinFormChips);\n\n    if (bet === \"\") {\n      joinInvalidBet.innerHTML = \"Please input the bet you want\";\n      joinInvalidBet.hidden = false;\n      (0,_helper_js__WEBPACK_IMPORTED_MODULE_0__.toggleValidity)(joinFormBet, \"invalid\");\n    } else {\n      joinInvalidBet.hidden = true;\n      (0,_helper_js__WEBPACK_IMPORTED_MODULE_0__.toggleValidity)(joinFormBet, \"valid\");\n    }\n\n    if (name !== \"\" && password !== \"\" && chips !== \"\" && bet !== \"\") {\n      axios.post(\"/game/join\", data).then(function (response) {\n        if (response.data.message === \"No such room exists\") {\n          joinInvalidName.innerHTML = \"Rooms is not found, please enter valid room\";\n          joinInvalidName.hidden = false;\n          (0,_helper_js__WEBPACK_IMPORTED_MODULE_0__.toggleValidity)(joinFormName, \"invalid\");\n        } else if (response.data.message === \"Incorrect Password\") {\n          joinInvalidPassword.innerHTML = \"Please enter correct password\";\n          joinInvalidPassword.hidden = false;\n          (0,_helper_js__WEBPACK_IMPORTED_MODULE_0__.toggleValidity)(joinFormPassword, \"invalid\");\n        } else {\n          window.location.replace(\"http://localhost:3004/game\");\n        }\n      });\n    }\n  } catch (error) {\n    console.log(error);\n  }\n}; // BUTTONS EVENTS\n\n\ncreateRoomBtn.addEventListener(\"click\", createRoom);\njoinRoomBtn.addEventListener(\"click\", joinRoom);\nshowCreateRoomBtn.addEventListener(\"click\", showCreateForm);\nshowJoinRoomBtn.addEventListener(\"click\", showJoinForm);\ndocument.getElementById(\"nav-show-create\").addEventListener(\"click\", showCreateForm);\ndocument.getElementById(\"nav-show-join\").addEventListener(\"click\", showJoinForm);\ndocument.getElementById(\"nav-show-main\").addEventListener(\"click\", showMain);\ndocument.getElementById(\"nav-logout\").addEventListener(\"click\", logout);\ninit();\n\n//# sourceURL=webpack://baccarratstar/./src/js/pre-room.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/pre-room.js");
/******/ 	
/******/ })()
;