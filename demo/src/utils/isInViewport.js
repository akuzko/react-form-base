export default function isInViewport(el) {
  const height = el.offsetHeight;
  let top = el.offsetTop;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
  }

  return (
    top + 100 < (window.pageYOffset + window.innerHeight) &&
    (Math.max(top + height - 200, 0)) >= window.pageYOffset
  );
}
