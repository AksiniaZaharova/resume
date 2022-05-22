function scrollEvents () {
    document.addEventListener('click', () => console.log('hello world'))
    document.addEventListener('wheel', handleScroll);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    let currentPage = 1;

    let scrollStatus = {
        wheeling: false,
        functionCall: false
    };

    let scrollTimer = false;

    function handleScroll(event, mobile, prev) {
        scrollStatus.wheeling = true;
        if (!scrollStatus?.functionCall) {
            const currentId = document.getElementById(`page-${currentPage}`);

            if (event?.deltaY > 0 || mobile && !prev) {
                if (currentPage === 6) {
                    return false;
                }
                else {
                    const nextId = document.getElementById(`page-${currentPage + 1}`);
                    setAnimations(currentId, nextId, false);
                    currentPage = currentPage + 1;
                }
            }
            if (event?.deltaY < 0 || mobile && prev) {
                if (currentPage === 1) {
                    return false;
                }
                else {
                    const previousId = document.getElementById(`page-${currentPage - 1}`);
                    setAnimations(currentId, previousId, true);
                    currentPage = currentPage - 1;
                }
            }
            scrollStatus.functionCall = true;
        }
        window.clearInterval(scrollTimer);
        scrollTimer = window.setTimeout(function() {
            scrollStatus.wheeling = false;
            scrollStatus.functionCall = false;
        }, 50);
    }

    function setAnimations(curr, next, toTop) {
        if(toTop) {
            curr.setAttribute('data-animation-bottom', 'true');
            curr.classList.add('current');
            next.setAttribute('data-animation-prev', 'true');
            next.setAttribute('data-hidden', 'false');
            setTimeout(() => {
                curr.setAttribute('data-hidden', 'true');
                curr.removeAttribute('data-animation-bottom');
                next.removeAttribute('data-animation-prev');
                curr.removeAttribute('class');
            },  750);
        }
        if(!toTop) {
            curr.setAttribute('data-animation-top', 'true');
            curr.classList.add('current');
            next.setAttribute('data-hidden', 'false');
            next.setAttribute('data-animation-next', 'true');
            setTimeout(() => {
                curr.setAttribute('data-hidden', 'true');
                curr.removeAttribute('data-animation-top');
                next.removeAttribute('data-animation-next');
                curr.removeAttribute('class');
            }, 750);
        }
    }

    let yDown = null;

    function getTouches(event) {
        return event.touches;
    }

    function handleTouchStart(event) {
        event.stopPropagation();
        const firstTouch = getTouches(event)[0];
        yDown = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
        evt.stopPropagation();
        if (!yDown ) {
            return;
        }
        let yUp = evt.touches[0].clientY;

        let yDiff = yDown - yUp;

        if ( yDiff > 0 ) {
            handleScroll('', true, false)
        } else {
            handleScroll('', true, true)
        }
        yDown = null;
    }

    if(window.innerWidth <= 860) {
        let titles = document.querySelectorAll('.project-title');
        let mockups = document.querySelectorAll('.project-mockups');

        titles.forEach((el, index) => {
            if(el.className.split('adobe').length > 1 || el.className.split('about').length > 1) {
                return false;
            }
            el.append(mockups[index]);
        })
    }
}

if (document.readyState === 'loading') {  // Загрузка ещё не закончилась
    document.addEventListener('DOMContentLoaded', scrollEvents);
} else {
    scrollEvents();
}
