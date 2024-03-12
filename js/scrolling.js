// scrolling.js

function handleMouseWheel(event) {
    // Check the direction of the scroll
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

    // Determine the next or previous container
    var currentContainer = document.querySelector('.active-container');
    var nextContainer = (delta > 0) ? currentContainer.previousElementSibling : currentContainer.nextElementSibling;

    if (nextContainer) {
        // Add a class to mark the next container as active
        nextContainer.classList.add('active-container');

        // Scroll to the center of the next container
        var rect = nextContainer.getBoundingClientRect();
        var scrollPosition = rect.top + window.scrollY + (rect.height / 2) - (window.innerHeight / 2);

        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });

        // Remove the 'active-container' class from the current container
        currentContainer.classList.remove('active-container');
    }
}

// Add the mouse wheel event listener to the document
document.addEventListener('wheel', handleMouseWheel);