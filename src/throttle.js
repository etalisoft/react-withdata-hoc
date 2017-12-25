export default ({ ms = 100 } = {}) => fn => {
  let pause = 0;
  const resume = () => {
    pause = 0;
  };
  const exec = (...args) => {
    pause = setTimeout(resume, ms);
    fn(...args);
  };

  return (...args) => {
    if (!pause) {
      return exec(...args);
    }

    clearTimeout(pause);
    pause = setTimeout(() => exec(...args), ms);
  };
};
