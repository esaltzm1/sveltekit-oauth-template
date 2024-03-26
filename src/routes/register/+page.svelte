<script lang="ts">
	import GoogleAuthButton from '../login/google/GoogleAuthButton.svelte';
	import RegisterForm from './RegisterForm.svelte';

	export let data;
</script>

<RegisterForm data={data.registerForm} />
<GoogleAuthButton isRegistering={true} />
