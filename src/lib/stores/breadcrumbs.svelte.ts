export type BreadcrumbItem = {
	title: string;
	href?: string;
};

export let breadcrumbs = $state<BreadcrumbItem[]>([]); 