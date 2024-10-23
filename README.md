# Dynasty Fantasy Basketball

## Overview
This project is a web application for dynasty fantasy basketball enthusiasts. It is heavily based on the KeepTradeCut dynasty football website. It provides player rankings, a trade calculator, and a Keep/Trade/Cut game to help managers make informed decisions about their teams. The rankings are fully crowdsourced and managed through the website.

## Features
- Player Rankings: Up-to-date crowdsourced rankings of NBA players for dynasty leagues
- Trade Calculator: Evaluate potential trades based on player values
- Keep/Trade/Cut Game: Interactive game to contribute to player rankings
- Add Players: Ability to add new players to the database

## Technology Stack
- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MongoDB
- API: RESTful API for player data and rankings

## Project Structure
- client
     - public
        - index.html
        - json
     - node_modules
     - src
        - api js scripts
        - components/styles and pages
        - app.js - react based
     - package.json 
- server
     - node_modules
     - src
        - controllers, models, routes (for each page)
        - venv
        - app.js - express.js based
        - nba_players.csv & nba_players.json & csv_to_json.py (csv from internet -> json used for mongodb)
        - server.js - express.js based again
     - package.json
- src
     - constants
     - types
     - helpers
     - index.js
     - sharedModule.js
- .gitIgnore
- package.json
- README   

## Getting Started
1. Clone the repository
2. Install dependencies (node.js based so use `npm`):
   ```
   npm install
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up your MongoDB database
4. Create a `.env` file in the server directory with your configuration
5. Start the development servers (client & server in 2 separate terminals):
   ```
   npm run dev
   ```
   
## TODO
- Implement Keep/Trade/Cut game
     - Figure out formula for continuously updating value (try and not have to rewrite entire json file)
- Make home page nice
     - Add an about section
- Improve CSS and JS animations (maybe) -> make it look like an actual website
- Look at more features once the above three are done (maybe league analyzer via sleeper API)

## Contributing
(Add contribution guidelines here)

## License
(Add license information here)
