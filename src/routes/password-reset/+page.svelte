<script>
	import { displayStrings } from '$lib/i18n';
	import { superForm } from 'sveltekit-superforms';
	import PasswordResetRequestForm from './PasswordResetRequestForm.svelte';

	export let data;

	const { message } = superForm(data.passwordResetRequestForm);
</script>

{#if $message === 'SUCCESS'}
	<p>
		{displayStrings.pages['password-reset'].successSubtitle}
	</p>
{:else}
	<PasswordResetRequestForm data={data.passwordResetRequestForm} />
{/if}
