document.addEventListener('DOMContentLoaded', () => {
    
    const shortenForm = document.getElementById('shorten-form');
    const longUrlInput = document.getElementById('long-url');
    const customAliasInput = document.getElementById('custom-alias');
    const submitBtn = document.getElementById('submit-btn');
    
    const resultContainer = document.getElementById('result-container');
    const errorMsg = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const shortUrlLink = document.getElementById('short-url-link');
    const copyBtn = document.getElementById('copy-btn');

    const analyticsForm = document.getElementById('analytics-form');
    const analyticsAliasInput = document.getElementById('analytics-alias');
    const analyticsResult = document.getElementById('analytics-result');
    const analyticsError = document.getElementById('analytics-error');
    const analyticsErrorText = document.getElementById('analytics-error-text');
    const totalClicks = document.getElementById('total-clicks');
    const lastVisited = document.getElementById('last-visited');

    const getBaseUrl = () => {
        return window.location.origin;
    };

    shortenForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        resultContainer.classList.add('hidden');
        errorMsg.classList.add('hidden');
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Generating...`;

        const urlValue = longUrlInput.value.trim();
        const aliasValue = customAliasInput.value.trim();

        const payload = { url: urlValue };
        if (aliasValue) {
            payload.customAlias = aliasValue;
        }

        try {
            const response = await fetch('/url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate short URL');
            }

            const fullShortUrl = `${getBaseUrl()}/${data.id}`;
            shortUrlLink.href = fullShortUrl;
            shortUrlLink.textContent = fullShortUrl;
            resultContainer.classList.remove('hidden');

            longUrlInput.value = '';
            customAliasInput.value = '';

        } catch (error) {
            errorText.textContent = error.message;
            errorMsg.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const urlToCopy = shortUrlLink.href;
        
        navigator.clipboard.writeText(urlToCopy).then(() => {
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i class='bx bx-check'></i>`;
            copyBtn.style.color = '#17d07e';
            copyBtn.style.borderColor = '#17d07e';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy', err);
        });
    });

    analyticsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        analyticsResult.classList.add('hidden');
        analyticsError.classList.add('hidden');
        
        const alias = analyticsAliasInput.value.trim();
        if (!alias) return;

        try {
            const response = await fetch(`/url/analytics/${alias}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch analytics.');
            }

            totalClicks.textContent = data.totalClicks || 0;
            
            if (data.analytics && data.analytics.length > 0) {
                const lastVisitTimestamp = data.analytics[data.analytics.length - 1].timestamp;
                const date = new Date(lastVisitTimestamp);
                lastVisited.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            } else {
                lastVisited.textContent = 'Never';
            }

            analyticsResult.classList.remove('hidden');

        } catch (error) {
            analyticsErrorText.textContent = error.message;
            analyticsError.classList.remove('hidden');
        }
    });

});
