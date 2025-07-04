import { MediaQuery } from "svelte/reactivity";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export class IsMobile extends MediaQuery {
	constructor() {
		super(`max-width: ${MOBILE_BREAKPOINT - 1}px`);
	}
}

// More robust mobile/touch device detection
export class IsTouchDevice {
	current = $state(false);

	constructor() {
		this.updateTouchCapability();
		
		// Listen for orientation changes and resize events
		if (typeof window !== 'undefined') {
			window.addEventListener('orientationchange', () => {
				setTimeout(() => this.updateTouchCapability(), 100);
			});
			window.addEventListener('resize', () => this.updateTouchCapability());
		}
	}

	private updateTouchCapability() {
		if (typeof window === 'undefined') {
			this.current = false;
			return;
		}

		// Check multiple touch indicators
		const hasTouchSupport = 
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			// @ts-ignore - legacy support
			navigator.msMaxTouchPoints > 0;

		// Check screen size (mobile or tablet-sized)
		const isSmallScreen = window.innerWidth <= TABLET_BREAKPOINT;

		// Check user agent for mobile indicators (fallback)
		const mobileUserAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

		// Device is considered "mobile-like" if:
		// 1. Has touch AND is small screen, OR
		// 2. Mobile user agent, OR  
		// 3. Very small screen (definitely mobile)
		this.current = 
			(hasTouchSupport && isSmallScreen) ||
			mobileUserAgent ||
			window.innerWidth <= MOBILE_BREAKPOINT;
	}
}

// Convenience export for the more robust detection
export const isTouchDevice = new IsTouchDevice();
