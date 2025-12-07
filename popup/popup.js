async function getAllAchievements() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]) {
                resolve([]);
                return;
            }
            
            chrome.tabs.sendMessage(tabs[0].id, { action: "getAchievements" }, (response) => {
                if (chrome.runtime.lastError) {
                    chrome.storage.local.get(['allAchievementsCache'], (result) => {
                        if (result.allAchievementsCache) {
                            resolve(result.allAchievementsCache);
                        } else {
                            resolve([]);
                        }
                    });
                } else {
                    if (response && response.achievements) {
                        chrome.storage.local.set({ allAchievementsCache: response.achievements });
                        resolve(response.achievements);
                    } else {
                        resolve([]);
                    }
                }
            });
        });
    });
}

async function getCompletedAchievements() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['ach_'], (result) => {
            resolve(result.ach_ || []);
        });
    });
}

function updateStats(achievements, completed) {
    let totalScore = 0;
    const completedTitles = completed.map(ach => typeof ach === 'object' ? ach.title : ach);
    
    achievements.forEach(achievement => {
        if (completedTitles.includes(achievement.title)) {
            totalScore += achievement.points || 0;
        }
    });
    
    document.getElementById('total-score').textContent = totalScore;
    document.getElementById('completed-count').textContent = completedTitles.length;
    document.getElementById('total-count').textContent = achievements.length;
}

function renderAchievements(achievements, completed, filter = 'all', searchQuery = '') {
    const listElement = document.getElementById('achievement-list');
    const emptyCompleted = document.getElementById('empty-completed');
    const emptyUncompleted = document.getElementById('empty-uncompleted');

    listElement.innerHTML = '';
    listElement.classList.add('hidden');
    emptyCompleted.classList.add('hidden');
    emptyUncompleted.classList.add('hidden');

    const completedTitles = completed.map(ach => typeof ach === 'object' ? ach.title : ach);
    
    let filteredAchievements = achievements.filter(achievement => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const title = achievement.title.toLowerCase();
            const description = achievement.description.toLowerCase();
            if (!title.includes(query) && !description.includes(query)) {
                return false;
            }
        }
        if (filter === 'completed') {
            return completedTitles.includes(achievement.title);
        } else if (filter === 'uncompleted') {
            return !completedTitles.includes(achievement.title);
        }
        
        return true;
    });
    
    filteredAchievements.sort((a, b) => {
        const aCompleted = completedTitles.includes(a.title);
        const bCompleted = completedTitles.includes(b.title);
        
        if (aCompleted && !bCompleted) return -1;
        if (!aCompleted && bCompleted) return 1;
        
        return (b.points || 0) - (a.points || 0);
    });
    
    if (filter === 'completed' && filteredAchievements.length === 0) {
        emptyCompleted.classList.remove('hidden');
        return;
    }
    
    if (filter === 'uncompleted' && filteredAchievements.length === 0) {
        emptyUncompleted.classList.remove('hidden');
        return;
    }
    
    filteredAchievements.forEach(achievement => {
        const isCompleted = completedTitles.includes(achievement.title);
        
        const item = document.createElement('div');
        item.className = 'achievement-item';
        
        item.innerHTML = `
            <div class="achievement-header">
                <div class="achievement-icon">${achievement.icon || '🏆'}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-status ${isCompleted ? 'status-completed' : 'status-uncompleted'}">
                    ${isCompleted ? 'Получено' : 'Не получено'}
                </div>
            </div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-points">Очки: ${achievement.points || 0}</div>
        `;
        
        listElement.appendChild(item);
    });
    
    listElement.classList.remove('hidden');
}


async function initPopup() {
    const loadingElement = document.getElementById('loading');

    loadingElement.classList.remove('hidden');
    
    try {

        const [allAchievements, completedAchievements] = await Promise.all([
            getAllAchievements(),
            getCompletedAchievements()
        ]);
        
        updateStats(allAchievements, completedAchievements);
        

        renderAchievements(allAchievements, completedAchievements);

        loadingElement.classList.add('hidden');

        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.tab;
                const searchQuery = document.getElementById('search').value;
                renderAchievements(allAchievements, completedAchievements, filter, searchQuery);
            });
        });
        document.getElementById('search').addEventListener('input', (e) => {
            const filter = document.querySelector('.tab.active').dataset.tab;
            renderAchievements(allAchievements, completedAchievements, filter, e.target.value);
        });
        
    } catch (error) {
        console.error('Error loading achievements:', error);
        loadingElement.innerHTML = 'Ошибка загрузки ачивок';
    }
}


document.addEventListener('DOMContentLoaded', initPopup);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        initPopup();
    }
});