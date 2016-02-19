import sublime, sublime_plugin, re
# 从当前位置找到下一个特殊符号，选中中间内容
class MeCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        selection = sublime.Selection(self.view.id())

        current_point = self.view.sel()[0].begin()

        # print(current_point)
        # current_line_end = self.view.line(current_point).end()

        current_word = self.view.word(current_point)

        start = current_word.begin()   
        end   = current_word.end()

        text  = self.view.substr(current_word)

        p = re.compile(r'[a-zA-Z0-9]+', re.I)

        pos = self.view.sel()[0].begin() - start

        for m in p.finditer(text):
            if pos in range(m.start(), m.end()):
                selection.add(sublime.Region(start + m.start(), start + m.end()))

