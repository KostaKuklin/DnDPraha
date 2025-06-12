# Images Folder

This folder contains all images used in the D&D Campaign Manager website.

## Recommended Image Organization

### NPC Images
- **File naming**: `npc-[name].jpg` or `npc-[name].png`
- **Recommended size**: 400x300px or larger
- **Format**: JPG for photos, PNG for illustrations with transparency
- **Examples**: `npc-eldrin.jpg`, `npc-captain-thorne.png`

### Character Portraits
- **File naming**: `portrait-[character-name].jpg` or `portrait-[character-name].png`
- **Recommended size**: 200x200px (square for circular display)
- **Format**: JPG for photos, PNG for illustrations
- **Examples**: `portrait-thorin.jpg`, `portrait-lyra.png`

### Background Images
- **File naming**: `bg-[description].jpg`
- **Recommended size**: 1920x1080px or larger
- **Format**: JPG for better compression
- **Examples**: `bg-fantasy-landscape.jpg`, `bg-dungeon.jpg`

### Icons and UI Elements
- **File naming**: `icon-[description].png`
- **Recommended size**: 64x64px or 128x128px
- **Format**: PNG for transparency support
- **Examples**: `icon-sword.png`, `icon-spell.png`

## Usage in Code

To use images in your HTML/CSS:

```html
<!-- In HTML -->
<img src="images/npc-eldrin.jpg" alt="Eldrin the Wise">

<!-- In CSS -->
background-image: url('images/bg-fantasy-landscape.jpg');
```

## Image Optimization Tips

1. **Compress images** before uploading to reduce file size
2. **Use appropriate formats**: JPG for photos, PNG for graphics with transparency
3. **Consider responsive images** with different sizes for mobile/desktop
4. **Keep file sizes under 500KB** for better loading performance

## Current Image References

The website currently uses placeholder images from Unsplash. You can replace these with your own images by:

1. Adding your images to this folder
2. Updating the image paths in `script.js` for NPCs and party members
3. Updating any background images in `styles.css` 