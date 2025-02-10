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
import type { TFLiteWebModelRunner, TFLiteWebModelRunnerOptions, TFLiteWebModelRunnerTensorInfo } from "@tensorflow/tfjs-tflite/dist/types/tflite_web_model_runner";
import { TFLiteModel } from "./tflite_model";
export * from "./delegate_plugin";
import { TFLiteDelegatePlugin } from "./delegate_plugin";
export { TFLiteModel } from "./tflite_model";
export { CoralDelegate } from "./coral_delegate";
interface InterpreterOptions {
    threads?: number;
    delegate?: {
        path: string;
        options: Array<[string, string]>;
    };
}
export declare const TFLiteNodeModelRunner: new (model: ArrayBuffer, options: InterpreterOptions) => TFLiteWebModelRunner;
export declare const TensorInfo: new () => TFLiteWebModelRunnerTensorInfo;
/**
 * Loads a TFLiteModel from the given model url or file.
 *
 * @param model The file path to the model (string), the url to the model
 *     (string), or the model content in memory (ArrayBuffer).
 * @param options Options related to model inference.
 *
 * @doc {heading: 'Models', subheading: 'Loading'}
 */
export declare function loadTFLiteModel(model: string | ArrayBuffer, options?: TFLiteWebModelRunnerOptions & {
    delegates?: TFLiteDelegatePlugin[];
}): Promise<TFLiteModel>;
