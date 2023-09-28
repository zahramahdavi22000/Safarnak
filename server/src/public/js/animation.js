// on
function reveal() {
    let fadeUpRight = document.querySelectorAll(".fade-up-right");
    let fadeDownLeft = document.querySelectorAll(".fade-down-left");
    let flipUpElements = document.querySelectorAll(".flip-up-animation");
    let flipLeftElements = document.querySelectorAll(".flip-left");
    let zoomInDownElements = document.querySelectorAll(".zoom-in-down");
    let fadeUpElements = document.querySelectorAll(".fade-up");

    for (let i = 0; i < fadeUpRight.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = fadeUpRight[i].getBoundingClientRect().top;
        let elementVisible = -50;

        if (elementTop < windowHeight - elementVisible) {
            fadeUpRight[i].classList.add("active");
        } else {
            fadeUpRight[i].classList.remove("active");
        }
    }

    for (let i = 0; i < fadeDownLeft.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = fadeDownLeft[i].getBoundingClientRect().top;
        let elementVisible = -50;

        if (elementTop < windowHeight - elementVisible) {
            fadeDownLeft[i].classList.add("active");
        } else {
            fadeDownLeft[i].classList.remove("active");
        }
    }




    for (let i = 0; i < flipUpElements.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = flipUpElements[i].getBoundingClientRect().top;
        let elementVisible = -50;

        if (elementTop < windowHeight - elementVisible) {
            flipUpElements[i].classList.add("active");
        } else {
            flipUpElements[i].classList.remove("active");
        }
    }



    for (let i = 0; i < flipLeftElements.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = flipLeftElements[i].getBoundingClientRect().top;
        let elementVisible = -50;

        if (elementTop < windowHeight - elementVisible) {
            flipLeftElements[i].classList.add("active");
        } else {
            flipLeftElements[i].classList.remove("active");
        }
    }

    for (let i = 0; i < zoomInDownElements.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = zoomInDownElements[i].getBoundingClientRect().top;
        let elementVisible = -50;

        if (elementTop < windowHeight - elementVisible) {
            zoomInDownElements[i].classList.add("active");
        } else {
            zoomInDownElements[i].classList.remove("active");
        }
    }

    for (let i = 0; i < fadeUpElements.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = fadeUpElements[i].getBoundingClientRect().top;
        let elementVisible = -50;

        if (elementTop < windowHeight - elementVisible) {
            fadeUpElements[i].classList.add("active");
        } else {
            fadeUpElements[i].classList.remove("active");
        }
    }
}


function reveal2() {
    let fadeUpRightLoad = document.querySelectorAll(".fade-up-right-load");
    let fadeDownLeftLoad = document.querySelectorAll(".fade-down-left-load");
    let zoomInDownElementsLoad = document.querySelectorAll(".zoom-in-down-load");


    for (let i = 0; i < fadeUpRightLoad.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = fadeUpRightLoad[i].getBoundingClientRect().top;
        let elementVisible = -50;

        if (elementTop < windowHeight - elementVisible) {
            fadeUpRightLoad[i].classList.add("active");
        } else {
            fadeUpRightLoad[i].classList.remove("active");
        }
    }

    for (let i = 0; i < fadeDownLeftLoad.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = fadeDownLeftLoad[i].getBoundingClientRect().top;
        let elementVisible = -50;

        if (elementTop < windowHeight - elementVisible) {
            fadeDownLeftLoad[i].classList.add("active");
        } else {
            fadeDownLeftLoad[i].classList.remove("active");
        }
    }
    for (let i = 0; i < zoomInDownElementsLoad.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = zoomInDownElementsLoad[i].getBoundingClientRect().top;
        let elementVisible = -50;

        if (elementTop < windowHeight - elementVisible) {
            zoomInDownElementsLoad[i].classList.add("active");
        } else {
            zoomInDownElementsLoad[i].classList.remove("active");
        }
    }

}

window.myLoad = reveal
window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal2); // Add this line to trigger the animation when the page is loaded

////////////////////////////////////////////////////////////////////////
