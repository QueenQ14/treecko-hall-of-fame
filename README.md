# ![](favicon.png) Treecko Hall of Fame Website

## What is this project about?

I started out this project as part of my Backend Development Course on [Boot.dev](https://boot.dev). It was my first personal project and the project was scoped to be completed in 20-40 hours.
The website's functionalities are as follows:
* It is able to read a CSV file with particular column names(for the case of my project the table looks like this):



| Title    | Species  | Nickname | OT       | TID      | Game     | Shiny    | Caught   |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
|the Living Legend | Sceptile | Sorrow | QueenQ | 20577 | Generation 3 | Yes | Jan 21, 2026 |

* `app.js` parses this table and builds multiple divs which make up a card component. Accordingly, `styles.css` contains all the styling details for each mini component. Full disclosure that I used AI to create a CSS based off screenshots I provided from UI that I liked.
* Finally, a helper method that renders these out as fanned out cards, and if there are more than 3 cards, it'll convert them into a carousel that just keeps track of the current index of the list of cards and moves it every X seconds.

## Prerequisites

There are no pre-requisites as such for this project. It does require a CSV input and for my case this was done by recording inputs from users on a Google Form, saves it on a Google Sheet, on which I have an additional column called **Approved?** which is a checkbox which are explicitly allowed for all. This is so that I can uncheck any entries that might be spam or malicious. 
Using that I have created a new sheet called **Public** and I have added the following query on Cell A1:
```
=QUERY('Form Responses 1'!A:J, "select B, C, D, E, F, G, H, I where J = TRUE label B 'Title', C 'Species', D 'Nickname', E 'OT', F 'TID', G 'Game', H 'Shiny', I 'Caught' format I 'mmm d, yyyy'", 1)
```

This filters out only the approved rows from the first sheet. This Public sheet is then `File > Share > Publish to Web` and chosen as `.csv`. This provides us the URL that can be used with our `app.js`.


