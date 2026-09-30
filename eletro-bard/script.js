/* Eletro Bard - Landing Page */

const WHATSAPP_NUMBER = "5532999926389"; // único lugar com o número (o HTML só guarda a mensagem em data-wa)

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");
const header = document.getElementById("header");

/* WhatsApp: monta os links a partir de data-wa="mensagem" */
document.querySelectorAll("a[data-wa]").forEach((link) => {
    const message = link.dataset.wa;
    link.href = `https://wa.me/${WHATSAPP_NUMBER}` +
        (message ? `?text=${encodeURIComponent(message)}` : "");
});

/* Menu mobile */
function setMenu(open) {
    nav.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

if (menuButton && nav) {
    menuButton.addEventListener("click", () => setMenu(!nav.classList.contains("active")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav.classList.contains("active")) {
            setMenu(false);
            menuButton.focus();
        }
    });
    window.matchMedia("(min-width: 851px)").addEventListener("change", (e) => {
        if (e.matches) setMenu(false);
    });
}

/* Header ao rolar */
if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

/* Animação de entrada (sem IntersectionObserver, mostra tudo) */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    revealElements.forEach((el) => observer.observe(el));
} else {
    revealElements.forEach((el) => el.classList.add("visible"));
}

/* Ano do rodapé */
const currentYear = document.getElementById("currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();

/* Quadro de disjuntores do hero: o serviço escolhido muda a mensagem do WhatsApp */
const panel = document.querySelector(".panel");

if (panel) {
    const cta = document.getElementById("panelCta");
    const breakers = panel.querySelectorAll(".breaker");

    const select = (breaker) => {
        breakers.forEach((b) => b.setAttribute("aria-pressed", String(b === breaker)));
        cta.textContent = `Pedir orçamento: ${breaker.dataset.label}`;
        cta.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(breaker.dataset.msg)}`;
    };

    breakers.forEach((b) => b.addEventListener("click", () => select(b)));
    select(breakers[0]);
}

/* Efeitos do hero: lanterna que segue o mouse, painel inclinado e pulso ao ligar disjuntor */
const heroSection = document.querySelector(".hero");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroSection && canHover && allowMotion) {
    heroSection.addEventListener("pointermove", (e) => {
        const box = heroSection.getBoundingClientRect();
        heroSection.style.setProperty("--mx", `${e.clientX - box.left}px`);
        heroSection.style.setProperty("--my", `${e.clientY - box.top}px`);

        if (panel) {
            const p = panel.getBoundingClientRect();
            const dx = (e.clientX - (p.left + p.width / 2)) / box.width;
            const dy = (e.clientY - (p.top + p.height / 2)) / box.height;
            panel.style.transform =
                `perspective(900px) rotateY(${dx * 14}deg) rotateX(${-dy * 14}deg)`;
        }
    });

    heroSection.addEventListener("pointerleave", () => {
        if (panel) panel.style.transform = "";
    });
}

if (panel && allowMotion) {
    panel.querySelectorAll(".breaker").forEach((b) => {
        b.addEventListener("click", () => {
            panel.classList.remove("zap");
            void panel.offsetWidth;
            panel.classList.add("zap");
        });
    });
}