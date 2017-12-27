export default objectLiteral =>
  Object.keys(objectLiteral).reduce((o, k) => {
    const value = objectLiteral[k];
    o[k] = value instanceof Function ? value.bind(o) : value;
    return o;
  }, {});
