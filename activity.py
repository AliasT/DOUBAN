import requests
import datetime
import os
import sys

class Activity():
    # 用户验证信息
    user_info = dict(j_username='chaixb@lizi.com', j_password='123456')

    # 创建或编辑活动地址
    create_edit_url = 'http://admin.lizi.com/activity/saveOrEdit'
    auth_url = 'http://admin.lizi.com/j_spring_security_check'
    # 当前年月日
    year_month_day = datetime.datetime.now().strftime("%Y%m%d")


    def __init__(self):
        self.current         = self.__class__.year_month_day
        self.name            = sys.argv[1]
        self.create_edit_url = self.__class__.create_edit_url
        self.auth_session    = requests.Session()


    def auth(self):
        res = self.auth_session.post(self.__class__.auth_url, self.__class__.user_info)
        if res.status_code == 200:
            return True

    def parse_activity_args(self):
        ''' activeUrl
            name
            platform: WEB, MOBILE
        '''
        return { 'name': self.name, 'activeUrl': self.current, 'platform': 'WEB' }

    def create_activity(self): 
        if self.auth():
            res = self.auth_session.post(self.create_edit_url, self.parse_activity_args())
            print(res.text)
            print(res.status_code)
    # 生成目录
    def build(self, index):
        current = self.__class__.year_month_day + '-' + str(index+1)
        if os.path.isdir(current):
            index = index + 1
            self.build(index)
        else:
            self.current = current
            os.mkdir(current)
            self.create_activity()


Activity().build(0)
# 找出目录下包括当前年月日的文件并将其移动到新创建的文件夹




