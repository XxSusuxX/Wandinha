// ---------------------------------------------------------isMobile
(function () {var f={};var g=/iPhone/i,i=/iPod/i,j=/iPad/i,k=/\biOS-universal(?:.+)Mac\b/i,h=/\bAndroid(?:.+)Mobile\b/i,m=/Android/i,c=/(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,d=/Silk/i,b=/Windows Phone/i,n=/\bWindows(?:.+)ARM\b/i,p=/BlackBerry/i,q=/BB10/i,s=/Opera Mini/i,t=/\b(CriOS|Chrome)(?:.+)Mobile/i,u=/Mobile(?:.+)Firefox\b/i,v=function(l){return void 0!==l&&"MacIntel"===l.platform&&"number"==typeof l.maxTouchPoints&&l.maxTouchPoints>1&&"undefined"==typeof MSStream};function w(l){return function($){return $.test(l)}}function x(l){var $={userAgent:"",platform:"",maxTouchPoints:0};l||"undefined"==typeof navigator?"string"==typeof l?$.userAgent=l:l&&l.userAgent&&($={userAgent:l.userAgent,platform:l.platform,maxTouchPoints:l.maxTouchPoints||0}):$={userAgent:navigator.userAgent,platform:navigator.platform,maxTouchPoints:navigator.maxTouchPoints||0};var a=$.userAgent,e=a.split("[FBAN");void 0!==e[1]&&(a=e[0]),void 0!==(e=a.split("Twitter"))[1]&&(a=e[0]);var r=w(a),o={apple:{phone:r(g)&&!r(b),ipod:r(i),tablet:!r(g)&&(r(j)||v($))&&!r(b),universal:r(k),device:(r(g)||r(i)||r(j)||r(k)||v($))&&!r(b)},amazon:{phone:r(c),tablet:!r(c)&&r(d),device:r(c)||r(d)},android:{phone:!r(b)&&r(c)||!r(b)&&r(h),tablet:!r(b)&&!r(c)&&!r(h)&&(r(d)||r(m)),device:!r(b)&&(r(c)||r(d)||r(h)||r(m))||r(/\bokhttp\b/i)},windows:{phone:r(b),tablet:r(n),device:r(b)||r(n)},other:{blackberry:r(p),blackberry10:r(q),opera:r(s),firefox:r(u),chrome:r(t),device:r(p)||r(q)||r(s)||r(u)||r(t)},any:!1,phone:!1,tablet:!1};return o.any=o.apple.device||o.android.device||o.windows.device||o.other.device,o.phone=o.apple.phone||o.android.phone||o.windows.phone,o.tablet=o.apple.tablet||o.android.tablet||o.windows.tablet,o}f=x();if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f}else if(typeof define==="function"&&define.amd){define(function(){return f})}else{this["isMobile"]=f}})();
// ---------------------------------------------------------loaded
$(window).on("load", function () {
    setTimeout(function () {
        $('html').addClass('loaded')
    }, 1000);

});

// ---------------------------------------------------------auto scrolling text
let loops = gsap.utils.toArray('.text-single').map((line, i) => {
    const links = line.querySelectorAll(".js-text");
    return horizontalLoop(links, {
        repeat: -1,
        speed: 1.5 + i * 0.5,
        reversed: false,
        paddingRight: parseFloat(gsap.getProperty(links[0], "marginRight", "px"))
    });
});

let currentScroll = 0;
let scrollDirection = 1;

window.addEventListener("scroll", () => {
    let direction = (window.pageYOffset > currentScroll) ? 1 : -1;
    if (direction !== scrollDirection) {
        // console.log("change", direction);
        loops.forEach(tl => {
            gsap.to(tl, {timeScale: direction, overwrite: true});
        });
        scrollDirection = direction;
    }
    currentScroll = window.pageYOffset;
});

function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        totalWidth, curX, distanceToStart, distanceToLoop, item, i;
    gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el) => {
            let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
            return xPercents[i];
        }
    });
    gsap.set(items, {x: 0});
    totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
            .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
            .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
            vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }
    tl.next = vars => toIndex(curIndex+1, vars);
    tl.previous = vars => toIndex(curIndex-1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }
    return tl;
}
// ---------------------------------------------------------auto scrolling text
// ---------------------------------------------------------home sloagan text

if(!isMobile.any) {
    setTimeout(function (){
        var sicItemHeight = $('.slogan-info-container .item').outerHeight();
        $('.slogan-info-container .item').each(function () {
            var sicItemIndexplusOne = Number($(this).index()) + 1;
            var sicItemIndex = Number($(this).index());
            var sicItemsWidths = parseInt($('.slogan-info-container .inner').outerWidth());
            var numberOfChild = parseInt($('.slogan-info-container .inner').children().length);
            var sicItemWidth = sicItemsWidths / numberOfChild;
            var topPX = sicItemHeight * sicItemIndex + 'px'
            $(this).css('top', topPX);
            var leftPX = sicItemWidth * sicItemIndex + 'px'
            // console.log(leftPX);
            $(this).css('width', sicItemWidth)
            $(this).css('left', leftPX);
        })
    },1000)
}

if(isMobile.any){
    var swiperMobile = new Swiper(".mySloganSwiper", {
        direction: "vertical",
        slidesPerView: 2,
        autoplay:true,
        loop:true,
    });

    const eventBox = gsap.utils.toArray('.eventBox');
    eventBox.forEach((btn) => {
        gsap.from(btn, {
            scrollTrigger: {
                start: 'top 50% bottom 50%',
                end: 'bottom 50% top 50%',
                trigger: btn,
                onEnter() {
                    btn.classList.add('center');

                },
                onLeave() {
                    btn.classList.remove('center');
                },
                onEnterBack() {
                    btn.classList.add('center');
                },
                onLeaveBack() {
                    btn.classList.remove('center');
                }
            }
        });
    });
}

// ---------------------------------------------------------home sloagan text
// ---------------------------------------------------------splitText
let splitTitle = new SplitText($('section.home_events .title'),{type: "chars", charsClass: "char", position: "relative" });
// ---------------------------------------------------------splitText
// ---------------------------------------------------------finding O hbo center
var hbo = $('section.home-release .text .HBO-title svg');
var hboO = $('section.home-release .text .HBO-title .svg svg.o')
var offset = hbo.offset();
var offsetcenterOfO = hboO.offset().left + hboO.width() / 2;
var width = hbo.width();
var hboHeight = hbo.height();
// --------------------------------------------------------------------line of release section
// ------------------------line.line-left-----------------
var hbocenterY = ( $('section.home-release .text .HBO-title .svg').offset().top - $('section.home-release').offset().top ) + $('section.home-release .text .HBO-title .svg').height()/2  ;
$('section.home-release .text .lines .line.line-left').css('height' , hbocenterY)

var hbocenterLeftX =offsetcenterOfO - parseInt($('section.home-release .text .lines .line.line-left').css('left'))
$('section.home-release .text .lines .line.line-left').css('width' , hbocenterLeftX + 'px')
// ------------------------line.line-middle-----------------
$('section.home-release .text .lines .line.line-middle').css('height' , hbocenterY)
if (isMobile.any){
    var hbocenterMiddleX = offsetcenterOfO - ($('section.home-release').outerWidth() / 2 )
    $('section.home-release .text .lines .line.line-middle').css('width' , hbocenterMiddleX + 'px')
}
if (!isMobile.any){
    var hbocenterMiddleX = ($('section.home-release').outerWidth() / 2) - (offsetcenterOfO)
    $('section.home-release .text .lines .line.line-middle').css('width' , hbocenterMiddleX + 'px')
}
// ------------------------line.line-right-----------------
$('section.home-release .text .lines .line.line-right').css('height' , hbocenterY)
// var hbocenterRightX =($('section.home-release').outerWidth() - offset.left ) - (offsetcenterOfO)
var hbocenterRightX =($('section.home-release').outerWidth() - offsetcenterOfO )  - parseInt($('section.home-release .text .lines .line.line-left').css('left'))
$('section.home-release .text .lines .line.line-right').css('width' , hbocenterRightX + 'px')
// ---------------------------------------------------------make square
// var postBoxWidth = $('.postBox').outerWidth();
// $('.postBox').css('height' , postBoxWidth)
// ---------------------------------------------------------make square
// -------------------------------------------------------------contact line
// $('section.home-contact svg.contact-line path').each(function (){
//     var clX = $(this).offset().left;
//     var clY = $(this).offset().top - $('section.home-contact').offset().top;
//     var number = ($(this).index()) + 1;
//     console.log(number , clX ,clY);
//     result=[]
//     result.push(number , clX ,clY)
//     console.log(result);
//     $('section.home-contact .item').each(function (){
//         $(this).css({
//             'left' : clX ,
//             'top' : clY
//         });
//     })
// })

// -------------------------------------------------------------contact line
// -------------------------------------------------------------page ending
