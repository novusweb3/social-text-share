# Social Text Share
# Author: Adrian Birsan
# License: MIT
# Version: 1.0.0
# Description: A cool and customizable text selection sharing widget for React applications.
# Repository: https://github.com/novusweb3/social-text-share.git


GIF Here


## Features

- ✨ Beautiful floating UI
- 🎨 Fully customizable theme
- 📱 Responsive design
- ⚡️ Smooth animations
- 🎯 TypeScript support
- 🔧 Custom icons support
- 📢 Event callbacks
- 🌙 Dark mode ready

## Installation

```bash
npm install social-text-share
```

## Usage

```jsx
import { SocialTextShare } from 'social-text-share'
function App() {
return (
<div>
<SocialTextShare
theme={{
background: '#252525',
text: '#ffffff',
border: '#374151',
hoverBg: 'rgba(255, 255, 255, 0.1)'
}}
onShare={(text, platform) => {
console.log(Shared "${text}" on ${platform})
}}
/>
<p>Select any text on this page to see the social share widget!</p>
</div>
)
}
```

### Theme Options

```typescript
interface Theme {
background?: string // Background color of the widget
text?: string // Text color
border?: string // Border color
hoverBg?: string // Hover background color for buttons
}
```

### Custom Icons

```typescript
interface CustomIcons {
copy?: React.ReactNode // Custom copy icon
twitter?: React.ReactNode // Custom twitter icon
share?: React.ReactNode // Custom share icon
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| className | string | Additional CSS classes |
| customIcons | object | Custom icons for copy, twitter, and share buttons |
| theme | object | Custom theme colors |
| onCopy | function | Callback when text is copied |
| onShare | function | Callback when text is shared |
