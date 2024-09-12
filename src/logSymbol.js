import chalk from "chalk"
import { isUnicodeSupported } from "./utils.js"

const _isUnicodeSupported = isUnicodeSupported();

export const info = chalk.blue(_isUnicodeSupported ? 'ℹ' : 'i');
export const success = chalk.green(_isUnicodeSupported ? '✔' : '√');
export const warning = chalk.yellow(_isUnicodeSupported ? '⚠' : '‼');
export const error = chalk.red(_isUnicodeSupported ? '✖️' : '×');
export const arrow = chalk.yellow(_isUnicodeSupported ? '➤' : '→');
export const star = chalk.cyan(_isUnicodeSupported ? '⭐' : '★')