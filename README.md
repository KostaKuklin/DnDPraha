# D&D Praha Campaign Manager

A static web application for managing D&D campaign information, built with HTML, CSS, and JavaScript. This application works perfectly on GitHub Pages and provides a beautiful, responsive interface for campaign management.

## Features

- **Static Website**: No server required - works directly on GitHub Pages
- **Responsive Design**: Brutalist aesthetic with modern UX principles
- **Campaign Management**: 
  - NPC tracking and details
  - Rules reference with filtering
  - Interactive campaign map
  - Party member management
  - Session countdown timer
- **Admin Features**: 
  - Login system (admin/admin, user1/userpass)
  - Edit functionality for all data (temporary in static version)
  - Add/delete capabilities

## Pages

1. **Home**: Session countdown and overview
2. **NPCs**: Character database with images and details
3. **Rules**: Searchable rules reference with tags
4. **Map**: Interactive campaign map
5. **Party**: Player character management

## Data Files

The application loads data from static JSON files:
- `npcs.json` - Non-player character data
- `rules.json` - Game rules and mechanics
- `party.json` - Player character information
- `session_info.json` - Next session date and time
- `users.json` - User authentication data

## Setup

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/KostaKuklin/DnDPraha.git
   cd DnDPraha
   ```

2. Open `index.html` in your web browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. Visit `http://localhost:8000` in your browser

### GitHub Pages Deployment

The site is automatically deployed to GitHub Pages at:
**https://kostakuklin.github.io/DnDPraha/**

## Usage

### For Players
- Browse NPCs, rules, and party information
- View the campaign map
- Check session countdown

### For Admins
- Login with `admin/admin`
- Edit session information
- Add/edit/delete NPCs, rules, and party members
- Note: Changes are temporary in the static version

## Technical Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with brutalist design principles
- **Data**: Static JSON files
- **Deployment**: GitHub Pages
- **Font**: Inter (Google Fonts)

## Customization

### Adding New NPCs
Edit `npcs.json` to add new characters:
```json
{
  "id": 5,
  "name": "New Character",
  "description": "Character description",
  "image": "image_url",
  "role": "Character role",
  "location": "Character location"
}
```

### Adding New Rules
Edit `rules.json` to add new rules:
```json
{
  "title": "New Rule",
  "content": "Rule description",
  "tags": ["tag1", "tag2"]
}
```

### Updating Session Info
Edit `session_info.json`:
```json
{
  "date": "DD.MM.YYYY",
  "time": "HH:MM"
}
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue on the GitHub repository.

---

**Note**: This is a static website version. For full CRUD functionality with persistent data storage, consider deploying the Flask backend version to a platform like Heroku or Railway. 