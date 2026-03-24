// Reviews: load from reviews.json, submit via Formspree
const serviceLabels = {
    website: 'Website Development',
    other: 'Other',
};

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return `<span class="text-primary-400">${stars}</span>`;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderReviews(reviews) {
    const container = document.getElementById('reviews-container');
    const placeholder = document.getElementById('reviews-placeholder');
    if (!container) return;

    container.querySelectorAll('.review-card').forEach(el => el.remove());

    if (reviews.length === 0) {
        if (placeholder) placeholder.classList.remove('hidden');
        return;
    }

    if (placeholder) placeholder.classList.add('hidden');

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

document.addEventListener('DOMContentLoaded', async () => {
    // Load reviews from local JSON file
    try {
        const res = await fetch('reviews.json');
        if (res.ok) {
            const reviews = await res.json();
            renderReviews(reviews);
        }
    } catch (err) {
        console.error('Could not load reviews:', err);
    }

    // Form submits to Formspree — you get an email, then add the review to reviews.json
    const form = document.getElementById('review-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Submitting...';

            const data = new FormData(form);

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' },
                });
                if (res.ok) {
                    form.reset();
                    btn.textContent = 'Review Sent — Thank You!';
                    setTimeout(() => { btn.textContent = 'Submit Review'; btn.disabled = false; }, 3000);
                } else {
                    throw new Error('Submit failed');
                }
            } catch {
                alert('Could not send review. Please try again.');
                btn.disabled = false;
                btn.textContent = 'Submit Review';
            }
        });
    }
});
