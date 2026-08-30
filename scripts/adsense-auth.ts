import {
  createDefaultAuthDependencies,
  runAdsenseAuthCommand,
} from "./lib/adsense-auth";

void runAdsenseAuthCommand(createDefaultAuthDependencies()).then((exitCode) => {
  process.exitCode = exitCode;
});
