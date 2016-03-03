import sublime, sublime_plugin
import re

# 活动页自动转换插件
# 在活动内容的开始部分放置一个注释 <! -- start -->
# 在活动内容的结束部分放置一个注释 <! -- end -->
# 图片标签单独一行便于自动处理
#

class ActivityCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        view          = self.view
        content_start = view.find(r'<!--\s*start\s*-->', 0).end()   # 活动html开始位置
        p             = re.compile('me.lizi.com', re.I)

        if not content_start:   # 如果没有找到start标识, 退出
            return

        result = []

        while True:
            last_line = view.find(r'\S.+$', content_start)   # 当前行, 去掉首尾空白字符

            if re.search('<!--\s*end\s*-->', view.substr(last_line)):
                break

            result.append(p.sub('s02.lizi.com', view.substr(view.line(last_line))))

            if re.search('www', view.file_name()) and re.search('<img\s*src=".+".*/?>', view.substr(last_line)):    # wap环境下不需要设置图片宽高, 没有遇到活动html结束(更新图片大小)
                try:
                    view.sel().clear()
                    view.sel().add(last_line)
                    view.run_command('run_emmet_action', { 'action': 'update_image_size' })
                except:
                    pass

            content_start = last_line.end()
            # 活动html结束

        # set clipboard
        sublime.set_clipboard('\n'.join(result))
