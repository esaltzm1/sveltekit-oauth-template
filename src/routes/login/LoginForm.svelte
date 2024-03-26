<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { LoginSchema } from '$lib/validationSchemas';
	import FormInput from '$lib/components/FormInput/FormInput.svelte';
	import { displayStrings } from '$lib/i18n';

	export let data: SuperValidated<Infer<LoginSchema>>;

	const { form, errors, constraints, enhance, message } = superForm(data);
	const pageStrings = displayStrings.pages.login;
</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" use:enhance>
	<FormInput
		name="email"
		label={pageStrings.labels.email}
		type="text"
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
	<button>{displayStrings.buttons.login}</button>
</form>

<a href="/password-reset">{displayStrings.buttons.forgotPassword}</a>
