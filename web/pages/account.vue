<script lang="ts" setup>
import * as firebaseui from 'firebaseui';
import { EmailAuthProvider } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';

const currentUser = useCurrentUser();

const container = ref<HTMLDivElement>();
let login: firebaseui.auth.AuthUI | undefined;
watch(container, (container) => {
  if (container) {
    login =
      firebaseui.auth.AuthUI.getInstance() ??
      new firebaseui.auth.AuthUI(firebaseAuth);
    login.start(container, {
      signInOptions: [EmailAuthProvider.PROVIDER_ID],
    });
  } else {
    login?.delete();
    login = undefined;
  }
});

watch(currentUser, (user) => {
  if (user) syncProjects();
});

async function syncProjects() {
  const localService = createLocalAccountService();
  const firebaseService = createFirebaseAccountService();
  const localProjects = await localService.listProjects();
  const firebaseProjects = await firebaseService.listProjects();
  const firebaseProjectIds = new Set(firebaseProjects.map((p) => p.id));

  const missingProjects = localProjects.filter(
    (p) => !firebaseProjectIds.has(p.id),
  );
  console.log(
    `Syncing ${missingProjects.length} local projects to firebase...`,
  );
  for (const p of missingProjects) {
    await firebaseService.saveProject(p);
  }
}
</script>

<template>
  <div class="bg-gray-200 dark:bg-gray-800 h-full p-8 flex flex-col gap-4">
    <h2 class="text-2xl font-medium line-clamp-1 truncate">Account</h2>
    <template v-if="!currentUser">
      <p>Login to share settings and projects between devices.</p>
      <div ref="container" v-if="!currentUser" />
    </template>
    <template v-else>
      <p>
        Logged in as: {{ currentUser.displayName }} ({{ currentUser.email }})
      </p>
      <UButton class="self-start" @click="firebaseAuth.signOut()"
        >Log out</UButton
      >
    </template>
  </div>
</template>
