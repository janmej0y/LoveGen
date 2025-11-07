import { swipeRight, swipeLeft } from './api.js';

let stack;
let currentCard;
let isDragging = false;
let startX;

export function initializeSwipe() {
    stack = document.querySelector('.card-stack');
    if (!stack || !stack.children.length) {
        console.log("Swipe stack not found or is empty.");
        return;
    }

    // The top card is the last child element in the stack
    currentCard = stack.lastElementChild;
    if (currentCard) {
        addEventListenersToCard(currentCard);
    }

    // Add listeners to swipe action buttons
    document.querySelector('.action-btn.like').addEventListener('click', () => handleSwipeAction('right'));
    document.querySelector('.action-btn.dislike').addEventListener('click', () => handleSwipeAction('left'));
}

function addEventListenersToCard(card) {
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag, { passive: true });

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: true });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
}

function startDrag(e) {
    if (currentCard) {
        isDragging = true;
        startX = e.pageX || e.touches[0].pageX;
        currentCard.classList.add('dragging');
    }
}

function onDrag(e) {
    if (!isDragging || !currentCard) return;
    
    e.preventDefault();
    const currentX = e.pageX || e.touches[0].pageX;
    const diffX = currentX - startX;
    const rotate = diffX * 0.1;

    currentCard.style.transform = `translateX(${diffX}px) rotate(${rotate}deg)`;
}

function endDrag(e) {
    if (!isDragging || !currentCard) return;
    
    isDragging = false;
    currentCard.classList.remove('dragging');

    const finalX = currentCard.getBoundingClientRect().left;
    const decisionThreshold = window.innerWidth * 0.4;

    if (finalX > window.innerWidth - decisionThreshold) {
        handleSwipeAction('right');
    } else if (finalX < decisionThreshold - currentCard.offsetWidth) {
        handleSwipeAction('left');
    } else {
        currentCard.style.transform = 'translateX(0) rotate(0deg)'; // Snap back
    }
}

async function handleSwipeAction(direction) {
    if (!currentCard) return;

    removeEventListenersFromCard(currentCard);

    const flyOutX = (direction === 'right' ? 1 : -1) * (window.innerWidth * 1.5);
    const rotate = (direction === 'right' ? 1 : -1) * 30;
    currentCard.style.transform = `translateX(${flyOutX}px) rotate(${rotate}deg)`;
    currentCard.style.opacity = '0';

    const userId = currentCard.dataset.userId;

    try {
        if (direction === 'right') {
            const res = await swipeRight(userId);
            if (res.data.match) {
                alert("It's a Match!");
            }
        } else {
            await swipeLeft(userId);
        }
    } catch (error) {
        console.error('Swipe failed:', error);
    }

    setTimeout(() => {
        currentCard.remove();
        currentCard = stack.lastElementChild;
        if (currentCard) {
            addEventListenersToCard(currentCard);
        }
    }, 300);
}

function removeEventListenersFromCard(card) {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
}

