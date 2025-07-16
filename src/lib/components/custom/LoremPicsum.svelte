<script lang="ts">
	interface Props {
		width?: number;
		height?: number;
		id?: number;
		blur?: number;
		grayscale?: boolean;
		alt?: string;
		class?: string;
	}

	let {
		width = 400,
		height = 300,
		id,
		blur,
		grayscale = false,
		alt = 'Lorem Picsum placeholder image',
		class: className = '',
		...restProps
	}: Props = $props();

	// Build the Lorem Picsum URL
	let imageUrl = $derived(() => {
		let url = `https://picsum.photos/${width}/${height}`;

		// Add specific image ID if provided
		if (id !== undefined) {
			url = `https://picsum.photos/id/${id}/${width}/${height}`;
		}

		// Add query parameters
		const params = new URLSearchParams();
		if (blur && blur > 0) {
			params.append('blur', blur.toString());
		}
		if (grayscale) {
			params.append('grayscale', '');
		}

		const queryString = params.toString();
		return queryString ? `${url}?${queryString}` : url;
	});
</script>

<img src={imageUrl()} {alt} class={className} {...restProps} />
