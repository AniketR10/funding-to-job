import requests
import pandas as pd
from bs4 import BeautifulSoup
import time
import random

def get_founder_socials(yc_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        response = requests.get(yc_url, headers=headers, timeout=10)
        if response.status_code != 200:
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        
        social_links = soup.select("a[href*='linkedin.com'], a[href*='twitter.com'], a[href*='x.com']")
        
        extracted_socials = []
        for link in social_links:
            href = link.get("href")
            if href and "/company/" not in href and "ycombinator" not in href and "y-combinator" not in href:
                extracted_socials.append(href)
        
        return list(set(extracted_socials))

    except Exception as e:
        print(f"   ❌ Error scraping {yc_url}: {e}")
        return []
    

def scrape_yc():
    target = [
        "winter-2026", "summer-2026", "spring-2026", "fall-2026",
        "winter-2025", "summer-2025", "spring-2025", "fall-2025",
        
    ]

    base_url = "https://yc-oss.github.io/api/batches/{}.json"
    all_companies = []

    for batch in target:
        url = base_url.format(batch)
        print(f"fetching {batch}...", end=" ")

        try:
            res = requests.get(url)
            if res.status_code == 200:
                data = res.json()
                all_companies.extend(data)
                print(f"fetched {len(data)}.")
            else:
                print(f"⚠️  No data (Batch might not exist yet)")

        except Exception as e:
            print(f"Error: {e}")

    if not all_companies:
        print("no companies found")
        return
    df = pd.DataFrame(all_companies)

    cols_needed = ["name", "website", "all_locations", "one_liner", "launched_at", "batch", "stage", "url"]
    filter_cols = [c for c in cols_needed if c in df.columns]
    df = df[filter_cols]

    df["founder_socials"] = ""

    print(f"\n🚀 STEP 2: Scraping Founder Socials for {len(df)} companies...")
    print("   (This will take time due to rate limits. Do not close!)")

    for idx, row in df.iterrows():
        company_name = row["name"]
        company_url = row["url"]

        if not isinstance(company_url, str):
            continue

        print(f"   [{idx+1}/{len(df)}] Visiting {company_name}...", end=" ")

        socials = get_founder_socials(company_url)

        if socials:
            print(f"found {len(socials)} links.")
            df.at[idx, "founder_socials"] = ", ".join(socials)
        else:
            print(f"no socials found...")

        if idx%10 == 0:
            df.to_csv("yc-latest.csv", index=False)

        time.sleep(random.uniform(1.0,2.5))


    filename = f"yc-latest.csv"
    df.to_csv(filename, index=False)
    print(f"saved to {filename}")

if __name__ == "__main__":
    scrape_yc()


