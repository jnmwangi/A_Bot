if(!browser && chrome){
  var browser = chrome;
}

browser.runtime.onInstalled.addListener((details) => {
  console.log(details);
    if(details.reason !== "install" && details.reason !== "update") return;
  });