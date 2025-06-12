# D&D Campaign Manager

A lightweight web application for managing your Dungeons & Dragons campaign with a beautiful, modern interface and smooth animations.

## Features

### 🏠 Landing Page
- **Next Session Countdown**: Displays the date and time of your next session with a live countdown timer
- **Animated Hero Section**: Eye-catching title with glowing effects
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 👥 NPCs Page
- **NPC Gallery**: Grid layout showing all NPCs your party has encountered
- **Detailed Information**: Click any NPC to see their full details in a modal
- **Rich Descriptions**: Each NPC includes role, location, and backstory
- **Sample Data**: Includes 4 example NPCs to get you started

### 📖 Rules Page
- **Categorized Rules**: Rules are tagged for easy filtering
- **Filter System**: Filter by movement, combat, spell, conditions, saving throws, or spellcasting
- **Quick Reference**: Essential D&D 5e rules for players
- **Smooth Animations**: Cards slide in with beautiful transitions

### 🗺️ Map Page
- **Embedded Faerun Map**: Direct integration with [LoreMaps Faerun](https://loremaps.azurewebsites.net/Maps/Faerun)
- **Full-Screen View**: Responsive iframe that adapts to screen size
- **Campaign Setting**: Perfect for Forgotten Realms campaigns

### ⚔️ Party Page
- **Character Cards**: Visual representation of each party member
- **Detailed Profiles**: Click to see spells, abilities, and magical items
- **Player Information**: Track both player and character names
- **Level Tracking**: Current character levels displayed prominently

## Customization Guide

### Setting Your Next Session
Edit the `script.js` file and update line 35:
```javascript
const nextSession = new Date('2024-01-15T19:00:00'); // Update this with your actual session time
```

### Adding NPCs
In `script.js`, find the `npcsData` array and add new NPCs:
```javascript
{
    id: 5,
    name: "Your NPC Name",
    description: "Description of the NPC",
    image: "URL to NPC image",
    role: "NPC Role",
    location: "Where they can be found"
}
```

### Adding Party Members
In `script.js`, find the `partyData` array and add new characters:
```javascript
{
    id: 5,
    playerName: "Player Name",
    characterName: "Character Name",
    class: "Character Class",
    level: 5,
    portrait: "URL to character portrait",
    spells: ["Spell 1", "Spell 2", "Spell 3"],
    magicalItems: ["Item 1", "Item 2", "Item 3"]
}
```

### Adding Rules
In `script.js`, find the `rulesData` array and add new rules:
```javascript
{
    title: "Rule Title",
    content: "Rule description and details",
    tags: ["tag1", "tag2"] // Use existing tags: movement, combat, spell, conditions, saving-throws, spellcasting
}
```

### Changing the Map
To use a different map, update the iframe src in `index.html`:
```html
<iframe src="YOUR_MAP_URL" width="100%" height="600" frameborder="0" title="Your Map"></iframe>
```

## Styling Customization

### Color Scheme
The app uses a dark theme with gold accents. To change colors, edit `styles.css`:
- **Primary Gold**: `#ffd700` (used for highlights and borders)
- **Background**: Dark gradient from `#1a1a2e` to `#0f3460`
- **Text**: `#e8e8e8` for main text, `#ccc` for secondary text

### Animations
All animations are CSS-based for smooth performance:
- **Fade In**: Elements appear with opacity transitions
- **Slide Up**: Cards slide up from below
- **Glow Effects**: Text and borders have subtle glow animations
- **Hover Effects**: Interactive elements respond to mouse hover

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## File Structure

```
DNDApp/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Getting Started

1. **Open the app**: Double-click `index.html` or open it in your web browser
2. **Customize the data**: Edit `script.js` to add your campaign information
3. **Update session time**: Set your next session date and time
4. **Add your content**: Replace sample data with your actual campaign details

## Tips for Best Experience

- **Images**: Use high-quality images for NPCs and character portraits
- **Session Updates**: Remember to update the session time before each game
- **Regular Updates**: Keep NPC and party information current
- **Mobile Use**: The app works great on tablets and phones for in-game reference

## Technical Notes

- **No Dependencies**: Pure HTML, CSS, and JavaScript - no frameworks required
- **Lightweight**: Fast loading and smooth performance
- **Offline Capable**: Works without internet (except for the map)
- **Responsive**: Adapts to any screen size automatically

Enjoy your D&D campaign! 🎲⚔️🐉 