import { useEffect, useState } from "react";

function ScrollButton() {
  const [isVisible, setisVisible] = useState(false);
  useEffect(function () {
    function scrollY() {
      const scroll = window.scrollY;
      if (scroll > 400) {
        setisVisible(true);
      } else if (scroll < 400) {
        setisVisible(false);
      }
    }
    window.addEventListener("scroll", scrollY);
    return function () {
      window.removeEventListener("scroll", scrollY);
    };
  }, []);
  function handleScroll() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
  return (
    <>
      {isVisible ? (
        <button
          className="btn--icon scroll-to-top-btn"
          onClick={() => handleScroll()}
          aria-label="Scroll to top"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      ) : null}
    </>
  );
}

export default ScrollButton;
