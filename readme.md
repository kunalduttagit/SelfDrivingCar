
# Self Driving Car
This project is been created without using any libraries. Javascript isn't the best choice to do such projects, but it really  doesn't matters for the scale of this mini project.

## 1. Canvas and Car mechanics(/physics)
- First we create a index.html file and define a ```<canvas\>```. It's used to draw anything on browser with help of JavaScript
- Linking  ```main.js``` with the html file. 
- ```myCanvas``` is the ID for canvas, but as there's only one canvas, we can use any fo them to target the canvas
- Height = window height, and widht of 200
- This is a 2d render context ```(ctx)```
- We create a road and a car object
```c
function(animate)
requestAnimationFrame(animate);
```
This calls the function recursively for like 60 times per second. everytime setting height inside this function resets the values of canvas, so no need to ``ctx.save()`` or ``ctx.restore``.
 #### Car.js
- x and y for coordinates, widht and height is self explanatory
 $$Speed, s = \frac{Distance}{Time}$$
 $$Acceleration, a = \frac{\delta v}{\delta t}$$
 - Whenever arrow UP key is pressed, we increase the the speed by a factor of acceleration constant and vice versa.
 $$Friction, f = \mu N$$
 - If we have any positive speed, we decrease it by a factor of friction, so that a car that has any speed can stop after some time.
- We use angle to translate to the direction of rotation. 
- A flip is used so that when car is reversed and rotated, it can use left arrow for left movement and vice versa (making angle negative). 
<p align = "center">
<img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Sin_Cos_Tan_Cot_unit_circle.svg" alt="drawing" width="350"/>
</p>
This is a unit circle, We can see when a car is rotated, it should go in the same direction, as its orientation, for that we use

```c
this.x  -=  Math.sin(this.angle)*this.speed;
this.y  -=  Math.cos(this.angle)*this.speed;
```
So say if a car is at  $\alpha = 45\degree$, then x and y increases at same ratio, i.e, $\cos\alpha$ and $\sin\alpha$ increases at same rate, making car go in diagonal $45\degree$. Also multiplying it with speed, for x and y axis in that direction.
#### Controls.js
This is pretty simple, if a key is pressed, make that direction true, and when lifted, make it false again.
## 2. Road Generation 
#### Road.js
This is the one which renders the road. It needs ```x ``` for centering of the elements, and a width. ```Lane count``` can be changed as per choice. left and right boundaries 
are defined in accordance to x, half of the width to both left and right. 

The ```y-axis``` is from an arbitrary negative infinity to positive infinity. 
> Note: Y axis grows/increases downwards

We define borders array, [left, right]. Which takes objects (x, y). Left goes from x at left to y at top, and to x at left and y at bottom.
**a**. left = 0,	top = $-\infty$ to **b**. left = 0,	bottom = $\infty$
**c**. right = 0,	top = $-\infty$ to **d**. right = 0,	bottom = $\infty$

	|a		|b
	|		|
	|		|
	|c		|d

```getLaneCenter()``` method gives the centre for any lane index [i=0 -> i=laneCount]

```lerp()``` is a simple method, for **linear interpolation**, which constructs new data points within the range of a discrete set of known data points. here, we simply pass``` left,right,t``` as arguments and depending on value of ```i```, we kinda get a percentage which is usually centred between any lane.
>for ```i=0```
>LC, lane count = 3
>eg. if left = 0, right = 10, $t = \frac{i}{LC}$, then
> ```
> function  lerp(a, b, t){
> return  a  + (b-a) *  t;
>}
We can see, $a+(b-a) = right$, multiplied by t gives 0 for first time.
>for ```i = 1```
> t = 3.33, which is at 1/3rd of lane, so we get another data point at $\frac{1}{nth}$ point, here n = lc
