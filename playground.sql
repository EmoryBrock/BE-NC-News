\c nc_news_test

SELECT * FROM articles;
SELECT * FROM topics;
SELECT * FROM comments;
SELECT * FROM users;

SELECT 
articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
, COUNT(comments.article_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
WHERE articles.topic = 'cats'
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;

