#!/usr/bin/env node

import assert from 'node:assert';

import { sumValues, sumValuesAsync, sumValuesSync } from './dist/index.mjs';

assert(sumValues([1, 2, 3]) === 6);
assert(sumValuesSync([1, 2, 3]) === 6);

sumValuesAsync([1, 2, 3])
    .then((answer) => assert(answer === 6))
    .catch((r) => console.log(r));
