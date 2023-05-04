# threading
#### A clojure-inspired utility for threading arbitrary data into the first or last argument of a sequence of functions

### Motivation
In order to compose function operations on arbitrary data, you have to nest functions
```javascript
expect(subtract(add(3, 3) 3)).toBe(3);
```
The legibility of the example decreases as the number of functions increase.

### Example Usage

#### Thread-first
Apply the initial & resulting values of the function list to the first argument of the function.

Simply provide an initial value then the functions you'd like to compose on the value.
```javascript
import { threadFirst } from 'threading';

const value = threadFirst(
    5,
    timesThree,
    plusOne
);

expect(value).toBe(16);
```

To use with a function that should already have a value you can pass an array containing the function and the other arguments.
```javascript
import { threadFirst } from 'threading';

const value = threadFirst(
  5,
  [times 3],
  [divideby 5]
);

expect(value).toBe(3);
```

#### Thread-last
Apply the initial & resulting values of the function list to the last argument of the function.

Simply provide an initial value then the functions you'd like to compose on the value.
```javascript
import { threadLast } from 'threading';

const value = threadLast(
    5,
    timesThree,
    plusOne
);

expect(value).toBe(16);
```

To use with a function that should already have a value you can pass an array containing the function and the other arguments.
```javascript
import { threadLast } from 'threading';

const value = threadFirst(
  5,
  [times 2],
  [divideby 5]
);

expect(value).toBe(0.5);
```
