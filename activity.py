import requests
import datetime
import os
import sys
import argparse

# 命令行参数
parser = argparse.ArgumentParser(description="丽子平台--自动生成活动链接,图片文件夹")

#当前年月日
year_month_day = datetime.datetime.now().strftime("%Y%m%d")

parser.add_argument('name', help="需要添加的活动名称")   # 增加活动名选项
parser.add_argument('--link', help="活动链接(默认取当前日期并添加后缀区分", default=year_month_day) # 活动链接, default添加选项默认值(可选)
parser.add_argument('-p', '--platform', help="活动所对应的平台", default="WEB") # 活动平台(可选)

args = parser.parse_args()  # 参数解析

class Activity():
    user_info       = dict(j_username='chaixb@lizi.com', j_password='123456')      # 正式环境用户名密码
    create_edit_url = 'http://admin.lizi.com/activity/saveOrEdit'                  # 创建或编辑活动地址
    auth_url        = 'http://admin.lizi.com/j_spring_security_check'              # 登陆验证

    def __init__(self, name, platform, link, year_month_day):
        self.current         = year_month_day
        self.names           = names    # 同时增加多个活动
        self.platform        = platform
        self.link            = link
        self.create_edit_url = self.__class__.create_edit_url
        self.auth_session    = requests.Session()   # 新建会话


    def auth(self):
        res = self.auth_session.post(self.__class__.auth_url, self.__class__.user_info)
        if res.status_code == 200:
            return True


    def parse_activity_args(self):
        ''' activeUrl
            name
            platform: WEB, MOBILE
        '''
        return { 'name': self.name, 'activeUrl': self.current, 'platform': self.platform }


    def create(self):
        if self.auth():
            res = self.auth_session.post(self.create_edit_url, self.parse_activity_args())


    # 生成目录
    def build(self, index):
        current = self.current + '-' + str(index+1)

        if os.path.isdir(current):
            index = index + 1
            self.build(index)
        else:
            try:
                # 新建图片文件夹
                os.makedirs("E:/web/images/active/" + current, exist_ok=False)
                # self.create()
            except OSError:
                print('文件已存在!')


Activity(args.name, args.platform, args.link, year_month_day)
# 找出目录下包括当前年月日的文件并将其移动到新创建的文件夹




