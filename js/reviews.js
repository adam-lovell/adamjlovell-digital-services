// Reviews: submit and display
const STORAGE_KEY = 'lovellReviews';

const serviceLabels = {
    website: 'Website Development',
    tutoring: 'Math & Science Tutoring',
    beats: 'Romulus Beats',
    other: 'Other',
};

function getReviews() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveReview(review) {
    const reviews = getReviews();
    reviews.unshift({
        ...review,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        date: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function renderStars(rating) {
    const full = '★';
    const empty = '☆';
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? full : empty;
    }
    return `<span class="text-primary-400">${stars}</span>`;
}

function renderReviews() {
    const container = document.getElementById('reviews-container');
    const placeholder = document.getElementById('reviews-placeholder');
    const reviews = getReviews();

    if (reviews.length === 0) {
        if (placeholder) placeholder.classList.remove('hidden');
        container.querySelectorAll('.review-card').forEach(el => el.remove());
        return;
    }

    if (placeholder) placeholder.classList.add('hidden');
    container.querySelectorAll('.review-card').forEach(el => el.remove());

    reviews.forEach((r) => {
        const card = document.createElement('div');
        card.className = 'review-card p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50';
        card.innerHTML = `
            <div class="flex items-start justify-between gap-4 mb-3">
                <div>
                    <p class="font-display font-semibold text-slate-100">${escapeHtml(r.name)}</p>
                    <p class="text-sm text-primary-400">${escapeHtml(serviceLabels[r.service] || r.service)}</p>
                </div>
                <div class="text-sm">${renderStars(parseInt(r.rating, 10))}</div>
            </div>
            <p class="text-slate-400 text-sm leading-relaxed">${escapeHtml(r.text)}</p>
            <p class="text-slate-500 text-xs mt-3">${formatDate(r.date)}</p>
        `;
        container.insertBefore(card, placeholder);
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

document.addEventListener('DOMContentLoaded', () => {
    renderReviews();

    const form = document.getElementById('review-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveReview({
                name: document.getElementById('reviewer-name').value.trim(),
                service: document.getElementById('review-service').value,
                rating: document.getElementById('review-rating').value,
                text: document.getElementById('review-text').value.trim(),
            });
            form.reset();
            renderReviews();
        });
    }
});
