export const templates = [
  {
    name: "vite-template",
    url: "yingside/vite-template",
    description: "基于vite的vue3+前端工具链模板"
  },
  {
    name: "vue-webpack",
    url: "yingside/webpack-template",
    description: "基于webpack5自定义初始化vue3项目"
  },
  {
    name: "vue-cli-template",
    url: "yingside/vue-cli-template",
    description: "基于vue-cli自定义初始化vue3项目"
  },
  {
    name: "vue-admin-box",
    url: "cmdparkour/vue-admin-box",
    description: "基于vue3 + vite中后台项目模板"
  }
]

export const messages = [
  {
    message: "请输入项目名称:",
    name: 'name',
    validate(val) {
      if (val.match(/[\u4e00-\u9fff`~!@#$%^&*()_+=[\]{}|\\;:'",.<>/?]/g)) {
        return "项目名字不能包含中文和特殊字符"
      }
      return true
    }
  },
  {
    message: "请输入项目关键词(,分割):",
    name: 'keywords',
  },
  {
    message: "请输入项目描述:",
    name: 'description',
  },
  {
    message: "请输入作者名称:",
    name: 'author',
  }
]