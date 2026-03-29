import csv
import random
from datetime import datetime, timedelta

names = ["Rahul","Aman","Priya","Sneha","Arjun","Neha","Karan","Riya","Vikram","Anjali","Siddharth","Pooja","Aditya","Shreya","Rohit","Ananya","Kavya","Amit","Sanya","Raghav","Aniket","Isha","Saurabh","Divya","Manish","Nisha","Ashish","Kriti","Rishi","Shivani","Aakash","Maya","Yash","Pallavi","Satyam","Anushka","Raghavendra","Sonal","Vivek","Aarav","Anjali","Karan","Riya","Vikram","Aniket","Isha","Saurabh","Divya","Manish","Nisha","Ashish","Kriti","Rishi","Shivani","Aakash","Maya","Yash","Pallavi","Satyam","Anushka","Raghavendra","Sonal","Vivek","Aarav"]
branches = ["CSE","IT","ECE","ME","CE","EE","AE","BT","CHE","CSEAI","CSE AIML","CSE DS","EEE","ELCE"]
subjects = ["DBMS","OS","Maths","CN","DSA","AI","ML","DL","WEBT","DAA","CD","OS","UHV"]

rows = []

for i in range(5000):
    row = [
        i+1,
        random.choice(names),
        random.choice(branches),
        random.randint(1,8),
        random.choice(subjects),
        random.randint(20,100),
        random.randint(60,100),
        (datetime.now() - timedelta(days=random.randint(0,100))).strftime("%Y-%m-%d")
    ]
    rows.append(row)

with open("students.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["student_id","name","branch","semester","subject","marks","attendance","exam_date"])
    writer.writerows(rows)

print("CSV generated!")