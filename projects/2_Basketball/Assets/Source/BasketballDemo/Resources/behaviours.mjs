/******/ var __webpack_modules__ = ({

/***/ "./output/Base/base.js":
/*!*****************************!*\
  !*** ./output/Base/base.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JsBehaviour": () => (/* binding */ JsBehaviour)
/* harmony export */ });
class JsBehaviour {
    constructor(mb) {
        // mono.Js
        this._mb = mb;
        if (this.Start != JsBehaviour.prototype.Start) {
            mb.JsStart = this.Start.bind(this);
        }
        if (this.Update != JsBehaviour.prototype.Update) {
            mb.JsUpdate = this.Update.bind(this);
        }
        if (this.OnTriggerEnter != JsBehaviour.prototype.OnTriggerEnter) {
            mb.JsOnTriggerEnter = this.OnTriggerEnter.bind(this);
        }
    }
    Start() { }
    Update() { }
    OnTriggerEnter(other) { }
}

//# sourceMappingURL=base.js.map

/***/ }),

/***/ "./output/JSBallBehaviour.js":
/*!***********************************!*\
  !*** ./output/JSBallBehaviour.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JSBallBehaviour": () => (/* binding */ JSBallBehaviour)
/* harmony export */ });
/* harmony import */ var _Base_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base/base */ "./output/Base/base.js");
/* harmony import */ var _JSGameManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JSGameManager */ "./output/JSGameManager.js");


class JSBallBehaviour extends _Base_base__WEBPACK_IMPORTED_MODULE_0__.JsBehaviour {
    OnTriggerEnter(trigger) {
        if (trigger == _JSGameManager__WEBPACK_IMPORTED_MODULE_1__.JSGameManager.instance._mb.PrescoreTrigger) {
            this.prescore = true;
        }
        if (trigger == _JSGameManager__WEBPACK_IMPORTED_MODULE_1__.JSGameManager.instance._mb.ScoredTrigger && this.prescore) {
            console.log("得分");
        }
    }
}

//# sourceMappingURL=JSBallBehaviour.js.map

/***/ }),

/***/ "./output/JSGameManager.js":
/*!*********************************!*\
  !*** ./output/JSGameManager.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JSGameManager": () => (/* binding */ JSGameManager)
/* harmony export */ });
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var puerts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! puerts */ "puerts");
/* harmony import */ var puerts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(puerts__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Base_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Base/base */ "./output/Base/base.js");



class JSGameManager extends _Base_base__WEBPACK_IMPORTED_MODULE_2__.JsBehaviour {
    Start() {
        this.spawnBall();
        JSGameManager.instance = this;
    }
    Update() {
        const expectPressTimeMax = 1000;
        if (!this.pressed && (csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Input.GetMouseButtonDown(0) || csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Input.touchCount != 0)) {
            this.pressed = Date.now();
            if (csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Input.touchCount) {
                this.useTouch = true;
            }
        }
        if (this.pressed && (this.useTouch ? csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Input.touchCount == 0 : csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Input.GetMouseButtonUp(0))) {
            this.shootBall(Math.min(expectPressTimeMax, Date.now() - this.pressed) / expectPressTimeMax);
            this.pressed = 0;
        }
        //@ts-ignore
        globalThis._puerts_registry && globalThis._puerts_registry.cleanup();
    }
    shootBall(power) {
        const rigidbody = this.currentBall.GetComponent((0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Rigidbody));
        rigidbody.isKinematic = false;
        rigidbody.velocity = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Vector3(1 + 2 * power, 3 + 6 * power, 0);
        setTimeout(() => {
            this.spawnBall();
        }, 500);
    }
    spawnBall() {
        const ball = this.currentBall = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Object.Instantiate(this._mb.BallPrefab);
        ball.transform.position = this._mb.BallSpawnPoint.transform.position;
        const rigidbody = ball.GetComponent((0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Rigidbody));
        rigidbody.isKinematic = true;
    }
}

//# sourceMappingURL=JSGameManager.js.map

/***/ }),

/***/ "csharp":
/*!*************************!*\
  !*** external "csharp" ***!
  \*************************/
/***/ ((module) => {

module.exports = csharp;

/***/ }),

/***/ "puerts":
/*!*************************!*\
  !*** external "puerts" ***!
  \*************************/
/***/ ((module) => {

module.exports = puerts;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./output/entry.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JSBallBehaviour": () => (/* binding */ JSBallBehaviourFactory),
/* harmony export */   "JSGameManager": () => (/* binding */ JSGameManagerFactory)
/* harmony export */ });
/* harmony import */ var _JSGameManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./JSGameManager */ "./output/JSGameManager.js");
/* harmony import */ var _JSBallBehaviour__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JSBallBehaviour */ "./output/JSBallBehaviour.js");


function makeFactory(cls) {
    return function (...args) {
        return new cls(...args);
    };
}
const JSBallBehaviourFactory = makeFactory(_JSBallBehaviour__WEBPACK_IMPORTED_MODULE_1__.JSBallBehaviour);
const JSGameManagerFactory = makeFactory(_JSGameManager__WEBPACK_IMPORTED_MODULE_0__.JSGameManager);

//# sourceMappingURL=entry.js.map
})();

var __webpack_exports__JSBallBehaviour = __webpack_exports__.JSBallBehaviour;
var __webpack_exports__JSGameManager = __webpack_exports__.JSGameManager;
export { __webpack_exports__JSBallBehaviour as JSBallBehaviour, __webpack_exports__JSGameManager as JSGameManager };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVoYXZpb3Vycy5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3VCO0FBQ3ZCOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkIwQztBQUNNO0FBQ2hELDhCQUE4QixtREFBVztBQUN6QztBQUNBLHVCQUF1QixzRkFBMEM7QUFDakU7QUFDQTtBQUNBLHVCQUF1QixvRkFBd0M7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDMkI7QUFDM0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNicUM7QUFDSjtBQUNTO0FBQzFDLDRCQUE0QixtREFBVztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsd0VBQW9DLE9BQU8sZ0VBQTRCO0FBQ3JHO0FBQ0EsZ0JBQWdCLGdFQUE0QjtBQUM1QztBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsZ0VBQTRCLFFBQVEsc0VBQWtDO0FBQ25IO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELCtDQUFPLENBQUMseURBQXFCO0FBQ3JGO0FBQ0EsaUNBQWlDLHVEQUFtQjtBQUNwRDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSx3Q0FBd0Msa0VBQThCO0FBQ3RFO0FBQ0EsNENBQTRDLCtDQUFPLENBQUMseURBQXFCO0FBQ3pFO0FBQ0E7QUFDQTtBQUN5QjtBQUN6Qjs7Ozs7Ozs7OztBQ3ZDQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7U0NBQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBOztTQUVBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBOzs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EsaUNBQWlDLFdBQVc7VUFDNUM7VUFDQTs7Ozs7VUNQQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBOzs7OztVQ1BBOzs7OztVQ0FBO1VBQ0E7VUFDQTtVQUNBLHVEQUF1RCxpQkFBaUI7VUFDeEU7VUFDQSxnREFBZ0QsYUFBYTtVQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOZ0Q7QUFDSTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLDZEQUFlO0FBQzFELHlDQUF5Qyx5REFBYTtBQUNzQztBQUM1RixpQyIsInNvdXJjZXMiOlsid2VicGFjazovL0BwdWVydHMvd2ViZ2wvLi9vdXRwdXQvQmFzZS9iYXNlLmpzIiwid2VicGFjazovL0BwdWVydHMvd2ViZ2wvLi9vdXRwdXQvSlNCYWxsQmVoYXZpb3VyLmpzIiwid2VicGFjazovL0BwdWVydHMvd2ViZ2wvLi9vdXRwdXQvSlNHYW1lTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9AcHVlcnRzL3dlYmdsL2V4dGVybmFsIHZhciBcImNzaGFycFwiIiwid2VicGFjazovL0BwdWVydHMvd2ViZ2wvZXh0ZXJuYWwgdmFyIFwicHVlcnRzXCIiLCJ3ZWJwYWNrOi8vQHB1ZXJ0cy93ZWJnbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AcHVlcnRzL3dlYmdsL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL0BwdWVydHMvd2ViZ2wvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0BwdWVydHMvd2ViZ2wvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9AcHVlcnRzL3dlYmdsL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQHB1ZXJ0cy93ZWJnbC8uL291dHB1dC9lbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBKc0JlaGF2aW91ciB7XG4gICAgY29uc3RydWN0b3IobWIpIHtcbiAgICAgICAgLy8gbW9uby5Kc1xuICAgICAgICB0aGlzLl9tYiA9IG1iO1xuICAgICAgICBpZiAodGhpcy5TdGFydCAhPSBKc0JlaGF2aW91ci5wcm90b3R5cGUuU3RhcnQpIHtcbiAgICAgICAgICAgIG1iLkpzU3RhcnQgPSB0aGlzLlN0YXJ0LmJpbmQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuVXBkYXRlICE9IEpzQmVoYXZpb3VyLnByb3RvdHlwZS5VcGRhdGUpIHtcbiAgICAgICAgICAgIG1iLkpzVXBkYXRlID0gdGhpcy5VcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5PblRyaWdnZXJFbnRlciAhPSBKc0JlaGF2aW91ci5wcm90b3R5cGUuT25UcmlnZ2VyRW50ZXIpIHtcbiAgICAgICAgICAgIG1iLkpzT25UcmlnZ2VyRW50ZXIgPSB0aGlzLk9uVHJpZ2dlckVudGVyLmJpbmQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgU3RhcnQoKSB7IH1cbiAgICBVcGRhdGUoKSB7IH1cbiAgICBPblRyaWdnZXJFbnRlcihvdGhlcikgeyB9XG59XG5leHBvcnQgeyBKc0JlaGF2aW91ciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmFzZS5qcy5tYXAiLCJpbXBvcnQgeyBKc0JlaGF2aW91ciB9IGZyb20gJy4vQmFzZS9iYXNlJztcbmltcG9ydCB7IEpTR2FtZU1hbmFnZXIgfSBmcm9tICcuL0pTR2FtZU1hbmFnZXInO1xuY2xhc3MgSlNCYWxsQmVoYXZpb3VyIGV4dGVuZHMgSnNCZWhhdmlvdXIge1xuICAgIE9uVHJpZ2dlckVudGVyKHRyaWdnZXIpIHtcbiAgICAgICAgaWYgKHRyaWdnZXIgPT0gSlNHYW1lTWFuYWdlci5pbnN0YW5jZS5fbWIuUHJlc2NvcmVUcmlnZ2VyKSB7XG4gICAgICAgICAgICB0aGlzLnByZXNjb3JlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJpZ2dlciA9PSBKU0dhbWVNYW5hZ2VyLmluc3RhbmNlLl9tYi5TY29yZWRUcmlnZ2VyICYmIHRoaXMucHJlc2NvcmUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5b6X5YiGXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IHsgSlNCYWxsQmVoYXZpb3VyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1KU0JhbGxCZWhhdmlvdXIuanMubWFwIiwiaW1wb3J0IHsgVW5pdHlFbmdpbmUgfSBmcm9tICdjc2hhcnAnO1xuaW1wb3J0IHsgJHR5cGVvZiB9IGZyb20gJ3B1ZXJ0cyc7XG5pbXBvcnQgeyBKc0JlaGF2aW91ciB9IGZyb20gJy4vQmFzZS9iYXNlJztcbmNsYXNzIEpTR2FtZU1hbmFnZXIgZXh0ZW5kcyBKc0JlaGF2aW91ciB7XG4gICAgU3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc3Bhd25CYWxsKCk7XG4gICAgICAgIEpTR2FtZU1hbmFnZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIH1cbiAgICBVcGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IGV4cGVjdFByZXNzVGltZU1heCA9IDEwMDA7XG4gICAgICAgIGlmICghdGhpcy5wcmVzc2VkICYmIChVbml0eUVuZ2luZS5JbnB1dC5HZXRNb3VzZUJ1dHRvbkRvd24oMCkgfHwgVW5pdHlFbmdpbmUuSW5wdXQudG91Y2hDb3VudCAhPSAwKSkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmIChVbml0eUVuZ2luZS5JbnB1dC50b3VjaENvdW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VUb3VjaCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJlc3NlZCAmJiAodGhpcy51c2VUb3VjaCA/IFVuaXR5RW5naW5lLklucHV0LnRvdWNoQ291bnQgPT0gMCA6IFVuaXR5RW5naW5lLklucHV0LkdldE1vdXNlQnV0dG9uVXAoMCkpKSB7XG4gICAgICAgICAgICB0aGlzLnNob290QmFsbChNYXRoLm1pbihleHBlY3RQcmVzc1RpbWVNYXgsIERhdGUubm93KCkgLSB0aGlzLnByZXNzZWQpIC8gZXhwZWN0UHJlc3NUaW1lTWF4KTtcbiAgICAgICAgICAgIHRoaXMucHJlc3NlZCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGdsb2JhbFRoaXMuX3B1ZXJ0c19yZWdpc3RyeSAmJiBnbG9iYWxUaGlzLl9wdWVydHNfcmVnaXN0cnkuY2xlYW51cCgpO1xuICAgIH1cbiAgICBzaG9vdEJhbGwocG93ZXIpIHtcbiAgICAgICAgY29uc3QgcmlnaWRib2R5ID0gdGhpcy5jdXJyZW50QmFsbC5HZXRDb21wb25lbnQoJHR5cGVvZihVbml0eUVuZ2luZS5SaWdpZGJvZHkpKTtcbiAgICAgICAgcmlnaWRib2R5LmlzS2luZW1hdGljID0gZmFsc2U7XG4gICAgICAgIHJpZ2lkYm9keS52ZWxvY2l0eSA9IG5ldyBVbml0eUVuZ2luZS5WZWN0b3IzKDEgKyAyICogcG93ZXIsIDMgKyA2ICogcG93ZXIsIDApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3Bhd25CYWxsKCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfVxuICAgIHNwYXduQmFsbCgpIHtcbiAgICAgICAgY29uc3QgYmFsbCA9IHRoaXMuY3VycmVudEJhbGwgPSBVbml0eUVuZ2luZS5PYmplY3QuSW5zdGFudGlhdGUodGhpcy5fbWIuQmFsbFByZWZhYik7XG4gICAgICAgIGJhbGwudHJhbnNmb3JtLnBvc2l0aW9uID0gdGhpcy5fbWIuQmFsbFNwYXduUG9pbnQudHJhbnNmb3JtLnBvc2l0aW9uO1xuICAgICAgICBjb25zdCByaWdpZGJvZHkgPSBiYWxsLkdldENvbXBvbmVudCgkdHlwZW9mKFVuaXR5RW5naW5lLlJpZ2lkYm9keSkpO1xuICAgICAgICByaWdpZGJvZHkuaXNLaW5lbWF0aWMgPSB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydCB7IEpTR2FtZU1hbmFnZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUpTR2FtZU1hbmFnZXIuanMubWFwIiwibW9kdWxlLmV4cG9ydHMgPSBjc2hhcnA7IiwibW9kdWxlLmV4cG9ydHMgPSBwdWVydHM7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IEpTR2FtZU1hbmFnZXIgfSBmcm9tIFwiLi9KU0dhbWVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBKU0JhbGxCZWhhdmlvdXIgfSBmcm9tIFwiLi9KU0JhbGxCZWhhdmlvdXJcIjtcbmZ1bmN0aW9uIG1ha2VGYWN0b3J5KGNscykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbmV3IGNscyguLi5hcmdzKTtcbiAgICB9O1xufVxuY29uc3QgSlNCYWxsQmVoYXZpb3VyRmFjdG9yeSA9IG1ha2VGYWN0b3J5KEpTQmFsbEJlaGF2aW91cik7XG5jb25zdCBKU0dhbWVNYW5hZ2VyRmFjdG9yeSA9IG1ha2VGYWN0b3J5KEpTR2FtZU1hbmFnZXIpO1xuZXhwb3J0IHsgSlNCYWxsQmVoYXZpb3VyRmFjdG9yeSBhcyBKU0JhbGxCZWhhdmlvdXIsIEpTR2FtZU1hbmFnZXJGYWN0b3J5IGFzIEpTR2FtZU1hbmFnZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudHJ5LmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==