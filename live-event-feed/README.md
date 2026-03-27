1. Which real-time approach did you choose and why? What are the trade-offs you considered?
   I choose webSocket, this is most effective way to make this applciation.
   My trade-off option, maybe i can make a request to every 5 second to update the chat in frontend, or also i can read whether having a update in mancache on the server, when the mancache is updated, the backend will query the database

2. The priority-based eviction logic — how would this change if we needed to persist events to a database?
    First, remove the delete logic in the function. 
    Then, push the over 50 messages to json file. Set the cronjob sync to database.

3. If this needed to handle 10,000 connected clients, what would break first and what would you change?
    As I mentioned, the json file will increase the server storage. So, i think the disk space full first? ( Need base on the server spec). And try to move all the "ready to backup messages" to other storage host (maybe AWS S3 service)

4. What did you intentionally leave out that you would add for production?
    Actually too much to answer. I think first is the validation logic in the controller. 
    - validate input data, user exist.
    - layout