// ЛОГИКА РАСШИРЕНИЯ

// Функция для получения всех ачивок
async function getAllAchievements() {
  const all = [];
  achievements = window.achievements;
  for (const key in achievements) {
      all.push({
        ...achievements[key],
      });
  }
  return all;
}

// Создание контейнера для ачивок
function ensureContainer() {
    container = document.getElementById('achivement-container')
    if (!container) {
        const container = document.createElement('div');

        container.id = 'achivement-container';
        container.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            color: black;
            padding: 8px 12px;
            font-family: monospace;
            font-size: 15px;
            z-index: 999999;
            max-width: 600px;
            word-break: break-all;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        
        document.body.appendChild(container);

        console.log('RUNET: achivement list created')
    }
}

// Показ ачивки
function showAchivement(achivement_data) {
    ensureContainer();
    const container = document.getElementById('achivement-container')
    const achivement = document.createElement('div');
        
    achivement.id = 'achivement';
    achivement.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 12px 16px;
        border: 1px solid #e5e5e5;
        margin-bottom: 8px;
        max-width: 300px;
    `;
    
    achivement.innerHTML = `
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">
            ${achivement_data.icon} ${achivement_data.title}
        </div>
        <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
            ${achivement_data.description}
        </div>
        <div style="color: #888; font-size: 13px;">
            Очки: ${achivement_data.points}
        </div>
    `;
    
    container.appendChild(achivement);

    console.log('RUNET: showed achievement: ' + achivement_data.title);
}

// Начисление ачивок
async function checkAchivements() {
    console.log('RUNET: requsting achivements')
    const achievements = await getAllAchievements();
    console.log('RUNET: achivements got')
    const { ach_: already_done = [] } = await chrome.storage.local.get('ach_');
    console.log(already_done)

    const url = window.location.href;

    for (const achievement of achievements) {
        if (achievement.condition(new URL(url)) && !already_done.includes(achievement.title)) {
            console.log('RUNET: showing achievement: ' + achievement.title);
            already_done.push(achievement.title);
            await chrome.storage.local.set({ ach_: already_done });
            showAchivement(achievement);
        }
    }
}

// Обновление при старте, ждем пока появится атрибут window.achievements
setTimeout(() => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAchivements);
    } else {
        checkAchivements();
    }
}, 100);

// Обновление при смене адреса
let lastUrl = window.location.href;
new MutationObserver(() => {
  if (lastUrl !== window.location.href) {
    lastUrl = window.location.href;
    checkAchivements();
  }
}).observe(document, { subtree: true, childList: true });


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getAchievements") {
        getAllAchievements().then(achievements => {
            sendResponse({ achievements: achievements });
        });
        return true;
    }
});

async function getAllAchievements() {
    const all = [];
    if (window.achievements) {
        for (const key in window.achievements) {
            all.push({
                ...window.achievements[key],
            });
        }
    }
    return all;
}