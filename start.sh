#!/bin/bash

# 拉取框架git代码
git pull 
# 等待一段时间，可以根据需要调整
sleep 1

# 获取当前脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 切换到 src/views/ 目录
cd "$SCRIPT_DIR/src/views/"

# 获取当前目录下的所有子目录
for dir in */; do
  # 进入子目录
  cd "$dir"
  
  # 检查是否为目录并且包含 .git 子目录
  if [ -d ".git" ]; then
    # 执行 git pull
    git pull
    
    # 等待一段时间，可以根据需要调整
    sleep 1
  fi
  
  # 返回上一级目录
  cd ..
done

# 切换回到顶级目录
cd "$SCRIPT_DIR/"

pnpm run start
