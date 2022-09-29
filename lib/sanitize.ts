import sanitize from 'sanitize-html';

const removeFromWord = (word: string) => {
  let editedWord = word.replace('<br />', '');
  editedWord = editedWord.replace('&nbsp;', '');
  editedWord = editedWord.replace('&gt;', '');
  editedWord = editedWord.replace('&lt;', '');
  return editedWord;
}

export const sanitizeHtml = (
  dirty: string
) => {
  const split = dirty.split(' ');
  const cleanArray = split.map((word) => {
    return removeFromWord(word);
  });
  const clean = cleanArray.filter((word) => word !== '');
  const final = sanitize(clean.join(' '), {
    allowedTags: [],
    allowedAttributes: {}
  });
  return final;
};

export const shortenSentence = (
  sentence: string,
  length = 220
) => {
  if (sentence.length < length) return sentence;
  const shortened = sentence.substring(0, length)
    .concat('...');
  return shortened;
};
