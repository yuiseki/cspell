import { describe, expect, test } from 'vitest';

import { assert } from './assert.js';

function catchError<T>(fn: () => T): Error | T {
    try {
        return fn();
    } catch (err) {
        return err as Error;
    }
}

describe('assert', () => {
    test.each`
        value        | message                   | expected
        ${true}      | ${undefined}              | ${undefined}
        ${1}         | ${undefined}              | ${undefined}
        ${'yes'}     | ${undefined}              | ${undefined}
        ${undefined} | ${undefined}              | ${new Error('AssertionError')}
        ${0}         | ${undefined}              | ${new Error('AssertionError')}
        ${null}      | ${undefined}              | ${new Error('AssertionError')}
        ${''}        | ${undefined}              | ${new Error('AssertionError')}
        ${false}     | ${undefined}              | ${new Error('AssertionError')}
        ${false}     | ${'Must be true or fail'} | ${new Error('Must be true or fail')}
        ${false}     | ${new Error('my error')}  | ${new Error('my error')}
    `('compare assert to node assert $value / $message', ({ value, message, expected }) => {
        expect(catchError(() => assert(value, message))).toEqual(expected);
    });
});
