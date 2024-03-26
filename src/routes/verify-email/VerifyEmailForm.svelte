<script lang="ts">
	import FormInput from '$lib/components/FormInput/FormInput.svelte';
	import { displayStrings } from '$lib/i18n';
	import type { VerifyEmailSchema } from '$lib/validationSchemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';

	export let data: SuperValidated<Infer<VerifyEmailSchema>>;

	const { form, errors, constraints, enhance, message } = superForm(data);
	const pageStrings = displayStrings.pages['verify-email'];
</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" action="?/confirmCode" use:enhance>
	<FormInput
		name="verificationCode"
		label={pageStrings.labels.verificationCode}
		type="text"
		value={$form.verificationCode}
		errors={$errors.verificationCode}
		constraints={$constraints.verificationCode}
	/>
	<button>{displayStrings.buttons.confirm}</button>
</form>
