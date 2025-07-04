<script lang="ts">
  import AnimatedGradient from '$lib/components/custom/AnimatedGradient.svelte';
  import StreamingContent from '$lib/components/custom/StreamingContent.svelte';
  import type { User } from '@prisma/client';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Button } from '$lib/components/ui/button/index.js';

  let { data } = $props();

  let name = $state('');
  let email = $state('');

  $effect(() => {
    if (data.streamed.settings) {
      (data.streamed.settings as Promise<User>).then((settings: User) => {
        if (settings) {
          name = settings.name || '';
          email = settings.email || '';
        }
      });
    }
  });
</script>

<div class="relative">
  <AnimatedGradient />
  <div class="relative z-10">
    <h1 class="text-2xl font-bold mb-4">Settings</h1>
    <StreamingContent promise={data.streamed.settings}>
      {#snippet children(settings)}
        <form method="POST">
          <div class="mb-4">
            <Label for="name" class="block text-sm font-medium text-gray-700">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              bind:value={name}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div class="mb-4">
            <Label for="email" class="block text-sm font-medium text-gray-700">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              bind:value={email}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <Button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </Button>
        </form>
      {/snippet}
    </StreamingContent>
  </div>
</div>
