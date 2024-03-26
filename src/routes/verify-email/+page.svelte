<script lang="ts">
	import { enhance } from '$app/forms';
	import VerifyEmailForm from './VerifyEmailForm.svelte';

	export let data;
</script>

<VerifyEmailForm data={data.verifyEmailForm} />
<p>Need a new code?</p>

<form method="post" action="?/newCode" use:enhance>
	<button type="submit">Send new code</button>
</form>
