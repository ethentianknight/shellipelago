var checkMobileMaxWidth = 768;
var checkMobileScreenWidth = Math.min(window.innerWidth, screen.width);
var checkMobileHasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

isMobile = checkMobileScreenWidth <= checkMobileMaxWidth || checkMobileHasCoarsePointer;
globalsState.loadedModules.push("checkMobile");
