var CONFIG = {

    businessEmail: "kgopotsomadibana42@gmail.com",

    formEndpoint: "https://formspree.io/f/xgaanged",

    address: "61 Blouberg Street, Bochum, South Africa",

    mapQuery: "61 Blouberg Street, Bochum, South Africa",

    timeZone: "Africa/Johannesburg"
};

var PAGE = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

document.addEventListener("DOMContentLoaded", function () {
    injectStyles();
    setActiveNavLink();
    updateFooterYear();
    showOpenStatus();
    showDailySpecial();
    setupBackToTop();
    setupScrollReveal();
    setupProductSearch();
    setupGallery();
    setupLightbox();
    setupMap();
    setupEnquiryForm();
    setupContactForm();
});

function injectStyles() {
    var css = "\
    .open-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:.9rem;font-weight:700;margin-top:6px;color:#fff}\
    .open-badge.open{background:#3c8d4f}\
    .open-badge.closed{background:#a8453a}\
    \
    .daily-special{background:linear-gradient(135deg,#f5e6d3,#e8d5c4);border-left:6px solid #c9a77b;border-radius:14px;padding:16px 20px;margin-bottom:24px}\
    .daily-special h3{margin:0 0 6px}\
    .daily-special p{margin:0 0 10px}\
    \
    #backToTop{position:fixed;bottom:24px;right:24px;width:46px;height:46px;border-radius:50%;border:none;background:#8b6b4c;color:#fff;font-size:1.3rem;cursor:pointer;display:none;box-shadow:0 4px 12px rgba(0,0,0,.25);z-index:900;margin:0;padding:0}\
    #backToTop:hover{background:#5a3a22}\
    \
    .reveal{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}\
    .reveal.visible{opacity:1;transform:none}\
    @media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}\
    \
    .gallery-tools{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;margin:18px 0}\
    .gallery-tools button{margin:0;padding:8px 18px;font-size:.9rem}\
    .gallery-tools button.active{background:#5a3a22}\
    .gallery-tools input{padding:8px 14px;border:2px solid #e8d5c4;border-radius:20px;font-size:1rem;min-width:200px;width:auto}\
    .search-status{text-align:center;font-style:italic;min-height:1.4em}\
    \
    .lightbox{position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(20,12,6,.92);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}\
    .lightbox[hidden]{display:none}\
    .lb-figure{margin:0;max-width:min(92vw,1000px);text-align:center}\
    .lb-img{max-width:100%;max-height:75vh;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.5);display:inline-block}\
    .lb-caption{color:#fff;margin-top:12px;font-size:1.05rem}\
    .lightbox button{position:absolute;margin:0;padding:0;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.15);color:#fff;font-size:1.6rem;box-shadow:none;display:flex;align-items:center;justify-content:center}\
    .lightbox button:hover{background:rgba(255,255,255,.35);transform:none;box-shadow:none}\
    .lightbox .lb-close{top:16px;right:16px}\
    .lightbox .lb-prev{left:16px;top:calc(50% - 24px)}\
    .lightbox .lb-next{right:16px;top:calc(50% - 24px)}\
    .lb-counter{position:absolute;top:26px;left:20px;color:#fff;font-weight:600}\
    @media (max-width:480px){.lb-img{max-height:60vh}}\
    \
    .map-controls{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}\
    .map-controls button{margin:0;padding:8px 16px;font-size:.9rem}\
    .map-controls button.active{background:#5a3a22}\
    .map-status{font-style:italic;min-height:1.4em}\
    \
    .form-message{margin-top:16px;padding:14px 18px;border-radius:12px;font-weight:600}\
    .form-message:focus{outline:2px solid #8b6b4c}\
    .form-message.error{background:#fbe4e1;color:#8a2b20;border:1px solid #e8a79f}\
    .form-message.success{background:#e3f3e6;color:#245a33;border:1px solid #9fd0ab}\
    .form-message ul{margin:6px 0 0;font-weight:400}\
    .form-message small{font-weight:400}\
    .invalid-field{border-color:#c0392b !important}\
    .field-error{display:block;color:#a8281c;font-size:.9rem;margin-top:4px}\
    .char-counter{display:block;font-size:.85rem;color:#7a5538;margin-top:2px}\
    ";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
}

  
function getSATime() {
    var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: CONFIG.timeZone,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).formatToParts(new Date());

    var info = { day: "", hour: 0, minute: 0 };
    parts.forEach(function (p) {
        if (p.type === "weekday") info.day = p.value;
        if (p.type === "hour") info.hour = parseInt(p.value, 10) % 24;
        if (p.type === "minute") info.minute = parseInt(p.value, 10);
    });
    info.mins = info.hour * 60 + info.minute;
    info.dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(info.day);
    return info;
}

function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
}

function isValidPhone(value) {
    return /^\+?\d{9,13}$/.test(value.replace(/[\s\-()]/g, ""));
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function formatRand(n) {
    return "R" + n.toLocaleString("en-ZA", {
        minimumFractionDigits: n % 1 ? 2 : 0,
        maximumFractionDigits: 2
    });
}

/*
   1. NAVIGATION, FOOTER, OPEN/CLOSED BADGE
   */
function setActiveNavLink() {
    document.querySelectorAll("nav a").forEach(function (link) {
        if ((link.getAttribute("href") || "").toLowerCase() === PAGE) {
            link.classList.add("active");
            link.style.borderBottomColor = "#f5d6b3";
            link.setAttribute("aria-current", "page");
        }
    });
}

function updateFooterYear() {
    var year = new Date().getFullYear();
    document.querySelectorAll("footer p").forEach(function (p) {
        if (p.textContent.indexOf("\u00A9") !== -1) {
            p.innerHTML = "&copy; " + year + " Madibana Family Bakery. All rights reserved.";
        }
    });
}

/* Mon-Fri 08:00-18:00 | Sat 09:00-16:00 | Sun closed */
function showOpenStatus() {
    var header = document.querySelector("header");
    if (!header) return;

    var t = getSATime();
    var open = false;
    if (t.dayIndex >= 1 && t.dayIndex <= 5) open = t.mins >= 8 * 60 && t.mins < 18 * 60;
    else if (t.dayIndex === 6) open = t.mins >= 9 * 60 && t.mins < 16 * 60;

    var badge = document.createElement("div");
    badge.className = "open-badge " + (open ? "open" : "closed");
    badge.textContent = open ? "We are open now!" : "Sorry, we are currently closed";

    var slogan = header.querySelector("p");
    if (slogan) slogan.insertAdjacentElement("afterend", badge);
    else header.appendChild(badge);
}

/* 
   2. DYNAMIC CONTENT - GREETING + SPECIAL OF THE DAY
      (home page and products page)
    */
var DAILY_SPECIALS = [
    { name: "We are closed today", text: "Send us an enquiry and we will get back to you on Monday morning." },
    { name: "Muffin Monday", text: "Fresh muffins in different flavours from R15 each." },
    { name: "Scone Tuesday", text: "Soft homemade scones from R12 each - perfect with tea or coffee." },
    { name: "Pastry Wednesday", text: "Buy one, get one free on selected pastries all day!" },
    { name: "Cupcake Thursday", text: "Get a free cookie with every dozen cupcakes you buy." },
    { name: "Fresh Bread Friday", text: "White bread R18 and brown bread R20 per loaf, baked fresh." },
    { name: "Cake Saturday", text: "Order a custom celebration cake from R350." }
];

function showDailySpecial() {
    if (PAGE !== "index.html" && PAGE !== "product.html") return;
    var main = document.querySelector("main");
    if (!main) return;

    var t = getSATime();
    var greeting = t.hour < 12 ? "Good morning" : (t.hour < 17 ? "Good afternoon" : "Good evening");
    var special = DAILY_SPECIALS[t.dayIndex < 0 ? 0 : t.dayIndex];

    var box = document.createElement("div");
    box.className = "daily-special";

    var h = document.createElement("h3");
    h.textContent = greeting + "! Today's special: " + special.name;
    var p = document.createElement("p");
    p.textContent = special.text;
    var link = document.createElement("a");
    link.href = "enquiry.html";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Order or enquire";
    link.appendChild(btn);

    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(link);
    main.insertAdjacentElement("afterbegin", box);
}

/*
   3. BACK-TO-TOP BUTTON + SCROLL REVEAL
    */
function setupBackToTop() {
    var btn = document.createElement("button");
    btn.id = "backToTop";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = "&uarr;";
    document.body.appendChild(btn);

    window.addEventListener("scroll", function () {
        btn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function setupScrollReveal() {
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll("main section").forEach(function (s) {
        s.classList.add("reveal");
        observer.observe(s);
    });
}

/*
   4. SEARCH - PRODUCTS PAGE
    */
function setupProductSearch() {
    if (PAGE !== "product.html") return;
    var sections = document.querySelectorAll("main section");
    if (!sections.length) return;

    var wrap = document.createElement("div");
    wrap.className = "gallery-tools";

    var input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Search our products (e.g. cake, bread)...";
    input.setAttribute("aria-label", "Search products");
    wrap.appendChild(input);

    var status = document.createElement("p");
    status.className = "search-status";
    status.setAttribute("aria-live", "polite");

    sections[0].parentNode.insertBefore(wrap, sections[0]);
    wrap.insertAdjacentElement("afterend", status);

    var index = Array.prototype.map.call(sections, function (s) {
        var alts = Array.prototype.map.call(s.querySelectorAll("img"), function (i) { return i.alt; }).join(" ");
        return (s.textContent + " " + alts).toLowerCase();
    });

    input.addEventListener("input", function () {
        var term = input.value.trim().toLowerCase();
        var found = 0;
        sections.forEach(function (s, i) {
            var match = term === "" || index[i].indexOf(term) !== -1;
            s.style.display = match ? "" : "none";
            if (match) found++;
        });
        status.textContent = term === "" ? "" :
            (found === 0 ? 'No products match "' + input.value.trim() + '".' :
                found + " section" + (found > 1 ? "s" : "") + " found.");
    });
}

/* 
   5. SEARCH + CATEGORY FILTER - GALLERY PAGE
   */
function setupGallery() {
    var sections = Array.prototype.filter.call(
        document.querySelectorAll("main section"),
        function (s) { return s.querySelector(".gallery-flex-wrapper"); }
    );
    if (!sections.length) return;

    var tools = document.createElement("div");
    tools.className = "gallery-tools";
    var activeCategory = "All";

    var search = document.createElement("input");
    search.type = "search";
    search.placeholder = "Search the gallery...";
    search.setAttribute("aria-label", "Search the gallery");

    var names = ["All"].concat(sections.map(function (s) {
        var h2 = s.querySelector("h2");
        return h2 ? h2.textContent.trim() : "Section";
    }));

    var buttons = names.map(function (name) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = name.replace(/^Our /, "");
        if (name === "All") b.classList.add("active");
        b.addEventListener("click", function () {
            activeCategory = name;
            buttons.forEach(function (x) { x.classList.remove("active"); });
            b.classList.add("active");
            applyFilter();
        });
        tools.appendChild(b);
        return b;
    });
    tools.appendChild(search);

    var status = document.createElement("p");
    status.className = "search-status";
    status.setAttribute("aria-live", "polite");

    sections[0].parentNode.insertBefore(tools, sections[0]);
    tools.insertAdjacentElement("afterend", status);

    search.addEventListener("input", applyFilter);

    function applyFilter() {
        var term = search.value.trim().toLowerCase();
        var total = 0;

        sections.forEach(function (section, i) {
            var categoryMatch = activeCategory === "All" || activeCategory === names[i + 1];
            var visible = 0;
            section.querySelectorAll(".gallery-card").forEach(function (card) {
                var match = categoryMatch && card.textContent.toLowerCase().indexOf(term) !== -1;
                card.style.display = match ? "" : "none";
                if (match) visible++;
            });
            section.style.display = visible > 0 ? "" : "none";
            total += visible;
        });

        status.textContent = total === 0
            ? "No products match your search."
            : (term || activeCategory !== "All" ? total + " product" + (total > 1 ? "s" : "") + " shown." : "");
    }
}

/* 
   6. GALLERY LIGHTBOX
      Click / Enter on an image -> full-size viewer with
      previous / next, keyboard arrows, swipe, Esc, caption + counter.
    */
function setupLightbox() {
    var triggers = document.querySelectorAll(PAGE === "gallery.html" ? ".gallery-card img" : "main img");
    if (!triggers.length) return;

    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Image viewer");
    overlay.innerHTML =
        '<button type="button" class="lb-close" aria-label="Close image viewer">&times;</button>' +
        '<button type="button" class="lb-prev" aria-label="Previous image">&#10094;</button>' +
        '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-caption"></figcaption></figure>' +
        '<button type="button" class="lb-next" aria-label="Next image">&#10095;</button>' +
        '<div class="lb-counter" aria-live="polite"></div>';
    document.body.appendChild(overlay);

    var lbImg = overlay.querySelector(".lb-img");
    var caption = overlay.querySelector(".lb-caption");
    var counter = overlay.querySelector(".lb-counter");
    var btnClose = overlay.querySelector(".lb-close");
    var btnPrev = overlay.querySelector(".lb-prev");
    var btnNext = overlay.querySelector(".lb-next");

    var items = [];
    var index = 0;
    var lastFocus = null;
    var touchStartX = 0;

    function visibleImages() {
        return Array.prototype.filter.call(triggers, function (img) {
            var broken = img.complete && img.naturalWidth === 0;
            return img.offsetParent !== null && !broken;
        });
    }

    function captionFor(img) {
        var card = img.closest(".gallery-card");
        if (!card) return img.alt;
        var title = card.querySelector("h3");
        var ps = card.querySelectorAll("p");
        var price = ps.length ? ps[ps.length - 1].textContent.trim() : "";
        return (title ? title.textContent.trim() : img.alt) + (price ? " \u2013 " + price : "");
    }

    function show() {
        var img = items[index];
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        caption.textContent = captionFor(img);
        counter.textContent = (index + 1) + " / " + items.length;
        var many = items.length > 1;
        btnPrev.hidden = !many;
        btnNext.hidden = !many;

        // preload neighbours so browsing feels instant
        [index - 1, index + 1].forEach(function (i) {
            if (items[i]) { var pre = new Image(); pre.src = items[i].currentSrc || items[i].src; }
        });
    }

    function open(img) {
        items = visibleImages();
        index = items.indexOf(img);
        if (index === -1) { items = [img]; index = 0; }
        lastFocus = document.activeElement;
        show();
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        btnClose.focus();
    }

    function close() {
        overlay.hidden = true;
        document.body.style.overflow = "";
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function move(step) {
        if (items.length < 2) return;
        index = (index + step + items.length) % items.length;
        show();
    }

    lbImg.addEventListener("error", function () {
        caption.textContent = "Sorry, this image could not be loaded.";
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", function () { move(-1); });
    btnNext.addEventListener("click", function () { move(1); });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

    overlay.addEventListener("touchstart", function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    overlay.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener("keydown", function (e) {
        if (overlay.hidden) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") move(-1);
        else if (e.key === "ArrowRight") move(1);
        else if (e.key === "Tab") {
            var f = Array.prototype.filter.call(overlay.querySelectorAll("button"), function (b) { return !b.hidden; });
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    triggers.forEach(function (img) {
        img.style.cursor = "zoom-in";
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", "View larger image: " + img.alt);
        img.addEventListener("click", function () { open(img); });
        img.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(img); }
        });
    });
}

/* 
   7. INTERACTIVE MAP (contact page)
      Zoom, map/satellite, directions, "use my location", copy address
   */
function setupMap() {
    var iframe = document.querySelector("main iframe");
    if (!iframe || !CONFIG.mapQuery) return;

    var state = { type: "m", zoom: 15 };

    iframe.title = "Map showing the location of Madibana Family Bakery";
    iframe.style.width = "100%";
    iframe.style.height = "400px";
    iframe.setAttribute("loading", "lazy");

    function refresh() {
        iframe.src = "https://maps.google.com/maps?q=" + encodeURIComponent(CONFIG.mapQuery) +
            "&t=" + state.type + "&z=" + state.zoom + "&output=embed&hl=en";
    }
    refresh();

    var controls = document.createElement("div");
    controls.className = "map-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Map controls");

    var status = document.createElement("p");
    status.className = "map-status";
    status.setAttribute("aria-live", "polite");

    function makeButton(label, handler) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", handler);
        controls.appendChild(b);
        return b;
    }

    function directionsUrl(origin) {
        return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CONFIG.address) +
            (origin ? "&origin=" + encodeURIComponent(origin) : "") + "&travelmode=driving";
    }

    var btnMap = makeButton("Map", function () { setType("m"); });
    var btnSat = makeButton("Satellite", function () { setType("k"); });
    btnMap.classList.add("active");

    function setType(t) {
        state.type = t;
        btnMap.classList.toggle("active", t === "m");
        btnSat.classList.toggle("active", t === "k");
        refresh();
    }

    makeButton("Zoom in +", function () { state.zoom = Math.min(20, state.zoom + 1); refresh(); });
    makeButton("Zoom out \u2212", function () { state.zoom = Math.max(3, state.zoom - 1); refresh(); });

    makeButton("Get directions", function () {
        window.open(directionsUrl(""), "_blank", "noopener");
    });

    makeButton("Directions from my location", function () {
        if (!navigator.geolocation) {
            status.textContent = "Your browser does not support location services.";
            return;
        }
        status.textContent = "Finding your location...";
        navigator.geolocation.getCurrentPosition(function (pos) {
            status.textContent = "Opening directions from your location.";
            window.open(directionsUrl(pos.coords.latitude + "," + pos.coords.longitude), "_blank", "noopener");
        }, function (err) {
            status.textContent = err.code === 1
                ? "Location permission was denied. You can still use \"Get directions\"."
                : "We could not find your location. Please try \"Get directions\" instead.";
        }, { timeout: 10000 });
    });

    makeButton("Copy address", function () {
        function done() { status.textContent = "Address copied: " + CONFIG.address; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(CONFIG.address).then(done, function () {
                status.textContent = "Could not copy. Our address is: " + CONFIG.address;
            });
        } else {
            var ta = document.createElement("textarea");
            ta.value = CONFIG.address;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); done(); } catch (e) { status.textContent = "Our address is: " + CONFIG.address; }
            ta.remove();
        }
    });

    var anchor = iframe.closest("p") || iframe;
    anchor.insertAdjacentElement("afterend", controls);
    controls.insertAdjacentElement("afterend", status);
}

/*
   FORM ENGINE (shared by the enquiry + contact forms)
    */
function showFormMessage(form, type, html, focusBox) {
    var id = form.id || "form";
    var box = form.parentNode.querySelector('.form-message[data-for="' + id + '"]');
    if (!box) {
        box = document.createElement("div");
        box.setAttribute("data-for", id);
        box.setAttribute("role", type === "error" ? "alert" : "status");
        box.tabIndex = -1;
        form.insertAdjacentElement("afterend", box);
    }
    box.className = "form-message " + type;
    box.innerHTML = html;
    if (focusBox) {
        box.scrollIntoView({ behavior: "smooth", block: "center" });
        box.focus({ preventScroll: true });
    }
}

function removeFormMessage(form) {
    var box = form.parentNode.querySelector('.form-message[data-for="' + (form.id || "form") + '"]');
    if (box) box.remove();
}

function showFieldError(def, msg) {
    if (!def.errEl) {
        var el = document.createElement("span");
        el.className = "field-error";
        el.id = (def.id || def.group) + "-error";
        el.setAttribute("aria-live", "polite");
        var last = def.controls[def.controls.length - 1];
        var anchor = last;
        if (def.group && last.id) anchor = document.querySelector('label[for="' + last.id + '"]') || last;
        anchor.insertAdjacentElement("afterend", el);
        def.errEl = el;
    }
    def.errEl.textContent = msg;
    def.controls.forEach(function (c) {
        c.classList.toggle("invalid-field", !!msg);
        if (msg) {
            c.setAttribute("aria-invalid", "true");
            c.setAttribute("aria-describedby", def.errEl.id);
        } else {
            c.removeAttribute("aria-invalid");
            c.removeAttribute("aria-describedby");
        }
    });
}

/* defs: [{ id | group, validate(controls, form) -> error string or "" }] */
function attachValidation(form, defs) {
    form.noValidate = true; // we show our own, friendlier messages

    defs.forEach(function (def) {
        def.controls = def.group
            ? Array.prototype.slice.call(form.querySelectorAll('input[name="' + def.group + '"]'))
            : [form.querySelector("#" + def.id)];
        def.controls = def.controls.filter(Boolean);
        if (!def.controls.length) return;

        def.run = function () {
            var msg = def.validate(def.controls, form) || "";
            showFieldError(def, msg);
            return msg;
        };

        def.controls.forEach(function (c) {
            var immediate = c.type === "radio" || c.type === "checkbox" || c.tagName === "SELECT";
            c.addEventListener(immediate ? "change" : "blur", def.run);
            if (!immediate) {
                // once an error is showing, re-check while the user types so it clears at once
                c.addEventListener("input", function () {
                    if (c.getAttribute("aria-invalid") === "true") def.run();
                });
            }
        });
    });

    return {
        validateAll: function () {
            var errors = [], firstBad = null;
            defs.forEach(function (def) {
                if (!def.run) return;
                var msg = def.run();
                if (msg) { errors.push(msg); if (!firstBad) firstBad = def.controls[0]; }
            });
            return { errors: errors, firstBad: firstBad };
        },
        clear: function () {
            defs.forEach(function (def) { if (def.run) showFieldError(def, ""); });
        }
    };
}

function nameRule(label) {
    return function (c) {
        var v = c[0].value.trim();
        if (!v) return "Please enter your " + label + ".";
        if (v.length < 2) return "Your " + label + " must be at least 2 characters.";
        if (!/^[A-Za-z\u00C0-\u024F' \-]+$/.test(v)) return "Your " + label + " can only contain letters, spaces, hyphens and apostrophes.";
        return "";
    };
}

function emailRule(c) {
    var v = c[0].value.trim();
    if (!v) return "Please enter your email address.";
    if (!isValidEmail(v)) return "Please enter a valid email address, e.g. name@example.com.";
    return "";
}

function phoneRule(c) {
    var v = c[0].value.trim();
    if (!v) return "Please enter your phone number.";
    if (!isValidPhone(v)) return "Please enter a valid phone number, e.g. 082 123 6204 or +27 82 123 6204.";
    return "";
}

function addCharCounter(textarea, max) {
    if (!textarea) return;
    if (!textarea.value.trim()) textarea.value = "";
    textarea.maxLength = max;
    var counter = document.createElement("small");
    counter.className = "char-counter";
    textarea.insertAdjacentElement("afterend", counter);
    function update() { counter.textContent = textarea.value.length + " / " + max + " characters"; }
    textarea.addEventListener("input", update);
    if (textarea.form) textarea.form.addEventListener("reset", function () { setTimeout(update, 0); });
    update();
}

/*    EMAIL - real email via Formspree (if CONFIG.formEndpoint is set),
   otherwise opens the visitor's email app with the message filled in.
   */
function sendEmail(subject, fields) {
    if (CONFIG.formEndpoint) {
        var body = { _subject: subject };
        Object.keys(fields).forEach(function (key) { body[key] = fields[key]; });
        return fetch(CONFIG.formEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(body)
        }).then(function (response) {
            if (!response.ok) throw new Error("Server responded with " + response.status);
            return "sent";
        });
    }

    var lines = Object.keys(fields).map(function (key) { return key + ": " + fields[key]; });
    window.location.href = "mailto:" + CONFIG.businessEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
    return Promise.resolve("mailto");
}

function submitWithEmail(form, subject, fields, successHtml) {
    var btn = form.querySelector('input[type="submit"]');
    var original = btn ? btn.value : "";
    if (btn) { btn.disabled = true; btn.value = "Sending..."; }

    sendEmail(subject, fields).then(function (mode) {
        form.reset(); // reset first - the reset handler clears old messages
        var extra = mode === "mailto"
            ? "<br><small>Your email app should open with the message ready. Please press <strong>Send</strong> to finish.</small>"
            : "<br><small>Your message has been emailed to our team.</small>";
        showFormMessage(form, "success", successHtml + extra, true);
    }).catch(function () {
        showFormMessage(form, "error",
            'Sorry, we could not send your message right now. Please try again, call us on ' +
            '<a href="tel:+27821236204">+27 82 123 6204</a> or email ' +
            '<a href="mailto:' + CONFIG.businessEmail + '">' + CONFIG.businessEmail + "</a>.", true);
    }).then(function () {
        if (btn) { btn.disabled = false; btn.value = original; }
    });
}

function wireReset(form, validator) {
    form.addEventListener("reset", function () {
        validator.clear();
        removeFormMessage(form);
    });
}

/*
   8. ENQUIRY FORM - validation, price estimate, response, email
 */
var PRICE_LIST = {
    cake: { unit: 350 },
    cupcakes: { unit: 15, dozen: 120 },
    bread: { unit: 18 },
    muffins: { unit: 15, dozen: 200 },
    cookies: { unit: 50 },
    pastries: { unit: 20 },
    scones: { unit: 12 }
};

function estimateTotal(key, qty) {
    var item = PRICE_LIST[key];
    if (!item) return null;
    var total, notes = [];

    if (item.dozen) {
        var dozens = Math.floor(qty / 12);
        total = dozens * item.dozen + (qty % 12) * item.unit;
        if (dozens > 0) notes.push("dozen pricing applied");
        if (key === "cupcakes" && dozens > 0) notes.push("you get a free cookie with every dozen cupcakes");
    } else {
        total = qty * item.unit;
    }
    if (key === "cake" && new Date().getDate() <= 14) {
        total *= 0.9;
        notes.push("10% custom cake discount applied for orders placed before the 15th");
    }
    return { total: Math.round(total * 100) / 100, notes: notes };
}

function setupEnquiryForm() {
    var form = document.querySelector("form");
    if (!form || !form.querySelector("#product")) return;
    form.id = "enquiryForm";

    var dateInput = form.querySelector("#date");
    if (dateInput) {
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dateInput.min = now.toISOString().split("T")[0];
    }
    addCharCounter(form.querySelector("#message"), 500);

    var addressDef = {
        id: "address",
        validate: function (c, f) {
            var v = c[0].value.trim();
            var type = f.querySelector('input[name="enquirytype"]:checked');
            if (type && type.value === "order" && v.length < 5) return "Please enter your delivery address (required when placing an order).";
            return "";
        }
    };

    var validator = attachValidation(form, [
        { id: "firstname", validate: nameRule("first name") },
        { id: "surname", validate: nameRule("surname") },
        { id: "email", validate: emailRule },
        { id: "phone", validate: phoneRule },
        { id: "product", validate: function (c) { return c[0].value ? "" : "Please select a product."; } },
        {
            id: "quantity",
            validate: function (c) {
                var v = c[0].value.trim();
                if (v === "") return "Please enter the quantity you need.";
                var n = Number(v);
                if (!Number.isInteger(n) || n < 1) return "Quantity must be a whole number of 1 or more.";
                if (n > 500) return "For orders above 500 please contact us directly.";
                return "";
            }
        },
        {
            id: "date",
            validate: function (c) {
                var v = c[0].value;
                if (!v) return "";
                if (c[0].min && v < c[0].min) return "Your preferred date cannot be in the past.";
                if (new Date(v + "T00:00:00").getDay() === 0) return "We are closed on Sundays. Please choose another date.";
                return "";
            }
        },
        { group: "enquirytype", validate: function (c) { return c.some(function (r) { return r.checked; }) ? "" : "Please choose the type of enquiry."; } },
        { group: "contactmethod", validate: function (c) { return c.some(function (r) { return r.checked; }) ? "" : "Please choose at least one contact method."; } },
        addressDef
    ]);
    wireReset(form, validator);

    // re-check the address when the enquiry type changes
    form.querySelectorAll('input[name="enquirytype"]').forEach(function (r) {
        r.addEventListener("change", function () {
            if (addressDef.run && addressDef.controls[0].getAttribute("aria-invalid") === "true") addressDef.run();
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var result = validator.validateAll();

        if (result.errors.length) {
            var n = result.errors.length;
            showFormMessage(form, "error", "Please correct the " + n + " highlighted field" + (n > 1 ? "s" : "") + " below and try again.", false);
            result.firstBad.focus();
            return;
        }

        var v = function (id) { return form.querySelector("#" + id).value.trim(); };
        var productSel = form.querySelector("#product");
        var productText = productSel.options[productSel.selectedIndex].text.trim();
        var qty = parseInt(v("quantity"), 10);
        var type = form.querySelector('input[name="enquirytype"]:checked').value;
        var methods = Array.prototype.map.call(form.querySelectorAll('input[name="contactmethod"]:checked'), function (c) { return c.value; }).join(" and ");
        var quote = estimateTotal(productSel.value, qty);
        var quoteText = quote ? "from " + formatRand(quote.total) : "to be confirmed";

        var fields = {
            name: v("firstname") + " " + v("surname"),
            email: v("email"),
            phone: v("phone"),
            product: productText,
            quantity: String(qty),
            "estimated total": quoteText,
            "enquiry type": type,
            "preferred date": v("date") || "not specified",
            "contact method": methods,
            "delivery address": v("address") || "not specified",
            message: v("message") || "none"
        };

        var html = "Thank you, " + escapeHTML(v("firstname")) + "! Your enquiry has been received." +
            "<ul>" +
            "<li>Product: " + escapeHTML(productText) + " (x" + qty + ")</li>" +
            (quote ? "<li>Estimated total: <strong>" + escapeHTML(quoteText) + "</strong>" +
                (quote.notes.length ? " (" + escapeHTML(quote.notes.join("; ")) + ")" : "") +
                ". We will confirm the final price.</li>" : "") +
            "<li>Enquiry type: " + escapeHTML(type) + "</li>" +
            (v("date") ? "<li>Preferred date: " + escapeHTML(v("date")) + "</li>" : "") +
            "<li>We will contact you by: " + escapeHTML(methods) + "</li>" +
            "</ul>";

        submitWithEmail(form, "New bakery enquiry from " + fields.name, fields, html);
    });
}

/*
   9. CONTACT FORM - validation, response, email
*/
function setupContactForm() {
    var form = document.querySelector("form");
    if (!form || !form.querySelector("#subject")) return;
    form.id = "contactForm";

    addCharCounter(form.querySelector("#message"), 1000);

    var validator = attachValidation(form, [
        { id: "firstname", validate: nameRule("first name") },
        { id: "surname", validate: nameRule("surname") },
        { id: "email", validate: emailRule },
        { id: "phone", validate: phoneRule },
        {
            id: "subject",
            validate: function (c) {
                var v = c[0].value.trim();
                if (!v) return "Please enter a subject.";
                if (v.length < 3) return "The subject must be at least 3 characters.";
                return "";
            }
        },
        {
            id: "message",
            validate: function (c) {
                var v = c[0].value.trim();
                if (!v) return "Please write your message.";
                if (v.length < 10) return "Your message is too short - please write at least 10 characters.";
                return "";
            }
        }
    ]);
    wireReset(form, validator);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var result = validator.validateAll();

        if (result.errors.length) {
            var n = result.errors.length;
            showFormMessage(form, "error", "Please correct the " + n + " highlighted field" + (n > 1 ? "s" : "") + " below and try again.", false);
            result.firstBad.focus();
            return;
        }

        var v = function (id) { return form.querySelector("#" + id).value.trim(); };
        var fields = {
            name: v("firstname") + " " + v("surname"),
            email: v("email"),
            phone: v("phone"),
            subject: v("subject"),
            message: v("message")
        };

        var html = "Thank you, " + escapeHTML(v("firstname")) + "! Your message \"" +
            escapeHTML(v("subject")) + "\" has been received. We will get back to you as soon as possible.";

        submitWithEmail(form, "Website message: " + v("subject"), fields, html);
    });
    // Gallery Lightbox Functionality
document.addEventListener("DOMContentLoaded", function () {

    const galleryImages = document.querySelectorAll(".gallery-card img");

    if (galleryImages.length === 0) return;

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";

    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close image">&times;</button>
        <img src="" alt="Enlarged bakery product image">
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector(".lightbox-close");

    galleryImages.forEach(function (image) {

        image.addEventListener("click", function () {

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            lightbox.classList.add("active");
        });

    });

    closeButton.addEventListener("click", function () {
        lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            lightbox.classList.remove("active");
        }

    });

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            lightbox.classList.remove("active");
        }

    });

});
}







