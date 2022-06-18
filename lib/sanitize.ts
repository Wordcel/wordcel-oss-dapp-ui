const removeFromWord = (word: string) => {
  let editedWord = word.replace('<br />', '');
  editedWord = editedWord.replace('<b>', '');
  editedWord = editedWord.replace('</b>', '');
  editedWord = editedWord.replace('<i>', '');
  editedWord = editedWord.replace('</i>', '');
  editedWord = editedWord.replace('<br>', '');
  editedWord = editedWord.replace('<br/>', '');
  editedWord = editedWord.replace('</br>', '');
  editedWord = editedWord.replace('&nbsp;', '');
  editedWord = editedWord.replace('&gt;', '');
  editedWord = editedWord.replace('<a>', '');
  editedWord = editedWord.replace('</a>', '');
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
  return clean.join(' ');
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
