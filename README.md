##Trello Scrum Voting API

###Description
Used in Scrum planning, this Chrome extension allows a user to monitor and display effort point votes. 
A typical scenario: one person with the extension is connected to a projector and team members cast their votes from laptops or smart phones.

###Setup
The person who will tally the votes is the only one who needs to install the extension. Follow these steps to get started:

- Download the Trello Scrum Voting API project.
- Modify scripts/key.js to include your Trello developer key - get yours at [https://trello.com/app-key](https://trello.com/app-key).
- Optional - modify the `MONITORING_DURATION` variable in scripts/main.js. The default setting is 5000 ms (5 seconds).
- In Chrome, browse to [chrome://extensions/](chrome://extensions/), enable Developer mode (checkbox in upper right corner), click the 'Load unpacked extension' button and select the folder where you saved the Trello Scrum Voting API extension.
- Create a list called "Voting". If you use a different list name, update the variable `VOTING_LIST_NAME` in scripts/main.js to contain the same list name.
- Create a card in the Voting list for each member of your team. Name the card after the team member and assign them to the card.

###Usage
- Once the board with the Voting list loads, click the list's menu icon (the circle/down arrow in the upper right corner). The voting popup opens and displays a series of avatars and question marks, indicating that it's waiting for all team members to enter a vote.
- Team members open their card on the Voting list (either using a computer or the Trello app) and change the card's description to their current effort point vote. As team members update their votes, the voting popup will show a checkmark next to their avatar. **NOTE:** To re-use the same number on a subsequent vote, type a period after the number (or delete the period) in order for Trello to view the card as changed.
- Once all votes are in, click the Show Votes button to reveal all votes. Monitoring stops until the Clear button is click.
- Click the Clear button to reset all cards to '?' and await further votes.

###Can I use this commercially?
Yes. Please review the [LICENSE](LICENSE.md).

###References
Bruno Škvorc projects:

- [Custom Events and Ajax Friendly Page-ready Checks](http://www.sitepoint.com/custom-events-ajax-friendly-page-ready-checks/) - uses [TrelloUI](https://github.com/Swader/TrelloUI)
- How To Build a Trello Chrome Extension – API Authentication - [Part 1](http://www.sitepoint.com/build-trello-chrome-extension-api-authentication/), [Part 2](http://www.sitepoint.com/build-trello-chrome-extension-exporting-lists/) - uses [TrelloHelper] (https://github.com/Swader/TrelloHelper)