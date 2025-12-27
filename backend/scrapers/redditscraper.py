import feedparser
import html
from datetime import timedelta, date
import time
import pandas as pd

def scrape_reddit_jobs():

    subreddits = [
        "forhire",
        "WebDeveloperJobs"
    ]

    keywords = ["[hiring]", "hiring", "looking for developers", "job opening", "looking"]
    today = date.today()
    yesterday = today - timedelta(days=1)
    jobs = []
    print(f"🚀 scanning reddit for jobs")

    for sub in subreddits:
        rss = f"https://www.reddit.com/r/{sub}/new/.rss"
        print(f"scanning r/{sub}...", end= "")

        feed = feedparser.parse(rss, agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

        count = 0

        for entry in feed.entries:

            if hasattr(entry, 'published_parsed'):
                p = entry.published_parsed
                post_date = date(p.tm_year, p.tm_mon, p.tm_mday)
            else:
                continue

            if post_date == today or post_date == yesterday:

             clean_title = html.unescape(entry.title)

            if any(k.lower() in clean_title.lower() for k in keywords):
                
                if "[for hire]" in clean_title.lower():
                    continue

                jobs.append({
                    "subreddit": sub,
                    "title": clean_title,
                    "link": entry.link,
                    "published": str(post_date)
                })
                count += 1
            
        print(f"found {count} jobs...")
        time.sleep(1.0)

        if jobs:
            df = pd.DataFrame(jobs)
            filename = "reddit_jobs.csv"
            df.to_csv(filename, index=False)
            print(f"\n✨ Total found: {len(jobs)}")
            print(f"💾 Saved to {filename}")
        else:
            print("\n⚠️ No matching jobs found right now.")

if __name__ == "__main__":
    scrape_reddit_jobs()
                