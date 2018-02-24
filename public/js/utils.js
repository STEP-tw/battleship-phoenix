let utils = {};
let intervals=[];

utils.get = function () {
  return 'GET';
};

utils.post = function () {
  return 'POST';
};

utils.parse = function (content) {
  return JSON.parse(content);
};

utils.toS = function (content) {
  return JSON.stringify(content);
};

utils.updateMessage = function (content) {
  document.querySelector('.messageBox').innerHTML = content;
};

utils.getTargetGrid = function () {
  return document.querySelector('#targetGrid');
};

utils.getOceanGrid = function () {
  return document.querySelector('#oceanGrid');
};

utils.getReadyButton = function () {
  return document.querySelector('#ready');
};

utils.setInterval = function (callback,time=1000) {
  let interval = setInterval(callback,time);
  intervals.push(interval);
};

utils.poll = function (method,reqUrl,callBackFunction,time=1000) {
  utils.setInterval(()=>{
    sendAjax(method,reqUrl,callBackFunction);
  },time);
};


utils.clearIntervals = function () {
  intervals.forEach(function (interval) {
    clearInterval(interval);
  });
};

utils.clearLastInterval = function () {
  clearInterval(intervals.pop());
};
