#! /usr/bin/env sh
# 告诉脚本在任何命令出错的时候立即退出。这样可以确保在脚本执行过程中遇到错误时立即停止
set -e
# 捕获错误信号，并在错误时调用rollback函数
trap rollback ERR
# 获取远程的版本号列表
REMOTE_VERSIONS=$(git tag -l)

 # 获取当前远程的版本号，方便在报错时回滚
CURRENT_VERSION=$(git describe --tags `git rev-list --tags --max-count=1`)
echo "\r\n---当前远程版本号是: $CURRENT_VERSION---\r\n"

# 输出提示信息
echo "输入新发布的版本号:"
# 等待用户在终端输入，输入的内容将赋值给变量 VERSION
read VERSION

# 检查输入的版本号是否与远程版本号冲突
if echo "$REMOTE_VERSIONS" | grep -q "^v$VERSION$"; then
  echo "\r\n---版本号 $VERSION 已经存在，请选择一个不同的版本号---\r\n"
  exit 1
fi

# 输出信息并且让用户输入信息
# -p 选项用于在输出前显示提示信息， -n1 选项表示只接受一个字符的输入
read -p "确认发布 $VERSION ? (y/n)" -n1

# 直接输出一个空行
echo

# if []是直接判断 if [[]]是模糊判断
if [[ $REPLY =~ ^[Yy]$ ]];
then
  if [[ `git status --porcelain` ]]; # 如果有未提交的文件
  then
    echo "\r\n---工作目录不干净，需要提交---\r\n"
    git add -A
    git commit -m "[commit]: $VERSION" # 提交版本信息log
  else
    echo "\r\n---工作目录没有任何需要提交的内容，不建议生产新的版本---\r\n"
    exit 1
  fi

  # 修改package.json中的版本号
  npm version $VERSION --message "[release]: $VERSION"

  # 提交修改到远程仓库main分支
  git push origin main

  # 提交tag到仓库
  git push origin refs/tags/v$VERSION

  # 发布到npm
  npm publish
  echo "\r\n---发布成功---\r\n"
else
  echo "发布取消"
  exit 0
fi

# 结束时取消 trap
trap - ERR
exit 0

# 定义回滚函数，在发生错误时调用
rollback() {
  echo "\r\n---发生错误，正在回滚到远程版本 $CURRENT_VERSION---\r\n"
  # 重置工作目录
  git reset --hard $CURRENT_VERSION
  # 回滚package.json中的版本号到当前版本
  npm version $CURRENT_VERSION --allow-same-version --message "[rollback]: $CURRENT_VERSION"
  echo "\r\n---回滚完成，本地版本与远程一致---\r\n"
}