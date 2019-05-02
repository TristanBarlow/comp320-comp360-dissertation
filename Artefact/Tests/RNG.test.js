let rng = require("../MainProject/lib/RNG.js");

let seed = Math.floor(Math.random()*1000);
let RNG_1 = new rng.RNG(seed);
let RNG_2 =new  rng.RNG(seed);

//----------- FLOAT --------\\
test('RNG Float 1', function ()
{
    expect(RNG_1.nextFloat() === RNG_2.nextFloat());
});

test('RNG Float 2', function ()
{
    expect(RNG_1.nextFloat() === RNG_2.nextFloat());
});

test('RNG Float 3', function ()
{
    expect(RNG_1.nextFloat() === RNG_2.nextFloat());
});

test('RNG Float 4', function ()
{
    expect(RNG_1.nextFloat() === RNG_2.nextFloat());
});

//-------------- INT -----------\\
test('RNG Int 1', function ()
{
    expect(RNG_1.nextInt() === RNG_2.nextInt());
});

test('RNG Int 2', function ()
{
    expect(RNG_1.nextInt() === RNG_2.nextInt());
});

test('RNG Int 3', function ()
{
    expect(RNG_1.nextInt() === RNG_2.nextInt());
});

test('RNG Int 4', function ()
{
    expect(RNG_1.nextInt() === RNG_2.nextInt());
});


test('RNG Range 1', function ()
{
    expect(RNG_1.nextRange(0,1000) === RNG_2.nextInt(0,1000));
});

test('RNG Range 2', function ()
{
    expect(RNG_1.nextRange(-1,0) === RNG_2.nextInt(-1,0));
});


test('RNG Range 3', function ()
{
    expect(RNG_1.nextRange(-1000,1000) === RNG_2.nextInt(-1000,1000));
});


test('RNG Range 4', function ()
{
    expect(RNG_1.nextRange(0,0) === RNG_2.nextInt(0,0));
});


