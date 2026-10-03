/**
 * BioSearch — Advanced Search Engine
 * Manages modal toggling, constraint validation, query compiling,
 * and execution across knowledge graph nodes and live literature retrieval.
 */

export function initAdvancedSearch(config = {}) {
  const toggleBtn = document.getElementById(config.toggleBtnId || 'adv-search-toggle');
  const searchInput = document.getElementById(config.searchInputId || 'node-search');
  const modal = document.getElementById('adv-search-modal');
  const closeBtn = document.getElementById('adv-close-btn');
  const clearBtn = document.getElementById('adv-clear-btn');
  const applyBtn = document.getElementById('adv-apply-btn');

  if (!toggleBtn || !modal) return;

  // Toggle modal open/close
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.classList.toggle('open');
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      modal.classList.remove('open');
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
      modal.classList.remove('open');
    }
  });

  // Prevent closing when clicking inside modal
  modal.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const inputs = modal.querySelectorAll('input');
      inputs.forEach(input => input.value = '');
      const select = modal.querySelector('select');
      if (select) select.selectedIndex = 0;
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  // Apply constraints
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const allWords = document.getElementById('adv-all-words')?.value.trim() || '';
      const exactPhrase = document.getElementById('adv-exact')?.value.trim() || '';
      const anyWords = document.getElementById('adv-any')?.value.trim() || '';
      const noneWords = document.getElementById('adv-none')?.value.trim() || '';
      const where = document.getElementById('adv-where')?.value || 'anywhere';
      const author = document.getElementById('adv-author')?.value.trim() || '';
      const source = document.getElementById('adv-source')?.value.trim() || '';
      const yearStart = document.getElementById('adv-year-start')?.value.trim() || '';
      const yearEnd = document.getElementById('adv-year-end')?.value.trim() || '';

      // Compile query terms
      const queryParts = [];

      if (allWords) queryParts.push(allWords);
      if (exactPhrase) queryParts.push(`"${exactPhrase}"`);
      if (anyWords) {
        const anyList = anyWords.split(/\s+/).filter(Boolean);
        if (anyList.length > 1) {
          queryParts.push(`(${anyList.join(' OR ')})`);
        } else if (anyList.length === 1) {
          queryParts.push(anyList[0]);
        }
      }
      if (noneWords) {
        const noneList = noneWords.split(/\s+/).filter(Boolean);
        noneList.forEach(w => queryParts.push(`NOT ${w}`));
      }
      if (author) queryParts.push(`AUTH:"${author}"`);
      if (source) queryParts.push(`JOURNAL:"${source}"`);
      if (yearStart || yearEnd) {
        const start = yearStart || '*';
        const end = yearEnd || '*';
        queryParts.push(`PUB_YEAR:[${start} TO ${end}]`);
      }

      const compiledQuery = queryParts.join(' ').trim();

      if (searchInput && compiledQuery) {
        searchInput.value = compiledQuery;
        // Trigger search filter in knowledge graph
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Also if user provided main search terms, allow live search
        const cleanSearchTerm = [allWords, exactPhrase, anyWords].filter(Boolean).join(' ');
        if (cleanSearchTerm && typeof window.runLiveTopicSearch === 'function') {
          window.runLiveTopicSearch(cleanSearchTerm, 5);
        }
      }

      modal.classList.remove('open');
    });
  }
}
