var test1ModuleName = "test1";
var test1DeviceType = isMobile ? "mobile" : "desktop";

globalsState.loadedModules.push(test1ModuleName);
alert("test1 loaded on " + test1DeviceType);
