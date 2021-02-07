/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    const charArr = string.split('');
    let result = '';
    let currentChar = '';
    let counRepeatChar = 0;

    if (size === undefined) return string;
    if (size === 0) return '';

    for (let i = 0; i < charArr.length; i++) {
        const char = charArr[i];

        if (currentChar !== char) {
            currentChar = char;
            result += char;
            counRepeatChar = 1;
        } else if (counRepeatChar < size) {
            result += char;
            counRepeatChar++;
        }
    }

    return result;
}
