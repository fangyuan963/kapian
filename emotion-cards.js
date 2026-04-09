// 卡牌配置
const cards = [
    {
        name: "1麻木",
        image: "cards/1.png.png",
        keywords: ["隔绝", "疏离"],
        meaning: "感受被关闭，对外界失去连接"
    },
    {
        name: "2紧绷",
        image: "cards/2.png.png",
        keywords: ["内耗", "压抑"],
        meaning: "内在持续用力，无法放松"
    },
    {
        name: "3怀疑",
        image: "cards/3.png.png",
        keywords: ["动摇", "迷茫"],
        meaning: "对自我或选择产生动摇"
    },
    {
        name: "4渴望",
        image: "cards/4.png.png",
        keywords: ["匮乏", "期许"],
        meaning: "有未被满足的深层需求"
    },
    {
        name: "5淹没",
        image: "cards/5.png.png",
        keywords: ["过载", "困顿"],
        meaning: "情绪过载，难以承载"
    },
    {
        name: "6断联",
        image: "cards/6.png.png",
        keywords: ["疏离", "失联"],
        meaning: "与自我/他人失去连接"
    },
    {
        name: "7看见",
        image: "cards/7.png.png",
        keywords: ["觉察", "清醒"],
        meaning: "开始观察，而不是卷入"
    },
    {
        name: "8允许",
        image: "cards/8.png.png",
        keywords: ["接纳", "顺从"],
        meaning: "停止对抗情绪"
    },
    {
        name: "9顺从",
        image: "cards/9.png.png",
        keywords: ["舒缓", "和解"],
        meaning: "内在开始放松"
    },
    {
        name: "10重构",
        image: "cards/10.png.png",
        keywords: ["重塑", "转念"],
        meaning: "重新理解这段经历"
    },
    {
        name: "11回归",
        image: "cards/11.png.png",
        keywords: ["自守", "归心"],
        meaning: "回到自身中心"
    },
    {
        name: "12选择",
        image: "cards/12.png.png",
        keywords: ["主动", "掌控"],
        meaning: "意识到自己有主动权"
    },
    {
        name: "13释放",
        image: "cards/13.png.png",
        keywords: ["宣泄", "排解"],
        meaning: "让情绪流动出去"
    },
    {
        name: "14暂停",
        image: "cards/14.png.png",
        keywords: ["缓行", "止念"],
        meaning: "不再自动反应"
    },
    {
        name: "15边界",
        image: "cards/15.png.png",
        keywords: ["守护", "设防"],
        meaning: "保护自己的能量"
    },
    {
        name: "16连接",
        image: "cards/16.png.png",
        keywords: ["联结", "相依"],
        meaning: "主动建立支持"
    },
    {
        name: "17行动",
        image: "cards/17.png.png",
        keywords: ["笃定", "安然"],
        meaning: "做一个小改变"
    },
    {
        name: "18信任",
        image: "cards/18.png.png",
        keywords: ["关系", "沟通"],
        meaning: "接纳过程本身"
    }
];

// 全局变量
let selectedSpread = 'single';
let drawnCards = [];
let interpretationResult = '';
let shuffledCards = [];
let selectedCards = [];

// DOM元素
const questionInput = document.getElementById('questionInput');
const inputHint = document.getElementById('inputHint');
const spreadBtns = document.querySelectorAll('.spread-btn');
const shuffleBtn = document.getElementById('shuffleBtn');
const cardsContainer = document.getElementById('cardsContainer');
const framesContainer = document.getElementById('framesContainer');
const interpretBtn = document.getElementById('interpretBtn');
const interpretationContent = document.getElementById('interpretationContent');
const feedbackBtns = document.querySelectorAll('.feedback-btn');
const loading = document.getElementById('loading');
const loadingStatus = document.getElementById('loadingStatus');
const feedbackModal = document.getElementById('feedbackModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalConfirm = document.getElementById('modalConfirm');

// 初始化画框
function initFrames() {
    updateFrames();
}

// 初始化
function init() {
    // 绑定事件
    questionInput.addEventListener('input', updateInputHint);
    spreadBtns.forEach(btn => btn.addEventListener('click', selectSpread));
    shuffleBtn.addEventListener('click', shuffleCards);
    interpretBtn.addEventListener('click', generateInterpretation);
    feedbackBtns.forEach(btn => btn.addEventListener('click', submitFeedback));
    modalClose.addEventListener('click', closeModal);
    modalConfirm.addEventListener('click', closeModal);
    
    // 初始化画框
    initFrames();
}

// 更新输入字数提示
function updateInputHint() {
    const length = questionInput.value.length;
    inputHint.textContent = `${length}/100字`;
    
    if (length > 100) {
        inputHint.style.color = '#ff4757';
    } else {
        inputHint.style.color = '#999';
    }
}

// 更新画框
function updateFrames() {
    framesContainer.innerHTML = '';
    const frameCount = selectedSpread === 'single' ? 1 : 3;
    
    for (let i = 0; i < frameCount; i++) {
        const frame = document.createElement('div');
        frame.className = 'card-frame';
        frame.dataset.index = i;
        framesContainer.appendChild(frame);
    }
}

// 选择牌阵
function selectSpread(e) {
    spreadBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    selectedSpread = e.target.dataset.spread;
    
    // 更新画框
    updateFrames();
    
    // 清空之前的卡牌
    cardsContainer.innerHTML = '';
    drawnCards = [];
    selectedCards = [];
    interpretationContent.innerHTML = '<div class="placeholder"><p>选择牌阵后洗牌</p></div>';
}

// 洗牌功能
function shuffleCards() {
    // 清空之前的卡牌
    cardsContainer.innerHTML = '';
    framesContainer.innerHTML = '';
    shuffledCards = [];
    selectedCards = [];
    drawnCards = [];
    interpretationContent.innerHTML = '<div class="placeholder"><p>洗牌后选择卡牌</p></div>';
    
    // 重新生成画框
    updateFrames();
    
    // 随机洗牌
    shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    
    // 显示洗牌动画
    showShuffleAnimation();
    
    // 延迟显示整齐排列的卡牌
    setTimeout(() => {
        displayFanCards();
    }, 500);
}

// 显示洗牌动画
function showShuffleAnimation() {
    cardsContainer.innerHTML = '';
    cardsContainer.className = 'cards-fan';
    
    // 创建临时洗牌动画
    const tempCards = [...cards].slice(0, 5);
    tempCards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardElement.classList.add('fan-card');
        cardElement.style.animation = `shuffleAnimation 0.5s ease ${index * 0.1}s`;
        cardsContainer.appendChild(cardElement);
    });
}

// 显示水平整齐排列的卡牌
function displayFanCards() {
    cardsContainer.innerHTML = '';
    cardsContainer.className = 'cards-fan';
    
    const cardCount = 18; // 卡牌数量
    
    shuffledCards.slice(0, cardCount).forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardElement.classList.add('fan-card');
        
        // 水平整齐排列
        cardElement.style.transform = 'none';
        cardElement.style.position = 'relative';
        cardElement.style.zIndex = index;
        
        // 添加点击事件
        cardElement.addEventListener('click', () => {
            if (selectedCards.length < (selectedSpread === 'single' ? 1 : 3)) {
                selectCard(card, cardElement);
            }
        });
        
        cardsContainer.appendChild(cardElement);
    });
}

// 选择卡牌
function selectCard(card, cardElement) {
    const frameIndex = selectedCards.length;
    const frame = framesContainer.children[frameIndex];
    
    if (!frame) return;
    
    // 获取卡牌和画框的位置
    const cardRect = cardElement.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    
    // 计算相对位置和缩放比例
    const offsetX = frameRect.left - cardRect.left + (frameRect.width - cardRect.width) / 2;
    const offsetY = frameRect.top - cardRect.top + (frameRect.height - cardRect.height) / 2;
    const scaleX = frameRect.width / cardRect.width;
    const scaleY = frameRect.height / cardRect.height;
    const scale = Math.min(scaleX, scaleY);
    
    // 添加选中动画
    cardElement.style.transition = 'all 0.5s ease';
    cardElement.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    cardElement.style.position = 'absolute';
    cardElement.style.zIndex = '100';
    
    // 加入选中卡牌数组
    selectedCards.push(card);
    drawnCards = [...selectedCards];
    
    // 动画结束后将卡牌添加到画框
    setTimeout(() => {
        frame.appendChild(cardElement);
        cardElement.style.position = 'static';
        cardElement.style.transform = 'scale(1)';
        cardElement.style.width = '100%';
        cardElement.style.height = '100%';
        frame.classList.add('filled');
        
        // 添加双击提示
        addDoubleClickHint(cardElement);
        
        // 检查是否选够卡牌
        if (selectedCards.length === (selectedSpread === 'single' ? 1 : 3)) {
            // 清空卡牌容器
            cardsContainer.innerHTML = '';
        }
    }, 500);
}

// 添加双击提示
function addDoubleClickHint(cardElement) {
    // 创建提示元素
    const hintElement = document.createElement('div');
    hintElement.className = 'double-click-hint';
    hintElement.textContent = '双击翻开';
    hintElement.style.animation = 'bounce 1s infinite';
    
    // 将提示元素添加到卡牌中
    cardElement.appendChild(hintElement);
    
    // 绑定双击事件，点击后移除提示
    const doubleClickHandler = () => {
        if (hintElement) {
            hintElement.remove();
        }
        cardElement.removeEventListener('dblclick', doubleClickHandler);
    };
    
    cardElement.addEventListener('dblclick', doubleClickHandler);
}

// 随机抽卡（保留原有功能，作为备用）
function drawCards() {
    const question = questionInput.value.trim();
    
    // 验证输入
    if (!question) {
        showModal('说点什么吧，我在听');
        return;
    }
    
    if (question.length < 10 || question.length > 100) {
        showModal('请输入10-100字的问题');
        return;
    }
    
    // 清空之前的卡牌
    cardsContainer.innerHTML = '';
    cardsContainer.className = 'cards-container';
    drawnCards = [];
    selectedCards = [];
    interpretationContent.innerHTML = '<div class="placeholder"><p>抽卡后点击"生成解读"按钮查看AI解读</p></div>';
    
    // 随机抽取卡牌
    const cardCount = selectedSpread === 'single' ? 1 : 3;
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < cardCount; i++) {
        drawnCards.push(shuffled[i]);
    }
    
    // 生成卡牌元素
    drawnCards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardsContainer.appendChild(cardElement);
    });
    
    showModal('抽卡完成！双击卡牌查看牌面');
}

// 创建卡牌元素
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.index = index;
    
    cardDiv.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <span>?</span>
                <div class="card-tooltip">双击翻开</div>
            </div>
            <div class="card-back">
                <img src="${card.image}" alt="${card.name}" class="card-image">
                <h3 class="card-name">${card.name}</h3>
            </div>
        </div>
    `;
    
    // 绑定双击事件
    cardDiv.addEventListener('dblclick', () => {
        cardDiv.classList.toggle('flipped');
    });
    
    return cardDiv;
}

// 生成AI解读
async function generateInterpretation() {
    if (drawnCards.length === 0) {
        showModal('请先抽卡');
        return;
    }
    
    const question = questionInput.value.trim();
    
    if (!question || question.length < 10) {
        showModal('您还未输入烦恼内容');
        return;
    }
    
    // 显示水晶球动画
    loading.classList.add('show');
    loading.innerHTML = `
        <div class="loading-content">
            <div class="crystal-ball">
                <div class="crystal-ball-container">
                    <div class="crystal-ball-base"></div>
                    <div class="crystal-ball-glass"></div>
                    <div class="crystal-ball-light"></div>
                </div>
            </div>
            <div class="loading-text">
                <p class="loading-title">水晶球正在解读</p>
                <p class="loading-status" id="loadingStatus">正在解读第一张牌...</p>
            </div>
        </div>
    `;
    
    try {
        // 更新解读状态
        setTimeout(() => {
            document.getElementById('loadingStatus').textContent = '正在解读第二张牌...';
        }, 1000);
        
        if (selectedSpread === 'three') {
            setTimeout(() => {
                document.getElementById('loadingStatus').textContent = '正在解读第三张牌...';
            }, 2000);
        }
        
        setTimeout(() => {
            document.getElementById('loadingStatus').textContent = '正在整合解读结果...';
        }, 3000);
        
        // 调用后端API
        const response = await fetch('/api/interpret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                cards: drawnCards,
                spreadType: selectedSpread
            })
        });
        
        if (!response.ok) {
            throw new Error('API调用失败');
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // 显示解读结果
        interpretationContent.innerHTML = `<div class="interpretation-text">${data.interpretation}</div>`;
        interpretationResult = data.interpretation;
        
    } catch (error) {
        console.error('Error:', error);
        showModal('我还在想…再试试吧');
    } finally {
        // 隐藏加载动画
        loading.classList.remove('show');
        // 恢复加载动画的原始内容
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">
                    <p class="loading-title">正在处理...</p>
                    <p class="loading-status" id="loadingStatus">请稍候</p>
                </div>
            </div>
        `;
    }
}

// 提交反馈
function submitFeedback(e) {
    const feedback = e.target.dataset.feedback;
    
    // 这里可以添加反馈逻辑，比如发送到后端存储
    console.log('Feedback:', feedback);
    
    // 显示反馈弹窗
    let message = '';
    switch (feedback) {
        case 'accurate':
            message = '谢谢你的肯定！很高兴能帮到你。';
            break;
        case 'interesting':
            message = '谢谢你的反馈！我会继续努力。';
            break;
        case 'not-relevant':
            message = '谢谢你的反馈，我会不断改进。';
            break;
    }
    
    showModal(message);
}

// 显示弹窗
function showModal(message) {
    modalBody.textContent = message;
    feedbackModal.classList.add('show');
}

// 关闭弹窗
function closeModal() {
    feedbackModal.classList.remove('show');
}

// 初始化应用
init();