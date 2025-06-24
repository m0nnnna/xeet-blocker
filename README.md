# xeet-blocker

A Tampermonkey userscript that allows you to manually mark X (Twitter) accounts with country flags or super block them, with export/import functionality and a blocked accounts editor.
Description
This script enhances your X timeline by letting you:
Mark accounts with flags from 50 top countries (e.g.,  for USA,  for Japan).

Super block accounts to remove their tweets from view.

Export and import your settings as a JSON file.

Edit blocked accounts via an in-overlay text editor with save confirmation.

Features
Context menu to mark accounts with country flags or block them.

Persistent storage of marks and blocks via localStorage.

Export/import functionality for sharing settings.

Overlay editor to manage blocked accounts with a "Changes saved!" confirmation.

Real-time timeline updates via MutationObserver.

Installation
Install Tampermonkey:
Install the Tampermonkey extension for your browser (available for Chrome, Firefox, Edge, etc.) from tampermonkey.net.

Add the Script:
Click the Tampermonkey icon in your browser, select "Create a new script," and replace the default content with the script code from this repository (e.g., copy from script.js).

Save the script (File > Save).

Enable the Script:
Visit https://x.com/home, and the script should activate automatically.

Usage
Marking Accounts:
Right-click a tweet, select a country (e.g., "Mark as United States ()"), and a flag will appear below the tweet.

Super Blocking:
Right-click a tweet, choose "Super Block (Remove from View)," and the tweet (and future tweets from that user) will be removed.

Export Settings:
Click " Settings" > "Export Marks" to download user_data.json.

Import Settings:
Click " Settings" > use the file input to upload a user_data.json file.

Manage Blocked Accounts:
Click " Settings" > "Blocked Accounts" to open an editor overlay.

Edit the list (one username per line, e.g., @username), click "Save" (shows "Changes saved!" for 2 seconds), or "Close" to exit.

Supported Countries
The script supports flagging with emojis for the following 50 countries:
United States, Canada, United Kingdom, Germany, France, Japan, Australia, Switzerland, Netherlands, Sweden, Norway, Denmark, Finland, Austria, Belgium, Ireland, Singapore, New Zealand, Italy, Spain, South Korea, Israel, Luxembourg, Iceland, Portugal, Greece, Czech Republic, Poland, Hungary, Slovakia, Slovenia, Estonia, Latvia, Lithuania, Malta, Cyprus, United Arab Emirates, Qatar, Saudi Arabia, China, India, Russia, Brazil, Mexico, Argentina, South Africa, Turkey, Thailand, Malaysia.

Country flag emojis are standard Unicode representations.

License
This project is open-source. Feel free to use, modify, and distribute it under the MIT License.
Contributing
Suggestions or improvements? Open an issue or submit a pull request on GitHub!