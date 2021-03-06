
var carousel = function () {
    var visibleCount = 5, // how many visible items in carousel?
        $carousel = $('.carousel'),
        $carouselItems = $('.carousel-item'),
        $carouselWrapper = $('.carousel-wrapper'),
        $quickLink,
        emptyItem = '<li class="carousel-item empty"></li>',
        items = $carouselItems.length,
        itemWidth = $carouselItems.outerWidth(),
        i = 0,
        position = 1,
        animating = false,
        pages = Math.ceil(items / visibleCount);
        

    // carousel set up and add cloned items
    function initCarousel () {
        var $startClone = '',
            $endClone = '',
            lastItemsCount = visibleCount + (items - (visibleCount * pages)); // number of items in last view

        // debug info
        console.log('no. of items on last page: ' + lastItemsCount)
        console.log('no. of items: ' + items)
        console.log('pages: ' + pages)

        // set width of carousel, taking into account added items
        $carousel.width(itemWidth * items + (itemWidth * (10 + (visibleCount - lastItemsCount))));
        
        // position carousel to first 'real' item
        $carousel[0].style.left = (itemWidth * -visibleCount) + 'px';
        
        // populate empty blocks to fill end of carousel
        if (lastItemsCount) {
            for (i = 0; i < visibleCount - lastItemsCount; i += 1) {
                $startClone += emptyItem;
            }
        }

        // clone first visibleCount items to add to end
        for (i = 0; i < visibleCount; i += 1) {
            $startClone += '<li class="carousel-item clone">' + $($carouselItems[i]).html() + '</li>';
        }

        // clone last items to add to start
        // if no empty items clone last number of items visible (visibleCount)
        if (lastItemsCount === 0) {
            i = visibleCount;
        } else {
            i = lastItemsCount;
        }
        for (i; i > 0; i -= 1) {
            $endClone += '<li class="carousel-item clone">' + $($carouselItems[items - i]).html() + '</li>';
        }
        // populate empty blocks
        if (lastItemsCount) {
            for (i = 0; i < visibleCount - lastItemsCount; i += 1) {
                $endClone += emptyItem;
            }
        }
        // add clones to carousel
        $carousel.append($startClone);
        $carousel.prepend($endClone);

    }

    // carousel animation
    function slide (newPosition) {
        // ignore vigourous clicking
        if (animating) {
            return;
        }
        animating = true;
        position = newPosition;
        var leftPos = (itemWidth * -visibleCount) * position;
        $carousel.animate({
            left: leftPos
        }, 500, function () {
            animating = false;
            console.log(position + '/' + pages)
            if (position > pages) {
                // console.log('end clone')
                // when on end clone jump back to original's position
                position = 1;
                $carousel[0].style.left = (itemWidth * -visibleCount) + 'px';
            } else if (position === 0) {
                // console.log('start clone')
                // when on first clone to back to original's position
                position = pages;
                $carousel[0].style.left = (itemWidth * -visibleCount) * position + 'px';
            }
            // update pagination highlight
            setPaginationActive();
        });
    }

    // set pagination look
    function setPaginationActive () {
        if (pages > 1) {
            $quickLink.removeClass('active');
            $quickLink.eq(position - 1).addClass('active');
        }
    }

    // add pagination links
    function addPagination () {
        $quickLinks = '<div class="carousel-pagination">';
        for (i = 0; i < pages; i += 1) {
            $quickLinks += '<a class="quick-link" href="" data-page="' + (i + 1) + '"></a>';
        }
        $quickLinks += '</div>';
        $carouselWrapper.after($quickLinks);
        $quickLink = $('.quick-link');
        // click events
        $quickLink.on('click', function (e) {
            e.preventDefault();
            var page = $(this).data('page');
            if (page === position) {
                return;
            }
            slide(page);
        }).eq(0).addClass('active');
    }

    // add prev/next links
    function addControls () {
        var $prev = $('<a href="#" class="prev">previous</a>'),
            $next = $('<a href="#" class="next">next</a>'),
            $controls = $('<div class="carousel-controls"></div>');
        $controls.append($prev, $next);
        $carouselWrapper.after($controls);
        $prev.on('click', function(e) {
            e.preventDefault();
            slide(position - 1);
        });
        $next.on('click', function(e) {
            e.preventDefault();
            slide(position + 1);
        });
    }

    // add controls if more than 1 page
    if (pages > 1) {
        addControls();
        addPagination();
    }
    return initCarousel();
}();
        