import smtplib 
  
s = smtplib.SMTP('smtp.gmail.com', 587) 
  
s.starttls() 
   
s.login("assessments.pes@gmail.com", "assess123") 
  
message = "Heyy lava here"
  
s.sendmail("assessments.pes@gmail.com", "lavanya.ramkumar99@gmail.com", message) 
  
s.quit() 