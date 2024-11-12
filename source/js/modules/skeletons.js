function initSkeleton(skeletonElement) {
  const imgElement = skeletonElement.querySelector('img');
  const videoElement = skeletonElement.querySelector('video');
  const mediaElement = imgElement || videoElement;

  if (mediaElement) {
    const isLoaded = imgElement ? imgElement.complete : videoElement.readyState >= 1;

    if (isLoaded) {
      skeletonElement.classList.add('skeleton--loaded');
    } else {
      const loadEvent = imgElement ? 'load' : 'loadeddata';

      mediaElement.addEventListener(loadEvent, () => {
        skeletonElement.classList.add('skeleton--loaded');
      }, { once: true });

      const observer = new MutationObserver(() => {
        if ((imgElement && imgElement.complete) || (videoElement && videoElement.readyState >= 1)) {
          skeletonElement.classList.add('skeleton--loaded');
          observer.disconnect();
        }
      });
      observer.observe(mediaElement, { attributes: true, attributeFilter: ['src'] });

      setTimeout(() => {
        if ((imgElement && imgElement.complete) || (videoElement && videoElement.readyState >= 1)) {
          skeletonElement.classList.add('skeleton--loaded');
        }
      }, 1500);
    }
  }
}

function initSkeletons(wrapperElement = document) {
  const skeletonElements = wrapperElement.querySelectorAll('.skeleton');

  skeletonElements.forEach(initSkeleton);
}
