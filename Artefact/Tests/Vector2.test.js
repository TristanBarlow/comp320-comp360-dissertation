let vec = require('../MainProject/lib/vector2');

test('Vector Addition (0,0) + (1,1)', function ()
{
    expect(vec.Vector2.Add(new vec.Vector2(0,0), new vec.Vector2(1,1))).toEqual(new vec.Vector2(1,1));
});

test('Vector Addition (-1,-1) + (0,0)', function ()
{
    expect(vec.Vector2.Add(new vec.Vector2(-1,-1), new vec.Vector2(0,0))).toEqual(new vec.Vector2(-1,-1));
});

test('Vector Addition Rand 1', function ()
{
    let rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Add(new vec.Vector2(rand,rand), new vec.Vector2(rand,0))).toEqual(new vec.Vector2(rand*2,rand));
});

test('Vector Addition Rand 2', function ()
{
    let rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Add(new vec.Vector2(rand,rand), new vec.Vector2(rand,0))).toEqual(new vec.Vector2(rand*2,rand));
});



//--------------------- SUBTRACTION -------------------\\
test('Vector Subtraction (0,0) - (1,1)', function ()
{
    expect(vec.Vector2.Subtract(new vec.Vector2(0,0), new vec.Vector2(1,1))).toEqual(new vec.Vector2(-1,-1));
});

test('Vector Subtraction (-1,-1) - (-1,-1)', function ()
{
    expect(vec.Vector2.Subtract(new vec.Vector2(-1,-1), new vec.Vector2(-1,-1))).toEqual(new vec.Vector2(0,0));
});

test('Vector Subtraction Rand 1', function ()
{
    let rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Subtract(new vec.Vector2(rand,rand), new vec.Vector2(rand,0))).toEqual(new vec.Vector2(0,rand));

});

test('Vector Subtraction Rand 2', function ()
{
    let rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Subtract(new vec.Vector2(rand,rand), new vec.Vector2(-rand,-rand))).toEqual(new vec.Vector2(rand*2,rand*2));
});


//-------------------- SCALE ---------------\\
test('Vector Scale (0,0) * 10', function ()
{
    expect(vec.Vector2.Scale(new vec.Vector2(0,0),10)).toEqual(new vec.Vector2(0,0));
});

test('Vector Scale (-1,-1) - 10', function ()
{
    expect(vec.Vector2.Scale(new vec.Vector2(-1,-1),-10)).toEqual(new vec.Vector2(10,10));

});

test('Vector Scale Rand 1', function ()
{
    let rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Scale(new vec.Vector2(rand,rand), rand)).toEqual(new vec.Vector2(rand*rand,rand*rand));
});

test('Vector Scale Rand 2', function ()
{
    let rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Scale(new vec.Vector2(rand,rand),-rand)).toEqual(new vec.Vector2(rand*rand*-1,rand*rand*-1));
});

