<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let type: HTMLInputTypeAttribute = 'text';
	export let label: string | undefined;
	export let placeholder: string = '';
	export let name: string | undefined;
	export let errors: string[] | undefined;
	export let value: any;
	export let constraints: any;
</script>

<div>
	{#if label}
		<label for={name}>{label}</label>
	{/if}
	<input
		{type}
		id={name}
		{placeholder}
		{name}
		aria-invalid={errors ? 'true' : undefined}
		{value}
		{...constraints}
	/>
	{#if errors}<span class="invalid">{errors}</span>{/if}
</div>
