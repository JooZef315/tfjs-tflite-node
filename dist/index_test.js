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
const index_1 = require("./index");
const fs = require("fs");
require("@tensorflow/tfjs-backend-cpu");
const jpeg = require("jpeg-js");
describe('interpreter', () => {
    let model;
    let modelRunner;
    beforeEach(() => {
        model = fs.readFileSync('./test_data/mobilenet_v2_1.0_224_inat_bird_quant.tflite').buffer;
        modelRunner = new index_1.TFLiteNodeModelRunner(model, { threads: 4 });
    });
    it('has input tensors', () => {
        const inputs = modelRunner.getInputs();
        expect(inputs.length).toEqual(1);
    });
    it('gets data from input tensor', () => {
        const input = modelRunner.getInputs()[0];
        const data = input.data();
        expect(data).toBeDefined();
    });
    it('sets input tensor data', () => {
        const input = modelRunner.getInputs()[0];
        const data = input.data();
        data.set([1, 2, 3]);
    });
    it('runs infer', () => {
        const outputs = modelRunner.getOutputs();
        modelRunner.infer();
        expect(outputs[0].data()).toBeDefined();
    });
    it('returns the same reference for each getInputs() call', () => {
        expect(modelRunner.getInputs()).toEqual(modelRunner.getInputs());
    });
    it('returns the same reference for each getOutputs() call', () => {
        expect(modelRunner.getOutputs()).toEqual(modelRunner.getOutputs());
    });
    it('returns the same reference for each TensorInfo data() call', () => {
        const input = modelRunner.getInputs()[0];
        const output = modelRunner.getOutputs()[0];
        expect(input.data()).toEqual(input.data());
        expect(output.data()).toEqual(output.data());
    });
    it('gets input tensor name', () => {
        const input = modelRunner.getInputs()[0];
        expect(input.name).toEqual('map/TensorArrayStack/TensorArrayGatherV3');
    });
    it('gets output tensor name', () => {
        const output = modelRunner.getOutputs()[0];
        expect(output.name).toEqual('prediction');
    });
    it('gets input tensor id', () => {
        const input = modelRunner.getInputs()[0];
        expect(input.id).toEqual(0);
    });
});
function getParrot() {
    const parrotJpeg = jpeg.decode(fs.readFileSync('./test_data/parrot-small.jpg'));
    const { width, height, data } = parrotJpeg;
    const parrot = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < parrot.length; i += 3) {
        parrot[i] = data[offset];
        parrot[i + 1] = data[offset + 1];
        parrot[i + 2] = data[offset + 2];
        offset += 4;
    }
    return parrot;
}
function getMaxIndex(data) {
    let max = 0;
    let maxIndex = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i] > max) {
            max = data[i];
            maxIndex = i;
        }
    }
    return maxIndex;
}
describe('model', () => {
    let model;
    let modelRunner;
    let parrot;
    let labels;
    beforeEach(() => {
        model = fs.readFileSync('./test_data/mobilenet_v2_1.0_224_inat_bird_quant.tflite').buffer;
        modelRunner = new index_1.TFLiteNodeModelRunner(model, { threads: 4 });
        parrot = getParrot();
        labels = fs.readFileSync('./test_data/inat_bird_labels.txt', 'utf-8').split(/\r?\n/);
    });
    it('runs a model', () => {
        const input = modelRunner.getInputs()[0];
        input.data().set(parrot);
        modelRunner.infer();
        const output = modelRunner.getOutputs()[0];
        const maxIndex = getMaxIndex(output.data());
        const label = labels[maxIndex];
        expect(label).toEqual('Ara macao (Scarlet Macaw)');
    });
});
describe('float32 support', () => {
    let model;
    let modelRunner;
    let red;
    let labels;
    beforeEach(() => {
        model = fs.readFileSync('./test_data/teachable_machine_float.tflite')
            .buffer;
        modelRunner = new index_1.TFLiteNodeModelRunner(model, {});
        labels = ['class1', 'class2'];
        red = new Float32Array(224 * 224 * 3);
        for (let i = 0; i < red.length; i++) {
            if (i % 3 === 0) {
                red[i] = 255;
            }
        }
    });
    it('model input is a Float32Array', () => {
        const input = modelRunner.getInputs()[0];
        expect(input.data() instanceof Float32Array).toBeTruthy();
    });
    it('model output is a Float32Array', () => {
        const output = modelRunner.getOutputs()[0];
        expect(output.data() instanceof Float32Array).toBeTruthy();
    });
    it('runs a model with float32 input', () => {
        const input = modelRunner.getInputs()[0];
        input.data().set(red);
        modelRunner.infer();
        const output = modelRunner.getOutputs()[0];
        const maxIndex = getMaxIndex(output.data());
        const label = labels[maxIndex];
        expect(label).toEqual('class2');
    });
});
// TODO(mattsoulanille): Move this to integration tests since it loads from
// the web. Alternatively, serve the model locally.
describe('loading model from the web', () => {
    it('loads a model from the web', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = 'https://tfhub.dev/sayakpaul/lite-model/cartoongan/fp16/1';
        const model = yield (0, index_1.loadTFLiteModel)(url);
        expect(model).toBeDefined();
    }));
});
//# sourceMappingURL=index_test.js.map