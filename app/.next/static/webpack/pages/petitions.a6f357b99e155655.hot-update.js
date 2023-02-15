"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/petitions",{

/***/ "./src/stores/useActiveRegionsStore.tsx":
/*!**********************************************!*\
  !*** ./src/stores/useActiveRegionsStore.tsx ***!
  \**********************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var zustand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! zustand */ \"./node_modules/zustand/esm/index.js\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/web3.js */ \"./node_modules/@solana/web3.js/lib/index.browser.esm.js\");\n/* harmony import */ var types_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! types/types */ \"./src/types/types.ts\");\n/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ \"./node_modules/buffer/index.js\")[\"Buffer\"];\n\n\n\nconst programID = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey(\"E7QHjboLzRXGS8DzEq6CzcpHk54gHzJYvaPpzhxhHBU8\");\nconst useActiveRegionsStore = (0,zustand__WEBPACK_IMPORTED_MODULE_2__[\"default\"])((set, _get)=>({\n        regionList: null,\n        regStates: null,\n        getRegions: async (connection)=>{\n            try {\n                console.log(\"getting regionssssss\");\n                let pda = _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey.findProgramAddressSync([\n                    Buffer.from(\"r\")\n                ], programID);\n                console.log(\"pda\", pda[0].toString());\n                let acc = await connection.getAccountInfo(pda[0]);\n                console.log(\"acccc\", acc.data);\n                set((s)=>{\n                    s.regionList = types_types__WEBPACK_IMPORTED_MODULE_1__.ActiveRegionsLayout.decode(acc.data);\n                    console.log(\"regionsss\", s.regionList);\n                });\n            } catch (error) {\n                console.log(error);\n            }\n        },\n        getRegStates: async (connection, list)=>{\n            let regbuf = Buffer.alloc(1);\n            let adds = state.liveProps.reverse().map((e)=>{\n                idbuf.writeUInt32BE(e);\n                regbuf.writeUInt8(state.region);\n                return _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey.findProgramAddressSync([\n                    Buffer.from(\"p\"),\n                    regbuf,\n                    idbuf\n                ], programID)[0];\n            });\n            let accs = await connection.getMultipleAccountsInfo(adds);\n            set((s)=>{\n                s.liveProps = accs.map((e)=>PropLayout.decode(e.data));\n            });\n        }\n    }));\n/* harmony default export */ __webpack_exports__[\"default\"] = (useActiveRegionsStore);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3RvcmVzL3VzZUFjdGl2ZVJlZ2lvbnNTdG9yZS50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBdUM7QUFDZ0I7QUFDdUI7QUFFOUUsTUFBTUcsWUFBWSxJQUFJRixzREFBU0EsQ0FBQztBQVNoQyxNQUFNRyx3QkFBd0JKLG1EQUFNQSxDQUFxQixDQUFDSyxLQUFLQyxPQUFVO1FBQ3JFQyxZQUFZLElBQUk7UUFDaEJDLFdBQVcsSUFBSTtRQUNmQyxZQUFZLE9BQU9DLGFBQWU7WUFDOUIsSUFBSTtnQkFDQUMsUUFBUUMsR0FBRyxDQUFDO2dCQUNaLElBQUlDLE1BQU1aLDZFQUFnQyxDQUN0QztvQkFBQ2MsTUFBTUEsQ0FBQ0MsSUFBSSxDQUFDO2lCQUFLLEVBQ2xCYjtnQkFHSlEsUUFBUUMsR0FBRyxDQUFDLE9BQU9DLEdBQUcsQ0FBQyxFQUFFLENBQUNJLFFBQVE7Z0JBRWxDLElBQUlDLE1BQU0sTUFBTVIsV0FBV1MsY0FBYyxDQUFDTixHQUFHLENBQUMsRUFBRTtnQkFFaERGLFFBQVFDLEdBQUcsQ0FBQyxTQUFTTSxJQUFJRSxJQUFJO2dCQUM3QmYsSUFBSSxDQUFDZ0IsSUFBTTtvQkFDUEEsRUFBRWQsVUFBVSxHQUFHTCxtRUFBMEIsQ0FBQ2dCLElBQUlFLElBQUk7b0JBQ2xEVCxRQUFRQyxHQUFHLENBQUMsYUFBYVMsRUFBRWQsVUFBVTtnQkFDekM7WUFDSixFQUFFLE9BQU9nQixPQUFPO2dCQUFFWixRQUFRQyxHQUFHLENBQUNXO1lBQU87UUFDekM7UUFDQUMsY0FBYyxPQUFPZCxZQUFZZSxPQUFTO1lBQ3RDLElBQUlDLFNBQVNYLE1BQU1BLENBQUNZLEtBQUssQ0FBQztZQUUxQixJQUFJQyxPQUFPQyxNQUFNQyxTQUFTLENBQUNDLE9BQU8sR0FBR0MsR0FBRyxDQUFDLENBQUNDLElBQU07Z0JBQzVDQyxNQUFNQyxhQUFhLENBQUNGO2dCQUNwQlAsT0FBT1UsVUFBVSxDQUFDUCxNQUFNUSxNQUFNO2dCQUM5QixPQUFPcEMsNkVBQWdDLENBQ25DO29CQUFDYyxNQUFNQSxDQUFDQyxJQUFJLENBQUM7b0JBQU1VO29CQUFRUTtpQkFBTSxFQUNqQy9CLFVBQ0gsQ0FBQyxFQUFFO1lBQ1I7WUFFQSxJQUFJbUMsT0FBTyxNQUFNNUIsV0FBVzZCLHVCQUF1QixDQUFDWDtZQUNwRHZCLElBQUksQ0FBQ2dCLElBQU07Z0JBQ1BBLEVBQUVTLFNBQVMsR0FBR1EsS0FBS04sR0FBRyxDQUFDLENBQUNDLElBQU1PLFdBQVdsQixNQUFNLENBQUNXLEVBQUViLElBQUk7WUFDMUQ7UUFDSjtJQUNKO0FBRUEsK0RBQWVoQixxQkFBcUJBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL3N0b3Jlcy91c2VBY3RpdmVSZWdpb25zU3RvcmUudHN4P2E3MWYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZSwgeyBTdGF0ZSB9IGZyb20gJ3p1c3RhbmQnXG5pbXBvcnQgeyBDb25uZWN0aW9uLCBQdWJsaWNLZXkgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnXG5pbXBvcnQgeyBBY3RpdmVSZWdpb25zTGF5b3V0LCBSYXdBY3RpdmVSZWdpb25zLCBSYXdTdGF0ZSB9IGZyb20gJ3R5cGVzL3R5cGVzJztcblxuY29uc3QgcHJvZ3JhbUlEID0gbmV3IFB1YmxpY0tleShcIkU3UUhqYm9MelJYR1M4RHpFcTZDemNwSGs1NGdIekpZdmFQcHpoeGhIQlU4XCIpO1xuXG5pbnRlcmZhY2UgQWN0aXZlUmVnaW9uc1N0b3JlIGV4dGVuZHMgU3RhdGUge1xuICAgIHJlZ2lvbkxpc3Q6IFJhd0FjdGl2ZVJlZ2lvbnM7XG4gICAgcmVnU3RhdGVzOiBSYXdTdGF0ZVtdO1xuICAgIGdldFJlZ2lvbnM6IChjb25uZWN0aW9uOiBDb25uZWN0aW9uKSA9PiB2b2lkO1xuICAgIGdldFJlZ1N0YXRlczogKGNvbm5lY3Rpb246IENvbm5lY3Rpb24sIGxpc3Q6IFJhd0FjdGl2ZVJlZ2lvbnMpID0+IHZvaWQ7XG59XG5cbmNvbnN0IHVzZUFjdGl2ZVJlZ2lvbnNTdG9yZSA9IGNyZWF0ZTxBY3RpdmVSZWdpb25zU3RvcmU+KChzZXQsIF9nZXQpID0+ICh7XG4gICAgcmVnaW9uTGlzdDogbnVsbCxcbiAgICByZWdTdGF0ZXM6IG51bGwsXG4gICAgZ2V0UmVnaW9uczogYXN5bmMgKGNvbm5lY3Rpb24pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0dGluZyByZWdpb25zc3Nzc3NcIilcbiAgICAgICAgICAgIGxldCBwZGEgPSBQdWJsaWNLZXkuZmluZFByb2dyYW1BZGRyZXNzU3luYyhcbiAgICAgICAgICAgICAgICBbQnVmZmVyLmZyb20oXCJyXCIpXSxcbiAgICAgICAgICAgICAgICBwcm9ncmFtSURcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwZGFcIiwgcGRhWzBdLnRvU3RyaW5nKCkpXG5cbiAgICAgICAgICAgIGxldCBhY2MgPSBhd2FpdCBjb25uZWN0aW9uLmdldEFjY291bnRJbmZvKHBkYVswXSlcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY2NjY1wiLCBhY2MuZGF0YSlcbiAgICAgICAgICAgIHNldCgocykgPT4ge1xuICAgICAgICAgICAgICAgIHMucmVnaW9uTGlzdCA9IEFjdGl2ZVJlZ2lvbnNMYXlvdXQuZGVjb2RlKGFjYy5kYXRhKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVnaW9uc3NzXCIsIHMucmVnaW9uTGlzdClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7IGNvbnNvbGUubG9nKGVycm9yKSB9XG4gICAgfSxcbiAgICBnZXRSZWdTdGF0ZXM6IGFzeW5jIChjb25uZWN0aW9uLCBsaXN0KSA9PiB7XG4gICAgICAgIGxldCByZWdidWYgPSBCdWZmZXIuYWxsb2MoMSlcblxuICAgICAgICBsZXQgYWRkcyA9IHN0YXRlLmxpdmVQcm9wcy5yZXZlcnNlKCkubWFwKChlKSA9PiB7ICAgLy9yZXZlcnNlOiBtb3N0IHJlY2VudCBmaXJzdFxuICAgICAgICAgICAgaWRidWYud3JpdGVVSW50MzJCRShlKVxuICAgICAgICAgICAgcmVnYnVmLndyaXRlVUludDgoc3RhdGUucmVnaW9uKVxuICAgICAgICAgICAgcmV0dXJuIFB1YmxpY0tleS5maW5kUHJvZ3JhbUFkZHJlc3NTeW5jKFxuICAgICAgICAgICAgICAgIFtCdWZmZXIuZnJvbShcInBcIiksIHJlZ2J1ZiwgaWRidWZdLFxuICAgICAgICAgICAgICAgIHByb2dyYW1JRFxuICAgICAgICAgICAgKVswXVxuICAgICAgICB9KVxuXG4gICAgICAgIGxldCBhY2NzID0gYXdhaXQgY29ubmVjdGlvbi5nZXRNdWx0aXBsZUFjY291bnRzSW5mbyhhZGRzKVxuICAgICAgICBzZXQoKHMpID0+IHtcbiAgICAgICAgICAgIHMubGl2ZVByb3BzID0gYWNjcy5tYXAoKGUpID0+IFByb3BMYXlvdXQuZGVjb2RlKGUuZGF0YSkpXG4gICAgICAgIH0pXG4gICAgfVxufSkpO1xuXG5leHBvcnQgZGVmYXVsdCB1c2VBY3RpdmVSZWdpb25zU3RvcmU7Il0sIm5hbWVzIjpbImNyZWF0ZSIsIlB1YmxpY0tleSIsIkFjdGl2ZVJlZ2lvbnNMYXlvdXQiLCJwcm9ncmFtSUQiLCJ1c2VBY3RpdmVSZWdpb25zU3RvcmUiLCJzZXQiLCJfZ2V0IiwicmVnaW9uTGlzdCIsInJlZ1N0YXRlcyIsImdldFJlZ2lvbnMiLCJjb25uZWN0aW9uIiwiY29uc29sZSIsImxvZyIsInBkYSIsImZpbmRQcm9ncmFtQWRkcmVzc1N5bmMiLCJCdWZmZXIiLCJmcm9tIiwidG9TdHJpbmciLCJhY2MiLCJnZXRBY2NvdW50SW5mbyIsImRhdGEiLCJzIiwiZGVjb2RlIiwiZXJyb3IiLCJnZXRSZWdTdGF0ZXMiLCJsaXN0IiwicmVnYnVmIiwiYWxsb2MiLCJhZGRzIiwic3RhdGUiLCJsaXZlUHJvcHMiLCJyZXZlcnNlIiwibWFwIiwiZSIsImlkYnVmIiwid3JpdGVVSW50MzJCRSIsIndyaXRlVUludDgiLCJyZWdpb24iLCJhY2NzIiwiZ2V0TXVsdGlwbGVBY2NvdW50c0luZm8iLCJQcm9wTGF5b3V0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/stores/useActiveRegionsStore.tsx\n"));

/***/ })

});