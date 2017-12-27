export const isBool = v => typeof v === 'boolean';
export const isNum = v => typeof v === 'number';
export const toArray = v => (v instanceof Array ? v : [v]);
