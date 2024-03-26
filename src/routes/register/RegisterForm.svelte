<script lang="ts">
	import FormInput from '$lib/components/FormInput/FormInput.svelte';
	import { displayStrings } from '$lib/i18n';
	import type { RegisterSchema } from '$lib/validationSchemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';

	export let data: SuperValidated<Infer<RegisterSchema>>;

	const { form, errors, constraints, enhance, message } = superForm(data);
	const pageStrings = displayStrings.pages.register;
</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" use:enhance>
	<FormInput
		name="email"
		label={pageStrings.labels.email}
		type="email"
		value={$form.email}
		errors={$errors.email}
		constraints={$constraints.email}
	/>
	<FormInput
		name="password"
		label={pageStrings.labels.password}
		type="password"
		value={$form.password}
		errors={$errors.password}
		constraints={$constraints.password}
	/>
	<FormInput
		name="confirmPassword"
		label={pageStrings.labels.confirmPassword}
		type="password"
		value={$form.confirmPassword}
		errors={$errors.confirmPassword}
		constraints={$constraints.confirmPassword}
	/>
	<button>{displayStrings.buttons.register}</button>
</form>
