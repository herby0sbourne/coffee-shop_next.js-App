import { useRouter } from "next/router";
import Link from "next/link";

const Id = () => {
  const router = useRouter();
  console.log(router);
  return (
    <h1>
      coffee shopp {router.query.id}
      <Link href="/">Back to Home</Link>
      <Link href={`/coffee-shop/${router.query.id}`}>dynamic route</Link>
    </h1>
  );
};

export default Id;
