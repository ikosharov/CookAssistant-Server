module.exports.clone = function clone(objToClone) {
  return JSON.parse(JSON.stringify(objToClone));
};