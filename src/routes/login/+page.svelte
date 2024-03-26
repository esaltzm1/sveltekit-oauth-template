<script lang="ts">
	import LoginForm from './LoginForm.svelte';
	import GoogleAuthButton from './google/GoogleAuthButton.svelte';

	export let data;
</script>

<LoginForm data={data.loginForm} />

<GoogleAuthButton isRegistering={false} />
