/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

const compare = (str1, str2, param) => {
    const compareString = (str1, str2) => str1.localeCompare(str2, ['ru', 'en'], {caseFirst: 'upper'});

    if (param === 'desc') {
        return compareString(str2, str1);
    } else {
        return compareString(str1, str2);
    }
}

export const sortStrings = (arr, param = 'asc') => arr.slice().sort((a, b) => compare(a, b, param));
