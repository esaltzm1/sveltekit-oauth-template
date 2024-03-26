<script lang="ts">
	import { displayStrings } from '$lib/i18n';

	export let verificationCode: string;

	const pageStrings = displayStrings.pages['verify-email'];
</script>

<p>verification code: {verificationCode}</p>
