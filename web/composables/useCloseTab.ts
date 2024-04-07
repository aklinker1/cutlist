export default function () {
  const openIds = useOpenProjectIds();
  const route = useRoute();
  const router = useRouter();

  return (id: string) => {
    if (route.path === `/p/${id}`) router.replace('/');
    openIds.value = openIds.value.filter((item) => item !== id);
  };
}
