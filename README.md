# Paragraph-Processor-Word-Finder
The task is to create a backend program that can accept multiple paragraphs as a single input. Each paragraph should be stored in a table, and every word in the paragraphs should be mapped with the paragraph ID in another table. The program should then be able to return the top 10 paragraphs that contain the specific word.


#Instructions-to-use-application
1) Make sure the package.json file contains all the necessary dependencies required by the Node application. This includes the PostgreSQL client library (pg) if the application interacts with the PostgreSQL database.
2) The program may start by executing - npm start - on terminal. 
3) The server runs on PORT 4000
5) You can find the SQL text file in WordFinderDatabase folder.
6) Import this SQL text file in PostgreSQL
Steps to import in SQL:
Open pgAdmin and connect to your PostgreSQL server.
Right-click on the "Databases" node and select "Create" > "Database..." to create a new database if needed.
Right-click on the newly created database or the existing one you want to import into.
Select "Restore..." from the context menu.
In the "Restore" dialog, specify the source file (SQL dump file) and other options as needed.
Click "Restore" to start the import process.
7) The report PDF contains the report of the project
