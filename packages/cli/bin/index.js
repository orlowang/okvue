#!/usr/bin/env node

const local = require("os-locale");
const chalk = require("chalk");
const cli = require("../lib/cli");

const lc = local.sync();
const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split(".");
const major = semver[0];

let errMsg =
  "You are running Node " +
  currentNodeVersion +
  ".\n" +
  "@okvue/cli requires Node 8.4 or higher. \n" +
  "Please update your version of Node.";

if (/zh/.test(lc)) {
  errMsg =
    "当前运行的Node版本为 " +
    currentNodeVersion +
    ".\n" +
    "@okvue/cli需要Node 8.4及以上版本. \n" +
    "请升级你的Node版本.";
}

if (major < 8) {
  console.error(chalk.red(errMsg));
  process.exit(1);
}

const cmd = new cli({ local: lc });
cmd.run();
