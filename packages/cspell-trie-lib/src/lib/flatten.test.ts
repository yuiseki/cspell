import { genSequence } from 'gensequence';
import { describe, expect, test } from 'vitest';

import { flattenToTrieRefNodeArray, flattenToTrieRefNodeIterable } from './flatten.js';
import { createTrieRootFromList } from './TrieNode/trie-util.js';
import type { TrieRefNode } from './trieRef.js';

describe('Validate Flatten', () => {
    test('Simple flatten Array', () => {
        const trie = createTrieRootFromList(sampleWords);
        const nodes = flattenToTrieRefNodeArray(trie);
        expect(nodes).toHaveLength(112);
        const words = [...walk(nodes)];
        expect(words).toEqual(sampleWords.sort());
    });

    test('Simple flatten Iterable', () => {
        const trie = createTrieRootFromList(sampleWords);
        const nodes = [...flattenToTrieRefNodeIterable(trie)];
        expect(nodes).toHaveLength(112);
        const words = [...walk(nodes)];
        expect(words).toEqual(sampleWords.sort());
    });
});

function walk(nodes: TrieRefNode[]): IterableIterator<string> {
    function* w(node: TrieRefNode, prefix: string): IterableIterator<string> {
        if (node.f) {
            yield prefix;
        }
        if (node.r) {
            yield* genSequence(node.r).concatMap((a) =>
                genSequence(w(nodes[a[1]], a[0])).map((suffix) => prefix + suffix),
            );
        }
    }
    return w(nodes[nodes.length - 1], '');
}

const sampleWords = [
    'journal',
    'journalism',
    'journalist',
    'journalistic',
    'journals',
    'journey',
    'journeyer',
    'journeyman',
    'journeymen',
    'joust',
    'jouster',
    'jousting',
    'jovial',
    'joviality',
    'jowl',
    'jowly',
    'joy',
    'joyful',
    'joyfuller',
    'joyfullest',
    'joyfulness',
    'joyless',
    'joylessness',
    'joyous',
    'joyousness',
    'joyridden',
    'joyride',
    'joyrider',
    'joyriding',
    'joyrode',
    'joystick',
    'lift',
    'lifted',
    'lifter',
    'lifting',
    'lifts',
    'talk',
    'talked',
    'talker',
    'talking',
    'talks',
    'walk',
    'walked',
    'walker',
    'walking',
    'walks',
    'Big Apple',
    'New York',
    'apple',
    'big apple',
    'fun journey',
    'long walk',
    'fun walk',
];
