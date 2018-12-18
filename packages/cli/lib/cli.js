const commander = require("commander");
const ora = require("ora");
const validateProjectName = require("validate-npm-package-name");
const download = require("download-git-repo");
const chalk = require("chalk");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");
const cp = require("child_process");
const packageJson = require("../package.json");
const { isSafeToCreateProjectIn, stderrFilter } = require("./utils");
const en = require("./en");
const zh = require("./zh");

function printValidationResults(results) {
  if (typeof results !== "undefined") {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`));
    });
  }
}

module.exports = class cli {
  constructor({ local }) {
    this.message = en;
    if (/zh/.test(local)) {
      this.message = zh;
    }
  }

  async create(name) {
    const root = path.resolve(name);
    const check_name = validateProjectName(name);
    if (!check_name.validForNewPackages) {
      console.error(
        `${this.message.err_npm_name_prefix} ${chalk.red(`"${name}"`)} ${
          this.message.err_npm_name_suffix
        }`
      );
      printValidationResults(check_name.errors);
      printValidationResults(check_name.warnings);
      process.exit(1);
    }
    let _this = this,
      repo_url = undefined;
    const info = await this.getGeneratorType();
    const spinner = ora(this.message.creating);

    if (info.type === this.message.platform_pc) {
      repo_url = `bpovstop/admin#${
        this.message.useTabView ? "with-tab" : "default"
      }`;
    } else {
      repo_url = "bpovstop/mobile-tpl";
    }

    fs.ensureDirSync(name);
    if (!isSafeToCreateProjectIn(root, name, this.message)) {
      process.exit(1);
    }
    spinner.start();
    spinner.text = this.message.fetch_repo;

    download(repo_url, root, function(err) {
      if (err) {
        spinner.fail(_this.message.failed);
        console.log(chalk.red(err));
      } else {
        spinner.text = _this.message.dep_install;
        child(`cd ${name} && npm i`)
          .then(msg => {
            spinner.succeed(_this.message.success);
            console.log(
              `\n${_this.message.start_dev}\n${chalk.green(
                "    cd " + name
              )}\n${chalk.green("    npm start")}`
            );
          })
          .catch(err => {
            spinner.fail(_this.message.failed);
            console.log(chalk.red(err));
          });
      }
    });

    const child = cmd =>
      new Promise((resolve, reject) => {
        cp.exec(cmd, (err, stdout, stderr) => {
          if (err || stderrFilter(stderr)) {
            reject(err || stderr);
          }
          resolve(stdout);
        });
      });
  }

  getGeneratorType() {
    let _this = this;
    // todo this's not good to return when select PC, think another way in inquirer.js
    return inquirer
      .prompt([
        {
          type: "list",
          name: "type",
          default: this.message.platform_mobile,
          message: this.message.pick_paltform_type,
          choices: [this.message.platform_mobile, this.message.platform_pc]
        }
      ])
      .then(({ type }) => {
        if (type === this.message.platform_pc) {
          return inquirer
            .prompt({
              type: "confirm",
              name: "useTabView",
              message: this.message.use_tab_view
            })
            .then(answers => {
              answers.type = type;
              return answers;
            });
        } else {
          return inquirer
            .prompt([
              {
                type: "list",
                name: "appType",
                message: this.message.app_type_select,
                choices: [
                  this.message.app_type_mutiple,
                  this.message.app_type_single
                ]
              },
              {
                type: "confirm",
                name: "useNativeScroll",
                message: this.message.use_native_scroll
              }
            ])
            .then(answers => {
              answers.type = type;
              return answers;
            });
        }
      });
  }

  run() {
    let project_name = undefined;

    const program = new commander.Command("okvue")
      .version(packageJson.version)
      .arguments(this.message.project_directory)
      .usage(
        `${chalk.green(this.message.project_directory)} ${this.message.options}`
      )
      .action((...argv) => {
        if (argv.length > 1) {
          project_name = argv[0];
        }
      })
      .allowUnknownOption()
      .on("--help", () => {
        console.log(`\n${this.message.pull_issue}`);
        console.log(
          chalk.cyan(
            "https://github.com/owcc/okvue/tree/master/packages/cli/issues"
          )
        );
        console.log();
      })
      .parse(process.argv);

    if (typeof project_name === "undefined") {
      console.log();
      console.log(this.message.specify_project);
      console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green(
          this.message.project_directory
        )}`
      );
      console.log();
      console.log(this.message.example);
      console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green("my-project")}`
      );
      console.log();
      console.log(
        `${this.message.run} ${chalk.cyan(`${program.name()} --help`)} ${
          this.message.all_options
        }`
      );
      process.exit(1);
    }

    this.create(project_name);
  }
};
