exports.timeStamp = () => {
  const time = new Date();
  return `${time.toDateString()} ${time.toLocaleTimeString()}`;
};
