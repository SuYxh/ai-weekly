import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url'; // 确保导入 fileURLToPath

/**
 * 异步读取文件内容
 * @param {string} filePath - 文件的绝对或相对路径
 * @param {string} [encoding='utf8'] - 文件编码，默认为 'utf8'
 * @returns {Promise<string>} - 返回包含文件内容的 Promise 对象
 * @throws {Error} - 如果读取文件失败，则抛出错误
 */
export async function readFileContent(filePath, encoding = 'utf8') {
  try {
    const absolutePath = path.resolve(filePath);
    const content = await fs.readFile(absolutePath, encoding);
    return content;
  } catch (error) {
    console.error(`读取文件 ${filePath} 时出错:`, error);
    throw new Error(`无法读取文件: ${filePath}`);
  }
}

/**
 * 异步写入文件内容。如果目录不存在，会自动创建。如果文件已存在，会覆盖内容。
 * 如果 data 是对象或数组，会先转换为 JSON 字符串再写入。
 * @param {string} filePath - 文件的绝对或相对路径
 * @param {string | Buffer | object | Array} data - 要写入的数据。对象或数组会被 JSON.stringify 处理。
 * @param {string} [encoding='utf8'] - 文件编码，默认为 'utf8' (如果 data 是 Buffer 或被转为 JSON 则忽略部分情况)
 * @returns {Promise<void>} - 操作完成时解析的 Promise 对象
 * @throws {Error} - 如果写入文件失败，则抛出错误
 */
export async function writeFileContent(filePath, data, encoding = 'utf8') {
  try {
    const absolutePath = path.resolve(filePath);
    let contentToWrite = data;

    // 检查 data 是否为需要转换为 JSON 的类型 (非 null 的对象，且不是 Buffer)
    if (typeof data === 'object' && data !== null && !Buffer.isBuffer(data)) {
      try {
        // 转换为带缩进的 JSON 字符串，更易读
        contentToWrite = JSON.stringify(data, null, 2);
        // 对于 JSON 文件，通常使用 utf8 编码
        encoding = 'utf8';
      } catch (stringifyError) {
        console.error(`将数据转换为 JSON 时出错 (文件: ${filePath}):`, stringifyError);
        throw new Error(`无法将数据转换为 JSON 写入文件: ${filePath}`);
      }
    }

    // 确保目录存在
    await fs.ensureDir(path.dirname(absolutePath));
    // 写入文件
    await fs.writeFile(absolutePath, contentToWrite, encoding);

  } catch (error) {
    // 避免重复记录上面 try-catch 中已处理的 JSON 转换错误
    if (!error.message.startsWith('无法将数据转换为 JSON')) {
        console.error(`写入文件 ${filePath} 时出错:`, error);
    }
    // 重新抛出错误或抛出通用错误
    throw new Error(`无法写入文件: ${filePath}`);
  }
}

/**
 * 异步检查文件或目录是否存在
 * @param {string} targetPath - 文件或目录的绝对或相对路径
 * @returns {Promise<boolean>} - 如果路径存在，则返回 true，否则返回 false
 */
export async function pathExists(targetPath) {
  try {
    const absolutePath = path.resolve(targetPath);
    return await fs.pathExists(absolutePath);
  } catch (error) {
    // pathExists 通常不应抛出异常，除非权限问题等，但以防万一
    console.error(`检查路径 ${targetPath} 时出错:`, error);
    return false; // 出错时假定不存在
  }
}

/**
 * 异步确保目录存在。如果目录链中的任何部分不存在，则创建它们。
 * @param {string} dirPath - 目录的绝对或相对路径
 * @returns {Promise<void>} - 操作完成时解析的 Promise 对象
 * @throws {Error} - 如果创建目录失败，则抛出错误
 */
export async function ensureDirectoryExists(dirPath) {
  try {
    const absolutePath = path.resolve(dirPath);
    await fs.ensureDir(absolutePath);
  } catch (error) {
    console.error(`确保目录 ${dirPath} 存在时出错:`, error);
    throw new Error(`无法创建目录: ${dirPath}`);
  }
}

/**
 * 异步删除文件或目录（及其内容）
 * @param {string} targetPath - 要删除的文件或目录的绝对或相对路径
 * @returns {Promise<void>} - 操作完成时解析的 Promise 对象
 * @throws {Error} - 如果删除失败，则抛出错误
 */
export async function removePath(targetPath) {
  try {
    const absolutePath = path.resolve(targetPath);
    await fs.remove(absolutePath);
  } catch (error) {
    console.error(`删除路径 ${targetPath} 时出错:`, error);
    throw new Error(`无法删除路径: ${targetPath}`);
  }
}

/**
 * 异步复制文件或目录
 * @param {string} srcPath - 源文件或目录的绝对或相对路径
 * @param {string} destPath - 目标路径
 * @param {object} [options={}] - fs-extra copy 方法的选项 (例如 { overwrite: true })
 * @returns {Promise<void>} - 操作完成时解析的 Promise 对象
 * @throws {Error} - 如果复制失败，则抛出错误
 */
export async function copyPath(srcPath, destPath, options = {}) {
  try {
    const absoluteSrc = path.resolve(srcPath);
    const absoluteDest = path.resolve(destPath);
    await fs.copy(absoluteSrc, absoluteDest, options);
  } catch (error) {
    console.error(`从 ${srcPath} 复制到 ${destPath} 时出错:`, error);
    throw new Error(`无法复制路径: 从 ${srcPath} 到 ${destPath}`);
  }
}

/**
 * 异步移动/重命名文件或目录
 * @param {string} srcPath - 源文件或目录的绝对或相对路径
 * @param {string} destPath - 目标路径
 * @param {object} [options={}] - fs-extra move 方法的选项 (例如 { overwrite: true })
 * @returns {Promise<void>} - 操作完成时解析的 Promise 对象
 * @throws {Error} - 如果移动失败，则抛出错误
 */
export async function movePath(srcPath, destPath, options = {}) {
  try {
    const absoluteSrc = path.resolve(srcPath);
    const absoluteDest = path.resolve(destPath);
    await fs.move(absoluteSrc, absoluteDest, options);
  } catch (error) {
    console.error(`从 ${srcPath} 移动到 ${destPath} 时出错:`, error);
    throw new Error(`无法移动路径: 从 ${srcPath} 到 ${destPath}`);
  }
}

/**
 * 获取当前 ES Module 文件所在的目录路径
 * @param {string} importMetaUrl - 调用方传入的 import.meta.url
 * @returns {string} - 当前文件所在的目录的绝对路径
 */
export function getCurrentDirname(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

/**
 * 解析相对于当前 ES Module 文件目录的路径
 * @param {string} importMetaUrl - 调用方传入的 import.meta.url
 * @param {...string} pathSegments - 相对于当前目录的路径片段 (例如 '..', 'data', 'file.json')
 * @returns {string} - 解析后的绝对路径
 */
export function resolvePathFromMeta(importMetaUrl, ...pathSegments) {
  const currentDir = getCurrentDirname(importMetaUrl);
  return path.resolve(currentDir, ...pathSegments);
}