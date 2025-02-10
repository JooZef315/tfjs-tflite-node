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
import { TFLiteDelegatePlugin } from "./src/delegate_plugin";
export type CoralDevice = `:${number}` | "usb" | `usb:${number}` | "pci" | `pci:${number}`;
export interface CoralOptions {
    device?: CoralDevice;
}
export declare class CoralDelegate implements TFLiteDelegatePlugin {
    readonly name = "CoralDelegate";
    readonly tfliteVersion = "2.7";
    readonly node: TFLiteDelegatePlugin["node"];
    readonly options: Array<[string, string]>;
    constructor(options?: CoralOptions, libPath?: string, platform?: NodeJS.Platform);
}
