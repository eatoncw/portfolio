import { html, render } from "https://unpkg.com/lit-html@0.7.1/lit-html.js";

import projects from "./projects.js";
import skills from "./skills.js";

function renderSkills() {
  const skillsTemplate = (header) => html`<div class="skill-container">
    <p class="skill-head">${header}</p>
    ${skills[header].map((skill, index) => {
      return html`<div class="skill-item">
        <div class="skill-item-wrapper">
          <p>${skill}</p>
        </div>
      </div>`;
    })}
  </div>`;
  const section = html`${Object.keys(skills).map((header) => {
    return skillsTemplate(header);
  })}`;
  render(section, document.querySelector(".skills-container"));
}

function renderProjects() {
  const projectTemplate = (project, i) => html`<div
    class=${project.height === 2
      ? `animate animate-opacity grid-item grid-item-double`
      : "animate animate-opacity grid-item grid-item-single"}
  >
    <p class="project-head">${project.title}</p>
    <div class="project-subhead-wrapper">
      <a class="project-subhead" href="${project.titleLinkHref}" target="_blank"
        >${project.titleLinkName}</a
      >
    </div>
    <div class="project-content">
      <a href="${project.imgHref}" target="_blank" class="project-thumb-link">
        <div>
          <div class="project-img-container">
            <img src="img/${project.img}" />
            ${project.img2 && html`<img src="img/${project.img}" />`}
          </div>
        </div>
      </a>
      <div class="project-description">
        <p>${project.body}</p>
        <p class="text-muted">
          ${project.technologies?.map((tech, i) => {
            return html`${tech}${i === project.technologies.length - 1
              ? ""
              : ", "}`;
          })}
        </p>
      </div>
    </div>
  </div> `;
  const shuffled = _ in window === undefined ? projects : _.shuffle(projects);
  const allProjects = html`${shuffled.map((proj, i) => {
    return projectTemplate(proj, i);
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

function handleHeaderMenu() {
  const TIMEOUT_BACKGROUND = 600;
  let navMenuOpen = false;
  let autoShow;
  const checkbox = document.querySelector(".navbar-toggler input");
  const navMenu = document.querySelector(".vertical-nav-menu");

  function setAutoAnimateNav() {
    autoShow = setInterval(() => {
      checkbox.checked = !checkbox.checked;
    }, 2500);
  }

  setAutoAnimateNav();

  function toggleMobileNav(cb) {
    navMenuOpen = !navMenuOpen;
    navMenu.classList.toggle("nav-menu-show", navMenuOpen);
    setTimeout(() => {
      document.querySelector("body").style.position = navMenuOpen
        ? "fixed"
        : "relative";
    }, TIMEOUT_BACKGROUND);
    cb && cb();
  }

  function closeMobileNav(cb) {
    if (checkbox.checked) checkbox.checked = false;
    setTimeout(setAutoAnimateNav, 2000);
    toggleMobileNav(cb);
  }

  function navigateOnClick(e) {
    const href = e.target.href;
    if (!href) return;
    const section = document.getElementById(href.split("#")[1]);
    if (document.querySelector("body").style.position === "fixed") {
      document.querySelector("body").style.position === "fixed";
    }

    function callback() {
      setTimeout(() => {
        section.scrollIntoView();
      }, TIMEOUT_BACKGROUND + 5);
    }

    closeMobileNav(callback);
  }

  document
    .querySelector(".navbar-items-vertical")
    .addEventListener("click", navigateOnClick);

  document.querySelector(".navbar-toggler").addEventListener("click", (e) => {
    if (e.target.tagName === "LABEL") return;
    clearInterval(autoShow);
    toggleMobileNav();
  });

  document.querySelector(".menu-close").addEventListener("click", (e) => {
    if (e.target.tagName === "LABEL") return;
    closeMobileNav();
  });
}

(() => {
  let headerObserver;
  renderProjects();
  renderSkills();
  handleBlobs();
  handleHeaderMenu();
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
