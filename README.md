## Cách Sử Dụng
### Không fork repo về, tạo một branch riêng cú pháp TheAIage_Tên ví dụ TheAIage_Phúc, rồi làm xong gì thì cứ commit lên cái branch của mình
Chạy phía Server trước
```
cd Server
```
Tạo môi trường ảo
```
python -m venv .venv
```
Kích hoạt môi trường ảo
- Trên Windows
```.\.venv\Scripts\activate```
- Trên MacOS/Linux
```source .venv/bin/activate```

Cài đặt các thư viện cần thiết
```
pip install -r requirement.txt
python .\App.py
```
Chạy phía Client sau
```
npm install
npm run dev
```