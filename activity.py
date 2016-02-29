import requests
import datetime
import os
# from requests.auth import AuthBase

# class LiziAdminAuth(AuthBase):
#     def __init__(self, username, password):
#         self.username = username
#         self.password = password

#     def __call__(self, r):
#         r.headers['j_username'] = self.username
#         r.headers['j_password'] = self.password
#         return r

# 登录账号
user_info = dict(j_username='chaixb@lizi.com', j_password='123456')
# req = requests.post('http://admin.lizi.com/j_spring_security_check', user_info)

# 获取当前年月日
year_month_day = datetime.datetime.now().strftime("%Y%m%d")

# 生成目录
def build(index):
    current = year_month_day + '-' + str(index+1)
    if os.path.isdir(current):
        index = index + 1
        build(index)
    else:
        os.mkdir(current)

# 找出目录下包括当前年月日的文件并将其移动到新创建的文件夹




