/*!
 * Portfolio Animations and Interactions
 * Professional-grade animations with performance optimization
 */

window.addEventListener("DOMContentLoaded", (event) => {
	// Enhanced scroll animations with Intersection Observer
	const observerOptions = {
		threshold: 0.15,
		rootMargin: "0px 0px -100px 0px",
	};

	const fadeInObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = "1";
				entry.target.style.transform = "translateY(0)";
				entry.target.classList.add("animated");
			}
		});
	}, observerOptions);

	// Observe all major sections
	document.querySelectorAll("section").forEach((section) => {
		section.style.opacity = "0";
		section.style.transform = "translateY(50px)";
		section.style.transition =
			"opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)";
		fadeInObserver.observe(section);
	});

	// Staggered animation for skill cells
	const skillCells = document.querySelectorAll(".skills-section .cell");
	skillCells.forEach((cell, index) => {
		cell.style.opacity = "0";
		cell.style.transform = "translateY(30px) scale(0.95)";
		cell.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${
			index * 0.05
		}s`;

		const cellObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.style.opacity = "1";
					entry.target.style.transform = "translateY(0) scale(1)";
				}
			});
		}, observerOptions);

		cellObserver.observe(cell);
	});

	// Elegant project card animations
	const projectItems = document.querySelectorAll(".project-item");
	projectItems.forEach((item, index) => {
		item.style.opacity = "0";
		item.style.transform = "scale(0.95) translateY(30px)";
		item.style.transition = `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${
			index * 0.08
		}s`;

		const projectObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.style.opacity = "1";
					entry.target.style.transform = "scale(1) translateY(0)";
				}
			});
		}, observerOptions);

		projectObserver.observe(item);
	});

	// Smooth parallax for profile image (subtle and performant)
	const profileImage = document.querySelector("#welcome .profile_image img");
	let ticking = false;

	if (profileImage) {
		window.addEventListener(
			"scroll",
			() => {
				if (!ticking) {
					window.requestAnimationFrame(() => {
						const scrolled = window.pageYOffset;
						const rate = scrolled * 0.15;
						profileImage.style.transform = `translateY(${rate}px)`;
						ticking = false;
					});
					ticking = true;
				}
			},
			{ passive: true }
		);
	}

	// Smooth scroll with offset for fixed nav
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			const href = this.getAttribute("href");
			if (href === "#") return;

			e.preventDefault();
			const target = document.querySelector(href);
			if (target) {
				const offsetTop = target.offsetTop - 80;
				window.scrollTo({
					top: offsetTop,
					behavior: "smooth",
				});
			}
		});
	});

	// Enhanced navbar scroll effect
	const nav = document.querySelector("nav");
	let lastScroll = 0;

	window.addEventListener(
		"scroll",
		() => {
			const currentScroll = window.pageYOffset;

			if (currentScroll > 100) {
				nav.classList.add("scrolled");
			} else {
				nav.classList.remove("scrolled");
			}

			lastScroll = currentScroll;
		},
		{ passive: true }
	);

	// Form submission with elegant feedback
	const contactForm = document.querySelector(".contact-section form");
	if (contactForm) {
		contactForm.addEventListener("submit", function (e) {
			e.preventDefault();
			const button = this.querySelector("button");
			const originalText = button.textContent;

			// Disable button and show loading state
			button.disabled = true;
			button.style.transform = "scale(0.98)";
			button.innerHTML = '<span style="opacity: 0.7;">Sending...</span>';

			// Simulate sending (replace with actual form submission)
			setTimeout(() => {
				button.innerHTML = "✓ Sent Successfully!";
				button.style.background =
					"linear-gradient(135deg, #10b981 0%, #059669 100%)";
				button.style.boxShadow = "0 20px 50px rgba(16, 185, 129, 0.4)";

				setTimeout(() => {
					button.style.transform = "scale(1)";
					button.innerHTML = originalText;
					button.style.background = "";
					button.style.boxShadow = "";
					button.disabled = false;
					this.reset();
				}, 2500);
			}, 1500);
		});

		// Real-time input validation styling
		const inputs = contactForm.querySelectorAll("input, textarea");
		inputs.forEach((input) => {
			input.addEventListener("input", function () {
				if (this.value.length > 0) {
					this.style.borderColor = "var(--success-color)";
				} else {
					this.style.borderColor = "var(--border-color)";
				}
			});

			input.addEventListener("blur", function () {
				if (this.value.length === 0) {
					this.style.borderColor = "var(--border-color)";
				}
			});
		});
	}

	// Typing effect for welcome heading (optional, can be disabled)
	const welcomeHeading = document.querySelector("#welcome h2");
	if (welcomeHeading && window.innerWidth > 768) {
		const text = welcomeHeading.textContent;
		welcomeHeading.textContent = "";
		welcomeHeading.style.opacity = "1";
		let i = 0;

		const typeWriter = () => {
			if (i < text.length) {
				welcomeHeading.textContent += text.charAt(i);
				i++;
				setTimeout(typeWriter, 40);
			}
		};

		setTimeout(typeWriter, 600);
	}

	// Active navigation highlighting
	const sections = document.querySelectorAll("section[id]");
	const navLinks = document.querySelectorAll('.nav_right a[href^="#"]');

	const highlightNav = () => {
		let current = "";
		const scrollPos = window.pageYOffset + 200;

		sections.forEach((section) => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.clientHeight;
			if (
				scrollPos >= sectionTop &&
				scrollPos < sectionTop + sectionHeight
			) {
				current = section.getAttribute("id");
			}
		});

		navLinks.forEach((link) => {
			link.style.color = "";
			link.style.fontWeight = "";
			if (link.getAttribute("href") === `#${current}`) {
				link.style.color = "var(--primary-color)";
				link.style.fontWeight = "700";
			}
		});
	};

	window.addEventListener("scroll", highlightNav, { passive: true });
	highlightNav();

	// Add smooth hover effects to all interactive elements
	const interactiveElements = document.querySelectorAll(
		"a, button, .cell, .project-item, .testimony-item"
	);
	interactiveElements.forEach((el) => {
		el.style.willChange = "auto";

		el.addEventListener("mouseenter", function () {
			this.style.willChange = "transform";
		});

		el.addEventListener("mouseleave", function () {
			this.style.willChange = "auto";
		});
	});

	// Performance optimization: Disable animations on low-end devices
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		document.querySelectorAll("*").forEach((el) => {
			el.style.animation = "none";
			el.style.transition = "none";
		});
	}

	console.log("🚀 Portfolio loaded successfully!");
});
