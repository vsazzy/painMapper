# Pain Mapper

## Tech and Dev Tools

- Built with (React Native)[https://reactnative.dev/]

### Recommended VS Code Extensions

- (React Native Tools by Microsoft)[https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native]
  - Allows for debugging

## Quick Start

- Install the (https://docs.expo.io/)[Expo] CLI `npm install --global expo-cli`
- Download the (Expo Go)[https://expo.io/tools#client] Client for your device of choice
- Clone the repo
- `yarn dev`
- Scan the QR code with your device
- Shake to reload or inspect

## Contributing Code

### Branches

Feature branches should branch off of `main` and when complete provide a Pull Request back into `main` ONLY when stable.

### Merging

Ideally, the `Rebase and Merge` feature is used and all commits follow the commit style.
However, when there are many small fixes on a branch, use the `Squash and Merge` feature instead.
In this case the final, singular, commit should follow the commit style. It often helps to follow this style along the way however.

### Commit Style/Format

https://www.conventionalcommits.org/en/v1.0.0/#summary

Examples: `docs`, `tools`, `refactor`, `feat`, `fix`

(TODO: Add full list of suggested scopes once those are determined)

### Code Style

Formatted with [Prettier](https://prettier.io/) using ESlint rules (defined in the config files)

## Debugging in VS Code

- Open the project in VS Code from the mobile folder
- install the extension "React Native Tools"
- Open up the settings in VS Code and in the top right there should be a button to open settings.json
- Add the line `"react-native.packager.port": 19000`
  - If this port doesn't work for you it can also be 19001. It should say in your terminal after starting the app with the line `exp://10.0.0.82:19000`
- run the app how you usually do
- in VS Code go to the tab with the bug on it and choose "Run and Debug".
- shake the phone to get to the expo settings and choose "Start Remote Debugging" / "Debug Remote JS".
  - this step must be done after VS Code connects
