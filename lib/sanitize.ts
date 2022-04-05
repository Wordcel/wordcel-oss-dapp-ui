const removeFromWord = (word: string) => {
  let editedWord = word.replace('<br />', '');
  editedWord = editedWord.replace('<br>', '');
  editedWord = editedWord.replace('<br/>', '');
  editedWord = editedWord.replace('</br>', '');
  editedWord = editedWord.replace('&nbsp;', '');
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
}