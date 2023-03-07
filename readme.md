# [Self Driving Car](https://mlcar.vercel.app)
This project is been created without using any libraries. 
Refer to documentions for more information on:
- HTML Canvas and how to draw on them.
- How to create a cars and add real world mechanics to it.
- Define roads and its boundaries.
- Create artificial sensors.
- Segment intersection.
- Collision detection and Traffic simulation
- Creating our own Neural Network, Feed Forward Algorithm
- Visualising Neural Networks (or black boxes)
- Optimising our Neural Networks using Parallelisation, Fitness function and Genetic Algorithms (GAs)

# How to Train your Neural Network
As you can see we have 4 buttons, **Save, Delete, Mutate and Cars**
### 1. Choose number of Cars
First start by selecting number of cars you want to deploy in Parallel (more cars will use more computer processing power, please proceed accordingly). More cars running in parallel can help us train our model faster.

### 2. Mutate
Mutation is a genetic algorithm used in this project. A lesser value for mutation will result in more cars be like our original car, and more value of mutation will lead to less cars follow footsteps of our original car.

#### Lower Mutation Value
So say the car is almost crossing that obstacle but misses it by an inch. What we do is set a very low value for our Mutation, say `0.1`. This will help randomise our remaining cars to shift a little bit here and there so that we can finally go through that obstacle. 

#### Higher Mutation Value
Consider a situation, where the car is very far away from crossing that obstacle, so we set an higher value for our mutation, so that cars get more randomisation and crosses the obstacle somehow.

### 3. Save
When you find that your model car behaves perfectly or makes any small progress, use the **SAVE** button to save that progress, so the network can use those set of weights and biases to further mutate into something better.

### 4. Delete
If you feel that your car doesn't behaves properly at all, or you've mistakenly saved a wrong car, just delete it to start with new training data.

Play around with those settings to understand the model better.
