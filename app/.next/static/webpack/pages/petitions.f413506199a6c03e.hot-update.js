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

/***/ "./src/views/petitions/index.tsx":
/*!***************************************!*\
  !*** ./src/views/petitions/index.tsx ***!
  \***************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PetitionsView\": function() { return /* binding */ PetitionsView; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _project_serum_anchor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @project-serum/anchor */ \"../node_modules/@project-serum/anchor/dist/browser/index.js\");\n/* harmony import */ var _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @solana/wallet-adapter-react */ \"./node_modules/@solana/wallet-adapter-react/lib/esm/index.js\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/web3.js */ \"./node_modules/@solana/web3.js/lib/index.browser.esm.js\");\n/* harmony import */ var components_petition_RegionRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/petition/RegionRow */ \"./src/components/petition/RegionRow.tsx\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var stores_useActiveRegionsStore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! stores/useActiveRegionsStore */ \"./src/stores/useActiveRegionsStore.tsx\");\n/* harmony import */ var utils_notifications__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! utils/notifications */ \"./src/utils/notifications.tsx\");\n/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ \"./node_modules/buffer/index.js\")[\"Buffer\"];\n\nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\nconst PetitionsView = (param)=>{\n    let {} = param;\n    _s();\n    const connection = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.Connection(\"http://127.0.0.1:8899\");\n    const { regions , getRegions  } = (0,stores_useActiveRegionsStore__WEBPACK_IMPORTED_MODULE_5__[\"default\"])();\n    const wallet = (0,_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_7__.useWallet)();\n    const getProvider = ()=>{\n        const provider = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_1__.AnchorProvider(connection, wallet, _project_serum_anchor__WEBPACK_IMPORTED_MODULE_1__.AnchorProvider.defaultOptions());\n        return provider;\n    };\n    const provider = getProvider();\n    const programID = \"E7QHjboLzRXGS8DzEq6CzcpHk54gHzJYvaPpzhxhHBU8\";\n    (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(()=>{\n        if (!regions) getRegions(connection);\n    }, [\n        connection,\n        getRegions,\n        regions\n    ]);\n    const createRegion = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async (e)=>{\n        e.preventDefault();\n        const idl = await _project_serum_anchor__WEBPACK_IMPORTED_MODULE_1__.Program.fetchIdl(programID, provider);\n        const program = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_1__.Program(idl, programID, provider);\n        let regbuf = Buffer.from([\n            0\n        ]);\n        regbuf.writeUInt8(regions.list.length == 0 ? 0 : regions.list[regions.list.length - 1] + 1);\n        let desc = e.target[0].value.toString();\n        let gk = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey(e.target[1].value.toString());\n        let statepda = _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.findProgramAddressSync([\n            Buffer.from(\"d\"),\n            regbuf\n        ], new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey(programID));\n        let regpda = _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.findProgramAddressSync([\n            Buffer.from(\"r\")\n        ], new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey(programID));\n        let gkLinkPda = _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.findProgramAddressSync([\n            gk.toBuffer()\n        ], new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey(programID));\n        let tx = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.Transaction();\n        tx.add(await program.methods.initializeRegion(desc).accounts({\n            state: statepda[0],\n            userAuthority: wallet.publicKey,\n            activeRegions: regpda[0],\n            gatekeeper: gk,\n            gkLink: gkLinkPda[0],\n            systemProgram: _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.SystemProgram.programId\n        }).instruction());\n        let signature = await wallet.sendTransaction(tx, connection);\n        const latestBlockHash = await connection.getLatestBlockhash();\n        await connection.confirmTransaction({\n            blockhash: latestBlockHash.blockhash,\n            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,\n            signature: signature\n        });\n        (0,utils_notifications__WEBPACK_IMPORTED_MODULE_6__.notify)({\n            type: \"success\",\n            message: \"Transaction successful!\",\n            txid: signature\n        });\n    }, [\n        connection,\n        regions\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"md:hero mx-auto p-4\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"md:hero-content flex flex-col\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                    className: \"text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#c53fe9ff] to-blue-600 py-8\",\n                    children: \"Petitions\"\n                }, void 0, false, {\n                    fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                    lineNumber: 77,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h4\", {\n                    className: \"md:w-full text-2xl md:text-3xl text-center text-slate-300 my-2\",\n                    children: [\n                        \"Active regions\",\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                            className: \"text-slate-500 text-2xl leading-relaxed text-center\",\n                            children: \"You are using verifiable Free (Libre) open source software\"\n                        }, void 0, false, {\n                            fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                            lineNumber: 83,\n                            columnNumber: 11\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                    lineNumber: 81,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n                    htmlFor: \"my-modal-4\",\n                    className: \"btn btn-active\",\n                    children: [\n                        \"Create new region\",\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n                            xmlns: \"http://www.w3.org/2000/svg\",\n                            className: \"h-6 w-6 ml-2\",\n                            fill: \"currentColor\",\n                            viewBox: \"0 0 48 48\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                                d: \"M22.5 38V25.5H10v-3h12.5V10h3v12.5H38v3H25.5V38Z\"\n                            }, void 0, false, {\n                                fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                                lineNumber: 90,\n                                columnNumber: 116\n                            }, undefined)\n                        }, void 0, false, {\n                            fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                            lineNumber: 90,\n                            columnNumber: 11\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                    lineNumber: 88,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                    type: \"checkbox\",\n                    id: \"my-modal-4\",\n                    className: \"modal-toggle z-100000\"\n                }, void 0, false, {\n                    fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                    lineNumber: 93,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n                    htmlFor: \"my-modal-4\",\n                    className: \"modal cursor-pointer z-1000\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n                        className: \"modal-box\",\n                        htmlFor: \"\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                className: \"text-lg font-bold my-6 text-center\",\n                                children: \"Create a new region\"\n                            }, void 0, false, {\n                                fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                                lineNumber: 96,\n                                columnNumber: 13\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"form\", {\n                                onSubmit: createRegion,\n                                className: \"flex flex-col\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                                        type: \"text\",\n                                        placeholder: \"Description\",\n                                        className: \"input input-bordered w-full max-w-xs mt-6 mb-4 mx-auto\"\n                                    }, void 0, false, {\n                                        fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                                        lineNumber: 98,\n                                        columnNumber: 15\n                                    }, undefined),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                                        type: \"text\",\n                                        placeholder: \"Gatekeeper network address\",\n                                        className: \"input input-bordered w-full max-w-xs my-4 mx-auto\"\n                                    }, void 0, false, {\n                                        fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                                        lineNumber: 99,\n                                        columnNumber: 15\n                                    }, undefined),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                        type: \"submit\",\n                                        className: \"btn btn-active btn-primary mx-auto my-4\",\n                                        children: [\n                                            \"submit\",\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n                                                xmlns: \"http://www.w3.org/2000/svg\",\n                                                className: \"h-6 w-6\",\n                                                fill: \"currentColor\",\n                                                viewBox: \"0 0 48 48\",\n                                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                                                    d: \"m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z\"\n                                                }, void 0, false, {\n                                                    fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                                                    lineNumber: 102,\n                                                    columnNumber: 117\n                                                }, undefined)\n                                            }, void 0, false, {\n                                                fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                                                lineNumber: 102,\n                                                columnNumber: 17\n                                            }, undefined)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                                        lineNumber: 100,\n                                        columnNumber: 15\n                                    }, undefined)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                                lineNumber: 97,\n                                columnNumber: 13\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                        lineNumber: 95,\n                        columnNumber: 11\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                    lineNumber: 94,\n                    columnNumber: 9\n                }, undefined),\n                regions === null || regions === void 0 ? void 0 : regions.list.map((v, i)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(components_petition_RegionRow__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                        code: v\n                    }, i, false, {\n                        fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n                        lineNumber: 108,\n                        columnNumber: 38\n                    }, undefined))\n            ]\n        }, void 0, true, {\n            fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n            lineNumber: 76,\n            columnNumber: 7\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"/home/alex/solana-petition/app/src/views/petitions/index.tsx\",\n        lineNumber: 75,\n        columnNumber: 5\n    }, undefined);\n};\n_s(PetitionsView, \"ylg5cyCrVZpala83PiZe9jRhypg=\", false, function() {\n    return [\n        stores_useActiveRegionsStore__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n        _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_7__.useWallet\n    ];\n});\n_c = PetitionsView;\nvar _c;\n$RefreshReg$(_c, \"PetitionsView\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHFFQUFTQTt3QkFBQ21GLE1BQU1GO3VCQUFRQzs7OztrQ0FBTTs7Ozs7Ozs7Ozs7O0FBS3BFLEVBQUU7R0F4R1c3RTs7UUFJcUJGLG9FQUFxQkE7UUFFdENSLG1FQUFTQTs7O0tBTmJVIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy92aWV3cy9wZXRpdGlvbnMvaW5kZXgudHN4P2E5ODkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5jaG9yUHJvdmlkZXIsIFByb2dyYW0gfSBmcm9tIFwiQHByb2plY3Qtc2VydW0vYW5jaG9yXCI7XG5pbXBvcnQgeyB1c2VXYWxsZXQgfSBmcm9tIFwiQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdFwiO1xuaW1wb3J0IHsgQ29ubmVjdGlvbiwgUHVibGljS2V5LCBTeXN0ZW1Qcm9ncmFtLCBUcmFuc2FjdGlvbiB9IGZyb20gXCJAc29sYW5hL3dlYjMuanNcIjtcbmltcG9ydCBSZWdpb25Sb3cgZnJvbSBcImNvbXBvbmVudHMvcGV0aXRpb24vUmVnaW9uUm93XCI7XG5pbXBvcnQgeyBGQywgRm9ybUV2ZW50LCB1c2VDYWxsYmFjaywgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgdXNlQWN0aXZlUmVnaW9uc1N0b3JlIGZyb20gXCJzdG9yZXMvdXNlQWN0aXZlUmVnaW9uc1N0b3JlXCI7XG5pbXBvcnQgeyBub3RpZnkgfSBmcm9tIFwidXRpbHMvbm90aWZpY2F0aW9uc1wiO1xuXG5leHBvcnQgY29uc3QgUGV0aXRpb25zVmlldzogRkMgPSAoeyB9KSA9PiB7XG5cbiAgY29uc3QgY29ubmVjdGlvbiA9IG5ldyBDb25uZWN0aW9uKFwiaHR0cDovLzEyNy4wLjAuMTo4ODk5XCIpO1xuXG4gIGNvbnN0IHsgcmVnaW9ucywgZ2V0UmVnaW9ucyB9ID0gdXNlQWN0aXZlUmVnaW9uc1N0b3JlKClcblxuICBjb25zdCB3YWxsZXQgPSB1c2VXYWxsZXQoKTtcblxuICBjb25zdCBnZXRQcm92aWRlciA9ICgpID0+IHtcbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBBbmNob3JQcm92aWRlcihcbiAgICAgIGNvbm5lY3Rpb24sXG4gICAgICB3YWxsZXQsXG4gICAgICBBbmNob3JQcm92aWRlci5kZWZhdWx0T3B0aW9ucygpXG4gICAgKTtcbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH07XG5cbiAgY29uc3QgcHJvdmlkZXIgPSBnZXRQcm92aWRlcigpXG5cbiAgY29uc3QgcHJvZ3JhbUlEID0gXCJFN1FIamJvTHpSWEdTOER6RXE2Q3pjcEhrNTRnSHpKWXZhUHB6aHhoSEJVOFwiXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXJlZ2lvbnMpIGdldFJlZ2lvbnMoY29ubmVjdGlvbilcbiAgfSwgW2Nvbm5lY3Rpb24sIGdldFJlZ2lvbnMsIHJlZ2lvbnNdKVxuXG4gIGNvbnN0IGNyZWF0ZVJlZ2lvbiA9IHVzZUNhbGxiYWNrKGFzeW5jIChlOiBGb3JtRXZlbnQ8SFRNTEZvcm1FbGVtZW50PikgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGlkbCA9IGF3YWl0IFByb2dyYW0uZmV0Y2hJZGwocHJvZ3JhbUlELCBwcm92aWRlcilcblxuICAgIGNvbnN0IHByb2dyYW0gPSBuZXcgUHJvZ3JhbShpZGwsIHByb2dyYW1JRCwgcHJvdmlkZXIpXG5cbiAgICBsZXQgcmVnYnVmID0gQnVmZmVyLmZyb20oWzBdKVxuICAgIHJlZ2J1Zi53cml0ZVVJbnQ4KHJlZ2lvbnMubGlzdC5sZW5ndGggPT0gMCA/IDAgOiByZWdpb25zLmxpc3RbcmVnaW9ucy5saXN0Lmxlbmd0aCAtIDFdICsgMSlcblxuICAgIGxldCBkZXNjID0gZS50YXJnZXRbMF0udmFsdWUudG9TdHJpbmcoKVxuICAgIGxldCBnayA9IG5ldyBQdWJsaWNLZXkoZS50YXJnZXRbMV0udmFsdWUudG9TdHJpbmcoKSlcblxuICAgIGxldCBzdGF0ZXBkYSA9IFB1YmxpY0tleS5maW5kUHJvZ3JhbUFkZHJlc3NTeW5jKFtCdWZmZXIuZnJvbShcImRcIiksIHJlZ2J1Zl0sIG5ldyBQdWJsaWNLZXkocHJvZ3JhbUlEKSlcbiAgICBsZXQgcmVncGRhID0gUHVibGljS2V5LmZpbmRQcm9ncmFtQWRkcmVzc1N5bmMoW0J1ZmZlci5mcm9tKFwiclwiKV0sIG5ldyBQdWJsaWNLZXkocHJvZ3JhbUlEKSlcbiAgICBsZXQgZ2tMaW5rUGRhID0gUHVibGljS2V5LmZpbmRQcm9ncmFtQWRkcmVzc1N5bmMoW2drLnRvQnVmZmVyKCldLCBuZXcgUHVibGljS2V5KHByb2dyYW1JRCkpXG5cbiAgICBsZXQgdHggPSBuZXcgVHJhbnNhY3Rpb24oKTtcbiAgICB0eC5hZGQoXG4gICAgICBhd2FpdCBwcm9ncmFtLm1ldGhvZHMuaW5pdGlhbGl6ZVJlZ2lvbihkZXNjKS5hY2NvdW50cyh7XG4gICAgICAgIHN0YXRlOiBzdGF0ZXBkYVswXSxcbiAgICAgICAgdXNlckF1dGhvcml0eTogd2FsbGV0LnB1YmxpY0tleSxcbiAgICAgICAgYWN0aXZlUmVnaW9uczogcmVncGRhWzBdLFxuICAgICAgICBnYXRla2VlcGVyOiBnayxcbiAgICAgICAgZ2tMaW5rOiBna0xpbmtQZGFbMF0sXG4gICAgICAgIHN5c3RlbVByb2dyYW06IFN5c3RlbVByb2dyYW0ucHJvZ3JhbUlkXG4gICAgICB9KS5pbnN0cnVjdGlvbigpXG4gICAgKTtcblxuICAgIGxldCBzaWduYXR1cmUgPSBhd2FpdCB3YWxsZXQuc2VuZFRyYW5zYWN0aW9uKHR4LCBjb25uZWN0aW9uKTtcblxuICAgIGNvbnN0IGxhdGVzdEJsb2NrSGFzaCA9IGF3YWl0IGNvbm5lY3Rpb24uZ2V0TGF0ZXN0QmxvY2toYXNoKCk7XG5cbiAgICBhd2FpdCBjb25uZWN0aW9uLmNvbmZpcm1UcmFuc2FjdGlvbih7XG4gICAgICBibG9ja2hhc2g6IGxhdGVzdEJsb2NrSGFzaC5ibG9ja2hhc2gsXG4gICAgICBsYXN0VmFsaWRCbG9ja0hlaWdodDogbGF0ZXN0QmxvY2tIYXNoLmxhc3RWYWxpZEJsb2NrSGVpZ2h0LFxuICAgICAgc2lnbmF0dXJlOiBzaWduYXR1cmUsXG4gICAgfSk7XG4gICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiAnVHJhbnNhY3Rpb24gc3VjY2Vzc2Z1bCEnLCB0eGlkOiBzaWduYXR1cmUgfSk7XG4gIH0sIFtjb25uZWN0aW9uLCByZWdpb25zXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWQ6aGVybyBteC1hdXRvIHAtNFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZDpoZXJvLWNvbnRlbnQgZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgdGV4dC01eGwgZm9udC1ib2xkIHRleHQtdHJhbnNwYXJlbnQgYmctY2xpcC10ZXh0IGJnLWdyYWRpZW50LXRvLXRyIGZyb20tWyNjNTNmZTlmZl0gdG8tYmx1ZS02MDAgcHktOFwiPlxuICAgICAgICAgIFBldGl0aW9uc1xuICAgICAgICA8L2gxPlxuXG4gICAgICAgIDxoNCBjbGFzc05hbWU9XCJtZDp3LWZ1bGwgdGV4dC0yeGwgbWQ6dGV4dC0zeGwgdGV4dC1jZW50ZXIgdGV4dC1zbGF0ZS0zMDAgbXktMlwiPlxuICAgICAgICAgIEFjdGl2ZSByZWdpb25zXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPSd0ZXh0LXNsYXRlLTUwMCB0ZXh0LTJ4bCBsZWFkaW5nLXJlbGF4ZWQgdGV4dC1jZW50ZXInPlxuICAgICAgICAgICAgWW91IGFyZSB1c2luZyB2ZXJpZmlhYmxlIEZyZWUgKExpYnJlKSBvcGVuIHNvdXJjZSBzb2Z0d2FyZVxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9oND5cblxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm15LW1vZGFsLTRcIiBjbGFzc05hbWU9XCJidG4gYnRuLWFjdGl2ZVwiPlxuICAgICAgICAgIENyZWF0ZSBuZXcgcmVnaW9uXG4gICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3NOYW1lPVwiaC02IHctNiBtbC0yXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgNDggNDhcIj48cGF0aCBkPVwiTTIyLjUgMzhWMjUuNUgxMHYtM2gxMi41VjEwaDN2MTIuNUgzOHYzSDI1LjVWMzhaXCIgLz48L3N2Zz5cbiAgICAgICAgPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJteS1tb2RhbC00XCIgY2xhc3NOYW1lPVwibW9kYWwtdG9nZ2xlIHotMTAwMDAwXCIgLz5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJteS1tb2RhbC00XCIgY2xhc3NOYW1lPVwibW9kYWwgY3Vyc29yLXBvaW50ZXIgei0xMDAwXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1vZGFsLWJveFwiIGh0bWxGb3I9XCJcIj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYm9sZCBteS02IHRleHQtY2VudGVyXCI+Q3JlYXRlIGEgbmV3IHJlZ2lvbjwvaDM+XG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17Y3JlYXRlUmVnaW9ufSBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRGVzY3JpcHRpb25cIiBjbGFzc05hbWU9XCJpbnB1dCBpbnB1dC1ib3JkZXJlZCB3LWZ1bGwgbWF4LXcteHMgbXQtNiBtYi00IG14LWF1dG9cIiAvPlxuICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkdhdGVrZWVwZXIgbmV0d29yayBhZGRyZXNzXCIgY2xhc3NOYW1lPVwiaW5wdXQgaW5wdXQtYm9yZGVyZWQgdy1mdWxsIG1heC13LXhzIG15LTQgbXgtYXV0b1wiIC8+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tYWN0aXZlIGJ0bi1wcmltYXJ5IG14LWF1dG8gbXktNFwiPlxuICAgICAgICAgICAgICAgIHN1Ym1pdFxuICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzTmFtZT1cImgtNiB3LTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgdmlld0JveD1cIjAgMCA0OCA0OFwiPjxwYXRoIGQ9XCJtMjQgNDAtMi4xLTIuMTVMMzQuMjUgMjUuNUg4di0zaDI2LjI1TDIxLjkgMTAuMTUgMjQgOGwxNiAxNlpcIiAvPjwvc3ZnPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2xhYmVsPlxuXG4gICAgICAgIHtyZWdpb25zPy5saXN0Lm1hcCgodiwgaSkgPT4gPFJlZ2lvblJvdyBjb2RlPXt2fSBrZXk9e2l9IC8+KX1cblxuICAgICAgPC9kaXY+XG4gICAgPC9kaXYgPlxuICApO1xufTtcbiJdLCJuYW1lcyI6WyJBbmNob3JQcm92aWRlciIsIlByb2dyYW0iLCJ1c2VXYWxsZXQiLCJDb25uZWN0aW9uIiwiUHVibGljS2V5IiwiU3lzdGVtUHJvZ3JhbSIsIlRyYW5zYWN0aW9uIiwiUmVnaW9uUm93IiwidXNlQ2FsbGJhY2siLCJ1c2VFZmZlY3QiLCJ1c2VBY3RpdmVSZWdpb25zU3RvcmUiLCJub3RpZnkiLCJQZXRpdGlvbnNWaWV3IiwiY29ubmVjdGlvbiIsInJlZ2lvbnMiLCJnZXRSZWdpb25zIiwid2FsbGV0IiwiZ2V0UHJvdmlkZXIiLCJwcm92aWRlciIsImRlZmF1bHRPcHRpb25zIiwicHJvZ3JhbUlEIiwiY3JlYXRlUmVnaW9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiaWRsIiwiZmV0Y2hJZGwiLCJwcm9ncmFtIiwicmVnYnVmIiwiQnVmZmVyIiwiZnJvbSIsIndyaXRlVUludDgiLCJsaXN0IiwibGVuZ3RoIiwiZGVzYyIsInRhcmdldCIsInZhbHVlIiwidG9TdHJpbmciLCJnayIsInN0YXRlcGRhIiwiZmluZFByb2dyYW1BZGRyZXNzU3luYyIsInJlZ3BkYSIsImdrTGlua1BkYSIsInRvQnVmZmVyIiwidHgiLCJhZGQiLCJtZXRob2RzIiwiaW5pdGlhbGl6ZVJlZ2lvbiIsImFjY291bnRzIiwic3RhdGUiLCJ1c2VyQXV0aG9yaXR5IiwicHVibGljS2V5IiwiYWN0aXZlUmVnaW9ucyIsImdhdGVrZWVwZXIiLCJna0xpbmsiLCJzeXN0ZW1Qcm9ncmFtIiwicHJvZ3JhbUlkIiwiaW5zdHJ1Y3Rpb24iLCJzaWduYXR1cmUiLCJzZW5kVHJhbnNhY3Rpb24iLCJsYXRlc3RCbG9ja0hhc2giLCJnZXRMYXRlc3RCbG9ja2hhc2giLCJjb25maXJtVHJhbnNhY3Rpb24iLCJibG9ja2hhc2giLCJsYXN0VmFsaWRCbG9ja0hlaWdodCIsInR5cGUiLCJtZXNzYWdlIiwidHhpZCIsImRpdiIsImNsYXNzTmFtZSIsImgxIiwiaDQiLCJwIiwibGFiZWwiLCJodG1sRm9yIiwic3ZnIiwieG1sbnMiLCJmaWxsIiwidmlld0JveCIsInBhdGgiLCJkIiwiaW5wdXQiLCJpZCIsImgzIiwiZm9ybSIsIm9uU3VibWl0IiwicGxhY2Vob2xkZXIiLCJidXR0b24iLCJtYXAiLCJ2IiwiaSIsImNvZGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/views/petitions/index.tsx\n"));

/***/ })

});