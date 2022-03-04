import { html, render } from "https://unpkg.com/lit-html@0.7.1/lit-html.js";
import projects from "./projects.js";

function renderProjects() {
  const projectTemplate = (project) => html`<div class="grid-item">
    <p class="lead">${project.title}</p>
    <a href="${project.titleLinkHref}" target="_blank"
      >${project.titleLinkName}</a
    >
    <a href="${project.imgHref}" target="_blank" class="project-thumb-link">
      <div>
        <div class="project-img-container">
          <img src="img/${project.img}" />
        </div>
      </div>
    </a>
    <p>${project.body}</p>
    <p class="text-muted">
      ${project.technologies?.map((tech, i) => {
        return html`${tech}${i === project.technologies.length - 1
          ? ""
          : ", "}`;
      })}
    </p>
  </div> `;
  const allProjects = html`${projects.map((proj) => {
    return projectTemplate(proj);
  })}`;
  render(allProjects, document.querySelector(".projects-container"));
}

function handleBlobs() {
  if (KUTE in window === undefined) return;
  console.log(KUTE in window);
  const blobContainerClasses = [".blob-top-container"];

  blobContainerClasses.forEach((blob) => {
    const div = document.querySelector(blob);
    const svg1 = div.querySelector(".blob1").className.baseVal;
    const svg2 = div.querySelector(".blob2").className.baseVal;
    console.log("names", svg1, svg2);
    const tween = KUTE.fromTo(
      `.${svg1}`,
      { path: `.${svg1}` },
      { path: `.${svg2}` },
      { repeat: 9999, duration: 3000, yoyo: true }
    );

    tween.start();
  });
}

function createHeaderObserver() {
  if ("IntersectionObserver" in window === undefined) return;
  const header = document.querySelector("header");
  const hero = document.querySelector(".section-1");
  const heroContent = hero.querySelector(".content-container");
  const headerHeight = header.getBoundingClientRect().height;
  const heroContentHeight = heroContent.getBoundingClientRect().height;
  let observer;

  let options = {
    root: null,
    rootMargin: `-${headerHeight + heroContentHeight}px 0px 0px 0px`,
    threshold: 0,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      header.classList.toggle("nav-hidden", !entry.isIntersecting);
    });
  }, options);
  let target = document
    .querySelector("#intro")
    .querySelector(".content-container");

  observer.observe(target);
  return observer;
}

function animationObservers() {
  const animatedEls = document.querySelectorAll(".animate");

  let observer;
  let options = {
    root: null,
    threshold: 0.25,
  };
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const isIntersecting = entry.isIntersecting;
      const classes = entry.target.classList;
      const arr = [...classes];
      const animation = arr.find((className) => {
        return className.includes("animate-");
      });

      switch (animation) {
        case "animate-right":
          classes.toggle("animate-right-show", isIntersecting);
          break;
        case "animate-left":
          classes.toggle("animate-left-show", isIntersecting);
          break;
        case "animate-opacity":
          classes.toggle("animate-opacity-show", isIntersecting);
          break;
        default:
          return null;
      }
    });
  }, options);

  animatedEls.forEach((el) => {
    observer.observe(el);
  });
}

(() => {
  let headerObserver;
  renderProjects();
  handleBlobs();
  new ResizeObserver(() => {
    if (headerObserver) {
      headerObserver.disconnect();
      headerObserver = createHeaderObserver();
    }
  }).observe(document.body);
  setTimeout(() => {
    // prevent observer rerun interference
    headerObserver = createHeaderObserver();
  }, 100);
  animationObservers();
})();
