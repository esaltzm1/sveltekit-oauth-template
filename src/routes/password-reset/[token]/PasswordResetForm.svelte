<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { PasswordResetSchema } from '$lib/validationSchemas';
	import FormInput from '$lib/components/FormInput/FormInput.svelte';
	import { displayStrings } from '$lib/i18n';

	export let data: SuperValidated<Infer<PasswordResetSchema>>;

	const { form, errors, constraints, enhance, message } = superForm(data);
	const pageStrings = displayStrings.pages['password-reset'].token;
</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" use:enhance>
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
	<button>{displayStrings.buttons.reset}</button>
</form>
