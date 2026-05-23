# Available Hacks

## Auto-Answer Hack

Automatically selects answers based on pre-configured mappings.

### Usage

1. Open the browser console (F12) while on a Blooket game
2. Load the hack script
3. Configure answer mappings
4. Enable the hack

### Example

```javascript
// Set answer mappings
BlooketAutoAnswer.setAnswer("What is 2+2?", 2); // Answer 3 (index 2)
BlooketAutoAnswer.setAnswer("What is the capital of France?", 0); // Answer 1 (index 0)

// Enable the hack
BlooketAutoAnswer.enable();

// Disable when done
BlooketAutoAnswer.disable();
```

### Important Notes

- Answer indices are 0-based (0-3 for four options)
- Question matching is case-insensitive
- Use responsibly and in accordance with Blooket's terms of service
- This is for educational purposes only

---

## Utility Functions

Available helper functions in `hacks/utils.js`:

- `log(message, prefix)` - Log with custom prefix
- `delay(ms)` - Delay execution
- `getElement(selector, maxRetries)` - Get element with retry logic
- `clickElement(element, offsetX, offsetY)` - Click element with offset

---

## Contributing

To add a new hack:

1. Create a new file in the `hacks/` directory
2. Use the utility functions provided
3. Add documentation to this file
4. Export your hack for browser console use

---

## Disclaimer

These hacks are provided for educational purposes. Users are responsible for ensuring their use complies with Blooket's terms of service and all applicable laws and regulations.
