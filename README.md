This is the modular-contract-builder for Mesa using typescript and next.js

Mobile first design based of figma - https://www.figma.com/design/gHXeJ4kbwBSnLYZwetPN2K/Untitled?node-id=0-1&node-type=canvas

Walks musicians through process of creating a splits contract. Asks users different questions in flow and populates pdf with given answers.

Uses zustand for lightweight state management. Stores values throughout pages, accesses them in the success page, and adds them to downloadable pdf using jsPDF.


'Agent' to register works on ASCAP:

The user can select they want their song registered with ASCAP, and the 'agent' gets to work. Using playwright, the ascap website is openened and logged into with A Mesa publisher account. Playwright is prompted for a 2fa code sent to the email. Using the Gmail API, the email from donotreply@ascap.com is found and the 2fa code is extracted. Once logged in, we go to the register works page and fill out the details with the user's song info and register the work. 
