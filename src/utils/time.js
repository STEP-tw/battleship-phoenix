exports.timeStamp = () => {
  const time = new Date();
  return `${time.toDateString()} ${time.toLocaleTimeString()}`;
};

exports.generateSessionId = () =>{
  let date = new Date();
  return date.getTime( );
};
