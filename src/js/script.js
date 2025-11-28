// SafeShelf System Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c SafeShelf System: Online ", "background: #00f3ff; color: #0a0a0f; font-weight: bold; padding: 4px; border-radius: 2px;");
    
    // Add subtle interaction to search bar
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('mouseenter', () => {
            searchBar.style.transform = 'scale(1.02)';
        });
        searchBar.addEventListener('mouseleave', () => {
            searchBar.style.transform = 'scale(1)';
        });
    }
});
