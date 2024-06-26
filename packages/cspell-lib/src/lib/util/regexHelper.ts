/**
 * Escape a string so it can be used as an exact match within a RegExp.
 * @param s - string to escape
 * @returns - the escaped string.
 */
export function escapeRegEx(s: string): string {
    return s.replaceAll(/[|\\{}()[\]^$+*?.]/g, '\\$&').replaceAll('-', '\\x2d');
}
