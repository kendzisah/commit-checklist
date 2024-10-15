// src/ui/webviewContent.ts

import * as vscode from 'vscode';
import { ChecklistGroup } from '../models/checklistModels';

export function getWebviewContent(
  webview: vscode.Webview,
  context: vscode.ExtensionContext,
  checklistData: ChecklistGroup[]
): string {
  const checklistDataStr = JSON.stringify(checklistData).replace(/</g, '\\u003c');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Commit Checklist</title>
    <style>
      body { font-family: sans-serif; padding: 10px; }
      h1 { font-size: 1.5em; }
      h2 { font-size: 1.2em; }
      ul { list-style-type: none; padding-left: 20px; }
      li { margin-bottom: 5px; }
      .group-container { margin-bottom: 20px; }
      .items-container { margin-left: 20px; display: block; }
      .disabled-radio { color: gray; }
    </style>
  </head>
  <body>
    <h1>Commit Checklist</h1>
    <form id="checklistForm">
      <div id="checklistContainer"></div>
      <button type="submit">Submit</button>
    </form>

    <script>
      const vscode = acquireVsCodeApi();
      const checklistData = ${checklistDataStr};

      function createChecklist() {
        const container = document.getElementById('checklistContainer');

        checklistData.forEach((group, groupIndex) => {
          const groupContainer = document.createElement('div');
          groupContainer.className = 'group-container';
          groupContainer.id = 'group-' + groupIndex;

          // Group Title
          const groupTitle = document.createElement('h2');
          groupTitle.textContent = group.title;
          groupContainer.appendChild(groupTitle);

          // Pre-Question (True/False Input)
          const preQuestionDiv = document.createElement('div');
          preQuestionDiv.className = 'pre-question';

          const preQuestionLabel = document.createElement('span');
          preQuestionLabel.textContent = group.preQuestion || 'Is this section applicable?';

          preQuestionDiv.appendChild(preQuestionLabel);
          preQuestionDiv.appendChild(document.createTextNode(' '));

          if (group.required) {
            // Required group: Lock the answer to "Yes"
            groupTitle.textContent += ' *'
            const yesInput = document.createElement('input');
            yesInput.type = 'radio';
            yesInput.name = 'preQuestion-' + groupIndex;
            yesInput.value = 'yes';
            yesInput.id = 'preQuestion-' + groupIndex + '-yes';
            yesInput.checked = true;
            yesInput.disabled = true; // Disable the input

            const yesLabel = document.createElement('label');
            yesLabel.htmlFor = yesInput.id;
            yesLabel.textContent = 'Yes';
            yesLabel.className = 'disabled-radio';

            const requiredNote = document.createElement('p');
            requiredNote.textContent = 'This section is required.';
            requiredNote.style.color = 'red';
            groupContainer.appendChild(requiredNote);

            preQuestionDiv.appendChild(yesInput);
            preQuestionDiv.appendChild(yesLabel);
          } else {
            // Optional group: Allow selection between "Yes" and "No"
            const yesInput = document.createElement('input');
            yesInput.type = 'radio';
            yesInput.name = 'preQuestion-' + groupIndex;
            yesInput.value = 'yes';
            yesInput.id = 'preQuestion-' + groupIndex + '-yes';
            yesInput.checked = true;

            const yesLabel = document.createElement('label');
            yesLabel.htmlFor = yesInput.id;
            yesLabel.textContent = 'Yes';

            const noInput = document.createElement('input');
            noInput.type = 'radio';
            noInput.name = 'preQuestion-' + groupIndex;
            noInput.value = 'no';
            noInput.id = 'preQuestion-' + groupIndex + '-no';

            const noLabel = document.createElement('label');
            noLabel.htmlFor = noInput.id;
            noLabel.textContent = 'No';

            preQuestionDiv.appendChild(yesInput);
            preQuestionDiv.appendChild(yesLabel);
            preQuestionDiv.appendChild(document.createTextNode(' '));
            preQuestionDiv.appendChild(noInput);
            preQuestionDiv.appendChild(noLabel);

            // Event Listener for Optional Groups
            yesInput.addEventListener('change', () => toggleGroupItems(groupIndex, true));
            noInput.addEventListener('change', () => toggleGroupItems(groupIndex, false));
          }

          groupContainer.appendChild(preQuestionDiv);

          // Items Container
          const itemContainer = document.createElement('div');
          itemContainer.className = 'items-container';
          itemContainer.id = 'items-container-' + groupIndex;
          itemContainer.style.display = 'block'; // Show by default

          const itemList = document.createElement('ul');

          group.items.forEach((groupItem, itemIndex) => {
            const itemId = \`group\${groupIndex}_item\${itemIndex}\`;
            const itemLi = document.createElement('li');

            const itemCheckbox = document.createElement('input');
            itemCheckbox.type = 'checkbox';
            itemCheckbox.id = itemId;
            itemCheckbox.name = itemId;
            if (group.required) {
              itemCheckbox.required = true;
            }

            const itemLabel = document.createElement('label');
            itemLabel.htmlFor = itemId;
            itemLabel.textContent = groupItem.question;

            itemLi.appendChild(itemCheckbox);
            itemLi.appendChild(itemLabel);

            // Sub-items
            if (groupItem.subItems && groupItem.subItems.length > 0) {
              const subItemList = document.createElement('ul');
              groupItem.subItems.forEach((subItem, subItemIndex) => {
                const subItemId = \`\${itemId}_subItem\${subItemIndex}\`;
                const subItemLi = document.createElement('li');

                const subItemCheckbox = document.createElement('input');
                subItemCheckbox.type = 'checkbox';
                subItemCheckbox.id = subItemId;
                subItemCheckbox.name = subItemId;
                if (group.required) {
                  subItemCheckbox.required = true;
                }

                const subItemLabel = document.createElement('label');
                subItemLabel.htmlFor = subItemId;
                subItemLabel.textContent = subItem.question;

                subItemLi.appendChild(subItemCheckbox);
                subItemLi.appendChild(subItemLabel);
                subItemList.appendChild(subItemLi);
              });
              itemLi.appendChild(subItemList);
            }

            itemList.appendChild(itemLi);
          });

          itemContainer.appendChild(itemList);
          groupContainer.appendChild(itemContainer);
          container.appendChild(groupContainer);

          // For required groups, items are always displayed
          if (!group.required) {
            // Initially hide items for optional groups if "No" is selected
            itemContainer.style.display = 'block'; // Show by default
          }
        });
      }

      function toggleGroupItems(groupIndex, show) {
        const itemContainer = document.getElementById('items-container-' + groupIndex);
        if (show) {
          itemContainer.style.display = 'block';
        } else {
          itemContainer.style.display = 'none';
          // Uncheck all checkboxes within this group
          const inputs = itemContainer.querySelectorAll('input[type="checkbox"]');
          inputs.forEach(input => {
            input.checked = false;
          });
        }
      }

      createChecklist();

  const form = document.getElementById('checklistForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    let incompleteGroups = [];

    checklistData.forEach((group, groupIndex) => {
      const isRequired = group.required;
      const preQuestionElement = document.querySelector(\`input[name="preQuestion-\${groupIndex}"]:checked\`);
      const showGroup = isRequired || (preQuestionElement && preQuestionElement.value === 'yes');

      if (showGroup) {
        const itemContainer = document.getElementById(\`items-container-\${groupIndex}\`);
        const checkboxes = itemContainer.querySelectorAll('input[type="checkbox"]');
        const groupValid = Array.from(checkboxes).every(checkbox => checkbox.checked);

        if (!groupValid) {
          allValid = false;
          incompleteGroups.push(group.title);
        }
      }
    });

    if (allValid) {
      vscode.postMessage({ command: 'submit', allChecked: true });
    } else {
      const message = \`Please complete all checklist items in the following groups: \${incompleteGroups.join(', ')}\`;
      vscode.postMessage({ command: 'showError', message: message });
    }
  });

  // Add this function to update checkbox required attribute
  function updateCheckboxRequiredStatus(groupIndex, isRequired) {
    const itemContainer = document.getElementById(\`items-container-\${groupIndex}\`);
    const checkboxes = itemContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.required = isRequired;
    });
  }

  // Update event listeners for pre-question radios
  checklistData.forEach((group, groupIndex) => {
    if (!group.required) {
      const yesInput = document.getElementById(\`preQuestion-\${groupIndex}-yes\`);
      const noInput = document.getElementById(\`preQuestion-\${groupIndex}-no\`);

      yesInput.addEventListener('change', () => {
        toggleGroupItems(groupIndex, true);
        updateCheckboxRequiredStatus(groupIndex, true);
      });
      noInput.addEventListener('change', () => {
        toggleGroupItems(groupIndex, false);
        updateCheckboxRequiredStatus(groupIndex, false);
      });
    }
  });
</script>
  </body>
  </html>
  `;
}
