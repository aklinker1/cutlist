export default createSharedComposable(() => {
  const user = ref(firebaseAuth.currentUser);
  firebaseAuth.authStateReady().then(() => {
    user.value = firebaseAuth.currentUser;
  });
  firebaseAuth.onAuthStateChanged(() => {
    user.value = firebaseAuth.currentUser;
  });
  return user;
});
