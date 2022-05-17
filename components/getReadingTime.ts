export const getReadingTime = (
  blocks: any[]
) => {
  const textTypes = ['paragraph', 'header', 'quote'];
  const wordsPerBlock = blocks.map((block) => {
    if (textTypes.includes(block.type)) {
      return block.data.text.split(' ').length;
    } else {
      return 0;
    }
  });
  const totalWords = wordsPerBlock.reduce((a, b) => a + b, 0)
  const totalSeconds = Math.round(totalWords / 3);
  if (totalSeconds < 60) {
    return `${totalSeconds} secs`;
  } else {
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes} min`;
  }
}