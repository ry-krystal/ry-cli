import clone from './gitClone.js'
import shell from 'shelljs'
import chalk from 'chalk'
import { info, success, warning, error, arrow, star } from './logSymbol.js'
import fs from "fs-extra"
import { removeDir, changePackageJson, npmInstall } from "./utils.js"
import { inquirerConfirm, inquirerChoose, inquirerInputs } from './interactive.js'
import { templates, messages } from './constants.js'

const initAction = async (name, option) => {
  if (!shell.which('git')) {
    console.log(error, chalk.redBright('git没有安装，请先安装git'));
    shell.exit(1);
  }
  // 验证name是否合法
  if (name.match(/[\u4e00-\u9fff`~!@#$%^&*()_+=[\]{}|\\;:'",.<>/?]/g)) {
    console.log(error, chalk.redBright("项目名字不能包含中文和特殊字符"));
    shell.exit(1)
  }

  let repository = ""
  if (option.template) {
    const template = templates.find(item => item.name === option.template)
    if (!template) {
      console.log(error, `没有找到模板${chalk.yellowBright(option.template)}`);
      console.log(`\r\n 运行 ${chalk.cyan('ry-cli list')} 查看所有可用的模板\r\n`);
      shell.exit(1)
    }
    repository = template.repository
  } else {
    // 询问是否需要使用模板
    const answer = await inquirerChoose("请选择一个模板", templates);
    repository = answer.choose
  }

  // 验证是否存在同名文件夹，如果存在
  // 1. 如果没有-f --force选项，提示用户是否删除同名文件夹
  // 2. 如果有-f --force选项，直接删除同名文件夹
  if (fs.existsSync(name) && !option.force) {
    console.log(warning, `已经存在项目文件夹${chalk.yellowBright(name)}`);
    const answer = await inquirerConfirm(`是否删除同名文件夹${chalk.yellowBright(name)}?`);
    // 询问是否删除同名文件夹
    if (answer.confirm) {
      // 询问结果为true
      // 删除
      await removeDir(name);
    } else {
      // 询问结果为false
      console.log(error, `对不起，项目创建失败，存在同名文件夹:${chalk.yellowBright(name)}`);
      shell.exit(1)
    }
  } else if (fs.existsSync(name) && option.force) {
    console.log(info, `已经存在同名文件夹${chalk.yellowBright(name)}`)
    // 删除
    await removeDir(name);
  }

  try {
    await clone(`yingside/${repository}`, name)
  } catch (error) {
    console.log(error, chalk.redBright('项目创建失败'));
    console.error(error);
    shell.exit(1);
  }

  // 判断命令行是否输入了-i --ignore选项，快速创还能项目选项
  if (!option.ignore) {
    // 询问
    const answers = await inquirerInputs(messages);
    console.log('answer', answers);
    await changePackageJson(name, answers)
  }

  // 安装依赖
  await npmInstall(name)
}
export default initAction