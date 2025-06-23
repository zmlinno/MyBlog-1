const imageElement = document.getElementById('slider');

// 替换为你自己的图片文件名
const images = [
  'photo/img1.jpg',
  'photo/img2.jpg',
  'photo/img3.jpg',
  'photo/img4.jpg',
  'photo/img5.jpg'
];

let index = 0;



function changeImage() {
  // 开始淡出
  imageElement.classList.add('fade-out');

  setTimeout(() => {
    // 更换图片
    index = (index + 1) % images.length;
    imageElement.src = images[index];

    // 完成后淡入
    imageElement.classList.remove('fade-out');
    imageElement.classList.add('fade-in');

    // 清除 fade-in，准备下次动画
    setTimeout(() => {
      imageElement.classList.remove('fade-in');
    }, 1000); // 与 CSS 中 transition 时间一致
  }, 1000); // fade-out 时间
}

// 每 4 秒切换一次
setInterval(changeImage, 4000);