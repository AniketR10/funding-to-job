import csv
import os
import datetime

MASTER_CSV_FILE = "all_scraped_data.csv"

def init_master_csv():

    if not os.path.exists(MASTER_CSV_FILE):
        with open(MASTER_CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Source', 'Date', 'Title', 'Link', 'Scraped_At'])
        print(f" Created new master file: {MASTER_CSV_FILE}")

def save_common_data(source_name, articles):
    init_master_csv()
    
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with open(MASTER_CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        
        count = 0
        for article in articles:
            row = [
                source_name,
                article.get('date', 'N/A'),
                article.get('title', 'N/A'),
                article.get('link', 'N/A'),
                timestamp
            ]
            writer.writerow(row)
            count += 1
            
    print(f" Saved {count} rows to {MASTER_CSV_FILE} (Source: {source_name})")