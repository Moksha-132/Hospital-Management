import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import os

logger = logging.getLogger(__name__)

def send_prescription_notification(email: str, appointment_id: int, patient_name: str, doctor_name: str, pdf_path: str = None):
    SMTP_SERVER = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("EMAIL_PORT", 587))
    SMTP_USERNAME = os.getenv("EMAIL_USER", "")
    SMTP_PASSWORD = os.getenv("EMAIL_PASS", "")
    
    subject = "New Prescription Added - Medicare App"
    body = f"Dear {patient_name},\n\nA new prescription has been added to your appointment #{appointment_id} by Dr. {doctor_name}.\n\nPlease log in to your Medicare dashboard to view it and order any required medicines.\n\nWarm regards,\nThe Medicare Team"
    
    # Always log to console for development visibility
    logger.warning("--- EMAIL NOTIFICATION TRIGGERED ---")
    logger.warning(f"To: {email}\nSubject: {subject}\nMessage:\n{body}")
    logger.warning("------------------------------------")
    
    # If credentials exist, send the actual email
    if SMTP_USERNAME and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg["Subject"] = subject
            msg["From"] = f"Medicare Team <{SMTP_USERNAME}>"
            msg["To"] = email
            msg.attach(MIMEText(body))
            
            if pdf_path and os.path.exists(pdf_path):
                with open(pdf_path, "rb") as f:
                    attach = MIMEApplication(f.read(), _subtype="pdf")
                    attach.add_header('Content-Disposition', 'attachment', filename=f"Prescription_Apt_{appointment_id}.pdf")
                    msg.attach(attach)
            
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
            logger.info(f"Actual email sent successfully to {email}")
        except Exception as e:
            logger.error(f"Failed to send real email: {e}")
    else:
        logger.info("Real email skipped: SMTP credentials not configured in .env file.")

def send_patient_report_notification(doctor_email: str, appointment_id: int, report_url: str, patient_name: str, doctor_name: str):
    SMTP_SERVER = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("EMAIL_PORT", 587))
    SMTP_USERNAME = os.getenv("EMAIL_USER", "")
    SMTP_PASSWORD = os.getenv("EMAIL_PASS", "")
    
    subject = f"Patient Uploaded a Report for Appointment #{appointment_id} - Medicare"
    body = f"Dear Dr. {doctor_name},\n\nYour patient, {patient_name}, has uploaded a new medical report for their upcoming appointment #{appointment_id}.\n\nYou can view the report securely here:\n{report_url}\n\nPlease review it prior to the consultation.\n\nWarm regards,\nThe Medicare Team"
    
    logger.warning("--- EMAIL NOTIFICATION TRIGGERED ---")
    logger.warning(f"To: {doctor_email}\nSubject: {subject}\nMessage:\n{body}")
    logger.warning("------------------------------------")
    
    if SMTP_USERNAME and SMTP_PASSWORD:
        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = f"Medicare Team <{SMTP_USERNAME}>"
            msg["To"] = doctor_email
            
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
            logger.info(f"Actual email sent successfully to {doctor_email}")
        except Exception as e:
            logger.error(f"Failed to send real email: {e}")
    else:
        logger.info("Real email skipped: SMTP credentials not configured in .env file.")

def send_call_started_email(patient_email: str, patient_name: str, doctor_name: str, meeting_link: str):
    SMTP_SERVER = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("EMAIL_PORT", 587))
    SMTP_USERNAME = os.getenv("EMAIL_USER", "")
    SMTP_PASSWORD = os.getenv("EMAIL_PASS", "")
    
    subject = f"Your Doctor is Ready! Join Your Consultation Now - Medicare"
    body = f"Dear {patient_name},\n\nThis is an automated notification from the Medicare App.\n\nDr. {doctor_name} has just started your scheduled video consultation and is currently waiting for you in the virtual room.\n\nPlease click the secure link below to join your doctor immediately:\n{meeting_link}\n\nIf you experience any technical difficulties, please log in to your dashboard to message your doctor directly.\n\nWarm regards,\nThe Medicare Team"
    
    logger.warning("--- EMAIL NOTIFICATION TRIGGERED ---")
    logger.warning(f"To: {patient_email}\nSubject: {subject}\nMessage:\n{body}")
    logger.warning("------------------------------------")
    
    if SMTP_USERNAME and SMTP_PASSWORD:
        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = f"Medicare Team <{SMTP_USERNAME}>"
            msg["To"] = patient_email
            
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
            logger.info(f"Actual email sent successfully to {patient_email}")
        except Exception as e:
            logger.error(f"Failed to send real email: {e}")
    else:
        logger.info("Real email skipped: SMTP credentials not configured in .env file.")

def send_message_notification(to_email: str, recipient_name: str, sender_name: str, is_doctor_sender: bool):
    SMTP_SERVER = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("EMAIL_PORT", 587))
    SMTP_USERNAME = os.getenv("EMAIL_USER", "")
    SMTP_PASSWORD = os.getenv("EMAIL_PASS", "")
    
    sender_title = f"Dr. {sender_name}" if is_doctor_sender else sender_name
    recipient_title = recipient_name if is_doctor_sender else f"Dr. {recipient_name}"
    
    subject = f"New Message from {sender_title} - Medicare"
    body = f"Dear {recipient_title},\n\nYou have received a new secure message from {sender_title} regarding your appointment.\n\nPlease log in to your Medicare dashboard to view and reply to the message.\n\nWarm regards,\nThe Medicare Team"
    
    logger.warning("--- EMAIL NOTIFICATION TRIGGERED ---")
    logger.warning(f"To: {to_email}\nSubject: {subject}\nMessage:\n{body}")
    logger.warning("------------------------------------")
    
    if SMTP_USERNAME and SMTP_PASSWORD:
        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = f"Medicare Team <{SMTP_USERNAME}>"
            msg["To"] = to_email
            
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
            logger.info(f"Actual email sent successfully to {to_email}")
        except Exception as e:
            logger.error(f"Failed to send real email: {e}")
    else:
        logger.info("Real email skipped: SMTP credentials not configured in .env file.")

def send_password_reset_otp_email(to_email: str, user_name: str, otp: str):
    SMTP_SERVER = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("EMAIL_PORT", 587))
    SMTP_USERNAME = os.getenv("EMAIL_USER", "")
    SMTP_PASSWORD = os.getenv("EMAIL_PASS", "")
    
    subject = "Password Reset Verification Code - Medicare"
    body = f"Dear {user_name},\n\nWe received a request to reset the password for your Medicare account.\n\nYour 6-digit verification code is: {otp}\n\nThis code will expire in 15 minutes. If you did not request a password reset, please ignore this email.\n\nWarm regards,\nThe Medicare Team"
    
    logger.warning("--- EMAIL NOTIFICATION TRIGGERED ---")
    logger.warning(f"To: {to_email}\nSubject: {subject}\nMessage:\n{body}")
    logger.warning("------------------------------------")
    
    if SMTP_USERNAME and SMTP_PASSWORD:
        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = f"Medicare Team <{SMTP_USERNAME}>"
            msg["To"] = to_email
            
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
            logger.info(f"Actual email sent successfully to {to_email}")
        except Exception as e:
            logger.error(f"Failed to send real email: {e}")
    else:
        logger.info("Real email skipped: SMTP credentials not configured in .env file.")
