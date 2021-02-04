import questions from "./data/questions"

const words = new Set()

questions.forEach(q => {
  q.text.split(" ").forEach(w => {
    words.add(w.toLowerCase().replace(/[^\w]/g, ''));
  })
})

const generateGameId = (length = 5) => {
  let id = '';
  const availableWords = new Set(words);
  for(let i = 0; i < length; i++) {
    const word = Array.from(availableWords)[Math.floor(Math.random() * Array.from(availableWords).length)]
    if (id !== '') {
      id += "-"
    }
    id += word;
    availableWords.delete(word);
  }
  return id;
}

export default generateGameId;
