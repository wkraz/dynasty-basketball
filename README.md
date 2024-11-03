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
5. Start the development servers (in 2 separate terminals, start in root directory for both):
   ```
   cd server
   node src/server.js
   ```
   ```
   cd client
   npm start
   ```

## Contributing
Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

### Contributing Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting
- Keep pull requests focused on a single feature or fix

### Bug Reports
If you find a bug, please create an issue with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Your environment details (browser, OS, etc.)

## License
This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Will Krzastek

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```