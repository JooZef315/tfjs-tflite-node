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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoralDelegate = void 0;
var os = require("os");
// The Coral delegate is unusual since it requires the user to have installed
// libedgetpu themselves (due to udev rules for accessing the USB device).
// This means we don't actually ship any DLLs for node. Instead, we load the
// one the user already has installed in their library path.
//
// The following names are from the python implementation.
// https://github.com/google-coral/pycoral/blob/9972f8ec6dbb8b2f46321e8c0d2513e0b6b152ce/pycoral/utils/edgetpu.py#L34-L38
var libNames = new Map([
    ["linux", "libedgetpu.so.1"],
    ["darwin", "libedgetpu.1.dylib"],
    ["win32", "edgetpu.dll"],
]);
var CoralDelegate = /** @class */ (function () {
    function CoralDelegate(options, libPath, platform) {
        if (options === void 0) { options = {}; }
        if (platform === void 0) { platform = os.platform(); }
        this.name = "CoralDelegate";
        this.tfliteVersion = "2.7";
        this.options = [];
        if (!libPath) {
            libPath = libNames.get(platform);
            if (!libPath) {
                throw new Error("Unknown platform ".concat(platform));
            }
        }
        if (options.device) {
            this.options.push(["device", options.device]);
        }
        this.node = {
            path: libPath,
        };
    }
    return CoralDelegate;
}());
exports.CoralDelegate = CoralDelegate;
