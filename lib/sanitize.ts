const removeFromWord = (word: string) => {
  let editedWord = word.replaceAll('<br />', '');
  editedWord = editedWord.replaceAll('<b>', '');
  editedWord = editedWord.replaceAll('</b>', '');
  editedWord = editedWord.replaceAll('<i>', '');
  editedWord = editedWord.replaceAll('</i>', '');
  editedWord = editedWord.replaceAll('<br>', '');
  editedWord = editedWord.replaceAll('<br/>', '');
  editedWord = editedWord.replaceAll('</br>', '');
  editedWord = editedWord.replaceAll('&nbsp;', '');
  editedWord = editedWord.replaceAll('&gt;', '');
  editedWord = editedWord.replaceAll('<a>', '');
  editedWord = editedWord.replaceAll('</a>', '');
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
