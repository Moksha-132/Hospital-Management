import os, smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
load_dotenv()
print('USER:', os.getenv('EMAIL_USER'))
msg = MIMEText('Test body')
msg['Subject']='Test'
msg['From']=f"Medicare Team <{os.getenv('EMAIL_USER')}>"
msg['To']='lmoksha.132@gmail.com'
s = smtplib.SMTP('smtp.gmail.com', 587)
s.starttls()
s.login(os.getenv('EMAIL_USER'), os.getenv('EMAIL_PASS'))
s.send_message(msg)
print('SUCCESS!')
