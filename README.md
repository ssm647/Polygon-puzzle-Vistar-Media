## SOLUTION: 

I have implemented a simple idea which is as follow: 

1) Take a given point (which the user enters) and draw a line to the extreme right, hence forming a long line 
2) Now take one state at a time, and check if the line (1) crosses how many edges of the states? if the answer is odd then the point is inside or else if even then it is outside 
3) We can do (2) by taking each edge (two vertices) at a time and see if the line (1) cross it or not
4) We will repeat (3) for each vertex of the state
5) We will see if the result is odd then the point is inside or if even then outside 


## INSTALLATION: 

1) Download the Polygon-puzzle-Vistar-Media.zip file from here
2) Install Node.js
3) In the terminal go to the Folder 'Vistar-Media-Puzzle'
4) Write 'npm install'
5) Write 'node puzzle'
6) Once the server is up and running, open the HTML file - index.html (to browser) from the same folder
7) Now the application is up and running - you can interact with the server from front end file
