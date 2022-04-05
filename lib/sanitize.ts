const removeFromWord = (word: string) => {
  let editedWord = word.replace('<br />', '');
  editedWord = editedWord.replace('<br>', '');
  editedWord = editedWord.replace('<br/>', '');
  editedWord = editedWord.replace('</br>', '');
  return editedWord;
}

export const sanitizeHtml = (
  dirty: string
) => {
  const split = dirty.split(' ');
  const cleanArray = split.map((word) => {
    if (word.includes('<') && word.includes('>')) {
      return removeFromWord(word);
    }
    return word;
  });
  const clean = cleanArray.filter((word) => word !== '');
  return clean.join(' ');
}