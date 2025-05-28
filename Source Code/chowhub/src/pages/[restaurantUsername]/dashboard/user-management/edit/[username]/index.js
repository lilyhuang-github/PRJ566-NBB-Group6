import { useRouter } from "next/router";
export default function EditEmployee() {
  const router = useRouter();
  const userId = router.query.username;
}
