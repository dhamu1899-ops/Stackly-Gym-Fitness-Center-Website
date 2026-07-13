/* =========================================================
   STACKLY — Shared JavaScript
   Loader, Navigation, Reveal Animations, Counters,
   Testimonial Slider, FAQ, Forms
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initTestimonialSlider();
  initFAQ();
  initContactForm();
  initNewsletterForm();
  initScrollTop();
  initImageFallback();
  initPasswordToggles();
  initAuthForms();
  initDashboardSidebar();
  initGoalBars();
  initDashCharts();
  initBmiCalculator();
  initPricingToggle();
  initScheduleTabs();
  initPlaceholderLinks();
  initSocialAuthButtons();
  initDashboardViews();
  initGoBackButton();
});

/* ---------- Placeholder Links ----------
   Any <a href="#"> that isn't wired to a JS widget (all interactive
   widgets on this site use <button>, never <a href="#">) is a
   non-functional demo link. Social icons route to the 404 page;
   every other placeholder link routes back to the homepage. Links
   that open a dashboard content view (data-view) are left alone. */
function initPlaceholderLinks() {
  const socialSelector = '.topbar-social a, .footer-social a, .trainer-social a';
  document.querySelectorAll(socialSelector).forEach((a) => {
    if (a.getAttribute("href") !== "#") return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "404.html";
    });
  });

  // Inside a dashboard, any non-functional content click (row actions,
  // "view all" links, etc.) goes to the 404 page rather than home —
  // sidebar menu items (data-view) and the explicit "Back to Website"
  // / logout links are left alone since those are real navigation.
  document.querySelectorAll('.dash-main a[href="#"]').forEach((a) => {
    if (a.dataset.view) return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "404.html";
    });
  });

  document.querySelectorAll('a[href="#"]').forEach((a) => {
    if (a.matches(socialSelector)) return;
    if (a.dataset.view) return;
    if (a.closest(".dash-main")) return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "index.html";
    });
  });
}

/* ---------- Social Auth Buttons (Login / Signup) ---------- */
function initSocialAuthButtons() {
  document.querySelectorAll(".social-auth button").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  });
}

/* ---------- Dashboard Sidebar View Switching ----------
   Each sidebar link with a [data-view] attribute shows its own
   content panel ([data-view-panel]) inside .dash-content, and hides
   the rest — giving every menu item unique, real content instead of
   a dead link. */
function initDashboardViews() {
  const links = document.querySelectorAll(".dash-nav a[data-view]");
  const panels = document.querySelectorAll("[data-view-panel]");
  if (!links.length || !panels.length) return;

  const titleEl = document.querySelector(".dash-topbar h1");
  const defaultTitle = titleEl ? titleEl.textContent : "";

  const activate = (view) => {
    panels.forEach((p) => {
      p.style.display = p.dataset.viewPanel === view ? "" : "none";
    });
    links.forEach((l) => l.classList.toggle("active", l.dataset.view === view));
    if (titleEl) {
      const activeLink = [...links].find((l) => l.dataset.view === view);
      titleEl.textContent = view === "overview" ? defaultTitle : (activeLink ? activeLink.textContent.trim() : defaultTitle);
    }
    const sidebar = document.querySelector(".dash-sidebar");
    const backdrop = document.querySelector(".dash-sidebar-backdrop");
    if (sidebar && sidebar.classList.contains("open") && window.innerWidth <= 1023) {
      sidebar.classList.remove("open");
      if (backdrop) { backdrop.style.opacity = "0"; backdrop.style.visibility = "hidden"; }
    }
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      activate(link.dataset.view);
    });
  });
}

/* ---------- BMI Calculator ---------- */
function initBmiCalculator() {
  const form = document.getElementById("bmi-form");
  if (!form) return;
  const weightEl = document.getElementById("bmi-weight");
  const heightEl = document.getElementById("bmi-height");
  const resultEl = document.getElementById("bmi-result-value");
  const labelEl = document.getElementById("bmi-result-label");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const w = parseFloat(weightEl.value);
    const h = parseFloat(heightEl.value) / 100;
    if (!w || !h) {
      resultEl.textContent = "--";
      labelEl.textContent = "Enter weight & height";
      return;
    }
    const bmi = w / (h * h);
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else if (bmi >= 30) category = "Obese";
    resultEl.textContent = bmi.toFixed(1);
    labelEl.textContent = category;
  });
}

/* ---------- Pricing Monthly / Yearly Toggle ---------- */
function initPricingToggle() {
  const switchEl = document.getElementById("price-switch");
  if (!switchEl) return;
  const cards = document.querySelectorAll("[data-monthly][data-yearly]");
  const labels = document.querySelectorAll(".pricing-toggle-wrap .label");

  switchEl.addEventListener("click", () => {
    const yearly = !switchEl.classList.contains("yearly");
    switchEl.classList.toggle("yearly", yearly);
    labels.forEach((l) => l.classList.toggle("active"));
    cards.forEach((card) => {
      const amountEl = card.querySelector(".price-amount-num");
      if (!amountEl) return;
      amountEl.textContent = yearly ? card.dataset.yearly : card.dataset.monthly;
      const periodEl = card.querySelector(".price-period");
      if (periodEl) periodEl.textContent = yearly ? "billed annually" : "billed monthly";
    });
  });
}

/* ---------- Class Schedule Tabs ---------- */
function initScheduleTabs() {
  const tabs = document.querySelectorAll(".schedule-tab");
  if (!tabs.length) return;
  const panels = document.querySelectorAll("[data-schedule-day]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const day = tab.dataset.day;
      panels.forEach((p) => {
        p.style.display = p.dataset.scheduleDay === day ? "" : "none";
      });
    });
  });
}

/* ---------- Loader ---------- */
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const MIN_DISPLAY = 1400; // ms - keeps loader from flashing, stays within 1-2s minimal / 2-5s ideal range
  const start = Date.now();

  const hideLoader = () => {
    const elapsed = Date.now() - start;
    const wait = Math.max(MIN_DISPLAY - elapsed, 0);
    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.classList.remove("no-scroll");
      // remove from DOM after transition completes (perf: don't keep animating offscreen node)
      setTimeout(() => loader.remove(), 700);
    }, wait);
  };

  document.body.classList.add("no-scroll");

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
    // Safety fallback: never let the loader block the page longer than 5s
    setTimeout(hideLoader, 5000);
  }
}

/* ---------- Navbar shrink-on-scroll + active link ---------- */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Highlight active nav link based on current page
  const current = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-link, .mobile-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ---------- Mobile Full-Screen Overlay Menu ---------- */
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const overlay = document.querySelector(".mobile-overlay");
  if (!toggle || !overlay) return;

  const closeMenu = () => {
    toggle.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    toggle.classList.add("open");
    overlay.classList.add("open");
    document.body.classList.add("no-scroll"); // lock background scroll; only overlay scrolls
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = overlay.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  overlay.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  // Mobile submenu accordion
  document.querySelectorAll(".mobile-parent").forEach((btn) => {
    btn.addEventListener("click", () => {
      const submenu = btn.nextElementSibling;
      const parentLi = btn.closest("li");
      const isOpen = submenu.classList.contains("open");
      submenu.classList.toggle("open", !isOpen);
      parentLi.classList.toggle("open", !isOpen);
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------- Scroll Reveal (IntersectionObserver) ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => io.observe(el));
}

/* ---------- Animated Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => io.observe(el));
}

/* ---------- Testimonial Slider ---------- */
function initTestimonialSlider() {
  const track = document.querySelector(".testi-track");
  const dotsWrap = document.querySelector(".testi-dots");
  if (!track || !dotsWrap) return;

  const slides = track.children;
  const total = slides.length;
  let index = 0;
  let timer;

  const goTo = (i) => {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dotsWrap.children].forEach((d, di) => d.classList.toggle("active", di === index));
  };

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goTo(i);
      resetTimer();
    });
    dotsWrap.appendChild(dot);
  }

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 5000);
  };

  resetTimer();
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : null;
    });
  });
}

/* ---------- Contact Form Validation ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");

  const validators = {
    name: (v) => v.trim().length >= 2 || "Please enter your full name.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address.",
    phone: (v) => v.trim() === "" || /^[0-9+\-\s()]{7,}$/.test(v.trim()) || "Enter a valid phone number.",
    subject: (v) => v.trim().length >= 3 || "Please add a subject.",
    message: (v) => v.trim().length >= 10 || "Message should be at least 10 characters.",
  };

  const validateField = (field) => {
    const name = field.name;
    const rule = validators[name];
    if (!rule) return true;
    const result = rule(field.value);
    const wrapper = field.closest(".field");
    if (result === true) {
      wrapper.classList.remove("has-error");
      return true;
    } else {
      wrapper.classList.add("has-error");
      const errEl = wrapper.querySelector(".error-msg");
      if (errEl) errEl.textContent = result;
      return false;
    }
  };

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("has-error")) validateField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll("input[name], textarea[name]").forEach((field) => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      status.textContent = "Please fix the highlighted fields before submitting.";
      status.className = "form-status error";
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Simulated submit (frontend-only demo). Wire this to your backend/API.
    setTimeout(() => {
      status.textContent = "Thanks! Your message has been sent — we'll get back to you within 24 hours.";
      status.className = "form-status success";
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      setTimeout(() => {
        window.location.href = "404.html";
      }, 900);
    }, 900);
  });
}

/* ---------- Newsletter Form (Footer) ---------- */
function initNewsletterForm() {
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    const input = form.querySelector("input[type='email']");
    const msg = form.parentElement.querySelector(".form-msg");
    const btn = form.querySelector("button[type='submit']");
    const btnOriginalText = btn ? btn.textContent : "Subscribe";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!msg) return;

      if (!isValid) {
        msg.textContent = "Please enter a valid email address.";
        msg.className = "form-msg error";
        return;
      }

      if (btn) {
        btn.textContent = "Subscribing...";
        btn.disabled = true;
        btn.classList.add("is-loading");
      }
      msg.textContent = "";
      msg.className = "form-msg";
      form.reset();

      setTimeout(() => {
        window.location.href = "404.html";
      }, 900);
    });
  });
}

/* ---------- Scroll To Top ---------- */
function initScrollTop() {
  const btn = document.querySelector(".scroll-top");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("show", window.scrollY > 500);
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Image Fallback ----------
   Any <img> inside a .photo container that fails to load
   (e.g. no network) is hidden, revealing the gradient +
   icon already sitting behind it — never a broken image icon. */
function initImageFallback() {
  document.querySelectorAll(".photo img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("img-error");
    });
    // Handle images that failed before the listener attached
    if (img.complete && img.naturalWidth === 0) {
      img.classList.add("img-error");
    }
  });
}

/* ---------- Password Visibility Toggle ---------- */
function initPasswordToggles() {
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    btn.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.innerHTML = isHidden
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });
  });
}

/* ---------- Login / Signup Forms ---------- */
function initAuthForms() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const status = loginForm.querySelector(".form-status");
    const validators = {
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address.",
      password: (v) => v.length >= 6 || "Password must be at least 6 characters.",
    };
    wireValidation(loginForm, validators);

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      loginForm.querySelectorAll("input[name]").forEach((f) => {
        if (!validateOne(f, validators)) valid = false;
      });
      if (!valid) {
        status.textContent = "Please fix the highlighted fields.";
        status.className = "form-status error";
        return;
      }
      const btn = loginForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Signing in...";
      const roleField = loginForm.querySelector('input[name="role"]:checked');
      const role = roleField ? roleField.value : "user";
      const destination = role === "admin" ? "dashboard-admin.html" : "dashboard-user.html";
      setTimeout(() => {
        status.textContent = "Login successful — redirecting to your " + (role === "admin" ? "admin " : "") + "dashboard...";
        status.className = "form-status success";
        setTimeout(() => {
          window.location.href = destination;
        }, 700);
      }, 800);
    });
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    const status = signupForm.querySelector(".form-status");
    const validators = {
      name: (v) => v.trim().length >= 2 || "Please enter your full name.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address.",
      password: (v) => v.length >= 8 || "Password must be at least 8 characters.",
      confirmPassword: (v) => {
        const pw = signupForm.querySelector("#signup-password").value;
        return v === pw || "Passwords do not match.";
      },
    };
    wireValidation(signupForm, validators);

    const pwInput = signupForm.querySelector("#signup-password");
    const strengthBar = signupForm.querySelector(".password-strength");
    if (pwInput && strengthBar) {
      pwInput.addEventListener("input", () => {
        const v = pwInput.value;
        let score = 0;
        if (v.length >= 8) score++;
        if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
        if (/[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v)) score++;
        strengthBar.className = "password-strength" + (v.length === 0 ? "" : score <= 1 ? " weak" : score === 2 ? " medium" : " strong");
      });
    }

    const terms = signupForm.querySelector("#terms");

    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      signupForm.querySelectorAll("input[name]").forEach((f) => {
        if (!validateOne(f, validators)) valid = false;
      });
      if (terms && !terms.checked) {
        status.textContent = "Please accept the Terms & Privacy Policy to continue.";
        status.className = "form-status error";
        return;
      }
      if (!valid) {
        status.textContent = "Please fix the highlighted fields.";
        status.className = "form-status error";
        return;
      }
      const btn = signupForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Creating account...";
      setTimeout(() => {
        status.textContent = "Account created — redirecting you to Stackly...";
        status.className = "form-status success";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 700);
      }, 800);
    });
  }
}

function wireValidation(form, validators) {
  form.querySelectorAll("input[name]").forEach((field) => {
    field.addEventListener("blur", () => validateOne(field, validators));
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("has-error")) validateOne(field, validators);
    });
  });
}

function validateOne(field, validators) {
  const rule = validators[field.name];
  if (!rule) return true;
  const result = rule(field.value);
  const wrapper = field.closest(".field");
  if (result === true) {
    wrapper.classList.remove("has-error");
    return true;
  }
  wrapper.classList.add("has-error");
  const errEl = wrapper.querySelector(".error-msg");
  if (errEl) errEl.textContent = result;
  return false;
}

/* ---------- Dashboard Sidebar (mobile) ---------- */
function initDashboardSidebar() {
  const toggle = document.querySelector(".dash-sidebar-toggle");
  const sidebar = document.querySelector(".dash-sidebar");
  if (!toggle || !sidebar) return;

  const backdrop = document.createElement("div");
  backdrop.className = "dash-sidebar-backdrop";
  backdrop.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:190;opacity:0;visibility:hidden;transition:opacity .3s ease;";
  document.body.appendChild(backdrop);

  const close = () => {
    sidebar.classList.remove("open");
    backdrop.style.opacity = "0";
    backdrop.style.visibility = "hidden";
  };
  const open = () => {
    sidebar.classList.add("open");
    backdrop.style.opacity = "1";
    backdrop.style.visibility = "visible";
  };

  toggle.addEventListener("click", () => {
    sidebar.classList.contains("open") ? close() : open();
  });
  backdrop.addEventListener("click", close);
}

/* ---------- Goal / Progress Bars ---------- */
function initGoalBars() {
  document.querySelectorAll(".goal-bar-fill[data-goal]").forEach((bar) => {
    const target = bar.getAttribute("data-goal");
    requestAnimationFrame(() => {
      bar.style.width = target + "%";
    });
  });
}

/* ---------- Dashboard Charts (Chart.js) ---------- */
function initDashCharts() {
  if (typeof Chart === "undefined") return;

  Chart.defaults.color = "#9ba0b0";
  Chart.defaults.font.family = "Inter, sans-serif";
  Chart.defaults.borderColor = "rgba(255, 255, 255, 0.08)";

  const activityCanvas = document.getElementById("activityChart");
  if (activityCanvas) {
    new Chart(activityCanvas, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Calories Burned",
            data: [420, 610, 380, 720, 540, 890, 460],
            borderColor: "#ed1b2e",
            backgroundColor: "rgba(237, 27, 46, 0.15)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#ed1b2e",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: "rgba(255, 255, 255, 0.08)" }, beginAtZero: true },
          x: { grid: { display: false } },
        },
      },
    });
  }

  const revenueCanvas = document.getElementById("revenueChart");
  if (revenueCanvas) {
    new Chart(revenueCanvas, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Revenue (₹k)",
            data: [420, 460, 510, 495, 560, 610, 685],
            borderColor: "#ed1b2e",
            backgroundColor: "rgba(237, 27, 46, 0.15)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#ed1b2e",
            pointRadius: 3,
          },
          {
            label: "New Members",
            data: [60, 72, 68, 80, 75, 92, 101],
            borderColor: "#14151d",
            backgroundColor: "rgba(20, 21, 29, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#14151d",
            pointRadius: 3,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: "rgba(255, 255, 255, 0.08)" }, beginAtZero: true },
          y1: { position: "right", grid: { display: false }, beginAtZero: true },
          x: { grid: { display: false } },
        },
      },
    });
  }

  const membershipCanvas = document.getElementById("membershipChart");
  if (membershipCanvas) {
    new Chart(membershipCanvas, {
      type: "doughnut",
      data: {
        labels: ["Basic", "Pro", "Elite"],
        datasets: [
          {
            data: [38, 45, 17],
            backgroundColor: ["#ed1b2e", "#14151d", "#e0a83a"],
            borderColor: "#1c1e29",
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: { legend: { display: false } },
      },
    });
  }
}

/* ---------- 404 Go Back Button ---------- */
function initGoBackButton() {
  const btn = document.getElementById("go-back-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  });
}
