<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { PasswordResetRequestSchema } from '$lib/validationSchemas';
	import FormInput from '$lib/components/FormInput/FormInput.svelte';
	import { displayStrings } from '$lib/i18n';

	export let data: SuperValidated<Infer<PasswordResetRequestSchema>>;

	const { form, errors, constraints, enhance, message } = superForm(data);
	const pageStrings = displayStrings.pages['password-reset'];
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
	<button>{displayStrings.buttons.reset}</button>
</form>
