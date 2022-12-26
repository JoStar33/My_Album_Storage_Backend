const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const asyncFor = async (count, callback) => {
  for (let index = 0; index < count; index++) {
    await callback(index);
  }
}

module.exports = { asyncForEach, asyncFor };