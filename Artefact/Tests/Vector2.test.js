let vec = require('../MainProject/lib/vector2');

test('Vector Addition', function ()
{
    expect(vec.Vector2.Add(new vec.Vector2(0,0), new vec.Vector2(1,1))).toEqual(new vec.Vector2(1,1));
    expect(vec.Vector2.Add(new vec.Vector2(-1,-1), new vec.Vector2(0,0))).toEqual(new vec.Vector2(-1,-1));

    let rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Add(new vec.Vector2(rand,rand), new vec.Vector2(rand,0))).toEqual(new vec.Vector2(rand*2,rand));

    rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Add(new vec.Vector2(rand,rand), new vec.Vector2(-rand,-rand))).toEqual(new vec.Vector2(0,0));
});
test('Vector Subtraction', function ()
{
    expect(vec.Vector2.Subtract(new vec.Vector2(0,0), new vec.Vector2(1,1))).toEqual(new vec.Vector2(-1,-1));
    expect(vec.Vector2.Subtract(new vec.Vector2(-1,-1), new vec.Vector2(-1,-1))).toEqual(new vec.Vector2(0,0));

    let rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Subtract(new vec.Vector2(rand,rand), new vec.Vector2(rand,0))).toEqual(new vec.Vector2(0,rand));

    rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Subtract(new vec.Vector2(rand,rand), new vec.Vector2(-rand,-rand))).toEqual(new vec.Vector2(rand*2,rand*2));
});
test('Vector Scale', function ()
{
    expect(vec.Vector2.Scale(new vec.Vector2(0,0),10)).toEqual(new vec.Vector2(0,0));
    expect(vec.Vector2.Scale(new vec.Vector2(-1,-1),-10)).toEqual(new vec.Vector2(10,10));

    let rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Scale(new vec.Vector2(rand,rand), rand)).toEqual(new vec.Vector2(rand*rand,rand*rand));

    rand = Math.floor(Math.random()*10000);
    expect(vec.Vector2.Scale(new vec.Vector2(rand,rand),-rand)).toEqual(new vec.Vector2(rand*rand*-1,rand*rand*-1));
});

