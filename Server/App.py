from flask import Flask, session as _Session, jsonify as _JSonify, request as _Request, Blueprint
from flask_session import Session
from flask_cors import CORS

from pymongo import MongoClient
from Database import UserModel

import os as OS
from functools import wraps


#
#   Core Function
#
App = Flask(__name__)
App.secret_key = OS.urandom(24)


#
#   Session Database Connection
#
Mongo_Client = MongoClient("mongodb+srv://namnhat828_db_user:4LLinINT0@firstcluster.ei2ujfu.mongodb.net/")
App.config["SESSION_TYPE"] = "mongodb"
App.config["SESSION_MONGODB"] = Mongo_Client
App.config["SESSION_MONGODB_DB"] = "Authentication"
App.config["SESSION_MONGODB_COLLECT"] = "Sessions"
App.config["SESSION_PERMANENT"] = True

# Cookie configuration for cross-origin requests
App.config["SESSION_COOKIE_SAMESITE"] = "None"
App.config["SESSION_COOKIE_SECURE"] = True
App.config["SESSION_COOKIE_HTTPONLY"] = True

Session(App)


#
#   CORS Intialization
#
# Khởi tạo CORS hiểu đơn giản cái này là một giao thức bảo mật
AllowedOriginList = [
    "http://localhost:5173", # Dev Origin
    "https://theaiage.vercel.app" # Production Origin
]

@App.before_request
def HandleOptions():
    if _Request.method == "OPTIONS":
        Origin = _Request.headers.get("Origin")
        if Origin and Origin in AllowedOriginList:
            Response = _JSonify({})
            Response.headers["Access-Control-Allow-Origin"] = Origin
            Response.headers["Access-Control-Allow-Credentials"] = "true"
            Response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            Response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
            Response.headers["Access-Control-Max-Age"] = "3600"
            return Response

CORS(App, 
     supports_credentials=True, 
     origins=AllowedOriginList,
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Content-Type"],
     max_age=3600)

@App.after_request
def AfterRequest(Response):
    Origin = _Request.headers.get("Origin")
    if Origin and Origin in AllowedOriginList:
        Response.headers["Access-Control-Allow-Origin"] = Origin
        Response.headers["Access-Control-Allow-Credentials"] = "true"
        Response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        Response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        Response.headers["Access-Control-Max-Age"] = "3600"
        
        # Ensure session cookie has correct attributes for cross-origin
        # Flask-Session sets the cookie, but we need to ensure it has SameSite=None
        if 'Set-Cookie' in Response.headers:
            cookie_header = Response.headers.get('Set-Cookie', '')
            # Check if this is a session cookie
            if 'session=' in cookie_header.lower() or 'sessionid=' in cookie_header.lower():
                # Remove existing SameSite if present and add correct one
                cookie_parts = cookie_header.split(';')
                new_parts = []
                has_samesite = False
                has_secure = False
                
                for part in cookie_parts:
                    part = part.strip()
                    if part.lower().startswith('samesite='):
                        # Replace with None
                        new_parts.append('SameSite=None')
                        has_samesite = True
                    elif part.lower() == 'secure':
                        new_parts.append('Secure')
                        has_secure = True
                    else:
                        new_parts.append(part)
                
                # Add if missing
                if not has_samesite:
                    new_parts.append('SameSite=None')
                if not has_secure:
                    new_parts.append('Secure')
                
                Response.headers['Set-Cookie'] = '; '.join(new_parts)
    
    return Response

#
#   Authentication
#
# Middleware dùng để xác thực tức là bắt buộc phải đăng nhập rồi mới được gọi API này
def AuthenticationRequired(FunctionPtr):
    @wraps(FunctionPtr)
    def AuthenticationFunction(*args, **kwargs):
        if "UserID" not in _Session:
            return _JSonify({"Message": "Not Authenticated"}), 401
        return FunctionPtr(*args, **kwargs)
    return AuthenticationFunction

# Middleware dùng để xác thực tức là bắt buộc phải chưa đăng nhập rồi mới được gọi API này
def UnauthenticationRequired(FunctionPtr):
    @wraps(FunctionPtr)
    # Kiểm tra nếu User đã có trong Sessions chưa
    # 1. Đã có trong Sessions trả về thông báo đã Login
    # 2. Chưa có trong Sessions tiếp tục các bước Login
    def UnauthenticationFunction(*args, **kwargs):
        if "UserID" in _Session:
            return _JSonify({"Message": "Already Logged In"}), 401
        return FunctionPtr(*args, **kwargs)
    return UnauthenticationFunction

@App.get("/")
def Home():
    return _JSonify({"Message": "TheAIage Server is Running"}), 200

@App.post("/auth/register")
@UnauthenticationRequired
#   POST Body Template
#   Email: Str
#   PlainPassword: Str
def AuthRegister():
    __Data = _Request.get_json()
    __Email = __Data.get("Email")
    __PlainPassword = __Data.get("PlainPassword")

    if UserModel.objects(Email=__Email).first():
        return _JSonify({"error": "Email Already Exists"}), 401
    
    NewUser = UserModel.CreateUser(__Email, __PlainPassword)
    NewUser.save()

    return _JSonify({
        "Message": "Registered",
        "UserID": str(NewUser.UserID),
        "Email": __Email,
        "Role": "Student"
    }), 200

@App.post("/auth/login")
@UnauthenticationRequired
#   POST Body Template
#   Email: Str
#   PlainPassword: Str
def AuthLogin():
    __Data = _Request.get_json()
    __Email = __Data.get("Email")
    __PlainPassword = __Data.get("PlainPassword")

    # lấy User tương ứng với Email đang Login
    LoginUser = UserModel.objects(Email=__Email).first()
    # Nếu không tồn tại User trong Database thì gửi về Message không tồn tại tài khoản
    if not LoginUser:
        return _JSonify({"Message": "Recipient Does Not Exist"}), 401
    # So sánh mật khẩu nếu không trùng khớp thì trả về lỗi sai mật khẩu
    if not LoginUser.CheckUserPassword(__PlainPassword):
        return _JSonify({"Message": "Wrong  Password"}), 401
    
    # Nếu tát cả điều kiện trên thỏa mãn thì đăng nhập thành công, lưu phiên đăng nhập vào Database
    _Session["UserID"] = str(LoginUser.UserID)
    _Session["Email"] = __Email
    _Session["Role"] = LoginUser.Role
    _Session.permanent = True

    return _JSonify({
        "Message": "Logged In",
        "UserID": str(LoginUser.UserID),
        "Email": __Email,
        "Role": LoginUser.Role
    }), 200

@App.post("/auth/logout")
@AuthenticationRequired
def AuthLogout():
    _Session.clear()
    return _JSonify({
        "Message": "Logged Out",
    }), 200

@App.get("/auth/me")
@AuthenticationRequired
def AuthMe():
    return _JSonify({
        "UserID": _Session["UserID"],
        "Email": _Session["Email"],
        "Role": _Session["Role"]
    }), 200

if __name__ == "__main__":
    _Port = int(OS.environ.get("PORT", 5000))
    App.run(host="0.0.0.0", debug=False, port=_Port)
