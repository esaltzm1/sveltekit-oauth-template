<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let type: HTMLInputTypeAttribute = 'text';
	export let label: string | undefined;
	export let name: string | undefined;
	export let errors: unknown;
	export let value: any;
	export let constraints: any;
</script>

{#if label}
	<label for={name}>{label}</label>
{/if}
<input {type} {name} aria-invalid={errors ? 'true' : undefined} {value} {...constraints} />
{#if errors}<span class="invalid">{errors}</span>{/if}
