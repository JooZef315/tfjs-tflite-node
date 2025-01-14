"use strict";
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTFLiteModel = exports.TensorInfo = exports.TFLiteNodeModelRunner = void 0;
const tflite_model_1 = require("./tflite_model");
const fs = require("fs");
__exportStar(require("./delegate_plugin"), exports);
const node_fetch_1 = require("node-fetch");
// tslint:disable-next-line:no-require-imports
const addon = require('bindings')('node_tflite_binding');
// tslint:disable-next-line:variable-name
exports.TFLiteNodeModelRunner = addon.Interpreter;
// tslint:disable-next-line:variable-name
exports.TensorInfo = addon.TensorInfo;
function createModel(model, options) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        let modelData;
        if (typeof model === 'string') {
            if (model.slice(0, 4) === 'http') {
                modelData = yield (yield (0, node_fetch_1.default)(model)).arrayBuffer();
            }
            else {
                modelData = (yield fs.promises.readFile(model)).buffer;
            }
        }
        else {
            modelData = model;
        }
        const interpreterOptions = {
            threads: (_a = options === null || options === void 0 ? void 0 : options.numThreads) !== null && _a !== void 0 ? _a : 4,
        };
        const firstDelegate = (_b = options === null || options === void 0 ? void 0 : options.delegates) === null || _b === void 0 ? void 0 : _b[0];
        if (((_c = options === null || options === void 0 ? void 0 : options.delegates) === null || _c === void 0 ? void 0 : _c.length) > 1) {
            console.warn('Only a single delegate is supported right now. Only the first '
                + `one, ${firstDelegate.name}, will be used`);
        }
        if (firstDelegate) {
            const delegatePath = (_d = firstDelegate.node) === null || _d === void 0 ? void 0 : _d.path;
            if (delegatePath) {
                interpreterOptions.delegate = {
                    path: delegatePath,
                    options: firstDelegate.options,
                };
            }
        }
        return new exports.TFLiteNodeModelRunner(modelData, interpreterOptions);
    });
}
/**
 * Loads a TFLiteModel from the given model url or file.
 *
 * @param model The file path to the model (string), the url to the model
 *     (string), or the model content in memory (ArrayBuffer).
 * @param options Options related to model inference.
 *
 * @doc {heading: 'Models', subheading: 'Loading'}
 */
function loadTFLiteModel(model, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Handle tfhub links.
        if (typeof model === 'string' && model.includes('tfhub.dev') &&
            model.includes('lite-model') && !model.endsWith(tflite_model_1.TFHUB_SEARCH_PARAM)) {
            model = `${model}${tflite_model_1.TFHUB_SEARCH_PARAM}`;
        }
        const tfliteModelRunner = yield createModel(model, options);
        return new tflite_model_1.TFLiteModel(tfliteModelRunner);
    });
}
exports.loadTFLiteModel = loadTFLiteModel;
//# sourceMappingURL=index.js.map