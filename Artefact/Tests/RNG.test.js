let rng = require("../MainProject/lib/RNG.js");

let seed = Math.floor(Math.random()*1000);
let RNG_1 = new rng.RNG(seed);
let RNG_2 =new  rng.RNG(seed);
test('RNG Float', function ()
{
    expect(RNG_1.nextFloat() === RNG_2.nextFloat());
    expect(RNG_1.nextFloat() === RNG_2.nextFloat());
    expect(RNG_1.nextFloat() === RNG_2.nextFloat());
});

test('RNG Int', function ()
{
    expect(RNG_1.nextInt() === RNG_2.nextInt());
    expect(RNG_1.nextInt() === RNG_2.nextInt());
    expect(RNG_1.nextInt() === RNG_2.nextInt());
});

test('RNG Int', function ()
{
    expect(RNG_1.nextInt() === RNG_2.nextInt());
    expect(RNG_1.nextInt() === RNG_2.nextInt());
    expect(RNG_1.nextInt() === RNG_2.nextInt());
});

test('RNG Range', function ()
{
    expect(RNG_1.nextRange(0,1000) === RNG_2.nextInt(0,1000));
    expect(RNG_1.nextRange(0,1000) === RNG_2.nextInt(0,1000));
    expect(RNG_1.nextRange(0,1000) === RNG_2.nextInt(0,1000));
});

