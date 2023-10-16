let count = 0


window.onscroll = function () {
  const pageScroll = window.innerHeight + window.pageYOffset + 1
  
  
  console.log(pageScroll,'pageScroll')
  if (pageScroll >= document.body.offsetHeight - 200) {
    $('.ending-page')
      .addClass('opacity-1')
  }

  if (pageScroll <= document.body.offsetHeight - 100) {
    $('.ending-page')
      .removeClass('opacity-1')
  }
}
//
//
// const draggableElement = document.querySelector('.ending-page');
//
// draggableElement.addEventListener('dragstart', (event) => {
//   console.log('Element is being dragged!');
//       $('.ending-page')
//         .addClass('show-desktop')
// });
//
