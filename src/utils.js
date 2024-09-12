import process from 'node:process';
import fs from "fs-extra";
import ora from 'ora';
import chalk from 'chalk';
import path from 'node:path';
import { error } from "./logSymbol.js";
import shell from 'shelljs';

// 获取绝对路径
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// 判断终端是否支持Unicode
export function isUnicodeSupported() {
  const { env } = process;
  const { TERM, TERM_PROGRAM } = env;

  if (process.platform !== 'win32') {
    return TERM !== 'linux'; // Linux console (kernel)
  }

  return Boolean(env.WT_SESSION) // Windows Terminal
    || Boolean(env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
    || env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
    || TERM_PROGRAM === 'Terminus-Sublime'
    || TERM_PROGRAM === 'vscode'
    || TERM === 'xterm-256color'
    || TERM === 'alacritty'
    || TERM === 'rxvt-unicode'
    || TERM === 'rxvt-unicode-256color'
    || env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';
}

// 删除文件夹
export async function removeDir(dir) {
  const spinner = ora({
    text: `正在删除文件夹${chalk.cyan(dir)}...`,
    color: 'yellow',
  }).start();

  try {
    await fs.remove(resolveApp(dir));
    spinner.succeed(chalk.greenBright(`文件夹${chalk.cyan(dir)}删除成功`));
  } catch (error) {
    spinner.fail(chalk.redBright(`文件夹${chalk.cyan(dir)}删除失败`));
    console.log(error);
  }
}

export async function changePackageJson(name, info) {
  try {
    const pkg = await fs.readJSON(resolveApp(`${name}/package.json`));
    Object.keys(info).forEach(item => {
      const isExist = info[item] && info[item].trim()
      if (item === 'name') {
        pkg[item] = isExist ? info[item].trim() : name;
      } else if (item === 'keywords' && isExist) {
        pkg[item] = info[item].trim().split(',');
      } else if (isExist) {
        pkg[item] = info[item];
      }
    });

    await fs.writeJSON(resolveApp(`${name}/package.json`), pkg, { spaces: 2 });
  } catch (err) {
    console.log(error, chalk.redBright("对不起,项目package.json文件修改失败,请手动修改package.json文件"));
    console.log(err);
  }
}

export async function npmInstall(dir) {
  const spinner = ora({
    text: `正在安装依赖...`,
    color: 'yellow',
  }).start();
  try {
    shell.cd(resolveApp(dir)); // 进入文件夹
    shell.exec('npm install --force --d', { silent: false }); // 安装依赖,不输出日志
    spinner.succeed(chalk.greenBright(`依赖安装成功,项目创建成功`));
  } catch (err) {
    spinner.fail(chalk.yellowBright(`依赖安装失败,请手动安装`));
    console.log(error, err);
  }
}