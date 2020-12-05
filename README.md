## Description
A non-blocking stream processing service that consumes the output of the given generator, which is an infinite stream of lines of event data encoded in JSON, and exposes stats about the stream in an HTTP interface
## Installation & Usage  
This project uses **node** and **npm**. Please install them if you do not have them locally installed.  
Navigate to the project directory and run `npm i && node server.js`.  
Then visit [localhost:3000](http://localhost:3000).  
## Endpoints
### GET /types
	Count of events encountered in the event_type field of the events
### GET /words
	Count of words encountered in the data field of the events
### GET /lastminutetypes
	Count of events encountered in the event_type field of the events in the last 60 seconds
### GET /lastminutewords
	Count of words encountered in the data field of the events in the last 60 seconds
## Important notes
* On a Unix OS, run `chmod x+ <filename>`. For example: `chmod x+ ./generator-macosx-amd64`.  
* On Mac OS, you need to allow running files from **AppStore and identified developers**.  
    * Then when you try and run the program from your terminal, you will get a prompt to allow the execution.  
    * Then the **Security & Privacy** window will pop up.  
    * Then you can allow the specific executable to run.
