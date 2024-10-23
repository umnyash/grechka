function initSkeleton(skeletonElement) {
  const imgElement = skeletonElement.querySelector('img');

  if (imgElement) {
    if (imgElement.complete) {
      skeletonElement.classList.add('skeleton--loaded');
    } else {
      imgElement.addEventListener('load', () => skeletonElement.classList.add('skeleton--loaded'), { once: true });
    }
  } else {
    const videoElement = skeletonElement.querySelector('video');

    if (videoElement.readyState >= 1) {
      skeletonElement.classList.add('skeleton--loaded');
    } else {
      videoElement.addEventListener('loadeddata', () => skeletonElement.classList.add('skeleton--loaded'), { once: true });
    }
  }
}

function initSkeletons(wrapperElement = document) {
  const skeletonElements = wrapperElement.querySelectorAll('.skeleton');

  skeletonElements.forEach(initSkeleton);
}
