export default function () {
  const openIds = useOpenProjectIds();
  const router = useRouter();

  return (id: string) => {
    router.push(`/p/${id}`);

    if (!openIds.value.includes(id)) openIds.value.push(id);
  };
}
