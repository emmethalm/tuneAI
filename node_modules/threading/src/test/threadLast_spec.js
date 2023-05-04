import expect from 'expect.js';
import threadLast from '../threadLast';

function timesThree(val) {
  return val * 3;
}

function plusOne(val) {
  return val + 1;
}

function divideby(val, divisor) {
  return val / divisor;
}

describe('#threadLast', () => {
  it('exists', () => {
    expect(threadLast).not.to.be(undefined);
  });

  it('returns the value if it is only passed one value', () => {
    expect(threadLast(4)).to.be(4);
  });

  it('returns the result of an operator', () => {
    expect(threadLast(5, timesThree)).to.be(15);
  });

  it('returns the result of multiple operators', () => {
    expect(threadLast(5, timesThree, plusOne)).to.be(16);
  });

  it('uses the value as the first argument in the function call', () => {
    const result = threadLast(5,
                     [divideby, 10]);
    expect(result).to.be(2);
  });
});
