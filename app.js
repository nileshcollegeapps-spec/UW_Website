(() => {
  "use strict";

  const items = [
    {
      id: "release-time-ledger",
      kind: "REPORT",
      title: "The Release-Time Ledger: Who Pays for Union Work?",
      date: "AUG 18, 2026",
      number: "01"
    },
    {
      id: "political-spending",
      kind: "VIDEO",
      title: "Following Union Political Spending",
      date: "AUG 12, 2026",
      number: "02"
    },
    {
      id: "contract-clause",
      kind: "REPORT",
      title: "Inside the Contract Clause That Moves Public Money",
      date: "AUG 05, 2026",
      number: "03"
    },
    {
      id: "membership-gap",
      kind: "REPORT",
      title: "The Growing Gap Between Membership and Influence",
      date: "JUL 27, 2026",
      number: "04"
    },
    {
      id: "release-time-video",
      kind: "VIDEO",
      title: "How Public Payroll Release Time Works",
      date: "JUL 19, 2026",
      number: "05"
    },
    {
      id: "dues-route",
      kind: "REPORT",
      title: "Where the Dues Went",
      date: "JUL 08, 2026",
      number: "06"
    },
    {
      id: "bargaining-table",
      kind: "VIDEO",
      title: "Beyond the Bargaining Table",
      date: "JUN 24, 2026",
      number: "07"
    }
  ];

  const body = document.body;
  const enterButton = document.querySelector("#enterButton");
  const homeButton = document.querySelector("#homeButton");
  const mainContent = document.querySelector("#mainContent");
  const navigationButtons = [...document.querySelectorAll("[data-view]")];
  const detailPanel = document.querySelector("#detailPanel");
  const detailClose = document.querySelector("#detailClose");
  const detailMeta = document.querySelector("#detailMeta");
  const detailTitle = document.querySelector("#detailTitle");
  const detailContent = document.querySelector("#detailContent");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeView = "reports";
  let previousFocus = null;
  let dragState = null;
  let suppressTimelineClick = false;

  const sunMarkup = `
    <svg class="sun-mark" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="8.5"></circle>
      <path d="M24 3v7M24 38v7M3 24h7M38 24h7M9.2 9.2l5 5M33.8 33.8l5 5M38.8 9.2l-5 5M14.2 33.8l-5 5"></path>
    </svg>`;

  function itemCard(item, index) {
    return `
      <article class="content-card${index === 0 ? " is-featured" : ""}" data-open-item="${item.id}" role="button" tabindex="0" aria-label="Open ${item.title}">
        <div class="card-topline"><span>${item.kind}</span><span>${item.date}</span></div>
        <span class="card-number">${item.number}</span>
        <h2>${item.title}</h2>
        <p>Placeholder</p>
        <span class="card-open">OPEN <b>↗</b></span>
      </article>`;
  }

  function videoCard(item) {
    return `
      <article class="video-card" data-open-item="${item.id}" role="button" tabindex="0" aria-label="Open ${item.title}">
        <div class="video-empty"><span>INSERT VIDEO HERE</span></div>
        <div class="video-copy">
          <div class="card-topline"><span>VIDEO</span><span>${item.date}</span></div>
          <h2>${item.title}</h2>
          <p>Placeholder</p>
        </div>
      </article>`;
  }

  function renderReports() {
    const reports = items.filter((item) => item.kind === "REPORT");
    mainContent.innerHTML = `
      <section class="view" aria-labelledby="reportsHeading">
        <header class="view-heading">
          <h1 id="reportsHeading">Reports</h1>
          <p>Placeholder</p>
        </header>
        <div class="reports-grid">${reports.map(itemCard).join("")}</div>
      </section>`;
  }

  function renderVideos() {
    const videos = items.filter((item) => item.kind === "VIDEO");
    mainContent.innerHTML = `
      <section class="view" aria-labelledby="videosHeading">
        <header class="view-heading">
          <h1 id="videosHeading">Videos</h1>
          <p>Placeholder</p>
        </header>
        <div class="videos-grid">${videos.map(videoCard).join("")}</div>
      </section>`;
  }

  function timelineItem(item, index) {
    const position = index % 2 === 0 ? "is-above" : "is-below";
    return `
      <article class="timeline-item ${position}">
        <span class="timeline-dot" aria-hidden="true"></span>
        <button type="button" data-open-item="${item.id}">
          <span>${item.kind}</span><small>${item.date}</small>
          <h2>${item.title}</h2>
          <p>Placeholder</p>
        </button>
      </article>`;
  }

  function renderTimeline() {
    const chronological = [...items].reverse();
    mainContent.innerHTML = `
      <section class="view timeline-panel" aria-labelledby="timelineHeading">
        <header class="view-heading timeline-heading">
          <div><h1 id="timelineHeading">Timeline</h1><p>DRAG LEFT OR RIGHT</p></div>
          <div class="timeline-controls">
            <button type="button" data-timeline-direction="left" aria-label="Move timeline left">←</button>
            <button type="button" data-timeline-direction="right" aria-label="Move timeline right">→</button>
          </div>
        </header>
        <div class="timeline-viewport" id="timelineViewport" tabindex="0" aria-label="Publication timeline">
          <div class="timeline-track">
            <span class="timeline-line" aria-hidden="true"></span>
            ${chronological.map(timelineItem).join("")}
          </div>
        </div>
      </section>`;

    const viewport = document.querySelector("#timelineViewport");
    requestAnimationFrame(() => {
      viewport.scrollLeft = viewport.scrollWidth;
    });
  }

  function renderContact() {
    mainContent.innerHTML = `
      <section class="view contact-panel" aria-labelledby="contactHeading">
        <header class="view-heading">
          <h1 id="contactHeading">Contact</h1>
          <p>Placeholder</p>
        </header>
        <form class="contact-form" id="contactForm">
          <label>NAME<input name="name" type="text" autocomplete="name" placeholder="Placeholder" required></label>
          <label>EMAIL<input name="email" type="email" autocomplete="email" placeholder="Placeholder" required></label>
          <label>MESSAGE<textarea name="message" rows="6" placeholder="Placeholder" required></textarea></label>
          <button type="submit">SEND <span>→</span></button>
        </form>
      </section>`;
  }

  function renderView(view) {
    activeView = view;
    navigationButtons.forEach((button) => {
      const isActive = button.dataset.view === view;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (view === "reports") renderReports();
    if (view === "videos") renderVideos();
    if (view === "timeline") renderTimeline();
    if (view === "contact") renderContact();
  }

  function beginEntrance() {
    if (!body.classList.contains("entrance-idle")) return;
    enterButton.disabled = true;

    if (reduceMotion.matches) {
      body.className = "entrance-open";
      mainContent.focus({ preventScroll: true });
      return;
    }

    body.className = "entrance-rising";
    window.setTimeout(() => {
      body.className = "entrance-docking";
      window.setTimeout(() => {
        body.className = "entrance-open";
        mainContent.focus({ preventScroll: true });
      }, 920);
    }, 1050);
  }

  function openDetail(itemId, opener) {
    const item = items.find((candidate) => candidate.id === itemId);
    if (!item) return;
    previousFocus = opener;
    detailMeta.innerHTML = `<span>${item.kind}</span><span>${item.date}</span><span>${item.number}</span>`;
    detailTitle.textContent = item.title;
    detailContent.innerHTML = item.kind === "VIDEO"
      ? `<div class="detail-video">INSERT VIDEO HERE</div>`
      : `<article class="detail-report"><p>Placeholder</p></article>`;
    detailPanel.hidden = false;
    document.body.style.overflow = "hidden";
    detailClose.focus();
  }

  function closeDetail() {
    detailPanel.hidden = true;
    document.body.style.overflow = "";
    if (previousFocus) previousFocus.focus();
  }

  function handleMainClick(event) {
    const directionButton = event.target.closest("[data-timeline-direction]");
    if (directionButton) {
      const viewport = document.querySelector("#timelineViewport");
      const amount = directionButton.dataset.timelineDirection === "left" ? -360 : 360;
      viewport.scrollBy({ left: amount, behavior: reduceMotion.matches ? "auto" : "smooth" });
      return;
    }

    const itemButton = event.target.closest("[data-open-item]");
    if (itemButton && !suppressTimelineClick) {
      openDetail(itemButton.dataset.openItem, itemButton);
    }
  }

  function handleMainKeydown(event) {
    const itemButton = event.target.closest("[data-open-item]");
    if (itemButton && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openDetail(itemButton.dataset.openItem, itemButton);
    }

    const viewport = event.target.closest("#timelineViewport");
    if (viewport && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      viewport.scrollBy({ left: event.key === "ArrowLeft" ? -280 : 280, behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
  }

  function handlePointerDown(event) {
    const viewport = event.target.closest("#timelineViewport");
    if (!viewport) return;
    dragState = {
      viewport,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: viewport.scrollLeft,
      moved: false
    };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");
  }

  function handlePointerMove(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const distance = event.clientX - dragState.startX;
    if (Math.abs(distance) > 5) dragState.moved = true;
    dragState.viewport.scrollLeft = dragState.scrollLeft - distance;
  }

  function handlePointerEnd(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const { viewport, moved, pointerId } = dragState;
    if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
    viewport.classList.remove("is-dragging");
    suppressTimelineClick = moved;
    dragState = null;
    window.setTimeout(() => {
      suppressTimelineClick = false;
    }, 0);
  }

  function handleSubmit(event) {
    if (!event.target.matches("#contactForm")) return;
    event.preventDefault();
    event.target.outerHTML = `
      <div class="contact-success" role="status">
        ${sunMarkup}
        <h2>Message received.</h2>
        <p>Placeholder</p>
      </div>`;
  }

  function handleDocumentKeydown(event) {
    if (!detailPanel.hidden && event.key === "Escape") {
      closeDetail();
      return;
    }

    if (!detailPanel.hidden && event.key === "Tab") {
      const focusable = [...detailPanel.querySelectorAll("button, [href], input, textarea, [tabindex]:not([tabindex='-1'])")]
        .filter((element) => !element.disabled && !element.hidden);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  enterButton.addEventListener("click", beginEntrance);
  homeButton.addEventListener("click", () => {
    renderView("reports");
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
  });
  navigationButtons.forEach((button) => {
    button.addEventListener("click", () => renderView(button.dataset.view));
  });
  mainContent.addEventListener("click", handleMainClick);
  mainContent.addEventListener("keydown", handleMainKeydown);
  mainContent.addEventListener("pointerdown", handlePointerDown);
  mainContent.addEventListener("pointermove", handlePointerMove);
  mainContent.addEventListener("pointerup", handlePointerEnd);
  mainContent.addEventListener("pointercancel", handlePointerEnd);
  mainContent.addEventListener("submit", handleSubmit);
  detailClose.addEventListener("click", closeDetail);
  document.addEventListener("keydown", handleDocumentKeydown);

  renderView(activeView);
})();
