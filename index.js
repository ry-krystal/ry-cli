#!/usr/bin/env node
import figlet from 'figlet'
import chalk from 'chalk'
import fs from "fs-extra"
import { program } from 'commander'
import { templates } from './constants.js'
import initAction from './initAction.js'
import { star } from "./logSymbol.js"
import Table from 'cli-table3'

const pkg = fs.readJSONSync(new URL('./package.json', import.meta.url))
program.version(pkg.version, '-v, --version')

program
  .name("ry-cli")
  .description(chalk.green("一个前端脚手架"))
  .usage("<command> [options]")
  .on("--help", () => {
    console.log("\r\n" + chalk.greenBright.bold(figlet.textSync('ry-cli', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })));

    console.log(`\r\nRun ${chalk.cyan(`ry-cli <command> --help`)} for detailed usage of given command\r\n`)
  })

program
  .command("create <app-name>")
  .description("创建一个新项目")
  .option("-t --template [template]", "选择模板创建项目")
  .option("-f --force", "强制覆盖本地同名项目")
  .option("-i --ignore", "忽略项目相关描述，快速创建项目")
  .action(initAction)

program
  .command("list")
  .description("查看所有可用的模板")
  .action(() => {
    // console.log(star, chalk.greenBright("所有可用模板如下:"));
    // 创建表格
    const table = new Table({
      colAligns: ['center', 'center', 'center', 'center'],
      colWidths: [10, 20, 30, 40],
    })

    // 先添加表头
    table.push(
      [
        chalk.yellowBright('序号'),
        chalk.greenBright('名称'),
        chalk.blueBright('地址'),
        chalk.cyanBright('描述')
      ]
    );

    // 添加大标题（跨4列）
    table.unshift(
      [{ colSpan: 4, content: chalk.bold.greenBright(`==========${star} 可用模板列表 ==========`) }]
    );

    templates.forEach(({ name, url, description }, index) => {
      table.push([chalk.yellowBright(index + 1), chalk.greenBright(name), chalk.blueBright(url), chalk.cyanBright(description)])
    })
    // 打印表格
    console.log(table.toString());
  })

program.parse(process.argv);