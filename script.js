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
  initDashboardUserInfo();
  initDashboardLogout();
  initHero3D();
  initFooterYear();
});

/* ---------- Footer: always show the current year ---------- */
function initFooterYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll(".copyright-year").forEach((el) => {
    el.textContent = year;
  });
}

/* ---------- Dashboard: show the logged-in user's info ----------
   After a successful login, initAuthForms() stashes the email and a
   derived display name in sessionStorage. On the dashboard pages we
   read that back and update the welcome heading, avatar initials
   (sidebar + topbar) and add the email next to the topbar avatar.
   If nothing is in sessionStorage (dashboard opened directly, no
   login), the original static demo content is left untouched. */
function initDashboardUserInfo() {
  const topbarH1 = document.querySelector(".dash-topbar h1");
  if (!topbarH1) return;

  const email = sessionStorage.getItem("stackly_user_email");
  const name = sessionStorage.getItem("stackly_user_name");
  if (!email || !name) return;

  const firstName = name.split(" ")[0];
  const initial = name.charAt(0).toUpperCase();

  if (/^Welcome back/i.test(topbarH1.textContent)) {
    topbarH1.textContent = "Welcome back, " + firstName;
  }

  document.querySelectorAll(".dash-user-avatar").forEach((el) => {
    el.textContent = initial;
  });

  const sidebarName = document.querySelector(".dash-user-card strong");
  if (sidebarName) sidebarName.textContent = name;

  const topbarActions = document.querySelector(".dash-topbar-actions");
  const topbarAvatar = topbarActions ? topbarActions.querySelector(".dash-user-avatar") : null;
  if (topbarActions && topbarAvatar) {
    let emailLabel = topbarActions.querySelector(".dash-user-email");
    if (!emailLabel) {
      emailLabel = document.createElement("span");
      emailLabel.className = "dash-user-email";
      topbarActions.insertBefore(emailLabel, topbarAvatar);
    }
    emailLabel.textContent = email;
  }
}

/* Clear the session on logout so a fresh visit shows demo content again. */
function initDashboardLogout() {
  document.querySelectorAll(".dash-logout").forEach((link) => {
    link.addEventListener("click", () => {
      sessionStorage.removeItem("stackly_user_email");
      sessionStorage.removeItem("stackly_user_name");
      sessionStorage.removeItem("stackly_user_role");
    });
  });
}

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

  // Inside a dashboard, EVERY content/action click (links or buttons —
  // "Manage Plan", "Upgrade to Elite", "Save Changes", notification bell,
  // row actions, "view all", etc.) goes to the 404 page only. It never
  // navigates to home, pricing, or any other real page. The only
  // exceptions are the sidebar menu items (data-view, client-side panel
  // switching), the sidebar logo, and the logout link (real navigation),
  // none of which live inside .dash-main.
  document.querySelectorAll(".dash-main a, .dash-main button").forEach((el) => {
    if (el.dataset.view) return;
    if (el.classList.contains("dash-sidebar-toggle")) return;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "404.html";
    });
  });

  document.querySelectorAll('a[href="#"]').forEach((a) => {
    if (a.matches(socialSelector)) return;
    if (a.classList.contains("forgot-link")) return;
    if (a.dataset.view) return;
    if (a.closest(".dash-main")) return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "index.html";
    });
  });
}

/* ---------- Social Auth Buttons (Login / Signup) + Forgot Password ----------
   Google / Apple continue-with buttons and the "Forgot password?" link are
   demo-only (no real auth backend), so they route to the 404 page. */
function initSocialAuthButtons() {
  document.querySelectorAll(".social-auth button").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "404.html";
    });
  });

  document.querySelectorAll(".forgot-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "404.html";
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
  const navbar = document.querySelector(".navbar");
  if (!toggle || !overlay) return;

  // Position the overlay to start exactly below the real navbar (accounts for
  // the .topbar row above it, which is only visible when the page is unscrolled).
  const syncOverlayPosition = () => {
    if (!navbar) return;
    const bottom = navbar.getBoundingClientRect().bottom;
    overlay.style.top = Math.max(bottom, 0) + "px";
  };

  const closeMenu = () => {
    toggle.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    syncOverlayPosition();
    toggle.classList.add("open");
    overlay.classList.add("open");
    document.body.classList.add("no-scroll"); // lock background scroll; only overlay scrolls
    toggle.setAttribute("aria-expanded", "true");
  };

  window.addEventListener("resize", () => {
    if (overlay.classList.contains("open")) syncOverlayPosition();
  });

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
      status.className = "form-status show error";
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Simulated submit (frontend-only demo). Wire this to your backend/API.
    setTimeout(() => {
      status.textContent = "Thanks! Your message has been sent — we'll get back to you within 24 hours.";
      status.className = "form-status show success";
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
        status.className = "form-status show error";
        return;
      }
      const btn = loginForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Signing in...";
      const roleField = loginForm.querySelector('input[name="role"]:checked');
      const role = roleField ? roleField.value : "user";
      const destination = role === "admin" ? "dashboard-admin.html" : "dashboard-user.html";

      // Capture the logged-in email and derive a display name from it so
      // the destination dashboard can show "Welcome, <Name>" + initials.
      const emailField = loginForm.querySelector('input[name="email"]');
      const email = emailField ? emailField.value.trim() : "";
      if (email) {
        const localPart = email.split("@")[0];
        const displayName = localPart
          .replace(/[._-]+/g, " ")
          .split(" ")
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        sessionStorage.setItem("stackly_user_email", email);
        sessionStorage.setItem("stackly_user_name", displayName || "Member");
        sessionStorage.setItem("stackly_user_role", role);
      }

      setTimeout(() => {
        status.textContent = "Login successful — redirecting to your " + (role === "admin" ? "admin " : "") + "dashboard...";
        status.className = "form-status show success";
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
        status.className = "form-status show error";
        return;
      }
      if (!valid) {
        status.textContent = "Please fix the highlighted fields.";
        status.className = "form-status show error";
        return;
      }
      const btn = signupForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Creating account...";
      setTimeout(() => {
        status.textContent = "Signup successful — redirecting you to login...";
        status.className = "form-status show success";
        setTimeout(() => {
          window.location.href = "login.html";
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
            label: "Revenue (thousands)",
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

/* ---------- Hero 3D Workout Animation (Three.js) ----------
   Builds a small low-poly 3D humanoid rig that does a continuous
   dumbbell bicep-curl while slowly rotating, rendered into the
   hero visual. If Three.js failed to load (offline preview, blocked
   CDN, etc.) the static photo fallback already in the markup stays
   visible and this function quietly does nothing. */
function initHero3D() {
  const stage = document.getElementById("hero3d-stage");
  const canvas = document.getElementById("hero3d-canvas");
  if (!stage || !canvas || typeof THREE === "undefined") return;

  const fallback = stage.querySelector(".hero-3d-fallback");

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.15, 6.4);
  camera.lookAt(0, 0.9, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0xed1b2e, 1.4, 12);
  rim.position.set(-2.5, 2, -2);
  scene.add(rim);
  const fill = new THREE.PointLight(0x4a6cff, 0.35, 12);
  fill.position.set(2.5, 0.5, 2.5);
  scene.add(fill);

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x20222c, roughness: 0.55, metalness: 0.15 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0x9aa0b4, roughness: 0.5, metalness: 0.1 });
  const accentMat = new THREE.MeshStandardMaterial({ color: 0xed1b2e, roughness: 0.35, metalness: 0.3, emissive: 0x4a0007, emissiveIntensity: 0.4 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x2c2e38, roughness: 0.3, metalness: 0.7 });

  const rig = new THREE.Group();

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 16), skinMat);
  head.position.set(0, 1.62, 0);
  rig.add(head);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.16, 12), skinMat);
  neck.position.set(0, 1.34, 0);
  rig.add(neck);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.36, 1.05, 14), bodyMat);
  torso.position.set(0, 0.75, 0);
  rig.add(torso);

  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.32, 14), bodyMat);
  hips.position.set(0, 0.18, 0);
  rig.add(hips);

  const legGeo = new THREE.CylinderGeometry(0.16, 0.13, 0.95, 12);
  const legL = new THREE.Mesh(legGeo, bodyMat);
  legL.position.set(-0.19, -0.5, 0);
  rig.add(legL);
  const legR = new THREE.Mesh(legGeo, bodyMat);
  legR.position.set(0.19, -0.5, 0);
  rig.add(legR);

  const footGeo = new THREE.BoxGeometry(0.22, 0.12, 0.38);
  const footL = new THREE.Mesh(footGeo, accentMat);
  footL.position.set(-0.19, -1.03, 0.08);
  rig.add(footL);
  const footR = new THREE.Mesh(footGeo, accentMat);
  footR.position.set(0.19, -1.03, 0.08);
  rig.add(footR);

  // Static right arm, resting at the side
  const armGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.55, 10);
  const rightArm = new THREE.Mesh(armGeo, skinMat);
  rightArm.position.set(0.58, 0.62, 0);
  rightArm.rotation.z = 0.12;
  rig.add(rightArm);
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), skinMat);
  rightHand.position.set(0.62, 0.34, 0);
  rig.add(rightHand);

  // Animated left arm doing a dumbbell curl: shoulder pivot -> upper arm,
  // elbow pivot -> forearm + dumbbell.
  const shoulderPivot = new THREE.Group();
  shoulderPivot.position.set(-0.58, 1.02, 0);
  rig.add(shoulderPivot);

  const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.1, 0.5, 10), skinMat);
  upperArm.position.set(0, -0.25, 0);
  shoulderPivot.add(upperArm);

  const elbowPivot = new THREE.Group();
  elbowPivot.position.set(0, -0.5, 0);
  shoulderPivot.add(elbowPivot);

  const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.48, 10), skinMat);
  forearm.position.set(0, -0.24, 0);
  elbowPivot.add(forearm);

  const dumbbell = new THREE.Group();
  dumbbell.position.set(0, -0.48, 0);
  const dbBar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.42, 8), metalMat);
  dbBar.rotation.z = Math.PI / 2;
  dumbbell.add(dbBar);
  const dbWeightGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.12, 12);
  const dbWeightL = new THREE.Mesh(dbWeightGeo, accentMat);
  dbWeightL.rotation.z = Math.PI / 2;
  dbWeightL.position.set(-0.18, 0, 0);
  dumbbell.add(dbWeightL);
  const dbWeightR = new THREE.Mesh(dbWeightGeo, accentMat);
  dbWeightR.rotation.z = Math.PI / 2;
  dbWeightR.position.set(0.18, 0, 0);
  dumbbell.add(dbWeightR);
  elbowPivot.add(dumbbell);

  rig.position.y = -0.35;
  rig.rotation.y = -0.45;
  scene.add(rig);

  function resize() {
    const w = stage.clientWidth || 1;
    const h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let rendered = false;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Bicep curl: elbow swings between resting and fully curled.
    const curl = (Math.sin(t * 1.6) + 1) / 2; // 0..1
    elbowPivot.rotation.x = -curl * 2.0;
    shoulderPivot.rotation.x = -0.15 - curl * 0.08;

    // Slow full-body showcase rotation + gentle idle bob.
    rig.rotation.y += 0.0035;
    rig.position.y = -0.35 + Math.sin(t * 1.1) * 0.02;

    // Slight breathing scale on the torso for life-like motion.
    torso.scale.y = 1 + Math.sin(t * 1.1) * 0.012;

    renderer.render(scene, camera);

    if (!rendered) {
      rendered = true;
      stage.classList.add("hero3d-ready");
      if (fallback) fallback.style.display = "none";
    }
  }
  animate();
}
