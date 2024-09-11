import inquirer from 'inquirer'

/**
 * @description: 询问是否继续
 * @param {string} message 询问提示语句
 * @return {object} 返回询问结果
 */
export const inquirerConfirm = async (message) => {
  const answer = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message
  })
  return answer
}

/**
 * @description: 询问选择
 * @param {string} message
 * @param {Array} choices
 * @param {string} type
 * @return {object}
 */
export const inquirerChoose = async (message, choices, type = 'list') => {
  const answer = await inquirer.prompt({
    type,
    name: 'choose',
    message,
    choices
  })
  return answer
}

/**
 * @description: 询问提示的值
 * @param {string} message
 * @return {object}
 */
export const inquirerInput = async (message) => {
  const answer = await inquirer.prompt({
    type: 'input',
    name: 'input',
    message
  })
  return answer
}

/**
 * @description: 
 * @param {Array} messages
 * @return {object}}
 */
export const inquirerInputs = async (messages) => {
  const answer = await inquirer.prompt(messages.map(({ type = 'input', name = 'input', message = '' }) => {
    return {
      name,
      type,
      message
    }
  }))
  return answer
}