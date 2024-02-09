class NeuralNetwork {
    constructor(neuronCounts){
        this.levels = [];
        for(let i = 0; i < neuronCounts.length - 1; i++)
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }

    static feedForward(inputs, network){

        let outputs = Level.feedForward(inputs, network.levels[0]);
        for(let i=1;i<network.levels.length;i++)
            outputs = Level.feedForward(outputs, network.levels[i])
        return outputs;
    }
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);
        this.weights = [];
        for (let i = 0; i < inputCount; i++)
            this.weights[i] = new Array(outputCount);

        Level.#randomize(this);
    }

    static #randomize(Level) {
        for (let i = 0; i < Level.inputs.length; i++)
            for (let j = 0; j < Level.outputs.length; j++)
                Level.weights[i][j] = Math.random() * 2 - 1;

        for (let i = 0; i < Level.biases.length; i++)
            Level.biases[i] = Math.random() * 2 - 1;
    }

    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++)
            level.inputs[i] = givenInputs[i];

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i]
            }

            if (sum > level.biases[i])
                level.outputs[i] = 1;
            else level.outputs[i] = 0;
        }

        return level.outputs;
    }
}