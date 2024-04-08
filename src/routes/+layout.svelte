<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

{#if data.user}
	<span>signed in with: {data.user.email}</span>
	<form method="post" action="/?/logout">
		<button type="submit">Sign out</button>
	</form>
{:else}
	not signed in
	<a href="/login">Log in</a>
{/if}

<slot />
