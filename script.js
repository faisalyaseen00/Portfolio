document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    initCvMenu();
    initHomeScroll();
    initThreeScene();
});


/* =========================
   THEME
========================= */

function initTheme() {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;

    const icon = toggle.querySelector("i");
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        if (icon) icon.className = "fas fa-sun";
    }

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");

        localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");

        if (icon) {
            icon.className = isLight ? "fas fa-sun" : "fas fa-moon";
        }
    });
}


/* =========================
   NAV / MOBILE
========================= */

function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            links.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (event) => {
        if (
            links.classList.contains("open") &&
            !links.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            links.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}


/* =========================
   HOME SCROLL SPY
   Scroll home to browse all sections.
   Nav clicks still open dedicated pages.
========================= */

function initHomeScroll() {
    if (!document.body.classList.contains("home-page")) return;

    const sections = [
        { id: "home", match: ["#home", "index.html"] },
        { id: "about", match: ["about.html"] },
        { id: "work", match: ["work.html"] },
        { id: "experience", match: ["experience.html"] },
        { id: "contact", match: ["contact.html"] }
    ];

    const navLinks = document.querySelectorAll(".nav-links a");

    function setActive(id) {
        navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            const section = sections.find((item) => item.id === id);
            const isActive =
                section &&
                section.match.some(
                    (m) => href.includes(m) || href === `#${id}`
                );
            link.classList.toggle("active", Boolean(isActive));
        });
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        },
        {
            rootMargin: "-35% 0px -45% 0px",
            threshold: 0.05
        }
    );

    ["home", "about", "work", "experience", "contact"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}


/* =========================
   CV DROPDOWN
========================= */

function initCvMenu() {
    const wrap = document.querySelector(".nav-cv-wrap");
    if (!wrap) return;

    const button = wrap.querySelector(".nav-cv");
    const menu = wrap.querySelector(".cv-menu");

    if (!button || !menu) return;

    button.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = menu.classList.toggle("open");
        button.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
        if (!wrap.contains(event.target)) {
            menu.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            menu.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        }
    });
}


/* =========================
   THREE.JS CORE
========================= */

function initThreeScene() {
    const container = document.getElementById("three-container");

    if (!container) return;

    if (typeof THREE === "undefined") {
        return;
    }

    const hero = container.closest(".hero");
    if (hero) hero.classList.add("has-three");

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / Math.max(container.clientHeight, 1),
        0.1,
        100
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeometry = new THREE.IcosahedronGeometry(1.15, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x66e3ff,
        transparent: true,
        opacity: 0.13
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(core);

    const shellGeometry = new THREE.IcosahedronGeometry(1.3, 2);
    const shellMaterial = new THREE.MeshBasicMaterial({
        color: 0x66e3ff,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    coreGroup.add(shell);

    function createRing(radius, rotationX, rotationY, rotationZ, opacity) {
        const geometry = new THREE.TorusGeometry(radius, 0.012, 8, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0x8b7cff,
            transparent: true,
            opacity
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = rotationX;
        ring.rotation.y = rotationY;
        ring.rotation.z = rotationZ;
        coreGroup.add(ring);
        return ring;
    }

    const ring1 = createRing(1.7, Math.PI / 2, 0, 0, 0.55);
    const ring2 = createRing(1.9, Math.PI / 3, Math.PI / 5, 0, 0.35);
    const ring3 = createRing(2.1, Math.PI / 5, Math.PI / 2, Math.PI / 4, 0.25);

    const nodeGroup = new THREE.Group();
    coreGroup.add(nodeGroup);

    const nodeGeometry = new THREE.SphereGeometry(0.045, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x66e3ff });
    const nodes = [];

    for (let i = 0; i < 28; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        const radius = 1.65 + Math.random() * 0.7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        node.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );

        nodeGroup.add(node);
        nodes.push(node);
    }

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x66e3ff,
        transparent: true,
        opacity: 0.12
    });

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);

            if (distance < 0.85) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    nodes[i].position,
                    nodes[j].position
                ]);
                nodeGroup.add(new THREE.Line(geometry, lineMaterial));
            }
        }
    }

    const particleCount = 450;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const radius = 2.5 + Math.random() * 3.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x66e3ff,
        size: 0.018,
        transparent: true,
        opacity: 0.45
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });

    function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        if (!reducedMotion) {
            shell.rotation.x = time * 0.18;
            shell.rotation.y = time * 0.25;
            core.rotation.x = time * 0.08;
            core.rotation.y = time * 0.12;

            ring1.rotation.z = time * 0.25;
            ring2.rotation.x = time * 0.18;
            ring2.rotation.z = -time * 0.15;
            ring3.rotation.y = time * 0.15;
            ring3.rotation.z = time * 0.2;

            nodeGroup.rotation.y = time * 0.08;
            nodeGroup.rotation.x = Math.sin(time * 0.2) * 0.08;

            particles.rotation.y = time * 0.015;

            const targetX = mouseY * 0.15;
            const targetY = mouseX * 0.25;

            coreGroup.rotation.x += (targetX - coreGroup.rotation.x) * 0.025;
            coreGroup.rotation.y += (targetY - coreGroup.rotation.y) * 0.025;
            coreGroup.position.y = Math.sin(time * 0.8) * 0.08;
        }

        renderer.render(scene, camera);
    }

    animate();
}
