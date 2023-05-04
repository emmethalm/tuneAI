import expect from 'expect.js';
import threadFirst from '../threadFirst';

function timesThree(val) {
  return val * 3;
}

function plusOne(val) {
  return val + 1;
}

function divideby(val, divisor) {
  return val / divisor;
}

function getWebhookState(val) {
  return val.webhooks;
}

function getValue(val) {
  return val.value;
}

describe('#threadFirst', () => {
  it('exists', () => {
    expect(threadFirst).not.to.be(undefined);
  });

  it('returns the value if it is only passed one value', () => {
    expect(threadFirst(4)).to.be(4);
  });

  it('returns the result of an operator', () => {
    expect(threadFirst(5, timesThree)).to.be(15);
  });

  it('returns the result of multiple operators', () => {
    expect(threadFirst(5, timesThree, plusOne)).to.be(16);
  });

  it('uses the value as the first argument in the function call', () => {
    const result = threadFirst(
      5,
      [divideby, 10]
    );
    
    expect(result).to.be(0.5);
  });

  it('demonstrates data access', () => {
    const state = {
      webhooks: {
        value: 1
      }
    };

    const value = threadFirst(
      state,
      getWebhookState,
      getValue
    );

    expect(value).to.be(1);
  });
});
