// Importing the necessary helper function to preload images from 'utils.js' file
import { preloadImages } from './utils.js';

// Importing the Card class from 'card.js' file
import { Card } from './card.js';

// Calling the Splitting function to split the text into individual characters, 
// it's a text animation library which splits the text for complex animations.
if(!isMobile.any) {
    Splitting();
}

// An array to hold different configurations/settings for different sets of cards. 
// Each setting object includes the orientation, number of slices, and animation details.

const settingsArray = [
    // 1st set of settings: Vertical orientation with 5 slices.
    // {
    //     orientation: 'vertical',
    //     slicesTotal: 10
    // },
    // 2nd set of settings: Vertical orientation with 15 slices.
    {
        orientation: 'horizontal',
        slicesTotal: 10,
        animation: {
            duration: 0.6,
            ease: 'expo.inOut'
        }
    },
    // 3rd set of settings: Horizontal orientation with 5 slices and specific animation duration and easing.
    // {
    //     orientation: 'vertical',
    //     slicesTotal: 10,
    // },
    // 4th set of settings: Horizontal orientation with 15 slices and specific animation duration and easing.
    // {
    //     orientation: 'horizontal',
    //     slicesTotal: 10,
    //     animation: {
    //         duration: 0.6,
    //         ease: 'expo.inOut'
    //     }
    // },
];
if(!isMobile.any){
    // Initialize the Cards
    [...document.querySelectorAll('.card')].forEach((cardEl, index) => {
        new Card(cardEl, settingsArray[Math.floor(index / 3) % settingsArray.length]);
    });
}


