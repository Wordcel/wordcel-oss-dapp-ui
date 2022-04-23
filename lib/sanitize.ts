const removeFromWord = (word: string) => {
  let editedWord = word.replace('<br />', '');
  editedWord = editedWord.replace('<br>', '');
  editedWord = editedWord.replace('<br/>', '');
  editedWord = editedWord.replace('</br>', '');
  editedWord = editedWord.replace('&nbsp;', '');
  editedWord = editedWord.replace('&gt;', '');
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
  sentence: string
) => {
  if (sentence.length < 220) return sentence;
  const shortened = sentence.substring(0, 220)
    .concat('...');
  return shortened;
};
