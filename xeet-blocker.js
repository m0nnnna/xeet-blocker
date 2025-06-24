// ==UserScript==
// @name         X Timeline Account Marker
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Manually mark X accounts with countries or super block them, with export/import and blocked editor
// @author       You
// @match        https://x.com/home
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Flag emoji mappings for top 50 countries (prioritizing 1st world/developed nations)
    const countryFlags = {
        "United States": "🇺🇸",
        "Canada": "🇨🇦",
        "United Kingdom": "🇬🇧",
        "Germany": "🇩🇪",
        "France": "🇫🇷",
        "Japan": "🇯🇵",
        "Australia": "🇦🇺",
        "Switzerland": "🇨🇭",
        "Netherlands": "🇳🇱",
        "Sweden": "🇸🇪",
        "Norway": "🇳🇴",
        "Denmark": "🇩🇰",
        "Finland": "🇫🇮",
        "Austria": "🇦🇹",
        "Belgium": "🇧🇪",
        "Ireland": "🇮🇪",
        "Singapore": "🇸🇬",
        "New Zealand": "🇳🇿",
        "Italy": "🇮🇹",
        "Spain": "🇪🇸",
        "South Korea": "🇰🇷",
        "Israel": "🇮🇱",
        "Luxembourg": "🇱🇺",
        "Iceland": "🇮🇸",
        "Portugal": "🇵🇹",
        "Greece": "🇬🇷",
        "Czech Republic": "🇨🇿",
        "Poland": "🇵🇱",
        "Hungary": "🇭🇺",
        "Slovakia": "🇸🇰",
        "Slovenia": "🇸🇮",
        "Estonia": "🇪🇪",
        "Latvia": "🇱🇻",
        "Lithuania": "🇱🇹",
        "Malta": "🇲🇹",
        "Cyprus": "🇨🇾",
        "United Arab Emirates": "🇦🇪",
        "Qatar": "🇶🇦",
        "Saudi Arabia": "🇸🇦",
        "China": "🇨🇳",
        "India": "🇮🇳",
        "Russia": "🇷🇺",
        "Brazil": "🇧🇷",
        "Mexico": "🇲🇽",
        "Argentina": "🇦🇷",
        "South Africa": "🇿🇦",
        "Turkey": "🇹🇷",
        "Thailand": "🇹🇭",
        "Malaysia": "🇲🇾"
    };

    // Load or initialize user data from localStorage
    let userData = JSON.parse(localStorage.getItem('userData')) || {};

    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data saved:', userData); // Debug log
    }

    // Enhance timeline posts
    function enhanceTimeline() {
        console.log('Refreshing timeline'); // Debug log
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        tweets.forEach(tweet => {
            const usernameElement = tweet.querySelector('a[href*="/"] span');
            if (usernameElement) {
                const username = usernameElement.textContent.replace('@', '');

                // Handle super block
                if (userData[username]?.superBlock) {
                    tweet.remove();
                    return;
                }

                // Add or update flag
                const location = userData[username]?.location || "";
                const flag = countryFlags[location];
                if (flag) {
                    if (!tweet.querySelector(`span.flag-${username}`)) {
                        const flagSpan = document.createElement('span');
                        flagSpan.className = `flag-${username}`;
                        flagSpan.style.cssText = 'display: block; margin-top: 5px; font-size: 24px;';
                        flagSpan.textContent = flag;
                        const contentArea = tweet.querySelector('div[lang]') || tweet;
                        contentArea.appendChild(flagSpan);
                    }
                } else if (tweet.querySelector(`span.flag-${username}`)) {
                    tweet.querySelector(`span.flag-${username}`).remove();
                }
            }
        });
    }

    // Show context menu for marking
    function showMarkMenu(event) {
        const usernameElement = event.target.closest('article[data-testid="tweet"]')?.querySelector('a[href*="/"] span');
        if (!usernameElement) return;

        const username = usernameElement.textContent.replace('@', '');
        event.preventDefault();

        const menu = document.createElement('div');
        menu.style.cssText = `
            position: absolute;
            background: #1a1a1a;
            border: 1px solid #333;
            padding: 8px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        menu.style.left = `${event.pageX}px`;
        menu.style.top = `${event.pageY}px`;

        // Add country options
        Object.keys(countryFlags).forEach(country => {
            const option = document.createElement('div');
            option.textContent = `Mark as ${country} (${countryFlags[country]})`;
            option.style.padding = '4px 10px';
            option.style.cursor = 'pointer';
            option.addEventListener('mouseover', () => option.style.background = '#2a2a2a');
            option.addEventListener('mouseout', () => option.style.background = '');
            option.addEventListener('click', () => {
                userData[username] = { location: country };
                delete userData[username]?.superBlock;
                saveUserData();
                enhanceTimeline();
                menu.remove();
            });
            menu.appendChild(option);
        });

        // Add super block option
        const blockOption = document.createElement('div');
        blockOption.textContent = 'Super Block (Remove from View)';
        blockOption.style.padding = '4px 10px';
        blockOption.style.cursor = 'pointer';
        blockOption.style.color = '#ff4444';
        blockOption.addEventListener('mouseover', () => blockOption.style.background = '#2a2a2a');
        blockOption.addEventListener('mouseout', () => blockOption.style.background = '');
        blockOption.addEventListener('click', () => {
            userData[username] = { superBlock: true };
            delete userData[username]?.location;
            saveUserData();
            enhanceTimeline();
            menu.remove();
        });
        menu.appendChild(blockOption);

        document.body.appendChild(menu);

        // Close menu on click outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        document.addEventListener('click', closeMenu);
    }

    // Export user data
    function exportUserData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "user_data.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        dropdown.style.display = 'none'; // Hide dropdown after action
    }

    // Import user data (merge with existing data)
    function importUserData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const importedData = JSON.parse(e.target.result);
                // Merge imported data with existing userData
                Object.keys(importedData).forEach(username => {
                    userData[username] = importedData[username];
                });
                saveUserData();
                enhanceTimeline();
            };
            reader.readAsText(file);
            event.target.value = ''; // Reset input
        }
        dropdown.style.display = 'none'; // Hide dropdown after action
    }

    // Show blocked accounts editor overlay
    function showBlockedAccountsEditor() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Create editor container
        const editor = document.createElement('div');
        editor.style.cssText = `
            background: #1a1a1a;
            border: 1px solid #333;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 14px;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // Get blocked usernames
        const blocked = Object.entries(userData)
            .filter(([_, data]) => data.superBlock)
            .map(([username]) => `@${username}`)
            .join('\n');

        // Create text area
        const textArea = document.createElement('textarea');
        textArea.value = blocked || 'No accounts are currently blocked.';
        textArea.style.cssText = `
            width: 100%;
            height: 200px;
            padding: 10px;
            background: #2a2a2a;
            color: #fff;
            border: 1px solid #333;
            border-radius: 4px;
            margin-bottom: 10px;
            box-sizing: border-box;
            resize: vertical;
        `;

        // Create save button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = `
            padding: 5px 15px;
            background: #4caf50;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        saveBtn.addEventListener('click', () => {
            console.log('Save button clicked'); // Debug log
            const lines = textArea.value.split('\n')
                .map(line => line.trim().replace('@', ''))
                .filter(username => username);
            console.log('Parsed lines:', lines); // Debug log
            const newUserData = {};
            lines.forEach(username => {
                if (username) newUserData[username] = { superBlock: true };
            });
            console.log('New userData to merge:', newUserData); // Debug log
            // Preserve existing non-superBlock data and update superBlock entries
            const originalUserData = { ...userData };
            userData = { ...originalUserData }; // Create a fresh copy
            Object.keys(newUserData).forEach(username => {
                userData[username] = newUserData[username];
            });
            // Remove superBlock entries that are no longer in the list
            Object.keys(originalUserData).forEach(username => {
                if (originalUserData[username].superBlock && !lines.includes(username)) {
                    delete userData[username].superBlock;
                    if (Object.keys(userData[username]).length === 0) delete userData[username];
                }
            });
            saveUserData();
            enhanceTimeline(); // Refresh timeline after saving
            console.log('User data after save:', userData); // Debug log

            // Show save confirmation and close after delay
            const message = document.createElement('div');
            message.textContent = 'Changes saved!';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #4caf50;
                color: #fff;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 3000;
                font-family: Arial, sans-serif;
                font-size: 16px;
            `;
            document.body.appendChild(message);
            setTimeout(() => {
                message.remove();
                overlay.remove(); // Close overlay after message
            }, 2000); // Display message for 2 seconds
        });

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            padding: 5px 15px;
            background: #ff4444;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        `;
        closeBtn.addEventListener('click', () => overlay.remove());

        // Add elements to editor
        editor.appendChild(textArea);
        editor.appendChild(saveBtn);
        editor.appendChild(closeBtn);
        overlay.appendChild(editor);
        document.body.appendChild(overlay);
    }

    // Add collapsible controls
    function addControls() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '⚙️ Settings';
        toggleBtn.style.cssText = `
            padding: 5px 10px;
            background: #1a1a1a;
            color: #fff;
            border: 1px solid #333;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;
        toggleBtn.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        const dropdown = document.createElement('div');
        dropdown.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: #1a1a1a;
            border: 1px solid #333;
            padding: 8px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            margin-top: 5px;
        `;

        const exportBtn = document.createElement('div');
        exportBtn.textContent = 'Export Marks';
        exportBtn.style.cssText = `
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
        `;
        exportBtn.addEventListener('mouseover', () => exportBtn.style.background = '#2a2a2a');
        exportBtn.addEventListener('mouseout', () => exportBtn.style.background = '');
        exportBtn.addEventListener('click', exportUserData);

        const importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.accept = '.json';
        importInput.style.cssText = `
            padding: 5px;
            background: #1a1a1a;
            color: #fff;
            border: 1px solid #333;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 5px;
            width: 100%;
            box-sizing: border-box;
        `;
        importInput.addEventListener('change', importUserData);

        const blockedBtn = document.createElement('div');
        blockedBtn.textContent = 'Blocked Accounts';
        blockedBtn.style.cssText = `
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
            margin-top: 5px;
        `;
        blockedBtn.addEventListener('click', showBlockedAccountsEditor);
        blockedBtn.addEventListener('mouseover', () => blockedBtn.style.background = '#2a2a2a');
        blockedBtn.addEventListener('mouseout', () => blockedBtn.style.background = '');

        dropdown.appendChild(exportBtn);
        dropdown.appendChild(importInput);
        dropdown.appendChild(blockedBtn);
        container.appendChild(toggleBtn);
        container.appendChild(dropdown);
        document.body.appendChild(container);
    }

    // Initialize
    document.addEventListener('contextmenu', showMarkMenu);
    window.addEventListener('load', () => {
        enhanceTimeline();
        addControls();
    });

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        enhanceTimeline();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();