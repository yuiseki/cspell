import { describe, expect, test } from 'vitest';

import { trieRootToITrieRoot } from '../../TrieNode/trie.js';
import { createTrieRootFromList } from '../../TrieNode/trie-util.js';
import { walker } from './walker.js';
import type { WalkerIterator, YieldResult } from './walkerTypes.js';

describe('walker', () => {
    const trieNode = createTrieRootFromList(sampleWords.sort());
    const root = trieRootToITrieRoot(trieNode);

    test('walker', () => {
        const i = walker(root);
        const result = walkerToArray(i, 4);
        expect(result).toEqual(sampleWords.filter((a) => a.length <= 4).sort());
    });
});

function walkerToArray(w: WalkerIterator, depth: number): string[] {
    const maxDepth = depth - 1;
    let goDeeper = true;
    let ir: IteratorResult<YieldResult>;
    const result: string[] = [];
    while (!(ir = w.next(goDeeper)).done) {
        const { text, node, depth } = ir.value;
        if (node.eow) {
            result.push(text);
        }
        goDeeper = depth < maxDepth;
    }
    return result;
}

const sampleWords = [
    'walk',
    'walked',
    'walker',
    'walking',
    'walks',
    'talk',
    'talks',
    'talked',
    'talker',
    'talking',
    'lift',
    'lifts',
    'lifted',
    'lifter',
    'lifting',
    'journal',
    'journals',
    'journalism',
    'journalist',
    'journalistic',
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
];
