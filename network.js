class NeuralNetwork{
    constructor(neuronCounts){  //hidden layers
        this.levels = [];
        for(let i=0; i<neuronCounts.length-1; i++){
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i+1])) //i is input, i+1 acts as output, next time, the previous output is current input
        }
    }

    static feedForward(givenInputs, network){
        let outputs = Level.feedForward(givenInputs, network.levels[0])
        for(let i=1; i<network.levels.length; i++){ //i=0 is already pushed
            outputs = Level.feedForward(outputs, network.levels[i])
        }
        return outputs
    }
}

class Level{
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount)
        this.outputs = new Array(outputCount)
        this.biases = new Array(outputCount)

        this.weights = []
        for(let i = 0; i < inputCount; i++){
            this.weights[i] = new Array(outputCount) //for each input, we have all output connected
        }

        Level.#randomize(this)
    }

    static #randomize(level){    //static to serialize, members don't serialize
        for(let i = 0; i < level.inputs.length; i++){
            for(let j = 0; j < level.outputs.length; j++){
                level.weights[i][j] = Math.random()*2-1
            }
        }
        for(let i=0; i<level.biases.length; i++){
            level.biases[i] = Math.random()*2-1;
        }
    
    }

    static feedForward(givenInputs, level){  //calculate outputs
        for(let i=0; i<level.inputs.length; i++){
            level.inputs[i] = givenInputs[i];
        }

        for(let i=0; i<level.outputs.length; i++){
            let sum = 0;
            for(let j=0; j<level.inputs.length; j++){
                sum += level.inputs[j] * level.weights[j][i]
            }

            if(sum > level.biases[i]){
                level.outputs[i] = 1    //activate neuron
            } else {
                level.outputs[i] = 0
            }
        }
        return level.outputs
    }
}