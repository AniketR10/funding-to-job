import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_latest_funding_table():
    base_url = "https://startuptalky.com/tag/indian-startup-funding/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    print(f" Connecting to Main Feed: {base_url}...")
    try:
        response = requests.get(base_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")

        latest_card = soup.find("article", class_="gh-card")
        if not latest_card:
            print("no articles found.")
            return

        link_tag = latest_card.find("a", class_="gh-card-link")
        if not link_tag:
            print("no link found")
            return
            
        article_url = f"https://startuptalky.com{link_tag['href']}"
        print(f" found latest article: {article_url}")

    except Exception as e:
        print(f"error: {e}")
        return

    print(f"\n Fetching Table Data from article...")
    try:
        article_response = requests.get(article_url, headers=headers, timeout=10)
        article_soup = BeautifulSoup(article_response.text, "html.parser")

        table_div = article_soup.find("div", class_="gh-table")
        
        if table_div:
            target_table = table_div.find("table")
        else:
            target_table = article_soup.find("table")

        if not target_table:
            print(" No table found in this article.")
            return

        rows = target_table.find_all("tr")
        table_data = []

        for row in rows:
            cols = row.find_all(["td", "th"])
            cols = [ele.get_text(strip=True) for ele in cols]
            
            if cols:
                table_data.append(cols)

        if table_data:
            
            headers = table_data[0]
            data_rows = table_data[1:] 
            
            df = pd.DataFrame(data_rows, columns=headers)
            
            print(f"successfully extracted {len(data_rows)} startups:")
            
            filename = "startuptalky_latest_funding.csv"
            df.to_csv(filename, index=False)
            print(f"\nsaved to {filename}")
        else:
            print(" table found but it was empty.")

    except Exception as e:
        print(f"error: {e}")

if __name__ == "__main__":
    scrape_latest_funding_table()