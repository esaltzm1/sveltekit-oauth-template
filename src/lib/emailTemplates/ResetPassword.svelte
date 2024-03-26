<script lang="ts">
	import { env } from '$env/dynamic/private';
	import { displayStrings } from '$lib/i18n';

	export let resetPasswordLink: string;

	const pageStrings = displayStrings.pages['password-reset'].email;
</script>

<div class="px-4">
	<div class="max-w-sm mx-auto space-y-6">
		<div class="space-y-2 text-center">
			<div class="space-y-1">
				<h1 class="text-lg font-bold">{pageStrings.title}</h1>
				<p class="text-sm text-gray-500 dark:text-gray-400">{pageStrings.subtitle}</p>
			</div>
		</div>
		<div class="space-y-2 text-sm prose dark:prose-dark">
			<p>
				{pageStrings.isEmailUnexpected}
				<a class="underline" href={`mailto:${env.SUPPORT_EMAIL_ADDRESS}`}>
					{pageStrings.contactSupport}
				</a>
				.
			</p>
		</div>
		<div class="space-y-2">
			<a
				class="w-full inline-block text-center py-2 rounded-md border border-gray-200 border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
				href={resetPasswordLink}
			>
				{pageStrings.labels.resetPasswordButton}
			</a>
		</div>
		<div class="text-sm text-center text-gray-500 dark:text-gray-400">
			{pageStrings.resetPasswordButtonSubtitle}
		</div>
	</div>
</div>
