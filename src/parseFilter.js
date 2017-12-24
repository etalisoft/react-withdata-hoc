const regQuote = /\"([^\"]*)\"?/g;
const regSpace = /\s/g;
const notEmpty = v => !!v.trim();

export default filter => {
  const parts = [];
  const append = (_, match) => parts.push(match) && ' ';
  return !filter ? undefined : parts.concat(...filter.replace(regQuote, append).split(regSpace)).filter(notEmpty);
};
