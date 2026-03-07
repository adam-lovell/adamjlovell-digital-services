// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    // Pre-select service from URL query param
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
        const select = document.getElementById('service');
        const option = select.querySelector(`option[value="${serviceParam}"]`);
        if (option) option.selected = true;
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value,
            };

            // Store in localStorage for demo (you can replace with Formspree, Netlify, or your API)
            try {
                const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
                submissions.push({ ...formData, date: new Date().toISOString() });
                localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

                statusEl.className = 'p-4 rounded-xl text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                statusEl.textContent = 'Thanks! Your message has been sent. I\'ll get back to you soon.';
                statusEl.classList.remove('hidden');
                form.reset();
            } catch (err) {
                statusEl.className = 'p-4 rounded-xl text-sm bg-red-500/20 text-red-400 border border-red-500/30';
                statusEl.textContent = 'Something went wrong. Please try again or email me directly.';
                statusEl.classList.remove('hidden');
            }

            submitBtn.disabled = false;
        });
    }
});
