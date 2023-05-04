export default function(value, ...operators) {
  if(typeof operators === 'undefined') {
    return value;
  }

  return operators.reduce((aggregate, operator) => {
    if (typeof operator === 'object') {
      const operatorFn = operator.shift();
      operator.unshift(aggregate);
      return operatorFn.apply(undefined, operator);
    }

    return operator.call(undefined, aggregate);
  }, value);
}
