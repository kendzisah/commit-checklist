# Commit Checklist Extension for Visual Studio Code

## Overview

The Commit Checklist extension for Visual Studio Code helps developers maintain production-ready code by enforcing a customizable checklist that must be reviewed during each commit. This ensures that best practices are consistently followed, reducing the number of revisions and potential bugs introduced into the codebase.

## Features

- **Customizable Checklists**: Define global or project-specific checklists tailored to your team's needs.
- **Pre-Commit Verification**: Review and complete the checklist before committing changes.
- **User-Friendly Interface**: An intuitive webview within VS Code for easy interaction.
- **Integration with Git**: Seamlessly integrates with Git commands to enhance your existing workflow.
- **Status Bar Access**: Quick access to the checklist via Key binds or Command Palette in VS Code.

## Installation

### From Visual Studio Marketplace

1. Open Visual Studio Code.
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on macOS).
3. Search for "Commit Checklist".
4. Click Install on the extension named "Commit Checklist" by [Your Publisher Name].
5. Reload VS Code if prompted.

## Usage

### Accessing the Commit Checklist

- **Via Key Bind**: Ctrl + Shift + C to open the commit checklist and commit changes 
- **Via Command Palette**: 
  1. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).
  2. Type "Commit with Checklist" and select the command.

### Completing the Checklist

1. Open the Checklist.
2. Answer pre-questions for each section.
3. Complete all checklist items in applicable sections.
4. Click "Submit" when finished.

### Committing Changes

- Use the "Commit" button in the extension (if available).
- Or use VS Code's built-in Git features after completing the checklist.

## Configuration

### Setting Up a Global Checklist

1. Open the Command Palette.
2. Run "Set Global Commit Checklist" command.
3. Provide the path to your JSON checklist file.

### Project-Specific Checklist

Create a `commit-checklist.json` file in your project root.

### Checklist JSON Format

```json
[
  {
    "title": "Section Title",
    "preQuestion": "Is this section applicable?",
    "required": false,
    "items": [
      {
        "question": "First item to check",
        "subItems": [
          {
            "question": "Sub-item to check"
          }
        ]
      },
      {
        "question": "Second item to check"
      }
    ]
  }
]
```

## Extension Settings

- `commitChecklist.jsonFilePath`: Path to the global commit checklist JSON file.

## Keybindings

- Commit with Checklist: `Ctrl+Shift+C` (Cmd+Shift+C on macOS)

## Development

### Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/kendzisah/commit-checklist.git
   ```
2. Install dependencies:
   ```
   cd commit-checklist
   npm install
   ```
3. Open in VS Code:
   ```
   code .
   ```
4. Press F5 to start the Extension Development Host.

### Building the Extension

1. Compile TypeScript:
   ```
   npm run compile
   ```
2. Package the extension:
   ```
   vsce package
   ```

## License

MIT

## Contributing

Contributions are welcome! To contribute:

1. Fork the Repository on GitHub.

2. Create a New Branch for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make Your Changes and Commit:

   ```bash
   git commit -m "Description of your changes"
   ```

4. Push to Your Fork:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Submit a Pull Request on GitHub.

## Support

If you need assistance or have questions about using the extension, you can: 
- Open an issue on GitHub.
- Contact Me: dzisahken10@gmail.com