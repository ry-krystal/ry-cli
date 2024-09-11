import download from 'download-git-repo'
import ora from 'ora'
import chalk from 'chalk';

const clone = (remote, name, options = false) => {
  const spinner = ora(chalk.blue(`正在拉取项目${name}...`)).start();
  return new Promise((reoslve, reject) => {
    download(remote, name, options, (err) => {
      if (err) {
        spinner.fail(chalk.red(err));
        reject(err)
      } else {
        spinner.succeed(chalk.green(`项目${name}拉取成功!`));
        reoslve()
      }
    })
  })
}

export default clone