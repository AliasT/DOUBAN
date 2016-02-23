import sublime, sublime_plugin
import re
class ECommand(sublime_plugin.TextCommand):
    def run(self, edit):
        # 唯一选区
        selection = self.view.sel()[0]

        result = []
        for m in re.finditer(r'\S+.+\S', self.view.substr(selection), re.M):
            result.append('\"' + m.group(0) + '\"')

        self.view.replace(edit, selection, ',\n'.join(result))
