import praw
import csv
import time
from datetime import datetime

reddit = praw.Reddit(
    client_id="eJXXwWR-6ke7NYf216u3-w",
    client_secret="b352T-F73r5blzGtNtJK2SQVIsNm0A",
    user_agent="job-posts",
)

csv_file = "reddit_realtime_posts.csv"

subreddits = [
    "jobs",
    "forhire",
    "remotejobs",
    "startup",
    "Entrepreneur"
]

keywords = [
    "hiring",
    "internship",
    "opening",
    "remote",
    "[hiring]",
    "looking for developers", 
    "job opening", 
    "looking for"
]


with open(csv_file, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    if f.tell() == 0:
        writer.writerow(["timestamp", "subreddit", "title", "url"])

subreddit = reddit.subreddit("+".join(subreddits))

print("Reddit stream started... waiting for new posts")


for submission in subreddit.stream.submissions(
    skip_existing=True,
    pause_after=-1
):
    if submission is None:
        continue

    title = submission.title.lower()

    if not any(k in title for k in keywords):
        continue

    timestamp = datetime.fromtimestamp(
        submission.created_utc
    ).isoformat()

    with open(csv_file, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            timestamp,
            submission.subreddit.display_name,
            submission.title.replace("\n", " ").strip(),
            submission.url
        ])

    print(f"[{submission.subreddit}] {submission.title}")


