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
/* harmony import */ var _Base_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base/base */ "./output/Base/base.js");

class JSGameManager extends _Base_base__WEBPACK_IMPORTED_MODULE_0__.JsBehaviour {
    Start() {
        this.spawnBall();
        JSGameManager.instance = this;
    }
    Update() {
        const expectPressTimeMax = 1000;
        if (!this.pressed && (CS.UnityEngine.Input.GetMouseButtonDown(0) || CS.UnityEngine.Input.touchCount != 0)) {
            this.pressed = Date.now();
            if (CS.UnityEngine.Input.touchCount) {
                this.useTouch = true;
            }
        }
        if (this.pressed && (this.useTouch ? CS.UnityEngine.Input.touchCount == 0 : CS.UnityEngine.Input.GetMouseButtonUp(0))) {
            this.shootBall(Math.min(expectPressTimeMax, Date.now() - this.pressed) / expectPressTimeMax);
            this.pressed = 0;
        }
        //@ts-ignore
        globalThis._puerts_registry && globalThis._puerts_registry.cleanup();
    }
    shootBall(power) {
        const rigidbody = this.currentBall.GetComponent(puer.$typeof(CS.UnityEngine.Rigidbody));
        rigidbody.isKinematic = false;
        rigidbody.velocity = new CS.UnityEngine.Vector3(1 + 2 * power, 3 + 6 * power, 0);
        setTimeout(() => {
            this.spawnBall();
        }, 500);
    }
    spawnBall() {
        const ball = this.currentBall = CS.UnityEngine.Object.Instantiate(this._mb.BallPrefab);
        ball.transform.position = this._mb.BallSpawnPoint.transform.position;
        const rigidbody = ball.GetComponent(puer.$typeof(CS.UnityEngine.Rigidbody));
        rigidbody.isKinematic = true;
    }
}

//# sourceMappingURL=JSGameManager.js.map

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVoYXZpb3Vycy5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3VCO0FBQ3ZCOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkIwQztBQUNNO0FBQ2hELDhCQUE4QixtREFBVztBQUN6QztBQUNBLHVCQUF1QixzRkFBMEM7QUFDakU7QUFDQTtBQUNBLHVCQUF1QixvRkFBd0M7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDMkI7QUFDM0I7Ozs7Ozs7Ozs7Ozs7OztBQ2IwQztBQUMxQyw0QkFBNEIsbURBQVc7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUN5QjtBQUN6Qjs7Ozs7O1NDckNBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05nRDtBQUNJO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsNkRBQWU7QUFDMUQseUNBQXlDLHlEQUFhO0FBQ3NDO0FBQzVGLGlDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHB1ZXJ0cy93ZWJnbC8uL291dHB1dC9CYXNlL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vQHB1ZXJ0cy93ZWJnbC8uL291dHB1dC9KU0JhbGxCZWhhdmlvdXIuanMiLCJ3ZWJwYWNrOi8vQHB1ZXJ0cy93ZWJnbC8uL291dHB1dC9KU0dhbWVNYW5hZ2VyLmpzIiwid2VicGFjazovL0BwdWVydHMvd2ViZ2wvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQHB1ZXJ0cy93ZWJnbC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQHB1ZXJ0cy93ZWJnbC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BwdWVydHMvd2ViZ2wvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9AcHVlcnRzL3dlYmdsLy4vb3V0cHV0L2VudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEpzQmVoYXZpb3VyIHtcbiAgICBjb25zdHJ1Y3RvcihtYikge1xuICAgICAgICAvLyBtb25vLkpzXG4gICAgICAgIHRoaXMuX21iID0gbWI7XG4gICAgICAgIGlmICh0aGlzLlN0YXJ0ICE9IEpzQmVoYXZpb3VyLnByb3RvdHlwZS5TdGFydCkge1xuICAgICAgICAgICAgbWIuSnNTdGFydCA9IHRoaXMuU3RhcnQuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5VcGRhdGUgIT0gSnNCZWhhdmlvdXIucHJvdG90eXBlLlVwZGF0ZSkge1xuICAgICAgICAgICAgbWIuSnNVcGRhdGUgPSB0aGlzLlVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLk9uVHJpZ2dlckVudGVyICE9IEpzQmVoYXZpb3VyLnByb3RvdHlwZS5PblRyaWdnZXJFbnRlcikge1xuICAgICAgICAgICAgbWIuSnNPblRyaWdnZXJFbnRlciA9IHRoaXMuT25UcmlnZ2VyRW50ZXIuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBTdGFydCgpIHsgfVxuICAgIFVwZGF0ZSgpIHsgfVxuICAgIE9uVHJpZ2dlckVudGVyKG90aGVyKSB7IH1cbn1cbmV4cG9ydCB7IEpzQmVoYXZpb3VyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1iYXNlLmpzLm1hcCIsImltcG9ydCB7IEpzQmVoYXZpb3VyIH0gZnJvbSAnLi9CYXNlL2Jhc2UnO1xuaW1wb3J0IHsgSlNHYW1lTWFuYWdlciB9IGZyb20gJy4vSlNHYW1lTWFuYWdlcic7XG5jbGFzcyBKU0JhbGxCZWhhdmlvdXIgZXh0ZW5kcyBKc0JlaGF2aW91ciB7XG4gICAgT25UcmlnZ2VyRW50ZXIodHJpZ2dlcikge1xuICAgICAgICBpZiAodHJpZ2dlciA9PSBKU0dhbWVNYW5hZ2VyLmluc3RhbmNlLl9tYi5QcmVzY29yZVRyaWdnZXIpIHtcbiAgICAgICAgICAgIHRoaXMucHJlc2NvcmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmlnZ2VyID09IEpTR2FtZU1hbmFnZXIuaW5zdGFuY2UuX21iLlNjb3JlZFRyaWdnZXIgJiYgdGhpcy5wcmVzY29yZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLlvpfliIZcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgeyBKU0JhbGxCZWhhdmlvdXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUpTQmFsbEJlaGF2aW91ci5qcy5tYXAiLCJpbXBvcnQgeyBKc0JlaGF2aW91ciB9IGZyb20gJy4vQmFzZS9iYXNlJztcbmNsYXNzIEpTR2FtZU1hbmFnZXIgZXh0ZW5kcyBKc0JlaGF2aW91ciB7XG4gICAgU3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc3Bhd25CYWxsKCk7XG4gICAgICAgIEpTR2FtZU1hbmFnZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIH1cbiAgICBVcGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IGV4cGVjdFByZXNzVGltZU1heCA9IDEwMDA7XG4gICAgICAgIGlmICghdGhpcy5wcmVzc2VkICYmIChDUy5Vbml0eUVuZ2luZS5JbnB1dC5HZXRNb3VzZUJ1dHRvbkRvd24oMCkgfHwgQ1MuVW5pdHlFbmdpbmUuSW5wdXQudG91Y2hDb3VudCAhPSAwKSkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmIChDUy5Vbml0eUVuZ2luZS5JbnB1dC50b3VjaENvdW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VUb3VjaCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJlc3NlZCAmJiAodGhpcy51c2VUb3VjaCA/IENTLlVuaXR5RW5naW5lLklucHV0LnRvdWNoQ291bnQgPT0gMCA6IENTLlVuaXR5RW5naW5lLklucHV0LkdldE1vdXNlQnV0dG9uVXAoMCkpKSB7XG4gICAgICAgICAgICB0aGlzLnNob290QmFsbChNYXRoLm1pbihleHBlY3RQcmVzc1RpbWVNYXgsIERhdGUubm93KCkgLSB0aGlzLnByZXNzZWQpIC8gZXhwZWN0UHJlc3NUaW1lTWF4KTtcbiAgICAgICAgICAgIHRoaXMucHJlc3NlZCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGdsb2JhbFRoaXMuX3B1ZXJ0c19yZWdpc3RyeSAmJiBnbG9iYWxUaGlzLl9wdWVydHNfcmVnaXN0cnkuY2xlYW51cCgpO1xuICAgIH1cbiAgICBzaG9vdEJhbGwocG93ZXIpIHtcbiAgICAgICAgY29uc3QgcmlnaWRib2R5ID0gdGhpcy5jdXJyZW50QmFsbC5HZXRDb21wb25lbnQocHVlci4kdHlwZW9mKENTLlVuaXR5RW5naW5lLlJpZ2lkYm9keSkpO1xuICAgICAgICByaWdpZGJvZHkuaXNLaW5lbWF0aWMgPSBmYWxzZTtcbiAgICAgICAgcmlnaWRib2R5LnZlbG9jaXR5ID0gbmV3IENTLlVuaXR5RW5naW5lLlZlY3RvcjMoMSArIDIgKiBwb3dlciwgMyArIDYgKiBwb3dlciwgMCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zcGF3bkJhbGwoKTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICB9XG4gICAgc3Bhd25CYWxsKCkge1xuICAgICAgICBjb25zdCBiYWxsID0gdGhpcy5jdXJyZW50QmFsbCA9IENTLlVuaXR5RW5naW5lLk9iamVjdC5JbnN0YW50aWF0ZSh0aGlzLl9tYi5CYWxsUHJlZmFiKTtcbiAgICAgICAgYmFsbC50cmFuc2Zvcm0ucG9zaXRpb24gPSB0aGlzLl9tYi5CYWxsU3Bhd25Qb2ludC50cmFuc2Zvcm0ucG9zaXRpb247XG4gICAgICAgIGNvbnN0IHJpZ2lkYm9keSA9IGJhbGwuR2V0Q29tcG9uZW50KHB1ZXIuJHR5cGVvZihDUy5Vbml0eUVuZ2luZS5SaWdpZGJvZHkpKTtcbiAgICAgICAgcmlnaWRib2R5LmlzS2luZW1hdGljID0gdHJ1ZTtcbiAgICB9XG59XG5leHBvcnQgeyBKU0dhbWVNYW5hZ2VyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1KU0dhbWVNYW5hZ2VyLmpzLm1hcCIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgSlNHYW1lTWFuYWdlciB9IGZyb20gXCIuL0pTR2FtZU1hbmFnZXJcIjtcbmltcG9ydCB7IEpTQmFsbEJlaGF2aW91ciB9IGZyb20gXCIuL0pTQmFsbEJlaGF2aW91clwiO1xuZnVuY3Rpb24gbWFrZUZhY3RvcnkoY2xzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2xzKC4uLmFyZ3MpO1xuICAgIH07XG59XG5jb25zdCBKU0JhbGxCZWhhdmlvdXJGYWN0b3J5ID0gbWFrZUZhY3RvcnkoSlNCYWxsQmVoYXZpb3VyKTtcbmNvbnN0IEpTR2FtZU1hbmFnZXJGYWN0b3J5ID0gbWFrZUZhY3RvcnkoSlNHYW1lTWFuYWdlcik7XG5leHBvcnQgeyBKU0JhbGxCZWhhdmlvdXJGYWN0b3J5IGFzIEpTQmFsbEJlaGF2aW91ciwgSlNHYW1lTWFuYWdlckZhY3RvcnkgYXMgSlNHYW1lTWFuYWdlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW50cnkuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9