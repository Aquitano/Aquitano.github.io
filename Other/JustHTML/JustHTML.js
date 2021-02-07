/*!
 * JustHTML v.1.1-alpha
 * Copyright 2021 Aquitano.
 * Licensed under MIT (https://github.com/Aquitano/JustHTML/blob/main/LICENSE)
 */
const appear = document.querySelectorAll(".AppearOnScroll");

const appearOptions = {
  threshold: 0,
  rootMargin: "0px 0px -250px 0px",
};

const appearOnScroll = new IntersectionObserver(function (
  entries,
  appearOnScroll
) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("appear");
      appearOnScroll.unobserve(entry.target);
    }
  });
},
appearOptions);
appear.forEach((appear) => {
  appearOnScroll.observe(appear);
});
